/**
 * MCP Adapter Types
 */

export interface MCPAdapterConfig {
  includeMetadata?: boolean;
}

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
