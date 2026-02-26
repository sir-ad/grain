# Stream

Real-time text streaming.

---

## Purpose

Display AI output as it generates — character by character or chunk by chunk.

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

### Markdown

```grain
<stream markdown="true">
# Hello

This is **bold** and *italic*.
</stream>
```

### Web output

```html
<ai-stream class="normal" cursor="true" data-speed="normal">
  Hello world
</ai-stream>
```
