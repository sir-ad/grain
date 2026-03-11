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
  position?: 'replace' | 'append' | 'prepend' | 'before' | 'after';
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
// --grain-primary: #2155ff;
// --grain-secondary: #5c6c87;
```

## Theme Tokens

`@grain.sh/web` ships a default visual system and applies it through CSS custom properties on the render host.

| Token | Purpose |
|-------|---------|
| `--grain-primary` | Primary accent color for actions and emphasis |
| `--grain-secondary` | Secondary accent for subdued surfaces |
| `--grain-background` | Host background token |
| `--grain-surface` | Base card surface |
| `--grain-surface-strong` | Elevated surface for nested panels |
| `--grain-border` | Border color across primitives |
| `--grain-text` | Primary text color |
| `--grain-muted` | Secondary text and labels |
| `--grain-error` | Error and destructive state color |
| `--grain-success` | Success state color |
| `--grain-warning` | Warning state color |
| `--grain-shadow` | Shared component shadow |
| `--grain-radius` | Shared component radius |
| `--grain-font-family` | Base UI font |
| `--grain-font-mono` | Monospace font for structured output |

Example:

```typescript
const adapter = new WebAdapter({
  theme: {
    '--grain-primary': 'var(--brand-accent)',
    '--grain-surface': 'var(--panel-surface)',
    '--grain-text': 'var(--text-strong)'
  }
});
```

## Production Notes

- Prefer pinned package versions instead of `@latest` once the interface is in use.
- Validate model output with `@grain.sh/core` if malformed Grain should fail before it reaches the DOM.
- Keep the Grain document itself as the source of truth and treat theme settings as presentation concerns.
