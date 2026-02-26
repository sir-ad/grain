# Context

Files, URLs, memory.

---

## Purpose

Provide AI with context — file attachments, URL references, conversation history chips.

---

## G-Lang

```grain
<context type="file" id="doc-123" name="spec.pdf" size="1024000" />
<context type="url" id="url-456" name="Wikipedia" preview="Free encyclopedia..." />
<context type="memory_chip" id="mem-789">User is building an AI library</context>
```

---

## Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `type` | `file` \| `url` \| `memory` \| `memory_chip` \| `conversation` | Context type |
| `id` | string | Unique identifier |
| `name` | string | Display name |
| `preview` | string | Preview text/thumbnail |
| `size` | number | File size (bytes) |
| `mimeType` | string | MIME type |
| `removable` | `true` \| `false` | Allow removal |

---

## States

```
ATTACHED → LOADING → READY
    ↓         ↓
  REMOVING   ERROR
```

---

## Events

| Event | Description |
|-------|-------------|
| `context.attach` | Context added |
| `context.load` | Loading started |
| `context.ready` | Ready for AI |
| `context.remove` | User removed |
