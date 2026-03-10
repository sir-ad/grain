---
title: Web API | WebAdapter, Events, and Theme Surface
description: Reference the @grain.sh/web adapter API, including WebAdapter construction, rendering methods, event hooks, and theme tokens for browser surfaces.
---
# Web API

`@grain.sh/web` turns Grain documents into semantic HTML and Web Components. It is the browser adapter used by the docs playground and the quickest path to a rendered interface.

---

## WebAdapter

```typescript
import { WebAdapter } from '@grain.sh/web';

const adapter = new WebAdapter(config);
```

## What This Package Owns

- DOM rendering for the documented Grain primitives
- custom element registration for browser use
- theme-token driven styling
- browser event hooks for interactive surfaces

---

## Constructor Options

```typescript
interface WebAdapterConfig {
  theme?: Record<string, string>;
  classPrefix?: string;
}
```

---

## Methods

### render()

```typescript
adapter.render(grain: string, options?: RenderOptions): HTMLElement | null
```

```typescript
interface RenderOptions {
  container?: HTMLElement | string;
  position?: 'replace' | 'append' | 'prepend';
  animate?: boolean;
}
```

### on()

```typescript
adapter.on(event: string, callback: (payload: any) => void): () => void
```

---

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `action` | `{ action: string, element: HTMLElement }` | Action button clicked |
| `copy` | `{ content: string }` | Content copied |
| `think:toggle` | `{ visible: boolean }` | Think visibility toggled |

---

## getThemeCSS()

```typescript
const css = adapter.getThemeCSS();
console.log(css);
// --grain-primary: #000000;
// --grain-secondary: #666666;
```

## Production Notes

- Prefer pinned package versions instead of `@latest` once the interface is in use.
- Validate model output with `@grain.sh/core` if malformed Grain should fail before it reaches the DOM.
- Keep the Grain document itself as the source of truth and treat theme settings as presentation concerns.
