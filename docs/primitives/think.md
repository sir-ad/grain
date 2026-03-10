---
title: Think Primitive | Reasoning and Internal Notes
description: Model hidden or visible reasoning traces while preserving a clean public interaction surface and explicit reveal behavior.
---
# Think

AI reasoning display.

---

## Purpose

Show the AI's "thinking" — chain-of-thought, reasoning, internal notes. Can be hidden or visible.

Use `<think>` when the application needs an explicit reasoning container that can be hidden, revealed, or audited separately from the user-facing response stream.

---

## Try it Live

<Playground />

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

### Visible (for educational/debugging)

```grain
<think visible="true">
  Let me solve this step by step:
  1. First, identify the variables...
  2. Then, apply the formula...
</think>
```

### Tree-of-thought

```grain
<think model="tree-of-thought" visible="true" depth="deep">
  Considering multiple approaches:
  
  Branch A: Recursive solution
    - Pros: Elegant, easy to understand
    - Cons: Stack overflow risk
  
  Branch B: Iterative solution
    - Pros: Memory efficient
    - Cons: More verbose
  
  Decision: Branch B for production use.
</think>
```

---

## Related

- [Stream](/primitives/stream) — Output text
- [Tool](/primitives/tool) — Tool execution
- [Playground](/playground) — Try it live

## Contract Notes

- Treat `<think>` as intentional structure, not a dumping ground for arbitrary hidden text.
- Keep visibility explicit so adapters do not guess whether reasoning should be shown.
- If the reasoning content is not meant to be surfaced at all, omit it rather than depending on renderer quirks.
