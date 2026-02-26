# CLI Adapter

Terminal rendering.

---

## Installation

```bash
npm install -g @ai-semantics/cli
```

---

## Usage

```bash
# Render a G-Lang file
ai-sem render --input chat.glang

# Watch mode
ai-sem render --input chat.glang --watch

# Output to file
ai-sem render --input chat.glang --output output.txt
```

---

## Programmatic

```javascript
import { CLIAdapter } from '@ai-semantics/cli';

const adapter = new CLIAdapter();

const output = adapter.render(`
<message role="assistant">
  <stream>Hello from terminal!</stream>
</message>
`);

console.log(output);
```

---

## Output Example

```
┌─ AI ──────────────────────────────────────┐
│ ○ Thinking...                               │
├─────────────────────────────────────────────┤
│ Hello from terminal!                        │
│                                             │
├─────────────────────────────────────────────┤
│ [Copy] [Regenerate] [Ask Follow-up]        │
└─────────────────────────────────────────────┘
```

---

## Rendering Rules

| Primitive | Rendering |
|-----------|-----------|
| `stream` | Typewriter effect |
| `think` | Hidden, `│` prefix when visible |
| `tool` | Box with status icon |
| `artifact` | Code blocks |
| `error` | Red text |
| `approve` | Checkboxes |
| `state` | Spinner |

---

## Theme

```javascript
const adapter = new CLIAdapter({ theme: 'dark' });
```

---

## Options

| Option | Description |
|--------|-------------|
| `--input, -i` | Input G-Lang file |
| `--output, -o` | Output file |
| `--watch, -w` | Watch mode |
| `--theme` | `light` or `dark` |
