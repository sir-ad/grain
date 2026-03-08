---
title: Think
description: AI reasoning display.
---
# Think

AI reasoning display.

---

## Purpose

Show the AI's "thinking" — chain-of-thought, reasoning, internal notes. Can be hidden or visible.

---

## Try it Live

<Playground defaultCode='
&lt;message role="assistant"&gt;
  &lt;think model="chain-of-thought" visible="true"&gt;
    Let me analyze this step by step:
    1. First, I need to understand the context
    2. Then, identify the key variables
    3. Finally, apply the relevant formula
  &lt;/think&gt;
  
  &lt;stream speed="normal"&gt;
    Based on my analysis, here is the answer...
  &lt;/stream&gt;
&lt;/message&gt;
' />

---

## G-Lang

```grain
<think model="chain-of-thought" visible="false" depth="medium">
  The user is asking about weather. I should call the weather API.
ResultsController
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
ResultsController
```

### Visible (for educational/debugging)

```grain
<think visible="true">
  Let me solve this step by step:
  1. First, identify the variables...
  2. Then, apply the formula...
ResultsController
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
ResultsController
```

---

## Related

- [Stream](/primitives/stream) — Output text
- [Tool](/primitives/tool) — Tool execution
- [Playground](/playground) — Try it live
