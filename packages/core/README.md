# `@grain.sh/core`

Core runtime for Grain, the XML-like interaction language for AI interfaces.

## Install

```bash
npm install @grain.sh/core
```

## Usage

```ts
import { GLangParser } from '@grain.sh/core';

const parser = new GLangParser();
const result = parser.parse(`
  <message role="assistant">
    <stream>Hello from Grain.</stream>
  </message>
`);

if (result.errors.length === 0) {
  console.log(result.ast);
}
```

## Exports

- `GLangParser`
- `Validator`
- `StateMachine`
- `EventBus`
- `ExtensionRegistry`

Docs: https://sir-ad.github.io/grain/
