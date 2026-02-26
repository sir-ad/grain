/**
 * Web Adapter for Grain
 * Renders G-Lang to semantic HTML
 */

import { GLangParser, EventBus, createExtensionRegistry } from 'grain';
import type { ASTNode, WebAdapterConfig, RenderOptions } from './types';

export class WebAdapter {
  private parser: GLangParser;
  private eventBus: EventBus;
  private extensions: ReturnType<typeof createExtensionRegistry>;
  private config: WebAdapterConfig;
  
  constructor(config: WebAdapterConfig = {}) {
    this.parser = new GLangParser();
    this.eventBus = new EventBus();
    this.extensions = createExtensionRegistry();
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
   * Render G-Lang to HTML
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

    const html = this.renderAST(result.ast);
    
    if (options.position === 'prepend') {
      container.insertAdjacentHTML('afterbegin', html);
    } else if (options.position === 'before') {
      container.insertAdjacentHTML('beforebegin', html);
    } else if (options.position === 'after') {
      container.insertAdjacentHTML('afterend', html);
    } else {
      container.innerHTML = html;
    }

    this.attachEventListeners(container);
    return container;
  }

  /**
   * Render AST to HTML string
   */
  private renderAST(node: ASTNode): string {
    if (!node) return '';
    if (node.type === 'document') {
      return node.children?.map(child => this.renderAST(child)).join('') || '';
    }
    if (node.type === 'text') {
      return node.value || '';
    }

    switch (node.type) {
      case 'message': return this.renderMessage(node);
      case 'stream': return this.renderStream(node);
      case 'think': return this.renderThink(node);
      case 'tool': return this.renderTool(node);
      case 'artifact': return this.renderArtifact(node);
      case 'context': return this.renderContext(node);
      case 'approve': return this.renderApprove(node);
      case 'error': return this.renderError(node);
      case 'input': return this.renderInput(node);
      case 'action': return this.renderAction(node);
      case 'branch': return this.renderBranch(node);
      case 'state': return this.renderState(node);
      default: return this.renderUnknown(node);
    }
  }

  private renderMessage(node: ASTNode): string {
    const role = node.attributes?.role || 'assistant';
    const isStreaming = node.attributes?.stream === 'true';
    const children = node.children?.map(c => this.renderAST(c)).join('') || '';
    return `<grain-message class="${role}${isStreaming ? ' streaming' : ''}" role="${role}">${children}</grain-message>`;
  }

  private renderStream(node: ASTNode): string {
    const speed = node.attributes?.speed || 'normal';
    const cursor = node.attributes?.cursor !== 'false';
    const children = node.children?.map(c => this.renderAST(c)).join('') || '';
    return `<grain-stream class="${speed}" ${cursor ? 'cursor' : ''} data-speed="${speed}">${children}</grain-stream>`;
  }

  private renderThink(node: ASTNode): string {
    const visible = node.attributes?.visible === 'true';
    const children = node.children?.map(c => this.renderAST(c)).join('') || '';
    return `<grain-think class="${visible ? 'visible' : 'hidden'}">${children}</grain-think>`;
  }

  private renderTool(node: ASTNode): string {
    const name = node.attributes?.name || 'unknown';
    const status = node.attributes?.status || 'pending';
    const children = node.children?.map(c => this.renderAST(c)).join('') || '';
    return `<grain-tool class="${status}" data-name="${name}" data-status="${status}">${children}</grain-tool>`;
  }

  private renderArtifact(node: ASTNode): string {
    const type = node.attributes?.type || 'text';
    const title = node.attributes?.title || '';
    const language = node.attributes?.language || '';
    const children = node.children?.map(c => this.renderAST(c)).join('') || '';
    return `<grain-artifact class="${type}" data-type="${type}" data-language="${language}" ${title ? `title="${title}"` : ''}>${children}</grain-artifact>`;
  }

  private renderContext(node: ASTNode): string {
    const type = node.attributes?.type || 'file';
    const id = node.attributes?.id || '';
    const name = node.attributes?.name || '';
    return `<grain-context class="${type}" data-id="${id}" data-type="${type}">${name}</grain-context>`;
  }

  private renderApprove(node: ASTNode): string {
    const action = node.attributes?.action || '';
    const warning = node.attributes?.warning || '';
    const children = node.children?.map(c => this.renderAST(c)).join('') || '';
    return `<grain-approve data-action="${action}">${warning ? `<warning>${warning}</warning>` : ''}${children}</grain-approve>`;
  }

  private renderError(node: ASTNode): string {
    const code = node.attributes?.code || 'UNKNOWN';
    const message = node.children?.map(c => this.renderAST(c)).join('') || '';
    return `<grain-error data-code="${code}">${message}</grain-error>`;
  }

  private renderInput(node: ASTNode): string {
    const placeholder = node.attributes?.placeholder || '';
    const multiline = node.attributes?.multiline === 'true';
    const children = node.children?.map(c => this.renderAST(c)).join('') || '';
    return `<grain-input class="${multiline ? 'multiline' : ''}">${multiline ? `<textarea placeholder="${placeholder}"></textarea>` : `<input type="text" placeholder="${placeholder}" />`}${children}</grain-input>`;
  }

  private renderAction(node: ASTNode): string {
    const name = node.attributes?.name || '';
    const label = node.attributes?.label || name;
    return `<button class="grain-action" data-action="${name}">${label}</button>`;
  }

  private renderBranch(node: ASTNode): string {
    const id = node.attributes?.id || '';
    const label = node.attributes?.label || '';
    const children = node.children?.map(c => this.renderAST(c)).join('') || '';
    return `<grain-branch data-id="${id}" ${label ? `label="${label}"` : ''}>${children}</grain-branch>`;
  }

  private renderState(node: ASTNode): string {
    const status = node.attributes?.status || 'idle';
    return `<grain-state data-status="${status}"></grain-state>`;
  }

  private renderUnknown(node: ASTNode): string {
    const children = node.children?.map(c => this.renderAST(c)).join('') || '';
    return `<div class="unknown" data-type="${node.type}">${children}</div>`;
  }

  private attachEventListeners(container: HTMLElement): void {
    container.querySelectorAll('.grain-action').forEach(el => {
      el.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        this.eventBus.emit('action', { action: target.dataset.action });
      });
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
