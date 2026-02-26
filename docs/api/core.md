# Core API

Core runtime for AI Semantics.

---

## Installation

```bash
npm install @ai-semantics/core
```

---

## GLangParser

Parse G-Lang into AST.

```javascript
import { GLangParser } from '@ai-semantics/core';

const parser = new GLangParser();

const result = parser.parse(`
<message role="assistant">
  <stream>Hello!</stream>
</message>
`);

if (result.errors.length > 0) {
  console.error('Errors:', result.errors);
} else {
  console.log('AST:', result.ast);
}
```

---

## Options

```javascript
const parser = new GLangParser({
  validate: true,   // Validate against spec
  strict: false     // Strict mode
});
```

---

## Validator

Validate AST against specification.

```javascript
import { Validator } from '@ai-semantics/core';

const validator = new Validator();

const result = validator.validate(ast);

if (!result.valid) {
  console.error('Validation errors:', result.errors);
}
```

---

## StateMachine

State transitions for primitives.

```javascript
import { StateMachine, STATE_MACHINES } from '@ai-semantics/core';

// Use pre-built stream state machine
const stream = new StateMachine(STATE_MACHINES.stream);

stream.transition('start');  // IDLE → GENERATING
stream.transition('chunk');  // GENERATING → GENERATING
stream.transition('complete'); // GENERATING → COMPLETE

console.log(stream.getState()); // 'complete'
```

---

## EventBus

Simple event emitter.

```javascript
import { EventBus } from '@ai-semantics/core';

const bus = new EventBus();

// Subscribe
const unsubscribe = bus.on('action', (payload) => {
  console.log('Action:', payload.action);
});

// Emit
bus.emit('action', { action: 'copy' });

// Unsubscribe
unsubscribe();
```

---

## ExtensionRegistry

Register custom primitives.

```javascript
import { ExtensionRegistry } from '@ai-semantics/core';

const registry = new ExtensionRegistry();

registry.register({
  name: 'my-extension',
  version: '1.0.0',
  primitives: {
    'my-chart': {
      type: 'my-chart',
      attributes: {
        data: { type: 'object', required: true }
      },
      states: ['loading', 'ready'],
      events: []
    }
  }
});
```

---

## createParser

Factory function.

```javascript
import { createParser } from '@ai-semantics/core';

const parser = createParser({ validate: true });
```
