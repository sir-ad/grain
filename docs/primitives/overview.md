---
title: Grain Primitives Overview
description: Grain defines 10 core primitives plus companion elements for results, warnings, progress, approvals, and structured interaction state.
---
# Primitives Overview

Grain defines **10 core primitives**. Companion elements like `<result>`, `<progress>`, `<warning>`, `<action>`, and `<option>` round out the language contract.

---

## The 10 Core Primitives

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

This is the core Grain idea: a model or agent can move between reasoning, streaming, tool execution, and final response without leaving the same document contract.

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

## Companion Elements

Core primitives often carry smaller semantic companions:

- `<result>` for structured tool output
- `<progress>` for long-running work
- `<warning>` for user-facing cautions
- `<option>` for approval choices
- `<suggestion>` for input affordances

---

## Extending

Add custom primitives:

```javascript
adapter.registerPrimitive('my-chart', {
  render: (props) => `<div class="my-chart">...</div>`
});
```

When extending Grain, keep the public contract narrow. The documented primitives should stay stable while custom behavior lives behind explicit extensions.

---

## Next

- [Stream Primitive](/primitives/stream) — Real-time text
- [Tool Primitive](/primitives/tool) — Function calls
- [G-Lang Syntax](/g-lang/syntax) — How to write primitives
