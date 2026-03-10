---
title: Core API | Parser, Validator, and State Machines
description: Reference the parser, validator, state machine, and helper utilities exposed by @grain.sh/core for production Grain documents.
---
# Core API

`@grain.sh/core` is the contract-enforcing runtime for Grain. It owns parsing, validation, state transitions, and extension registration without requiring a UI adapter.

---

## Installation

```bash
npm install @grain.sh/core
```

Use this package when you need to validate Grain documents in services, CLIs, tests, or middleware without pulling in browser-specific rendering code.

---

## GLangParser

Parse G-Lang into AST.

```javascript
import { GLangParser } from '@grain.sh/core';

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

## Contract Notes

- The parser accepts XML-like Grain syntax with both single- and double-quoted attributes.
- Companion elements such as `<result>`, `<progress>`, and `<warning>` are part of the documented language contract.
- Completed malformed input should fail explicitly rather than silently producing an inconsistent tree.

---

## Validator

Validate AST against specification.

```javascript
import { Validator } from '@grain.sh/core';

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
import { StateMachine, STATE_MACHINES } from '@grain.sh/core';

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
import { EventBus } from '@grain.sh/core';

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
import { ExtensionRegistry } from '@grain.sh/core';

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
import { createParser } from '@grain.sh/core';

const parser = createParser({ validate: true });
```

## Typical Use Cases

- validate examples copied from docs or model output before rendering
- normalize Grain documents before storing them in logs or workflow state
- build adapter-specific integrations without reimplementing the language contract
