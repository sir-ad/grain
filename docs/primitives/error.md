---
title: Error Primitive | Failures and Recovery Actions
description: Surface structured failures, user-facing recovery guidance, and retryable states inside Grain flows with explicit machine-readable error codes.
---
# Error

Error display with recovery.

---

## Purpose

Show failures — API errors, rate limits, invalid input — with recovery options.

Use `<error>` when the interface needs a durable, explicit failure node instead of burying the issue inside conversational text.

---

## G-Lang

```grain
<error code="RATE_LIMIT" message="Too many requests. Please wait 30 seconds." recoverable="true">
  <action name="retry" label="Retry" />
  <action name="cancel" label="Cancel" />
</error>
```

---

## Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `code` | string | Error code |
| `message` | string | Human-readable message |
| `recoverable` | `true` \| `false` | Can be retried |

---

## Nested

### `<action>` — Recovery actions

```grain
<action name="retry" label="Retry Now" />
<action name="cancel" label="Cancel" />
```

---

## States

```
VISIBLE → ACKNOWLEDGED
    ↓           ↓
  DISMISSED   RECOVERING → RECOVERED
```

---

## Events

| Event | Description |
|-------|-------------|
| `error.occur` | Error occurred |
| `error.retry` | User retried |
| `error.dismiss` | User dismissed |

## Usage Notes

- Keep `code` machine-friendly and `message` user-facing.
- Use nested `<action>` elements when the recovery path is explicit.
- Pair `<error>` with `<approve>` when a recovery step could trigger a sensitive or irreversible operation.
