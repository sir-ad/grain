/**
 * Types for AI Semantics Core
 */

// Primitive Types
export type PrimitiveType = 
  | 'stream' 
  | 'think' 
  | 'tool' 
  | 'artifact' 
  | 'input' 
  | 'context' 
  | 'state' 
  | 'error' 
  | 'approve' 
  | 'branch'
  | 'message'
  | 'action';

export type PrimitiveStatus = 
  | 'idle' 
  | 'loading' 
  | 'generating' 
  | 'streaming' 
  | 'thinking'
  | 'running'
  | 'pending'
  | 'complete'
  | 'error'
  | 'approved'
  | 'denied'
  | 'expired'
  | 'visible'
  | 'hidden'
  | 'offline';

// AST Types
export interface ASTNode {
  type: string;
  attributes?: Record<string, string>;
  children?: ASTNode[];
  value?: string;
  position?: number;
}

export interface ParseResult {
  ast: ASTNode | null;
  errors: Array<{ message: string; position?: number }>;
}

export interface ParserOptions {
  validate?: boolean;
  strict?: boolean;
}

// State Machine Types
export interface StateMachineConfig {
  initial: string;
  states: string[];
  transitions: Record<string, Record<string, string>>;
}

export interface StateChangeEvent {
  from: string;
  to: string;
  event: string;
  payload?: Record<string, unknown>;
  timestamp: number;
}

// Primitive Definitions
export interface PrimitiveDefinition {
  type: PrimitiveType;
  attributes: Record<string, AttributeDefinition>;
  states: string[];
  events: EventDefinition[];
}

export interface AttributeDefinition {
  type: 'string' | 'boolean' | 'number' | 'object' | 'array';
  required: boolean;
  default?: unknown;
  description?: string;
}

export interface EventDefinition {
  name: string;
  payload?: Record<string, string>;
  description?: string;
}

// Extension Types
export interface Extension {
  name: string;
  version: string;
  primitives?: Record<string, PrimitiveDefinition>;
  middleware?: Middleware[];
  theme?: Record<string, string>;
}

export interface Middleware {
  name: string;
  priority: number;
  handler: (context: RenderContext) => void | Promise<void>;
}

// Render Types
export interface RenderContext {
  ast: ASTNode;
  adapter: string;
  platform: string;
  options?: Record<string, unknown>;
}

export interface RenderResult {
  output: string;
  errors: Array<{ message: string }>;
  events?: Array<{ type: string; payload: unknown }>;
}

// Event Types
export interface EventPayload {
  [key: string]: unknown;
}

export interface EventCallback {
  (payload: EventPayload): void;
}

// Validation Types
export interface ValidationError {
  message: string;
  path?: string;
  position?: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}
