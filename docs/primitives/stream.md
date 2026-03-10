---
title: Stream Primitive | Incremental Assistant Output
description: Stream partial assistant output, status updates, and incremental responses with user-visible pacing and explicit lifecycle events.
---
# Stream

Real-time text streaming.

---

## Purpose

Display AI output as it generates — character by character or chunk by chunk.

Use `<stream>` when you want users to understand that the response is still in progress rather than reading a completed block that appears all at once.

---

## Try it Live

<Playground />

---

## G-Lang

```grain
<stream speed="normal" cursor="true" markdown="false">
  Hello! This text streams in real-time.
</stream>
```

---

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `speed` | `fast` \| `normal` \| `slow` | `normal` | Streaming speed |
| `cursor` | `true` \| `false` | `true` | Show blinking cursor |
| `markdown` | `true` \| `false` | `false` | Parse markdown |

---

## States

```
IDLE → GENERATING → COMPLETE
  ↓
PAUSED
  ↓
RESUMING
  ↓
ERROR
```

---

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `stream.start` | `{ content: string }` | Stream began |
| `stream.chunk` | `{ chunk: string, index: number }` | New chunk |
| `stream.complete` | `{ fullContent: string }` | Stream finished |
| `stream.pause` | `{ index: number }` | Stream paused |
| `stream.error` | `{ error: string }` | Stream failed |

---

## Examples

### Basic

```grain
<stream>Hello world</stream>
```

### With cursor

```grain
<stream cursor="true">Typing...</stream>
```

### Fast streaming

```grain
<stream speed="fast">This appears instantly.</stream>
```

### Markdown content

```grain
<stream markdown="true">
  # Hello

  This is **bold** and *italic*.

  ~~~javascript
  console.log('Hello');
  ~~~
</stream>
```

---

## Web Output

```html
<grain-stream class="normal" cursor="true" data-speed="normal">
  Hello world
</grain-stream>
```

---

## Related

- [Think](/primitives/think) — Show AI reasoning
- [Message](/primitives/overview) — Container for stream
- [Playground](/playground) — Try it live

## Production Guidance

- Keep stream content user-facing. Hidden reasoning belongs in `<think>`, not `<stream>`.
- Use explicit state transitions so adapters can distinguish active generation, pause, resume, and completion.
- Pair long-running streams with `<state>` or `<tool>` when the UI should explain why output is delayed.
