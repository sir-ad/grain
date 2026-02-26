/**
 * Web Adapter for AI Semantics
 * Renders G-Lang to semantic HTML
 */

import { GLangParser, EventBus, createExtensionRegistry } from '@ai-semantics/core';
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
        '--ai-primary': '#000000',
        '--ai-secondary': '#666666',
        '--ai-background': '#ffffff',
        '--ai-surface': '#f5f5f5',
        '--ai-border': '#e0e0e0',
        '--ai-error': '#dc3545',
        '--ai-success': '#28a745',
        '--ai-warning': '#ffc107',
        '--ai-radius': '8px',
        '--ai-font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        '--ai-font-mono': '"SF Mono", Monaco, Consolas, monospace',
        '--ai-space-xs': '4px',
        '--ai-space-sm': '8px',
        '--ai-space-md': '16px',
        '--ai-space-lg': '24px',
        '--ai-space-xl': '32px',
        '--ai-duration-fast': '150ms',
        '--ai-duration-normal': '300ms',
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

    // Attach event listeners
    this.attachEventListeners(container);

    return container;
  }

  /**
   * Render AST to HTML string
   */
  private renderAST(node: ASTNode): string {
    if (!node) return '';

    // Handle document node
    if (node.type === 'document') {
      return node.children?.map(child => this.renderAST(child)).join('') || '';
    }

    // Handle text node
    if (node.type === 'text') {
      return node.value || '';
    }

    // Render based on node type
    switch (node.type) {
      case 'message':
        return this.renderMessage(node);
      case 'stream':
        return this.renderStream(node);
      case 'think':
        return this.renderThink(node);
      case 'tool':
        return this.renderTool(node);
      case 'artifact':
        return this.renderArtifact(node);
      case 'context':
        return this.renderContext(node);
      case 'approve':
        return this.renderApprove(node);
      case 'error':
        return this.renderError(node);
      case 'input':
        return this.renderInput(node);
      case 'action':
        return this.renderAction(node);
      case 'branch':
        return this.renderBranch(node);
      case 'state':
        return this.renderState(node);
      default:
        return this.renderUnknown(node);
    }
  }

  private renderMessage(node: ASTNode): string {
    const role = node.attributes?.role || 'assistant';
    const isStreaming = node.attributes?.stream === 'true';
    const children = node.children?.map(c => this.renderAST(c)).join('') || '';
    
    return `
      <ai-message class="${role}${isStreaming ? ' streaming' : ''}" role="${role}">
        ${children}
      </ai-message>
    `;
  }

  private renderStream(node: ASTNode): string {
    const speed = node.attributes?.speed || 'normal';
    const cursor = node.attributes?.cursor !== 'false';
    const children = node.children?.map(c => this.renderAST(c)).join('') || '';
    
    return `
      <ai-stream 
        class="${speed}" 
        ${cursor ? 'cursor' : ''}
        data-speed="${speed}">
        ${children}
      </ai-stream>
    `;
  }

  private renderThink(node: ASTNode): string {
    const model = node.attributes?.model || 'chain-of-thought';
    const visible = node.attributes?.visible === 'true';
    const children = node.children?.map(c => this.renderAST(c)).join('') || '';
    
    return `
      <ai-think class="${visible ? 'visible' : 'hidden'}" data-model="${model}">
        ${children}
      </ai-think>
    `;
  }

  private renderTool(node: ASTNode): string {
    const name = node.attributes?.name || 'unknown';
    const status = node.attributes?.status || 'pending';
    const children = node.children?.map(c => this.renderAST(c)).join('') || '';
    
    return `
      <ai-tool class="${status}" data-name="${name}" data-status="${status}">
        ${children}
      </ai-tool>
    `;
  }

  private renderArtifact(node: ASTNode): string {
    const type = node.attributes?.type || 'text';
    const title = node.attributes?.title || '';
    const language = node.attributes?.language || '';
    const copyable = node.attributes?.copyable === 'true';
    const downloadable = node.attributes?.downloadable === 'true';
    const children = node.children?.map(c => this.renderAST(c)).join('') || '';
    
    return `
      <ai-artifact 
        class="${type}" 
        data-type="${type}"
        data-language="${language}"
        ${title ? `title="${title}"` : ''}>
        ${title ? `<header>${title}</header>` : ''}
        <content>${children}</content>
        ${copyable || downloadable ? `
          <actions>
            ${copyable ? '<button class="copy">Copy</button>' : ''}
            ${downloadable ? '<button class="download">Download</button>' : ''}
          </actions>
        ` : ''}
      </ai-artifact>
    `;
  }

  private renderContext(node: ASTNode): string {
    const type = node.attributes?.type || 'file';
    const id = node.attributes?.id || '';
    const name = node.attributes?.name || '';
    const removable = node.attributes?.removable !== 'false';
    
    return `
      <ai-context class="${type}" data-id="${id}" data-type="${type}">
        <icon>${type === 'file' ? '📄' : type === 'url' ? '🔗' : '💾'}</icon>
        <name>${name}</name>
        ${removable ? '<button class="remove">×</button>' : ''}
      </ai-context>
    `;
  }

  private renderApprove(node: ASTNode): string {
    const type = node.attributes?.type || 'tool_call';
    const action = node.attributes?.action || '';
    const warning = node.attributes?.warning || '';
    const children = node.children?.map(c => this.renderAST(c)).join('') || '';
    
    return `
      <ai-approve class="${type}" data-action="${action}">
        ${warning ? `<warning>${warning}</warning>` : ''}
        <actions>${children}</actions>
      </ai-approve>
    `;
  }

  private renderError(node: ASTNode): string {
    const code = node.attributes?.code || 'UNKNOWN';
    const message = node.children?.map(c => this.renderAST(c)).join('') || '';
    const recoverable = node.attributes?.recoverable === 'true';
    
    return `
      <ai-error class="${recoverable ? 'recoverable' : ''}" data-code="${code}">
        <icon>⚠️</icon>
        <message>${message}</message>
        ${recoverable ? '<actions><button class="retry">Retry</button></actions>' : ''}
      </ai-error>
    `;
  }

  private renderInput(node: ASTNode): string {
    const type = node.attributes?.type || 'text';
    const placeholder = node.attributes?.placeholder || '';
    const multiline = node.attributes?.multiline === 'true';
    const children = node.children?.map(c => this.renderAST(c)).join('') || '';
    
    return `
      <ai-input class="${multiline ? 'multiline' : ''}">
        ${multiline 
          ? `<textarea placeholder="${placeholder}"></textarea>` 
          : `<input type="text" placeholder="${placeholder}" />`}
        ${children ? `<suggestions>${children}</suggestions>` : ''}
      </ai-input>
    `;
  }

  private renderAction(node: ASTNode): string {
    const name = node.attributes?.name || '';
    const label = node.attributes?.label || name;
    const primary = node.attributes?.primary === 'true';
    
    return `
      <button 
        class="ai-action${primary ? ' primary' : ''}" 
        data-action="${name}">
        ${label}
      </button>
    `;
  }

  private renderBranch(node: ASTNode): string {
    const id = node.attributes?.id || '';
    const label = node.attributes?.label || '';
    const active = node.attributes?.active === 'true';
    const children = node.children?.map(c => this.renderAST(c)).join('') || '';
    
    return `
      <ai-branch class="${active ? 'active' : ''}" data-id="${id}">
        ${label ? `<header>${label}</header>` : ''}
        <content>${children}</content>
      </ai-branch>
    `;
  }

  private renderState(node: ASTNode): string {
    const status = node.attributes?.status || 'idle';
    const message = node.attributes?.message || '';
    
    return `
      <ai-state class="${status}" data-status="${status}">
        ${message}
      </ai-state>
    `;
  }

  private renderUnknown(node: ASTNode): string {
    const children = node.children?.map(c => this.renderAST(c)).join('') || '';
    return `<div class="unknown" data-type="${node.type}">${children}</div>`;
  }

  /**
   * Attach event listeners to rendered elements
   */
  private attachEventListeners(container: HTMLElement): void {
    // Action buttons
    container.querySelectorAll('.ai-action').forEach(el => {
      el.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const action = target.dataset.action;
        this.eventBus.emit('action', { action, element: target });
      });
    });

    // Copy buttons
    container.querySelectorAll('ai-artifact .copy').forEach(el => {
      el.addEventListener('click', (e) => {
        const artifact = (e.target as HTMLElement).closest('ai-artifact');
        const content = artifact?.querySelector('content')?.textContent;
        if (content) {
          navigator.clipboard.writeText(content);
          this.eventBus.emit('copy', { content });
        }
      });
    });

    // Think reveal/hide
    container.querySelectorAll('ai-think').forEach(el => {
      el.addEventListener('click', () => {
        el.classList.toggle('visible');
        this.eventBus.emit('think:toggle', { visible: el.classList.contains('visible') });
      });
    });
  }

  /**
   * Subscribe to events
   */
  on(event: string, callback: (payload: unknown) => void): () => void {
    return this.eventBus.on(event, callback as any);
  }

  /**
   * Get CSS variables
   */
  getThemeCSS(): string {
    return Object.entries(this.config.theme || {})
      .map(([key, value]) => `${key}: ${value};`)
      .join('\n');
  }
}

/**
 * Create a web adapter instance
 */
export function createWebAdapter(config?: WebAdapterConfig): WebAdapter {
  return new WebAdapter(config);
}

// Default export for CDN
export default WebAdapter;
