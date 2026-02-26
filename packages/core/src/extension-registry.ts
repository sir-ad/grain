/**
 * Extension Registry
 * Manages custom primitives and extensions
 */

import type { Extension, PrimitiveDefinition } from './types';

export class ExtensionRegistry {
  private extensions: Map<string, Extension> = new Map();
  private primitiveOverrides: Map<string, PrimitiveDefinition> = new Map();

  /**
   * Register an extension
   */
  register(extension: Extension): void {
    if (this.extensions.has(extension.name)) {
      throw new Error(`Extension already registered: ${extension.name}`);
    }

    // Validate extension
    if (!extension.name || !extension.version) {
      throw new Error('Extension must have name and version');
    }

    this.extensions.set(extension.name, extension);

    // Register custom primitives
    if (extension.primitives) {
      for (const [name, def] of Object.entries(extension.primitives)) {
        this.primitiveOverrides.set(name, def);
      }
    }
  }

  /**
   * Unregister an extension
   */
  unregister(name: string): void {
    const extension = this.extensions.get(name);
    if (extension?.primitives) {
      for (const primitiveName of Object.keys(extension.primitives)) {
        this.primitiveOverrides.delete(primitiveName);
      });
    }
    this.extensions.delete(name);
  }

  /**
   * Get an extension by name
   */
  get(name: string): Extension | undefined {
    return this.extensions.get(name);
  }

  /**
   * Get all registered extensions
   */
  getAll(): Extension[] {
    return Array.from(this.extensions.values());
  }

  /**
   * Get primitive definition
   */
  getPrimitive(name: string): PrimitiveDefinition | undefined {
    return this.primitiveOverrides.get(name);
  }

  /**
   * Get all custom primitives
   */
  getAllPrimitives(): Record<string, PrimitiveDefinition> {
    const primitives: Record<string, PrimitiveDefinition> = {};
    for (const [name, def] of this.primitiveOverrides) {
      primitives[name] = def;
    }
    return primitives;
  }

  /**
   * Check if primitive exists
   */
  hasPrimitive(name: string): boolean {
    return this.primitiveOverrides.has(name);
  }

  /**
   * Clear all extensions
   */
  clear(): void {
    this.extensions.clear();
    this.primitiveOverrides.clear();
  }
}

/**
 * Built-in primitives
 */
export const BUILTIN_PRIMITIVES: Record<string, PrimitiveDefinition> = {
  message: {
    type: 'message',
    attributes: {
      role: { type: 'string', required: false, default: 'assistant' },
      stream: { type: 'boolean', required: false, default: false },
      id: { type: 'string', required: false }
    },
    states: ['idle', 'streaming', 'complete'],
    events: [
      { name: 'message.send' },
      { name: 'message.receive' }
    ]
  },
  stream: {
    type: 'stream',
    attributes: {
      speed: { type: 'string', required: false, default: 'normal' },
      cursor: { type: 'boolean', required: false, default: true },
      markdown: { type: 'boolean', required: false, default: false }
    },
    states: ['idle', 'generating', 'complete', 'paused', 'error'],
    events: [
      { name: 'stream.start' },
      { name: 'stream.chunk' },
      { name: 'stream.complete' },
      { name: 'stream.pause' },
      { name: 'stream.error' }
    ]
  },
  think: {
    type: 'think',
    attributes: {
      model: { type: 'string', required: false, default: 'chain-of-thought' },
      visible: { type: 'boolean', required: false, default: false },
      depth: { type: 'string', required: false, default: 'medium' }
    },
    states: ['hidden', 'visible'],
    events: [
      { name: 'think.reveal' },
      { name: 'think.hide' }
    ]
  },
  tool: {
    type: 'tool',
    attributes: {
      name: { type: 'string', required: true },
      args: { type: 'object', required: false, default: {} },
      status: { type: 'string', required: false, default: 'pending' },
      mode: { type: 'string', required: false, default: 'automatic' }
    },
    states: ['pending', 'running', 'complete', 'error', 'cancelled'],
    events: [
      { name: 'tool.start' },
      { name: 'tool.progress' },
      { name: 'tool.complete' },
      { name: 'tool.error' }
    ]
  },
  artifact: {
    type: 'artifact',
    attributes: {
      type: { type: 'string', required: true },
      language: { type: 'string', required: false },
      title: { type: 'string', required: false },
      copyable: { type: 'boolean', required: false, default: false },
      downloadable: { type: 'boolean', required: false, default: false }
    },
    states: ['loading', 'ready', 'error'],
    events: [
      { name: 'artifact.load' },
      { name: 'artifact.ready' },
      { name: 'artifact.error' }
    ]
  },
  approve: {
    type: 'approve',
    attributes: {
      type: { type: 'string', required: true },
      action: { type: 'string', required: true },
      warning: { type: 'string', required: false },
      timeout: { type: 'number', required: false }
    },
    states: ['pending', 'showing', 'approved', 'denied', 'expired'],
    events: [
      { name: 'approve.request' },
      { name: 'approve.show' },
      { name: 'approve.approve' },
      { name: 'approve.deny' }
    ]
  },
  context: {
    type: 'context',
    attributes: {
      type: { type: 'string', required: true },
      id: { type: 'string', required: true },
      name: { type: 'string', required: false },
      removable: { type: 'boolean', required: false, default: true }
    },
    states: ['attached', 'loading', 'ready', 'error'],
    events: [
      { name: 'context.attach' },
      { name: 'context.load' },
      { name: 'context.remove' }
    ]
  },
  error: {
    type: 'error',
    attributes: {
      code: { type: 'string', required: true },
      message: { type: 'string', required: true },
      recoverable: { type: 'boolean', required: false, default: false }
    },
    states: ['visible', 'acknowledged', 'dismissed'],
    events: [
      { name: 'error.occur' },
      { name: 'error.retry' },
      { name: 'error.dismiss' }
    ]
  },
  input: {
    type: 'input',
    attributes: {
      type: { type: 'string', required: true },
      placeholder: { type: 'string', required: false },
      multiline: { type: 'boolean', required: false, default: false },
      maxlength: { type: 'number', required: false }
    },
    states: ['empty', 'typing', 'filled', 'submitting', 'submitted'],
    events: [
      { name: 'input.focus' },
      { name: 'input.change' },
      { name: 'input.submit' }
    ]
  },
  branch: {
    type: 'branch',
    attributes: {
      id: { type: 'string', required: true },
      label: { type: 'string', required: false },
      active: { type: 'boolean', required: false, default: false },
      mergeable: { type: 'boolean', required: false, default: false }
    },
    states: ['created', 'expanded', 'collapsed', 'active', 'merged'],
    events: [
      { name: 'branch.create' },
      { name: 'branch.expand' },
      { name: 'branch.activate' },
      { name: 'branch.merge' }
    ]
  }
};

/**
 * Create a new extension registry
 */
export function createExtensionRegistry(): ExtensionRegistry {
  return new ExtensionRegistry();
}
