---
title: Web Adapter | Render Grain to Semantic HTML
description: Render Grain documents to semantic HTML with Web Components, theme variables, browser event hooks, and a production-friendly CDN path.
---
# Web Adapter

Renders G-Lang to semantic HTML.

---

## Installation

```bash
npm install @grain.sh/web
```

This package is the browser-facing runtime. Use it when you want to mount Grain documents into an existing DOM tree or ship semantic Web Components directly.

---

## Quick Start

```javascript
import { WebAdapter } from '@grain.sh/web';

const adapter = new WebAdapter();

// Render
adapter.render(`<message role="assistant">
  <stream>Hello!</stream>
</message>`);
```

---

## CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@grain.sh/web@latest/dist/index.global.js"></script>
```

Pin a concrete package version instead of `@latest` in production.

The docs site and README use jsDelivr because it maps directly to the npm package and GitHub source without requiring separate CDN curation.

---

## Options

```javascript
const adapter = new WebAdapter({
  theme: {
    '--grain-primary': '#6366f1',
    '--grain-secondary': '#8b5cf6',
    '--grain-radius': '12px'
  }
});
```

---

## Theme Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--grain-primary` | `#000000` | Primary color |
| `--grain-secondary` | `#666666` | Secondary color |
| `--grain-background` | `#ffffff` | Background |
| `--grain-surface` | `#f5f5f5` | Surface color |
| `--grain-border` | `#e0e0e0` | Border color |
| `--grain-error` | `#dc3545` | Error color |
| `--grain-success` | `#28a745` | Success color |
| `--grain-warning` | `#ffc107` | Warning color |
| `--grain-font-family` | system-ui | Font |
| `--grain-font-mono` | monospace | Monospace font |
| `--grain-radius` | `8px` | Border radius |

---

## Events

```javascript
adapter.on('action', (event) => {
  console.log('Action:', event.action);
});

adapter.on('copy', (event) => {
  console.log('Copied:', event.content);
});

adapter.on('think:toggle', (event) => {
  console.log('Think visibility:', event.visible);
});
```

---

## Render Options

```javascript
// Replace content
adapter.render(grain, { container: '#app' });

// Append
adapter.render(grain, { container: '#app', position: 'append' });

// Prepend
adapter.render(grain, { container: '#app', position: 'prepend' });
```

---

## Output HTML

```grain
<message role="assistant">
  <stream>Hello</stream>
</message>
```

Renders as:

```html
<grain-message role="assistant">
  <grain-stream>Hello</grain-stream>
</grain-message>
```

---

## Full Example

```html
<!DOCTYPE html>
<html>
<head>
</head>
<body>
  <div id="chat"></div>
  
  <script src="https://cdn.jsdelivr.net/npm/@grain.sh/web@latest/dist/index.global.js"></script>
  <script>
    const adapter = new GrainWeb.WebAdapter({
      theme: { '--grain-primary': '#6366f1' }
    });
    
    // Handle actions
    adapter.on('action', (e) => console.log('Action:', e.action));
    
    // Render
    adapter.render(`<message role="assistant">
      <stream>Hello! How can I help?</stream>
    </message>`, {
      container: document.getElementById('chat')
    });
  </script>
</body>
</html>
```

## Production Notes

- Treat the Grain markup contract as versioned application input, not incidental HTML.
- Prefer pinned package versions and local bundling for long-lived apps.
- Use the docs playground or `grain` CLI when you need to validate snippets before shipping them.
