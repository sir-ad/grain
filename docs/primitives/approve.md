# Approve

Human-in-the-loop confirmation.

---

## Purpose

Require user approval for sensitive actions — tool execution, content generation, deletions.

---

## G-Lang

```grain
<approve type="tool_call" action="Send email to user@example.com" 
         warning="This will send an external email">
  <option label="Cancel"></option>
  <option label="Send Email"></option>
</approve>
```

---

## Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `type` | `tool_call` \| `action` \| `delete` \| `consent` | Approval type |
| `action` | string | What needs approval |
| `warning` | string | Warning message |
| `timeout` | number | Auto-expire (ms) |
| `auto` | `true` \| `false` | Auto-approve |

---

## Nested

### `<option>` — Approval options

```grain
<option label="Cancel"></option>
<option label="Confirm"></option>
```

---

## States

```
PENDING → SHOWING → APPROVED
    ↓         ↓        ↓
  EXPIRED   DENIED   EXECUTING → COMPLETE
```

---

## Events

| Event | Description |
|-------|-------------|
| `approve.request` | Approval requested |
| `approve.show` | User saw request |
| `approve.approve` | User approved |
| `approve.deny` | User denied |
| `approve.expire` | Request timed out |
