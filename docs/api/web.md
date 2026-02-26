# Web API

Web adapter API reference.

---

## WebAdapter

```typescript
import { WebAdapter } from '@ai-semantics/web';

const adapter = new WebAdapter(config);
```

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
// --ai-primary: #000000;
// --ai-secondary: #666666;
```
