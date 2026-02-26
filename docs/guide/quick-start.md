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
  <link rel="stylesheet" href="https://cdn.ai-semantics.dev/v1/ai-semantics-web.css">
</head>
<body>
  <div id="app"></div>
  
  <script src="https://cdn.ai-semantics.dev/v1/ai-semantics-web.js"></script>
  <script>
    const adapter = new AISemantics.WebAdapter();
    
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
npm install @ai-semantics/core @ai-semantics/web
```

```javascript
import { AISemantics } from '@ai-semantics/web';
import '@ai-semantics/web/dist/ai-semantics-web.css';

const adapter = new AISemantics.WebAdapter();

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
ai-sem render --input chat.glang

# Watch mode
ai-sem render --input chat.glang --watch
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
const adapter = new AISemantics.WebAdapter({
  theme: {
    '--ai-primary': '#6366f1',
    '--ai-secondary': '#8b5cf6',
    '--ai-radius': '12px'
  }
});
```

CSS variables available:

- `--ai-primary`
- `--ai-secondary`
- `--ai-background`
- `--ai-surface`
- `--ai-border`
- `--ai-error`
- `--ai-success`
- `--ai-warning`
- `--ai-font-family`
- `--ai-font-mono`
- `--ai-radius`

---

## Next

- [Primitives](/primitives/overview) — All 10 primitives
- [G-Lang Syntax](/g-lang/syntax) — Full syntax reference
- [API Reference](/api/core) — Programmatic usage
