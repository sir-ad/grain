# Input

User input collection.

---

## Purpose

Text fields, file uploads, voice input — collect user input for AI processing.

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
