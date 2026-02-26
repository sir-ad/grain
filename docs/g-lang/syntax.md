# G-Lang Syntax

The declarative syntax for AI interactions.

---

## Overview

G-Lang is an XML-based language designed for:
1. **AI models** can output valid G-Lang
2. **Developers** can read and write it
3. **Platforms** can parse and render it

---

## Quick Examples

### Message
```grain
<message role="assistant">
  <stream>Hello!</stream>
</message>
```

### Tool Call
```grain
<tool name="search" args='{"q": "weather"}' status="running" />
```

### With Approval
```grain
<approve type="tool_call" action="Send email">
  <option label="Cancel"></option>
  <option label="Send"></option>
</approve>
```

---

## Elements

| Element | Purpose |
|---------|---------|
| `<message>` | Conversation message |
| `<stream>` | Streaming text |
| `<think>` | AI reasoning |
| `<tool>` | Function call |
| `<artifact>` | Code, images, docs |
| `<input>` | User input |
| `<context>` | Files, URLs, memory |
| `<state>` | Status indicator |
| `<error>` | Error display |
| `<approve>` | Human approval |
| `<branch>` | Conversation fork |

---

## Attributes

All elements support attributes:

```grain
<stream speed="fast" cursor="true" markdown="true">
  Text content
</stream>
```

---

## Nested Elements

Elements can nest:

```grain
<message role="assistant">
  <think visible="false">Reasoning...</think>
  <stream>Response text</stream>
  <tool name="search" status="running" />
</message>
```

---

## Self-Closing

Some elements self-close:

```grain
<context type="file" id="123" name="doc.pdf" />
<action name="copy" label="Copy" />
```

---

## Full Example

```grain
<message role="user">What's the weather?</message>

<state status="thinking" message="Checking..." />

<message role="assistant">
  <tool name="get_weather" args='{"city": "Mumbai"}' status="complete">
    <result temperature="28" condition="sunny" />
  </tool>
  <stream>28°C and sunny in Mumbai!</stream>
</message>
```

---

## Next

- [Grammar](/g-lang/grammar) — Complete EBNF grammar
- [Examples](/g-lang/examples) — More examples
