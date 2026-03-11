/**
 * Web Adapter for Grain
 * Renders Grain Language to semantic HTML
 */

import { GLangParser, EventBus, type ASTNode } from '@grain.sh/core';
import { DEFAULT_STYLES, DEFAULT_THEME } from './default-styles';
import type { WebAdapterConfig, RenderOptions } from './types';

const KNOWN_PRIMITIVES = [
  'message',
  'stream',
  'think',
  'tool',
  'artifact',
  'context',
  'approve',
  'error',
  'input',
  'action',
  'actions',
  'option',
  'suggestion',
  'item',
  'branch',
  'state',
  'form',
  'chart',
  'memory',
  'layout',
  'table',
  'result',
  'progress',
  'warning'
] as const;

const STYLE_ELEMENT_ID = 'grain-web-default-styles';

export class WebAdapter {
  private parser: GLangParser;
  private eventBus: EventBus;
  private config: WebAdapterConfig;

  constructor(config: WebAdapterConfig = {}) {
    this.parser = new GLangParser();
    this.eventBus = new EventBus();
    this.config = {
      theme: {
        ...DEFAULT_THEME,
        ...config.theme
      },
      ...config
    };
  }

  /**
   * Render Grain Language to HTML
   */
  render(grain: string, options: RenderOptions = {}): HTMLElement | null {
    const result = this.parser.parse(grain);

    if (!result.ast || result.errors.length > 0) {
      console.error('Parse errors:', result.errors);
      return null;
    }

    const container = options.container
      ? (typeof options.container === 'string'
        ? document.querySelector(options.container)
        : options.container)
      : document.createElement('div');

    if (!container) {
      console.error('Container not found');
      return null;
    }

    const ownerDocument = container.ownerDocument || document;
    this.ensureDocumentStyles(ownerDocument);
    this.applyTheme(container as HTMLElement);

    const fragment = ownerDocument.createDocumentFragment();
    this.renderAST(result.ast, fragment, ownerDocument);

    if (options.position === 'prepend') {
      container.prepend(fragment);
    } else if (options.position === 'before') {
      container.parentNode?.insertBefore(fragment, container);
    } else if (options.position === 'after') {
      container.parentNode?.insertBefore(fragment, container.nextSibling);
    } else if (options.position === 'append') {
      container.appendChild(fragment);
    } else {
      container.replaceChildren(fragment);
    }

    return container as HTMLElement;
  }

  /**
   * Render Grain Language AST to HTML DOM Elements
   */
  private renderAST(
    node: ASTNode,
    documentParent: DocumentFragment | HTMLElement,
    ownerDocument: Document
  ): void {
    if (!node) return;

    if (node.type === 'document') {
      node.children?.forEach((child: ASTNode) => this.renderAST(child, documentParent, ownerDocument));
      return;
    }

    if (node.type === 'text') {
      if (!node.value?.trim()) {
        return;
      }

      documentParent.appendChild(ownerDocument.createTextNode(node.value));
      return;
    }

    let tagName = 'div';

    if (KNOWN_PRIMITIVES.includes(node.type as typeof KNOWN_PRIMITIVES[number])) {
      tagName = `grain-${node.type}`;
    }

    const el = ownerDocument.createElement(tagName);
    el.setAttribute('data-grain', 'true');
    el.setAttribute('data-grain-node', node.type);

    // Apply attributes
    if (node.attributes) {
      Object.entries(node.attributes).forEach(([key, value]) => {
        el.setAttribute(key, String(value));
        el.setAttribute(`data-${key}`, String(value));
      });
    }

    // Attach specific behaviors based on type
    if (node.type === 'action' || node.type === 'option') {
      el.classList.add('grain-action');
      el.setAttribute('role', 'button');
      el.tabIndex = 0;
      if (node.attributes?.primary !== undefined) {
        el.setAttribute('data-primary', 'true');
      }

      const actionName = node.attributes?.name || node.attributes?.label || '';
      const activate = () => {
        this.eventBus.emit('action', { action: actionName });
      };

      el.addEventListener('click', activate);
      el.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          activate();
        }
      });
    }

    if (node.type === 'message' && node.attributes?.role) {
      el.setAttribute('data-role', String(node.attributes.role));
    }

    if (node.type === 'tool') {
      const toolName = String(node.attributes?.name || 'Tool');
      el.setAttribute('data-title', `Tool · ${toolName}`);
    }

    if (node.type === 'artifact') {
      const artifactType = String(node.attributes?.type || 'output');
      el.setAttribute('data-title', `Artifact · ${artifactType}`);
    }

    if (node.type === 'approve') {
      const action = String(node.attributes?.action || 'Approval required');
      el.setAttribute('data-title', action);
    }

    if (node.type === 'error') {
      const code = String(node.attributes?.code || 'Runtime error');
      el.setAttribute('data-title', `Error · ${code}`);
    }

    if (node.type === 'warning') {
      el.setAttribute('data-title', 'Warning');
    }

    if (node.type === 'result') {
      el.setAttribute('data-title', 'Result');
    }

    if (node.type === 'input') {
      const placeholder = String(node.attributes?.placeholder || 'Input');
      el.setAttribute('data-title', `Input · ${String(node.attributes?.type || 'text')}`);
      el.setAttribute('data-placeholder', placeholder);
    }

    if (node.type === 'context') {
      el.setAttribute('data-title', 'Context');
    }

    if (node.type === 'layout') {
      el.setAttribute('data-title', 'Layout');
    }

    if (node.type === 'table') {
      el.setAttribute('data-title', 'Table');
    }

    if (node.type === 'memory') {
      el.setAttribute('data-title', 'Memory');
    }

    if (node.type === 'form') {
      el.setAttribute('data-title', 'Form');
    }

    if (node.type === 'chart') {
      el.setAttribute('data-title', 'Chart');
    }

    if (node.type === 'progress') {
      const rawValue = Number(node.attributes?.value ?? 0);
      const rawMax = Number(node.attributes?.max ?? 100);
      const max = Number.isFinite(rawMax) && rawMax > 0 ? rawMax : 100;
      const value = Number.isFinite(rawValue) ? rawValue : 0;
      const percentage = Math.max(0, Math.min(100, (value / max) * 100));
      el.setAttribute('data-title', `Progress · ${Math.round(percentage)}%`);
      el.style.setProperty('--grain-progress-scale', String(percentage / 100));
    }

    if (node.type === 'think') {
      const initiallyVisible = node.attributes?.visible === 'true';

      if (!initiallyVisible) {
        el.setAttribute('data-hidden', 'true');
        el.setAttribute('data-visible', 'false');
        el.setAttribute('aria-expanded', 'false');
        el.setAttribute('role', 'button');
        el.tabIndex = 0;

        const toggle = () => {
          const nextVisible = el.getAttribute('data-visible') !== 'true';
          el.setAttribute('data-visible', nextVisible ? 'true' : 'false');
          el.setAttribute('aria-expanded', nextVisible ? 'true' : 'false');
          this.eventBus.emit('think:toggle', { visible: nextVisible });
        };

        el.addEventListener('click', toggle);
        el.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggle();
          }
        });
      } else {
        el.setAttribute('data-visible', 'true');
        el.setAttribute('aria-expanded', 'true');
      }
    }

    // Recursively append children
    node.children?.forEach((child: ASTNode) => this.renderAST(child, el, ownerDocument));

    documentParent.appendChild(el);
  }

  /**
   * Register Native Web Components
   */
  public registerCustomElements() {
    if (typeof customElements === 'undefined') return;
    this.ensureDocumentStyles();

    KNOWN_PRIMITIVES.forEach((prim) => {
      const name = `grain-${prim}`;
      if (!customElements.get(name)) {
        customElements.define(name, class extends HTMLElement {
          connectedCallback() {
            this.setAttribute('data-grain-element', prim);
          }
        });
      }
    });
  }

  on(event: string, callback: (payload: unknown) => void): () => void {
    return this.eventBus.on(event, callback as any);
  }

  getThemeCSS(): string {
    return Object.entries(this.config.theme || {})
      .map(([key, value]) => `${key}: ${value};`)
      .join('\n');
  }

  private ensureDocumentStyles(ownerDocument?: Document): void {
    if (typeof document === 'undefined' && !ownerDocument) {
      return;
    }

    const targetDocument = ownerDocument || document;
    if (targetDocument.getElementById(STYLE_ELEMENT_ID)) {
      return;
    }

    const style = targetDocument.createElement('style');
    style.id = STYLE_ELEMENT_ID;
    style.textContent = DEFAULT_STYLES;
    (targetDocument.head || targetDocument.documentElement).appendChild(style);
  }

  private applyTheme(container: HTMLElement): void {
    container.setAttribute('data-grain-root', 'true');

    Object.entries(this.config.theme || {}).forEach(([key, value]) => {
      container.style.setProperty(key, value);
    });
  }
}

export function createWebAdapter(config?: WebAdapterConfig): WebAdapter {
  return new WebAdapter(config);
}

export default WebAdapter;
