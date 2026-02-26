# Examples

Real-world examples of AI Semantics in action.

---

## Basic Chat

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
    const adapter = new AISemantics.WebAdapter();
    
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
const adapter = new AISemantics.WebAdapter({
  theme: {
    '--ai-primary': '#6366f1',
    '--ai-secondary': '#8b5cf6',
    '--ai-background': '#0f0f0f',
    '--ai-surface': '#1a1a1a',
    '--ai-radius': '12px'
  }
});
```
