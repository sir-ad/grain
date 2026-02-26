/**
 * MCP Adapter for Grain
 * Tools return G-Lang in JSON format
 */

import { GLangParser, EventBus } from 'grain';
import type { ASTNode, MCPAdapterConfig } from './types';

export interface MCPToolResponse {
  semantic: 'tool';
  name: string;
  input?: Record<string, unknown>;
  output?: unknown;
  status: 'pending' | 'running' | 'complete' | 'error';
  error?: { code: string; message: string };
  metadata?: { duration_ms?: number; tokens_used?: number };
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
  metadata?: { duration_ms?: number; tokens_used?: number };
}

export class MCPAdapter {
  private parser: GLangParser;
  private eventBus: EventBus;
  private config: MCPAdapterConfig;

  constructor(config: MCPAdapterConfig = {}) {
    this.parser = new GLangParser();
    this.eventBus = new EventBus();
    this.config = config;
  }

  toMCP(grain: string): MCPToolResponse | MCPAgentMessage | MCPContextAttachment | null {
    const result = this.parser.parse(grain);
    if (!result.ast || result.errors.length > 0) return null;
    return this.astToMCP(result.ast);
  }

  private astToMCP(node: ASTNode): MCPToolResponse | MCPAgentMessage | MCPContextAttachment | null {
    switch (node.type) {
      case 'tool': return this.toolToMCP(node);
      case 'context': return this.contextToMCP(node);
      default: return null;
    }
  }

  private toolToMCP(node: ASTNode): MCPToolResponse {
    const name = node.attributes?.name || 'unknown';
    const status = (node.attributes?.status as MCPToolResponse['status']) || 'pending';
    
    let input: Record<string, unknown> = {};
    let output: unknown = undefined;

    node.children?.forEach(child => {
      if (child.type === 'input') {
        const content = child.children?.[0]?.value || '';
        content.split('\n').forEach(line => {
          const [key, ...valueParts] = line.split(':');
          if (key && valueParts.length > 0) {
            result[key.trim()] = valueParts.join(':').trim();
          }
        });
      } else if (child.type === 'result') {
        output = child.attributes || child.children?.[0]?.value;
      }
    });

    if (node.attributes?.args) {
      try { input = { ...input, ...JSON.parse(node.attributes.args) }; } catch {}
    }

    return { semantic: 'tool', name, input: Object.keys(input).length ? input : undefined, output, status };
  }

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

  fromMCP(mcp: MCPToolResponse | MCPAgentMessage | MCPContextAttachment): string {
    switch (mcp.semantic) {
      case 'tool': return this.mcpToolToGrain(mcp);
      case 'context': return this.mcpContextToGrain(mcp);
      default: return '';
    }
  }

  private mcpToolToGrain(mcp: MCPToolResponse): string {
    let content = `<tool name="${mcp.name}" status="${mcp.status}"`;
    if (mcp.input) content += ` args='${JSON.stringify(mcp.input)}'`;
    content += '>';
    if (mcp.output) content += `<result>${typeof mcp.output === 'object' ? this.objectToAttrs(mcp.output as Record<string, unknown>) : mcp.output}</result>`;
    content += '</tool>';
    return content;
  }

  private mcpContextToGrain(mcp: MCPContextAttachment): string {
    let attrs = `type="${mcp.type}" id="${mcp.id}"`;
    if (mcp.name) attrs += ` name="${mcp.name}"`;
    return `<context ${attrs} />`;
  }

  private objectToAttrs(obj: Record<string, unknown>): string {
    return Object.entries(obj).map(([k, v]) => `${k}="${v}"`).join(' ');
  }

  on(event: string, callback: (payload: unknown) => void): () => void {
    return this.eventBus.on(event, callback as any);
  }
}

export function createMCPAdapter(config?: MCPAdapterConfig): MCPAdapter {
  return new MCPAdapter(config);
}

export default MCPAdapter;
