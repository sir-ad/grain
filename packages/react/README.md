# `@grain.sh/react`

React bindings for rendering Grain documents with the web adapter.

## Install

```bash
npm install @grain.sh/react @grain.sh/web react react-dom
```

## Usage

```tsx
import { GrainStream } from '@grain.sh/react';

export function App() {
  return (
    <GrainStream content={`<message role="assistant"><stream>Hello from Grain.</stream></message>`} />
  );
}
```

## Exports

- `useGrain`
- `GrainStream`

Docs: https://sir-ad.github.io/grain/
