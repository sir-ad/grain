/**
 * MCP Adapter for AI Semantics
 * Tools return G-Lang in JSON format
 */

import { GLangParser, EventBus } from '@ai-semantics/core';
import type { ASTNode, MCPAdapterConfig } from './types';

export interface MCPToolResponse {
  semantic: 'tool';
  name: string;
  input?: Record<string, unknown>;
  output?: unknown;
  status: 'pending' | 'running' | 'complete' | 'error';
  error?: {
    code: string;
    message: string;
  };
  metadata?: {
    duration_ms?: number;
    tokens_used?: number;
  };
}

export interface MCPContextAttachment {
  semantic: 'context';
  type: 'file' | 'url' | 'memory' | 'memory_chip' | 'conversation';
  id: string;
  name?: string;
  preview?: string;
  size?: number;
  mimeType?: string;
}

export interface MCPAgentMessage {
  semantic: 'agent_message';
  from: string;
  to: string;
  type: 'task_start' | 'task_update' | 'task_complete' | 'task_error';
  task_id?: string;
  result?: MCPToolResponse | MCPContextAttachment;
  requires_approval?: boolean;
  metadata?: {
    duration_ms?: number;
    tokens_used?: number;
  };
}

/**
 * Convert G-Lang AST to MCP JSON
 */
export class MCPAdapter {
  private parser: GLangParser;
  private eventBus: EventBus;
  private config: MCPAdapterConfig;

  constructor(config: MCPAdapterConfig = {}) {
    this.parser = new GLangParser();
    this.eventBus = new EventBus();
    this.config = config;
  }

  /**
   * Parse G-Lang and convert to MCP format
   */
  toMCP(grain: string): MCPToolResponse | MCPAgentMessage | MCPContextAttachment | null {
    const result = this.parser.parse(grain);
    
    if (!result.ast || result.errors.length > 0) {
      console.error('Parse errors:', result.errors);
      return null;
    }

    return this.astToMCP(result.ast);
  }

  /**
   * Convert AST to MCP JSON
   */
  private astToMCP(node: ASTNode): MCPToolResponse | MCPAgentMessage | MCPContextAttachment | null {
    switch (node.type) {
      case 'tool':
        return this.toolToMCP(node);
      case 'context':
        return this.contextToMCP(node);
      default:
        return null;
    }
  }

  /**
   * Convert tool to MCP format
   */
  private toolToMCP(node: ASTNode): MCPToolResponse {
    const name = node.attributes?.name || 'unknown';
    const status = (node.attributes?.status as MCPToolResponse['status']) || 'pending';
    
    let input: Record<string, unknown> = {};
    let output: unknown = undefined;
    let error: MCPToolResponse['error'] = undefined;

    // Parse children for input/output/error
    node.children?.forEach(child => {
      if (child.type === 'input') {
        input = this.parseInputContent(child);
      } else if (child.type === 'result') {
        output = this.parseResultContent(child);
      } else if (child.type === 'error') {
        error = {
          code: child.attributes?.code || 'UNKNOWN',
          message: child.children?.[0]?.value || 'Unknown error'
        };
      }
    });

    // Parse args from attributes
    if (node.attributes?.args) {
      try {
        input = { ...input, ...JSON.parse(node.attributes.args) };
      } catch (e) {
        // Ignore parse errors
      }
    }

    return {
      semantic: 'tool',
      name,
      input: Object.keys(input).length > 0 ? input : undefined,
      output,
      status,
      error,
      metadata: this.config.includeMetadata ? {
        duration_ms: undefined,
        tokens_used: undefined
      } : undefined
    };
  }

  /**
   * Convert context to MCP format
   */
  private contextToMCP(node: ASTNode): MCPContextAttachment {
    return {
      semantic: 'context',
      type: (node.attributes?.type as MCPContextAttachment['type']) || 'file',
      id: node.attributes?.id || '',
      name: node.attributes?.name,
      preview: node.attributes?.preview,
      size: node.attributes?.size ? parseInt(node.attributes.size) : undefined,
      mimeType: node.attributes?.mimeType
    };
  }

  /**
   * Parse input content from tool
   */
  private parseInputContent(node: ASTNode): Record<string, unknown> {
    const content = node.children?.[0]?.value || '';
    // Simple key: value parsing
    const result: Record<string, unknown> = {};
    content.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        result[key.trim()] = valueParts.join(':').trim();
      }
    });
    return result;
  }

  /**
   * Parse result content from tool
   */
  private parseResultContent(node: ASTNode): unknown {
    // Check for JSON attributes
    const attrs = node.attributes || {};
    if (Object.keys(attrs).length > 0) {
      return attrs;
    }
    // Otherwise return text content
    return node.children?.[0]?.value;
  }

  /**
   * Create G-Lang from MCP response
   */
  fromMCP(mcp: MCPToolResponse | MCPAgentMessage | MCPContextAttachment): string {
    switch (mcp.semantic) {
      case 'tool':
        return this.mcpToolToGrain(mcp);
      case 'context':
        return this.mcpContextToGrain(mcp);
      case 'agent_message':
        return this.mcpAgentToGrain(mcp);
      default:
        return '';
    }
  }

  /**
   * Convert MCP tool to G-Lang
   */
  private mcpToolToGrain(mcp: MCPToolResponse): string {
    let content = `<tool name="${mcp.name}" status="${mcp.status}"`;
    
    if (mcp.input && Object.keys(mcp.input).length > 0) {
      content += ` args='${JSON.stringify(mcp.input)}'`;
    }
    
    content += '>';
    
    if (mcp.status === 'complete' && mcp.output !== undefined) {
      if (typeof mcp.output === 'object') {
        content += `<result ${this.objectToAttrs(mcp.output as Record<string, unknown>)} />`;
      } else {
        content += `<result>${mcp.output}</result>`;
      }
    }
    
    if (mcp.status === 'error' && mcp.error) {
      content += `<error code="${mcp.error.code}" message="${mcp.error.message}" />`;
    }
    
    content += '</tool>';
    
    return content;
  }

  /**
   * Convert MCP context to G-Lang
   */
  private mcpContextToGrain(mcp: MCPContextAttachment): string {
    let attrs = `type="${mcp.type}" id="${mcp.id}"`;
    
    if (mcp.name) attrs += ` name="${mcp.name}"`;
    if (mcp.preview) attrs += ` preview="${mcp.preview}"`;
    if (mcp.size) attrs += ` size="${mcp.size}"`;
    if (mcp.mimeType) attrs += ` mimeType="${mcp.mimeType}"`;
    
    return `<context ${attrs} />`;
  }

  /**
   * Convert MCP agent message to G-Lang
   */
  private mcpAgentToGrain(mcp: MCPAgentMessage): string {
    let content = `<agent from="${mcp.from}" to="${mcp.to}" type="${mcp.type}"`;
    
    if (mcp.task_id) content += ` task_id="${mcp.task_id}"`;
    if (mcp.requires_approval) content += ` requires_approval="true"`;
    
    content += '>';
    
    if (mcp.result) {
      content += this.fromMCP(mcp.result);
    }
    
    content += '</agent>';
    
    return content;
  }

  /**
   * Convert object to attribute string
   */
  private objectToAttrs(obj: Record<string, unknown>): string {
    return Object.entries(obj)
      .map(([k, v]) => `${k}="${v}"`)
      .join(' ');
  }

  /**
   * Subscribe to events
   */
  on(event: string, callback: (payload: unknown) => void): () => void {
    return this.eventBus.on(event, callback as any);
  }
}

/**
 * Create MCP adapter instance
 */
export function createMCPAdapter(config?: MCPAdapterConfig): MCPAdapter {
  return new MCPAdapter(config);
}

export default MCPAdapter;
