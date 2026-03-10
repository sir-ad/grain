---
title: Approve Primitive | Human Approval Checkpoints
description: Capture human approval checkpoints for sensitive actions, gated tools, and policy-controlled workflows with explicit user-facing decisions.
---
# Approve

Human-in-the-loop confirmation.

---

## Purpose

Require user approval for sensitive actions — tool execution, content generation, deletions.

Use `<approve>` whenever a model or workflow is about to cross a policy boundary that should remain explicitly human-controlled.

---

## Try it Live

<Playground />

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

## Nested Elements

### `<option>` — Approval options

```grain
<option label="Cancel"></option>
<option label="Confirm"></option>
<option label="Confirm" primary></option>
```

---

## States

```
PENDING → SHOWING → APPROVED
   ↓        ↓         ↓
EXPIRED  DENIED   EXECUTING → COMPLETE
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

---

## Examples

### Tool call approval

```grain
<tool name="send_email" status="pending" mode="manual">
  <input>To: user@example.com</input>
</tool>

<approve type="tool_call" action="Send email to user@example.com"
  warning="This will send an email to an external address">
  <option label="Cancel"></option>
  <option label="Send Email"></option>
</approve>
```

### Delete confirmation

```grain
<approve type="delete" action="Delete file: config.yaml"
  warning="This action cannot be undone">
  <option label="Keep File"></option>
  <option label="Delete Forever"></option>
</approve>
```

### Consent request

```grain
<approve type="consent" action="Share data with third party"
  warning="Your data will be shared with our analytics partner">
  <option label="Decline"></option>
  <option label="Agree"></option>
</approve>
```

### With timeout

```grain
<approve type="action" action="Apply changes" timeout="30000">
  <option label="Cancel"></option>
  <option label="Apply"></option>
</approve>
```

---

## Related

- [Tool](/primitives/tool) — Tool execution
- [Error](/primitives/error) — Error handling
- [Playground](/playground) — Try it live

## Operational Guidance

- Put the risky action in `action` and the user-facing caution in `warning`.
- Use `<option>` labels that match the real decision, not vague placeholders.
- Keep approval checkpoints explicit even if the surrounding tool run is otherwise automated.
