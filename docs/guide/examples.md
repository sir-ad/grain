---
title: Examples
description: End-to-end Grain examples for chat, tool execution, artifacts, approvals, and multi-step agent flows.
---
# Examples

Real-world examples of Grain in action.

---

## Basic Chat

```html
<!DOCTYPE html>
<html>
<head>
</head>
<body>
  <div id="chat"></div>
  <script src="https://cdn.jsdelivr.net/npm/@grain.sh/web@latest/dist/index.global.js"></script>
  <script>
    const adapter = new GrainWeb.WebAdapter();
    
    adapter.render(`<message role="assistant">
      <stream>Hello! How can I help?</stream>
    </message>`, {
      container: document.getElementById('chat')
    });
  </script>
</body>
</html>
```

---

## With Tool Call

```javascript
adapter.render(`<tool name="search" args='{"q": "weather"}' status="running" />`);

setTimeout(() => {
  adapter.render(`<tool name="search" status="complete">
    <result temperature="28" condition="sunny" />
  </tool>`, { container: '#tool-result' });
}, 1500);
```

---

## Interactive Chat

```javascript
const chat = document.getElementById('chat');

function addMessage(role, content) {
  adapter.render(`<message role="${role}">
    <stream>${content}</stream>
  </message>`, {
    container: chat,
    position: 'append'
  });
}

adapter.on('action', (e) => {
  if (e.action === 'regenerate') {
    // Handle regenerate
  }
});
```

---

## Custom Theme

```javascript
const adapter = new WebAdapter({
  theme: {
    '--grain-primary': '#6366f1',
    '--grain-secondary': '#8b5cf6',
    '--grain-background': '#0f0f0f',
    '--grain-surface': '#1a1a1a',
    '--grain-radius': '12px'
  }
});
```
