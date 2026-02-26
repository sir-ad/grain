# Think

AI reasoning display.

---

## Purpose

Show the AI's "thinking" — chain-of-thought, reasoning, internal notes. Can be hidden or visible.

---

## G-Lang

```grain
<think model="chain-of-thought" visible="false" depth="medium">
  The user is asking about weather. I should call the weather API.
</think>
```

---

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `model` | string | `chain-of-thought` | Reasoning model |
| `visible` | `true` \| `false` | `false` | Default visibility |
| `depth` | `shallow` \| `medium` \| `deep` | `medium` | Reasoning detail |

---

## States

```
HIDDEN ↔ VISIBLE
   ↕
EXPANDING/COLLAPSING
```

---

## Events

| Event | Description |
|-------|-------------|
| `think.reveal` | User revealed thinking |
| `think.hide` | User hid thinking |

---

## Examples

### Hidden by default

```grain
<think visible="false">
  User intent: weather query, location: Mumbai
</think>
```

### Visible

```grain
<think visible="true">
  Let me solve this step by step:
  1. First, identify the variables...
  2. Then, apply the formula...
</think>
```
