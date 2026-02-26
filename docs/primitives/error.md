# Error

Error display with recovery.

---

## Purpose

Show failures — API errors, rate limits, invalid input — with recovery options.

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
