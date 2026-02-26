# Artifact

Code, images, documents.

---

## Purpose

Display structured content — syntax-highlighted code, AI-generated images, documents, charts.

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
    ↓         ↓
   ERROR    EXPANDED
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
