---
title: State Primitive | Global Status and Progress
description: Model global assistant state, progress, ETA, and runtime phase changes across long interactions without overloading user-facing text.
---
# State

Global AI status indicator.

---

## Purpose

Show overall AI state — loading, thinking, idle, error. Typing indicators, progress bars, connection status.

Use `<state>` when the whole interaction surface needs a top-level status signal rather than a primitive-specific event such as tool progress or stream generation.

---

## G-Lang

```grain
<state status="thinking" message="Analyzing..." />
<state status="streaming" progress="65" eta="30" />
<state status="error" message="Connection lost" />
```

---

## Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `status` | `idle` \| `loading` \| `thinking` \| `streaming` \| `error` \| `offline` | Current status |
| `message` | string | Status message |
| `progress` | number | 0-100 progress |
| `eta` | number | Estimated seconds |
| `animated` | `true` \| `false` | Show animation |

---

## States

```
IDLE ←──────────────────┐
  ↓                     │
LOADING → THINKING → STREAMING
    ↓         ↓          ↓
   ERROR    ERROR      COMPLETE → IDLE
```

## Usage Notes

- Keep `status` coarse and user-readable. Primitive-level detail should stay inside `<tool>`, `<stream>`, or `<error>`.
- Use `progress` and `eta` only when the numbers are meaningful enough to reduce uncertainty.
- Prefer a single top-level `<state>` over multiple conflicting status indicators on the same screen.
