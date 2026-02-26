# Quick Start

> Get up and running with AI Semantics in 5 minutes.

---

## Installation

### Web (HTML)

```html
<!DOCTYPE html>
<html>
<head>
  <title>AI Semantics Demo</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@ai-semantics/web@1.0.0/dist/ai-semantics-web.css">
</head>
<body>
  <div id="app"></div>
  
  <script src="https://cdn.jsdelivr.net/npm/@ai-semantics/web@1.0.0/dist/ai-semantics-web.js"></script>
  <script>
    const adapter = new AISemantics.WebAdapter();
    
    // Render a simple message
    adapter.render(`<message role="assistant">
      <stream>Hello! I'm an AI assistant.</stream>
    </message>`, {
      container: document.getElementById('app')
    });
  </script>
</body>
</html>
```

### Web (npm)

```bash
npm install @ai-semantics/core @ai-semantics/web
```

```javascript
import { AISemantics } from '@ai-semantics/web';
import '@ai-semantics/web/dist/ai-semantics-web.css';

const adapter = new AISemantics.WebAdapter();

// Simple message
adapter.render(`<message role="assistant">
  <stream>Hello! How can I help?</stream>
</message>`);
```

### CLI

```bash
npm install -g @ai-semantics/cli

# Render G-Lang in terminal
ai-sem render --input chat.glang
```

### React

```bash
npm install @ai-semantics/react
```

```jsx
import { AISemanticsProvider, Message, Stream, Tool } from '@ai-semantics/react';

function App() {
  return (
    <AISemanticsProvider>
      <Message role="assistant">
        <Stream speed="normal">Hello!</Stream>
      </Message>
    </AISemanticsProvider>
  );
}
```

---

## Basic Usage

### 1. Simple Chat Message

```grain
<message role="assistant">
  <stream>Hello! How can I help you today?</stream>
</message>
```

**Web Output:**

```html
<ai-message role="assistant">
  <ai-stream speed="normal" cursor="true">Hello! How can I help you today?</ai-stream>
</ai-message>
```

---

### 2. With Thinking

```grain
<message role="assistant">
  <think model="chain-of-thought" visible="false">
    The user is asking a general question. I'll provide a helpful response.
  </think>
  <stream>Hello! How can I help you today?</stream>
</message>
```

---

### 3. Tool Call

```grain
<message role="assistant">
Let me check the weather for you.  <stream></stream>
</message>

<tool name="get_weather" args='{"city": "Mumbai"}' status="running">
  <input>City: Mumbai</input>
</tool>

<tool name="get_weather" status="complete">
  <result temperature="28" condition="sunny" humidity="65" />
</tool>

<message role="assistant">
  <stream>The weather in Mumbai is 28°C and sunny!</stream>
</message>
```

---

### 4. With Approval

```grain
<tool name="send_email" args='{"to": "user@example.com"}' status="pending" mode="manual">
  <input>To: user@example.com</input>
  <input>Subject: Hello</input>
</tool>

<approve type="tool_call" action="Send email to user@example.com" 
         warning="This will send an email to an external address">
  <option label="Cancel"></option>
  <option label="Send Email"></option>
</approve>
```

---

### 5. Code Artifact

```grain
<message role="assistant">
  <stream>Here's a JavaScript function to sort an array:</stream>
  <artifact type="code" language="javascript" title="sort.js" 
           copyable="true" downloadable="true">
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[arr.length - 1];
  const left = arr.filter((el, i) => el < pivot && i < arr.length - 1);
  const right = arr.filter((el, i) => el >= pivot && i < arr.length - 1);
  
  return [...quickSort(left), pivot, ...quickSort(right)];
}
  </artifact>
</message>
```

---

### 6. With Context

```grain
<message role="user">
  Summarize this document.
</message>

<context type="file" id="doc-123" name="annual-report-2024.pdf" 
         size="2048000" mimeType="application/pdf" />

<message role="assistant">
  <think model="chain-of-thought" visible="false">
    The user wants me to summarize a PDF document. I need to extract the text first.
  </think>
  <tool name="extract_text" args='{"file_id": "doc-123"}' status="running" />
  <tool name="extract_text" status="complete">
    <result text="Extracted 45 pages..." />
  </tool>
  <stream>Based on the annual report, the company saw a 23% increase in revenue...</stream>
</message>
```

---

## Interactive Example

### Complete Chat Interface

```html
<!DOCTYPE html>
<html>
<head>
  <title>AI Chat</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@ai-semantics/web@1.0.0/dist/ai-semantics-web.css">
  <style>
    #chat {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .user-message {
      text-align: right;
    }
    .user-message ai-message {
      --ai-background: #007bff;
      --ai-text: #ffffff;
    }
  </style>
</head>
<body>
  <div id="chat"></div>
  
  <script src="https://cdn.jsdelivr.net/npm/@ai-semantics/web@1.0.0/dist/ai-semantics-web.js"></script>
  <script>
    const adapter = new AISemantics.WebAdapter({
      theme: {
        '--ai-primary': '#007bff',
        '--ai-radius': '8px'
      }
    });
    
    const chat = document.getElementById('chat');
    
    // Handle actions
    adapter.on('action', (event) => {
      console.log('Action clicked:', event.name);
    });
    
    // Add user message
    function addUserMessage(text) {
      adapter.render(`<message role="user">${text}</message>`, {
        container: chat,
        position: 'append'
      });
    }
    
    // Simulate AI response
    function addAssistantMessage(grain) {
      adapter.render(grain, {
        container: chat,
        position: 'append'
      });
    }
    
    // Demo
    addUserMessage('What is the weather in Mumbai?');
    
    setTimeout(() => {
      addAssistantMessage(`<message role="assistant">
        <tool name="get_weather" args='{"city": "Mumbai"}' status="running">
          <input>City: Mumbai</input>
        </tool>
      </message>`);
    }, 500);
    
    setTimeout(() => {
      addAssistantMessage(`<message role="assistant">
        <tool name="get_weather" status="complete">
          <result temperature="28" condition="sunny" humidity="65" />
        </tool>
        <stream>The weather in Mumbai is 28°C and sunny. Perfect day!</stream>
        <actions>
          <action name="copy" label="Copy" />
          <action name="regenerate" label="Regenerate" />
        </actions>
      </message>`);
    }, 1500);
  </script>
</body>
</html>
```

---

## CLI Usage

### Installation

```bash
npm install -g @ai-semantics/cli
```

### Render G-Lang File

```bash
# Render to terminal
ai-sem render --input example.glang

# Watch mode
ai-sem render --input example.glang --watch

# Output to file
ai-sem render --input example.glang --output output.txt
```

### Example G-Lang File

```grain
<!-- example.glang -->
<message role="assistant">
  <think model="chain-of-thought" visible="true">
    Processing user request about weather in Mumbai.
  </think>
  <stream>The weather in Mumbai is 28°C and sunny.</stream>
</message>
```

### CLI Output

```
┌─ AI ─────────────────────────────────────────┐
│ ○ Thinking...                                 │
│   Processing user request...                 │
├──────────────────────────────────────────────┤
│ The weather in Mumbai is 28°C and sunny.     │
├──────────────────────────────────────────────┤
│ [Copy] [Regenerate]                          │
└──────────────────────────────────────────────┘
```

---

## React Usage

### Setup

```bash
npm install @ai-semantics/react
```

### Components

```jsx
import { 
  AISemanticsProvider,
  Message,
  Stream,
  Think,
  Tool,
  Artifact,
  Input,
  Actions
} from '@ai-semantics/react';

function Chat() {
  const [messages, setMessages] = useState([]);
  
  const handleSend = (text) => {
    // Add user message
    setMessages([...messages, { role: 'user', content: text }]);
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        streaming: true,
        content: 'Let me check that for you...'
      }]);
    }, 500);
  };
  
  return (
    <AISemanticsProvider>
      <div className="chat">
        {messages.map((msg, i) => (
          <Message key={i} role={msg.role}>
            <Stream speed="normal">{msg.content}</Stream>
          </Message>
        ))}
        
        <Input 
          type="text" 
          placeholder="Ask me anything..."
          onSubmit={handleSend}
        />
      </div>
    </AISemanticsProvider>
  );
}
```

---

## Configuration

### Theme Customization

```javascript
const adapter = new AISemantics.WebAdapter({
  theme: {
    '--ai-primary': '#6366f1',
    '--ai-secondary': '#8b5cf6',
    '--ai-background': '#ffffff',
    '--ai-surface': '#f8fafc',
    '--ai-border': '#e2e8f0',
    '--ai-radius': '8px',
    '--ai-font-family': 'Inter, sans-serif',
    '--ai-font-mono': 'Fira Code, monospace'
  }
});
```

### Custom Components

```javascript
// Register custom primitive
adapter.registerPrimitive('my-chart', {
  render: (props) => {
    return `<div class="my-chart" data-data='${JSON.stringify(props.data)}'></div>`;
  }
});
```

---

## Next Steps

- Read the [Specification](SPEC.md)
- Learn [G-Lang Syntax](G-LANG.md)
- Explore [Architecture](ARCHITECTURE.md)
- Check out [Examples](examples/)

---

## Getting Help

- Discord: https://discord.gg/ai-semantics
- GitHub Issues: https://github.com/sir-ad/ai-semantics/issues
- Twitter: @ai_semantics
