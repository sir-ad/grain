/**
 * Extension Registry
 * Manages custom primitives and extensions.
 */

import type { Extension, PrimitiveDefinition } from './types';

function definePrimitive(
  type: PrimitiveDefinition['type'],
  definition: Omit<PrimitiveDefinition, 'type'>
): PrimitiveDefinition {
  return {
    type,
    ...definition
  };
}

export class ExtensionRegistry {
  private readonly extensions: Map<string, Extension> = new Map();
  private readonly primitiveOverrides: Map<string, PrimitiveDefinition> = new Map();

  /**
   * Register an extension.
   */
  register(extension: Extension): void {
    if (this.extensions.has(extension.name)) {
      throw new Error(`Extension already registered: ${extension.name}`);
    }

    if (!extension.name || !extension.version) {
      throw new Error('Extension must have name and version');
    }

    this.extensions.set(extension.name, extension);

    if (extension.primitives) {
      for (const [name, definition] of Object.entries(extension.primitives)) {
        this.primitiveOverrides.set(name, definition);
      }
    }
  }

  /**
   * Unregister an extension.
   */
  unregister(name: string): void {
    const extension = this.extensions.get(name);
    if (extension?.primitives) {
      for (const primitiveName of Object.keys(extension.primitives)) {
        this.primitiveOverrides.delete(primitiveName);
      }
    }

    this.extensions.delete(name);
  }

  /**
   * Get an extension by name.
   */
  get(name: string): Extension | undefined {
    return this.extensions.get(name);
  }

  /**
   * Get all registered extensions.
   */
  getAll(): Extension[] {
    return Array.from(this.extensions.values());
  }

  /**
   * Get a primitive definition.
   */
  getPrimitive(name: string): PrimitiveDefinition | undefined {
    return this.primitiveOverrides.get(name);
  }

  /**
   * Get all custom primitives.
   */
  getAllPrimitives(): Record<string, PrimitiveDefinition> {
    const primitives: Record<string, PrimitiveDefinition> = {};
    for (const [name, definition] of this.primitiveOverrides.entries()) {
      primitives[name] = definition;
    }
    return primitives;
  }

  /**
   * Check whether a custom primitive exists.
   */
  hasPrimitive(name: string): boolean {
    return this.primitiveOverrides.has(name);
  }

  /**
   * Clear all extensions.
   */
  clear(): void {
    this.extensions.clear();
    this.primitiveOverrides.clear();
  }
}

/**
 * Built-in primitives.
 */
export const BUILTIN_PRIMITIVES: Record<string, PrimitiveDefinition> = {
  message: definePrimitive('message', {
    attributes: {
      role: { type: 'string', required: false, default: 'assistant' },
      stream: { type: 'boolean', required: false, default: false },
      id: { type: 'string', required: false }
    },
    states: ['idle', 'streaming', 'complete'],
    events: [
      { name: 'message.send' },
      { name: 'message.receive' }
    ],
    allowText: true
  }),
  stream: definePrimitive('stream', {
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
    ],
    allowText: true
  }),
  think: definePrimitive('think', {
    attributes: {
      model: { type: 'string', required: false, default: 'chain-of-thought' },
      visible: { type: 'boolean', required: false, default: false },
      depth: { type: 'string', required: false, default: 'medium' }
    },
    states: ['hidden', 'visible'],
    events: [
      { name: 'think.reveal' },
      { name: 'think.hide' }
    ],
    allowText: true
  }),
  tool: definePrimitive('tool', {
    attributes: {
      name: { type: 'string', required: true },
      args: { type: 'object', required: false, default: {} },
      status: { type: 'string', required: false, default: 'pending' },
      mode: { type: 'string', required: false, default: 'automatic' },
      timeout: { type: 'number', required: false },
      retry: { type: 'boolean', required: false },
      stream: { type: 'boolean', required: false }
    },
    states: ['pending', 'running', 'complete', 'error', 'cancelled'],
    events: [
      { name: 'tool.start' },
      { name: 'tool.progress' },
      { name: 'tool.complete' },
      { name: 'tool.error' }
    ],
    allowedChildren: ['input', 'result', 'progress', 'warning', 'error', 'action', 'actions', 'option']
  }),
  artifact: definePrimitive('artifact', {
    attributes: {
      type: { type: 'string', required: true },
      language: { type: 'string', required: false },
      title: { type: 'string', required: false },
      filename: { type: 'string', required: false },
      copyable: { type: 'boolean', required: false, default: false },
      downloadable: { type: 'boolean', required: false, default: false },
      editable: { type: 'boolean', required: false, default: false },
      runnable: { type: 'boolean', required: false, default: false }
    },
    states: ['loading', 'ready', 'error'],
    events: [
      { name: 'artifact.load' },
      { name: 'artifact.ready' },
      { name: 'artifact.error' }
    ],
    allowedChildren: ['actions', 'action', 'stream'],
    allowText: true
  }),
  approve: definePrimitive('approve', {
    attributes: {
      type: { type: 'string', required: true },
      action: { type: 'string', required: true },
      warning: { type: 'string', required: false },
      timeout: { type: 'number', required: false },
      auto: { type: 'boolean', required: false, default: false },
      status: { type: 'string', required: false, default: 'pending' },
      id: { type: 'string', required: false }
    },
    states: ['pending', 'showing', 'approved', 'denied', 'expired'],
    events: [
      { name: 'approve.request' },
      { name: 'approve.show' },
      { name: 'approve.approve' },
      { name: 'approve.deny' }
    ],
    allowedChildren: ['warning', 'option', 'actions', 'action'],
    allowText: true
  }),
  context: definePrimitive('context', {
    attributes: {
      type: { type: 'string', required: true },
      id: { type: 'string', required: true },
      name: { type: 'string', required: false },
      preview: { type: 'string', required: false },
      size: { type: 'number', required: false },
      mimeType: { type: 'string', required: false },
      removable: { type: 'boolean', required: false, default: true }
    },
    states: ['attached', 'loading', 'ready', 'error'],
    events: [
      { name: 'context.attach' },
      { name: 'context.load' },
      { name: 'context.remove' }
    ],
    allowText: true
  }),
  error: definePrimitive('error', {
    attributes: {
      code: { type: 'string', required: true },
      message: { type: 'string', required: false },
      recoverable: { type: 'boolean', required: false, default: false }
    },
    states: ['visible', 'acknowledged', 'dismissed'],
    events: [
      { name: 'error.occur' },
      { name: 'error.retry' },
      { name: 'error.dismiss' }
    ],
    allowedChildren: ['action', 'actions'],
    allowText: true
  }),
  input: definePrimitive('input', {
    attributes: {
      type: { type: 'string', required: false },
      name: { type: 'string', required: false },
      placeholder: { type: 'string', required: false },
      autofocus: { type: 'boolean', required: false, default: false },
      multiline: { type: 'boolean', required: false, default: false },
      attachments: { type: 'boolean', required: false, default: false },
      voice: { type: 'boolean', required: false, default: false },
      maxlength: { type: 'number', required: false },
      required: { type: 'boolean', required: false, default: false }
    },
    states: ['empty', 'typing', 'filled', 'submitting', 'submitted'],
    events: [
      { name: 'input.focus' },
      { name: 'input.change' },
      { name: 'input.submit' }
    ],
    allowText: true
  }),
  state: definePrimitive('state', {
    attributes: {
      status: { type: 'string', required: true },
      message: { type: 'string', required: false },
      progress: { type: 'number', required: false },
      eta: { type: 'string', required: false }
    },
    states: ['idle', 'loading', 'thinking', 'error', 'complete'],
    events: [
      { name: 'state.change' }
    ],
    allowText: true
  }),
  branch: definePrimitive('branch', {
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
  }),
  action: definePrimitive('action', {
    attributes: {
      name: { type: 'string', required: true },
      label: { type: 'string', required: false },
      primary: { type: 'boolean', required: false, default: false }
    },
    states: ['idle'],
    events: [
      { name: 'action.click' }
    ]
  }),
  actions: definePrimitive('actions', {
    attributes: {},
    states: ['idle'],
    events: [],
    allowedChildren: ['action', 'option']
  }),
  option: definePrimitive('option', {
    attributes: {
      label: { type: 'string', required: true },
      value: { type: 'string', required: false },
      primary: { type: 'boolean', required: false, default: false }
    },
    states: ['idle'],
    events: [
      { name: 'option.select' }
    ]
  }),
  suggestion: definePrimitive('suggestion', {
    attributes: {
      value: { type: 'string', required: false }
    },
    states: ['idle'],
    events: [
      { name: 'suggestion.select' }
    ],
    allowText: true
  }),
  item: definePrimitive('item', {
    attributes: {
      id: { type: 'string', required: false }
    },
    states: ['idle'],
    events: [],
    allowText: true
  }),
  result: definePrimitive('result', {
    attributes: {},
    states: ['idle', 'ready'],
    events: [
      { name: 'result.ready' }
    ],
    allowText: true,
    allowUnknownAttributes: true
  }),
  progress: definePrimitive('progress', {
    attributes: {
      value: { type: 'number', required: false },
      max: { type: 'number', required: false },
      status: { type: 'string', required: false }
    },
    states: ['idle', 'running', 'complete'],
    events: [
      { name: 'progress.update' }
    ],
    allowText: true
  }),
  warning: definePrimitive('warning', {
    attributes: {},
    states: ['visible'],
    events: [],
    allowText: true
  }),
  form: definePrimitive('form', {
    attributes: {
      action: { type: 'string', required: true },
      method: { type: 'string', required: false, default: 'POST' },
      schema: { type: 'string', required: false }
    },
    states: ['idle', 'editing', 'validating', 'submitting', 'success', 'error'],
    events: [
      { name: 'form.submit' },
      { name: 'form.change' },
      { name: 'form.error' }
    ],
    allowedChildren: ['input', 'action', 'actions', 'warning']
  }),
  chart: definePrimitive('chart', {
    attributes: {
      type: { type: 'string', required: true },
      title: { type: 'string', required: false },
      data: { type: 'string', required: true }
    },
    states: ['loading', 'ready', 'error', 'updating'],
    events: [
      { name: 'chart.update' },
      { name: 'chart.error' }
    ]
  }),
  table: definePrimitive('table', {
    attributes: {
      columns: { type: 'string', required: true },
      sortable: { type: 'boolean', required: false, default: false },
      pagination: { type: 'boolean', required: false, default: false }
    },
    states: ['loading', 'ready', 'error', 'updating'],
    events: [
      { name: 'table.sort' },
      { name: 'table.paginate' }
    ]
  }),
  memory: definePrimitive('memory', {
    attributes: {
      key: { type: 'string', required: true },
      scope: { type: 'string', required: false, default: 'session' },
      action: { type: 'string', required: true }
    },
    states: ['loading', 'ready', 'error'],
    events: [
      { name: 'memory.read' },
      { name: 'memory.write' }
    ],
    allowText: true
  }),
  layout: definePrimitive('layout', {
    attributes: {
      type: { type: 'string', required: true },
      gap: { type: 'string', required: false },
      direction: { type: 'string', required: false }
    },
    states: ['ready'],
    events: [
      { name: 'layout.resize' }
    ]
  })
};

/**
 * Create a new extension registry.
 */
export function createExtensionRegistry(): ExtensionRegistry {
  return new ExtensionRegistry();
}
