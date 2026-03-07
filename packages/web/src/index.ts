/**
 * Web Adapter for Grain
 * Renders Grain Language to semantic HTML
 */

import { GLangParser, EventBus, type ASTNode } from '@grain.sh/core';
import type { WebAdapterConfig, RenderOptions } from './types';

export class WebAdapter {
  private parser: GLangParser;
  private eventBus: EventBus;
  private config: WebAdapterConfig;

  constructor(config: WebAdapterConfig = {}) {
    this.parser = new GLangParser();
    this.eventBus = new EventBus();
    this.config = {
      theme: {
        '--grain-primary': '#000000',
        '--grain-secondary': '#666666',
        '--grain-background': '#ffffff',
        '--grain-surface': '#f5f5f5',
        '--grain-border': '#e0e0e0',
        '--grain-error': '#dc3545',
        '--grain-success': '#28a745',
        '--grain-warning': '#ffc107',
        '--grain-radius': '8px',
        '--grain-font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        '--grain-font-mono': '"SF Mono", Monaco, Consolas, monospace',
        '--grain-space-xs': '4px',
        '--grain-space-sm': '8px',
        '--grain-space-md': '16px',
        '--grain-space-lg': '24px',
        '--grain-space-xl': '32px',
        '--grain-duration-fast': '150ms',
        '--grain-duration-normal': '300ms',
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

    const fragment = document.createDocumentFragment();
    this.renderAST(result.ast, fragment);

    if (options.position === 'prepend') {
      container.prepend(fragment);
    } else if (options.position === 'before') {
      container.parentNode?.insertBefore(fragment, container);
    } else if (options.position === 'after') {
      container.parentNode?.insertBefore(fragment, container.nextSibling);
    } else {
      container.innerHTML = '';
      container.appendChild(fragment);
    }

    return container as HTMLElement;
  }

  /**
   * Render Grain Language AST to HTML DOM Elements
   */
  private renderAST(node: ASTNode, documentParent: DocumentFragment | HTMLElement): void {
    if (!node) return;

    if (node.type === 'document') {
      node.children?.forEach((child: ASTNode) => this.renderAST(child, documentParent));
      return;
    }

    if (node.type === 'text') {
      documentParent.appendChild(document.createTextNode(node.value || ''));
      return;
    }

    // Map known primitives to Web Components (Prefix with 'grain-')
    let tagName = 'div';
    const knownPrimitives = ['message', 'stream', 'think', 'tool', 'artifact', 'context', 'approve', 'error', 'input', 'action', 'branch', 'state', 'form', 'chart', 'memory', 'layout', 'table'];

    if (knownPrimitives.includes(node.type)) {
      tagName = `grain-${node.type}`;
    }

    const el = document.createElement(tagName);

    // Apply attributes
    if (node.attributes) {
      Object.entries(node.attributes).forEach(([key, value]) => {
        el.setAttribute(key, String(value));
      });
    }

    // Attach specific behaviors based on type
    if (node.type === 'action') {
      el.classList.add('grain-action');
      const actionName = node.attributes?.name || '';
      el.addEventListener('click', () => {
        this.eventBus.emit('action', { action: actionName });
      });
    }

    // Recursively append children
    node.children?.forEach((child: ASTNode) => this.renderAST(child, el));

    documentParent.appendChild(el);
  }

  /**
   * Register Native Web Components
   */
  public registerCustomElements() {
    if (typeof customElements === 'undefined') return;

    const primitives = ['message', 'stream', 'think', 'tool', 'artifact', 'context', 'approve', 'error', 'input', 'action', 'branch', 'state', 'form', 'chart', 'memory', 'layout', 'table'];

    primitives.forEach(prim => {
      const name = `grain-${prim}`;
      if (!customElements.get(name)) {
        customElements.define(name, class extends HTMLElement {
          connectedCallback() {
            // Internal lifecycle logic can be injected here
            // e.g. streaming cursors, visibility toggles for 'think'
            if (prim === 'think' && this.getAttribute('visible') !== 'true') {
              this.style.display = 'none';
            }
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
}

export function createWebAdapter(config?: WebAdapterConfig): WebAdapter {
  return new WebAdapter(config);
}

export default WebAdapter;
