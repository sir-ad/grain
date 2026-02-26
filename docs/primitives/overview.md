# Primitives Overview

AI Semantics defines **10 atomic primitives**. Every AI interaction composes from these.

---

## The 10 Primitives

| Primitive | Purpose |
|-----------|---------|
| [Stream](/primitives/stream) | Real-time text streaming |
| [Think](/primitives/think) | AI reasoning display |
| [Tool](/primitives/tool) | Function/tool execution |
| [Artifact](/primitives/artifact) | Code, images, documents |
| [Input](/primitives/input) | User input collection |
| [Context](/primitives/context) | Files, URLs, memory |
| [State](/primitives/state) | Global AI status |
| [Error](/primitives/error) | Failure handling |
| [Approve](/primitives/approve) | Human-in-the-loop |
| [Branch](/primitives/branch) | Conversation forks |

---

## Composition

Primitives compose into complex interfaces:

```grain
<message role="assistant">
  <think model="chain-of-thought" visible="false">
    User asks about weather. I should call the weather tool.
  </think>
  <stream>Let me check...</stream>
  <tool name="get_weather" status="running" />
</message>

<tool name="get_weather" status="complete">
  <result temperature="28" condition="sunny" />
</tool>

<message role="assistant">
  <stream>28°C and sunny!</stream>
</message>
```

---

## State Machines

Every primitive has explicit states:

```
STREAM:  IDLE → GENERATING → COMPLETE
                     ↓
                   PAUSED

TOOL:    PENDING → RUNNING → COMPLETE
                     ↓
                   ERROR

APPROVE: PENDING → SHOWING → APPROVED/DENIED
```

---

## Events

Each primitive emits events:

- `stream.start`, `stream.chunk`, `stream.complete`
- `tool.start`, `tool.progress`, `tool.complete`, `tool.error`
- `think.reveal`, `think.hide`
- `approve.request`, `approve.approve`, `approve.deny`

---

## Extending

Add custom primitives:

```javascript
adapter.registerPrimitive('my-chart', {
  render: (props) => `<div class="my-chart">...</div>`
});
```

---

## Next

- [Stream Primitive](/primitives/stream) — Real-time text
- [Tool Primitive](/primitives/tool) — Function calls
- [G-Lang Syntax](/g-lang/syntax) — How to write primitives
