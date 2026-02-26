# State

Global AI status indicator.

---

## Purpose

Show overall AI state — loading, thinking, idle, error. Typing indicators, progress bars, connection status.

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
