---
title: Quick Start
description: Create a Grain app, parse Grain documents, and ship your first interactive AI interface in minutes.
---
# Quick Start

Build your first AI interface in 5 minutes.

---

## HTML + CDN

The fastest way to start:

```html
<!DOCTYPE html>
<html>
<head>
  <title>AI Chat</title>
</head>
<body>
  <div id="app"></div>
  
  <script src="https://cdn.jsdelivr.net/npm/@grain.sh/web@latest/dist/index.global.js"></script>
  <script>
    const adapter = new GrainWeb.WebAdapter();
    
    // Render a message
    adapter.render(`<message role="assistant">
      <stream>Hello! I'm an AI assistant.</stream>
    </message>`, {
      container: document.getElementById('app')
    });
  </script>
</body>
</html>
```

---

## With npm

```bash
npm install @grain.sh/core @grain.sh/web
```

```javascript
import { WebAdapter } from '@grain.sh/web';

const adapter = new WebAdapter();

// Simple message
adapter.render(`<message role="assistant">
  <stream>Hello!</stream>
</message>`);

// With tool call
adapter.render(`<tool name="search" args='{"q": "weather"}' status="running" />`);
```

---

## CLI Usage

```bash
# Render a G-Lang file
grain --input chat.glang

# Watch mode
grain --input chat.glang --watch
```

---

## Examples

### Chat with Tool Call

```grain
<message role="user">What's the weather in Mumbai?</message>

<tool name="get_weather" args='{"city": "Mumbai"}' status="running">
  <input>City: Mumbai</input>
</tool>

<tool name="get_weather" status="complete">
  <result temperature="28" condition="sunny" humidity="65" />
</tool>

<message role="assistant">
  <stream>The weather in Mumbai is 28°C and sunny.</stream>
</message>
```

### With Approval

```grain
<approve type="tool_call" action="Send email to user@example.com" 
         warning="This will send an external email">
  <option label="Cancel"></option>
  <option label="Send Email"></option>
</approve>
```

### Code Artifact

```grain
<artifact type="code" language="javascript" title="hello.js" 
         copyable="true" downloadable="true">
function hello() {
  console.log('Hello, World!');
}
</artifact>
```

---

## Theme Customization

```javascript
const adapter = new WebAdapter({
  theme: {
    '--grain-primary': '#6366f1',
    '--grain-secondary': '#8b5cf6',
    '--grain-radius': '12px'
  }
});
```

CSS variables available:

- `--grain-primary`
- `--grain-secondary`
- `--grain-background`
- `--grain-surface`
- `--grain-border`
- `--grain-error`
- `--grain-success`
- `--grain-warning`
- `--grain-font-family`
- `--grain-font-mono`
- `--grain-radius`

---

## Next

- [Primitives](/primitives/overview) — Core primitives and companion elements
- [G-Lang Syntax](/g-lang/syntax) — Full syntax reference
- [API Reference](/api/core) — Programmatic usage
