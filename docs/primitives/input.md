---
title: Input Primitive | User Responses and Attachments
description: Request user input, attachments, and focused follow-up data from the active interface surface with structured suggestions and explicit input modes.
---
# Input

User input collection.

---

## Purpose

Text fields, file uploads, voice input — collect user input for AI processing.

Use `<input>` when the interface needs to gather structured user responses inside the same Grain document that displays assistant output and approval checkpoints.

---

## G-Lang

```grain
<input type="text" placeholder="Ask me anything..." multiline="true">
  <suggestion>Explain quantum computing</suggestion>
  <suggestion>Write a Python script</suggestion>
</input>
```

---

## Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `type` | `text` \| `file` \| `image` \| `voice` \| `multimodal` | Input type |
| `placeholder` | string | Placeholder text |
| `autofocus` | `true` \| `false` | Auto-focus on mount |
| `maxlength` | number | Character limit |
| `multiline` | `true` \| `false` | Textarea |
| `attachments` | `true` \| `false` | Allow file attachments |
| `voice` | `true` \| `false` | Enable voice input |

---

## Nested

### `<suggestion>` — Quick suggestions

```grain
<suggestion>Explain AI</suggestion>
<suggestion>Write code</suggestion>
```

---

## States

```
EMPTY → TYPING → FILLED → SUBMITTING → SUBMITTED
```

---

## Events

| Event | Description |
|-------|-------------|
| `input.focus` | Input gained focus |
| `input.change` | Value changed |
| `input.submit` | Form submitted |
| `input.voice.start` | Voice recording started |
| `input.suggestion.click` | User clicked suggestion |

## Usage Notes

- Keep the `type` aligned with the actual interaction surface so web, CLI, and other adapters can degrade gracefully.
- Use `<suggestion>` for common follow-ups rather than burying example prompts in surrounding prose.
- Pair `<input>` with `<context>` when the user may attach files, URLs, or prior memory.
