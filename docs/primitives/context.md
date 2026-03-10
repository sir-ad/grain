---
title: Context Primitive | Files, URLs, and Memory Chips
description: Pass files, URLs, snippets, and prior memory into a Grain interaction as structured context that remains visible and machine-readable.
---
# Context

Files, URLs, memory.

---

## Purpose

Provide AI with context — file attachments, URL references, conversation history chips.

`<context>` keeps supporting material visible and machine-readable instead of forcing attachments and memory into plain text descriptions.

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

## Usage Notes

- Use `type` to distinguish durable files from softer references such as URLs or memory chips.
- Keep `id` stable when the same context object may be revisited across updates.
- Pair `<context>` with `<artifact>` when the referenced object becomes something the user should inspect directly.
