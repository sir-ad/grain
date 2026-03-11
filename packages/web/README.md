# `@grain.sh/web`

Web adapter for rendering Grain documents into DOM nodes and custom elements.

## Install

```bash
npm install @grain.sh/web
```

CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@grain.sh/web@latest/dist/index.global.js"></script>
```

## Usage

```ts
import { createWebAdapter } from '@grain.sh/web';

const adapter = createWebAdapter();
adapter.registerCustomElements();

adapter.render(
  `<message role="assistant"><stream>Hello from Grain.</stream></message>`,
  { container: '#app' }
);
```

## Theme Tokens

The adapter injects a default stylesheet once per document and themes the render host through CSS custom properties. Override the host tokens to match your app:

```ts
const adapter = createWebAdapter({
  theme: {
    '--grain-primary': '#2155ff',
    '--grain-surface': '#10161f',
    '--grain-text': '#eef4ff',
    '--grain-muted': '#9db0cb'
  }
});
```

Useful tokens:

- `--grain-primary`
- `--grain-surface`
- `--grain-surface-strong`
- `--grain-border`
- `--grain-text`
- `--grain-muted`
- `--grain-success`
- `--grain-warning`
- `--grain-error`

Docs: https://sir-ad.github.io/grain/
