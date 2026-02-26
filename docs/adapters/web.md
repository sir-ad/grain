# Web Adapter

Renders G-Lang to semantic HTML.

---

## Installation

```bash
npm install @ai-semantics/web
```

---

## Quick Start

```javascript
import { AISemantics } from '@ai-semantics/web';
import '@ai-semantics/web/dist/ai-semantics-web.css';

const adapter = new AISemantics.WebAdapter();

// Render
adapter.render(`<message role="assistant">
  <stream>Hello!</stream>
</message>`);
```

---

## CDN

```html
<script src="https://cdn.ai-semantics.dev/v1/ai-semantics-web.js"></script>
<link rel="stylesheet" href="https://cdn.ai-semantics.dev/v1/ai-semantics-web.css">
```

---

## Options

```javascript
const adapter = new AISemantics.WebAdapter({
  theme: {
    '--ai-primary': '#6366f1',
    '--ai-secondary': '#8b5cf6',
    '--ai-radius': '12px'
  }
});
```

---

## Theme Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--ai-primary` | `#000000` | Primary color |
| `--ai-secondary` | `#666666` | Secondary color |
| `--ai-background` | `#ffffff` | Background |
| `--ai-surface` | `#f5f5f5` | Surface color |
| `--ai-border` | `#e0e0e0` | Border color |
| `--ai-error` | `#dc3545` | Error color |
| `--ai-success` | `#28a745` | Success color |
| `--ai-warning` | `#ffc107` | Warning color |
| `--ai-font-family` | system-ui | Font |
| `--ai-font-mono` | monospace | Monospace font |
| `--ai-radius` | `8px` | Border radius |

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
<ai-message role="assistant">
  <ai-stream>Hello</ai-stream>
</ai-message>
```

---

## Full Example

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://cdn.ai-semantics.dev/v1/ai-semantics-web.css">
</head>
<body>
  <div id="chat"></div>
  
  <script src="https://cdn.ai-semantics.dev/v1/ai-semantics-web.js"></script>
  <script>
    const adapter = new AISemantics.WebAdapter({
      theme: { '--ai-primary': '#6366f1' }
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
