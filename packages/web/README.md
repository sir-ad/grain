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

Docs: https://sir-ad.github.io/grain/
