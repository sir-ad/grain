# Architecture

> System design for AI Semantics.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         AI SEMANTICS                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐           │
│  │   SPEC      │    │   G-LANG    │    │  ADAPTERS   │           │
│  │  LAYER     │◄──►│   LAYER     │◄──►│   LAYER     │           │
│  └─────────────┘    └─────────────┘    └─────────────┘           │
│        │                  │                  │                    │
│        ▼                  ▼                  ▼                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                      CORE RUNTIME                           │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │  │
│  │  │ Parser   │  │Validator │  │Renderer  │  │ State    │  │  │
│  │  │          │  │          │  │          │  │ Machine  │  │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Layer 1: Specification Layer

**Purpose:** Defines the canonical behavior of all primitives.

### Components

| Component | Responsibility |
|-----------|----------------|
| `primitives.yaml` | Primitive definitions |
| `state-machines.yaml` | State transition rules |
| `events.yaml` | Event taxonomy |
| `schemas/` | JSON Schema for each primitive |

### Data Flow

```
primitives.yaml → Validator → Core Runtime
       │
       └─► Documentation Generator
```

---

## Layer 2: G-Lang Layer

**Purpose:** Parses and validates G-Lang syntax.

### Components

| Component | Responsibility |
|-----------|----------------|
| `lexer/` | Tokenization |
| `parser/` | AST generation |
| `validator/` | Schema validation |
| `transformer/` | AST transformations |

### Parser Flow

```
G-Lang String → Lexer → Tokens → Parser → AST → Validator → Valid AST
                     │                   │
                     └─► Error Reporter ─┘
```

### Parser Implementation

```javascript
// core/parser.js
export class GLangParser {
  constructor(options = {}) {
    this.lexer = new Lexer();
    this.validator = new Validator();
    this.options = options;
  }
  
  parse(input) {
    // 1. Tokenize
    const tokens = this.lexer.tokenize(input);
    
    // 2. Build AST
    const ast = this.parser.parse(tokens);
    
    // 3. Validate against spec
    if (this.options.validate !== false) {
      this.validator.validate(ast);
    }
    
    return ast;
  }
  
  parseAsync(input) {
    return Promise.resolve(this.parse(input));
  }
}
```

---

## Layer 3: Core Runtime

**Purpose:** Executes state machines and manages lifecycle.

### Components

| Component | Responsibility |
|-----------|----------------|
| `StateMachine` | State transitions |
| `EventBus` | Event emission |
| `ContextManager` | Context propagation |
| `ExtensionRegistry` | Custom primitives |

### StateMachine Implementation

```javascript
// core/state-machine.js
export class StateMachine {
  constructor(config) {
    this.states = config.states;
    this.initial = config.initial;
    this.transitions = config.transitions;
    this.current = this.initial;
    this.listeners = new Map();
  }
  
  transition(event, payload = {}) {
    const fromState = this.current;
    const toState = this.transitions[fromState]?.[event];
    
    if (!toState) {
      throw new InvalidTransitionError(fromState, event);
    }
    
    this.current = toState;
    this.emit('transition', { from: fromState, to: toState, event, payload });
    
    return { from: fromState, to: toState };
  }
  
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }
  
  emit(event, data) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(cb => cb(data));
  }
  
  getState() {
    return this.current;
  }
}
```

---

## Layer 4: Adapter Layer

**Purpose:** Renders G-Lang on different platforms.

### Adapter Interface

```javascript
// adapters/base.js
export class BaseAdapter {
  constructor(config = {}) {
    this.config = config;
    this.extensionRegistry = new ExtensionRegistry();
  }
  
  // Render G-Lang AST to platform-specific output
  render(ast, context = {}) {
    throw new Error('render() must be implemented');
  }
  
  // Handle user interaction
  handleInteraction(interaction) {
    throw new Error('handleInteraction() must be implemented');
  }
  
  // Register custom primitives
  registerExtension(extension) {
    this.extensionRegistry.register(extension);
  }
}
```

### Web Adapter

```javascript
// adapters/web/index.js
export class WebAdapter extends BaseAdapter {
  constructor(config = {}) {
    super(config);
    this.componentMap = this.buildComponentMap();
  }
  
  render(ast, context = {}) {
    const renderer = new ASTRenderer(this);
    return renderer.render(ast);
  }
  
  buildComponentMap() {
    return {
      message: MessageComponent,
      stream: StreamComponent,
      think: ThinkComponent,
      tool: ToolComponent,
      artifact: ArtifactComponent,
      context: ContextComponent,
      approve: ApproveComponent,
      branch: BranchComponent,
      state: StateComponent,
      error: ErrorComponent,
      input: InputComponent,
      action: ActionComponent
    };
  }
}
```

### CLI Adapter

```javascript
// adapters/cli/index.js
export class CLIAdapter extends BaseAdapter {
  constructor(config = {}) {
    super(config);
    this.ansi = new AnsiRenderer();
  }
  
  render(ast, context = {}) {
    const renderer = new CLIRenderer(this);
    return renderer.render(ast);
  }
  
  // Terminal-specific rendering
  renderStream(element) {
    return this.ansi.bold(this.ansi.cyan('◐ ')) + element.content;
  }
  
  renderTool(element) {
    const icons = { pending: '○', running: '◐', complete: '✓', error: '✗' };
    return `${icons[element.status]} Tool: ${element.name}`;
  }
  
  renderArtifact(element) {
    return this.ansi.codeBlock(element.content, element.language);
  }
}
```

---

## Data Flow

### Input to Render

```
User Input / AI Output
         │
         ▼
┌─────────────────┐
│   G-Lang Input  │
│  (string/JSON)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     Parser      │ ◄── Validate against SPEC
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Validated AST   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ State Machine  │ ◄── Initialize state for each primitive
│   Init         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Adapter      │ ◄── Select based on platform
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Platform      │
│  Output        │
│ (HTML/CLI/JSON)│
└─────────────────┘
```

### Event Flow

```
Platform Event (click, submit, etc.)
         │
         ▼
┌─────────────────┐
│  Event Bus      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ State Machine   │
│  Transition     │
└────────┬────────┘
         │
    ┌────┴────┐
    │          │
    ▼          ▼
┌───────┐  ┌────────┐
│Update │  │ Emit   │
│State  │  │ Event  │
└───┬───┘  └────┬───┘
    │            │
    ▼            ▼
┌────────┐  ┌────────────┐
│Re-render│  │ Listeners │
│Adapter  │  │ (UI update)│
└────────┘  └────────────┘
```

---

## Extension System

### Architecture

```
┌─────────────────────────────────────────┐
│           Extension Registry            │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────┐  ┌───────────┐          │
│  │ Built-in  │  │  Custom   │          │
│  │ Primitives│  │Extensions │          │
│  └───────────┘  └───────────┘          │
│         │              │                │
│         └──────┬───────┘                │
│                ▼                         │
│         ┌───────────┐                   │
│         │  Merge    │                   │
│         │ Priority  │                   │
│         └─────┬─────┘                   │
│               ▼                          │
│         ┌───────────┐                    │
│         │  Unified  │                    │
│         │Primitive  │                    │
│         │   Map     │                    │
│         └───────────┘                    │
└─────────────────────────────────────────┘
```

### Extension Structure

```javascript
// extensions/base.js
export class Extension {
  constructor(config) {
    this.name = config.name;
    this.version = config.version;
    this.primitives = config.primitives || {};
    this.middleware = config.middleware || [];
    this.theme = config.theme || {};
  }
  
  // Define custom primitives
  getPrimitives() {
    return this.primitives;
  }
  
  // Hook into rendering pipeline
  getMiddleware() {
    return this.middleware;
  }
  
  // Custom CSS/theme
  getTheme() {
    return this.theme;
  }
}
```

### Enterprise Extension Example

```javascript
// enterprise-crm.js
export const crmExtension = {
  name: '@enterprise/crm',
  version: '1.0.0',
  
  primitives: {
    'crm-contact': {
      schema: {
        name: { type: 'string', required: true },
        company: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string' },
        deal_value: { type: 'number' }
      },
      render: (props) => `<div class="crm-contact-card">...</div>`
    },
    
    'deal-stage': {
      schema: {
        stage: { type: 'enum', values: ['lead', 'qualified', 'proposal', 'closed'] },
        probability: { type: 'number' }
      },
      render: (props) => `<div class="deal-stage">...</div>`
    }
  },
  
  theme: {
    '--ai-primary': '#0066FF',
    '--ai-secondary': '#00AAFF',
    '--ai-radius': '8px'
  }
};
```

---

## Directory Structure

```
ai-semantics/
├── core/                      # Core runtime
│   ├── parser.js              # G-Lang parser
│   ├── validator.js           # Schema validation
│   ├── state-machine.js       # State management
│   ├── event-bus.js           # Event system
│   ├── context-manager.js     # Context propagation
│   └── index.js               # Main export
│
├── adapters/                  # Platform adapters
│   ├── web/                  # Web adapter
│   │   ├── index.js
│   │   ├── components/       # Web components
│   │   ├── css/             # Styles
│   │   └── index.d.ts       # TypeScript defs
│   ├── cli/                  # CLI adapter
│   ├── chat/                 # Chat platforms
│   ├── mcp/                  # MCP protocol
│   ├── agent/                # Agent comms
│   └── voice/                # Voice AI
│
├── spec/                      # Specification
│   ├── primitives.yaml
│   ├── state-machines.yaml
│   └── events.yaml
│
├── extensions/                # Extension system
│   ├── registry.js
│   ├── base.js
│   └── examples/
│
├── composer/                  # Visual editor
│   ├── editor/               # React app
│   └── preview/              # Live preview
│
├── enterprise/               # Enterprise features
│   ├── theming/
│   ├── branding/
│   └── sdk/
│
├── docs/                     # Documentation
│   ├── SPEC.md
│   ├── G-LANG.md
│   ├── ARCHITECTURE.md
│   ├── QUICK-START.md
│   └── API.md
│
├── package.json
├── tsconfig.json
├── rollup.config.js
├── vite.config.js
└── README.md
```

---

## Performance Considerations

### Bundle Size Targets

| Package | Target Size |
|---------|-------------|
| `@ai-semantics/core` | < 10KB |
| `@ai-semantics/web` | < 15KB |
| `@ai-semantics/cli` | < 8KB |
| `@ai-semantics/mcp` | < 5KB |

### Lazy Loading

```javascript
// Load adapters on demand
const adapters = {
  web: () => import('./adapters/web'),
  cli: () => import('./adapters/cli'),
  mcp: () => import('./adapters/mcp')
};

async function getAdapter(platform) {
  const adapter = await adapters[platform]();
  return adapter.default;
}
```

### Rendering Optimization

- Virtual DOM for web
- Incremental rendering for large documents
- Web Workers for parsing (optional)

---

## Security

### Input Sanitization

```javascript
// core/sanitizer.js
export class Sanitizer {
  constructor() {
    this.allowedTags = new Set([
      'message', 'think', 'stream', 'tool', 'artifact',
      'context', 'approve', 'branch', 'state', 'error', 'input', 'action'
    ]);
    
    this.allowedAttrs = new Set([
      'role', 'status', 'type', 'name', 'args', 'visible', 'id'
    ]);
  }
  
  sanitize(input) {
    // Remove disallowed tags and attributes
    // Prevent XSS attacks
    return sanitized;
  }
}
```

---

## Testing Strategy

### Unit Tests

- Parser tests
- State machine tests
- Validator tests
- Adapter rendering tests

### Integration Tests

- End-to-end G-Lang → render
- Event flow tests
- Extension loading tests

### Platform Tests

- Web: Browser matrix
- CLI: Terminal emulator tests
- MCP: Protocol compliance

---

## Version Compatibility

| Version | Node.js | Browsers |
|---------|---------|----------|
| 1.0.x | ≥18 | ≥Chrome 90, ≥Firefox 88, ≥Safari 14 |
| 2.0.x | ≥20 | ≥Chrome 100, ≥Firefox 100, ≥Safari 15 |

---

## Future Architecture Considerations

### Planned Additions

1. **Streaming Parser** — Parse G-Lang incrementally
2. **WASM Core** — Faster parsing in WebAssembly
3. **GraphQL Schema** — Type-safe G-Lang
4. **IDE Plugin** — G-Lang autocomplete

---

This architecture ensures:
- **Extensibility** — New primitives and platforms easily added
- **Performance** — Minimal bundle, lazy loading
- **Security** — Input sanitization by default
- **Testability** — Clear separation of concerns
