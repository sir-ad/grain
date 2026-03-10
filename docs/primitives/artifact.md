---
title: Artifact Primitive | Code, Files, and Rich Outputs
description: Attach code, images, files, and rich generated outputs as first-class artifacts in Grain documents with metadata that adapters can render consistently.
---
# Artifact

Code, images, documents.

---

## Purpose

Display structured content — syntax-highlighted code, AI-generated images, documents, charts.

Use `<artifact>` when the output should remain inspectable or downloadable rather than being flattened into plain conversational text.

---

## Try it Live

<Playground />

---

## G-Lang

```grain
<artifact type="code" language="javascript" title="hello.js"
  copyable="true" downloadable="true">
  function hello() {
    console.log('Hello, World!');
  }
</artifact>

<artifact type="image" title="Generated Image">
  [base64 data]
</artifact>
```

---

## Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `type` | `code` \| `image` \| `chart` \| `document` \| `file` \| `video` \| `audio` | Content type |
| `language` | string | Programming language (for code) |
| `title` | string | Display title |
| `filename` | string | Downloadable filename |
| `copyable` | `true` \| `false` | Allow copy |
| `downloadable` | `true` \| `false` | Allow download |
| `editable` | `true` \| `false` | Allow editing |
| `runnable` | `true` \| `false` | Allow execution |

---

## States

```
LOADING → READY → INTERACTING
   ↓        ↓
ERROR   EXPANDED
            ↓
         EDITING
```

---

## Events

| Event | Description |
|-------|-------------|
| `artifact.load` | Loading started |
| `artifact.ready` | Loaded successfully |
| `artifact.copy` | Content copied |
| `artifact.download` | Download started |
| `artifact.edit` | Content edited |

---

## Examples

### Code with syntax highlighting

```grain
<artifact type="code" language="python" title="factorial.py"
  copyable="true" runnable="true">
  def factorial(n):
      if n <= 1:
          return 1
      return n * factorial(n - 1)
</artifact>
```

### Chart visualization

```grain
<artifact type="chart" title="Monthly Revenue">
  {"type": "bar", "data": [120, 150, 180, 220]}
</artifact>
```

### Image artifact

```grain
<artifact type="image" title="Generated Art" downloadable="true">
  data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...
</artifact>
```

### Document/PDF

```grain
<artifact type="document" title="Report.pdf" filename="report.pdf">
  [PDF content or URL]
</artifact>
```

---

## Related

- [Tool](/primitives/tool) — Tool execution results
- [Context](/primitives/context) — File attachments
- [Playground](/playground) — Try it live

## Production Guidance

- Prefer artifacts for durable outputs such as code, reports, or generated files.
- Keep metadata like `title`, `filename`, and `language` populated so adapters can present the content consistently.
- Use `<tool>` for execution state and `<artifact>` for the resulting object once it is ready to inspect.
