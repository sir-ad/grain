# CLI API

CLI adapter API reference.

---

## CLIAdapter

```typescript
import { CLIAdapter } from '@ai-semantics/cli';

const adapter = new CLIAdapter(options);
```

---

## Options

```typescript
interface CLIOptions {
  theme?: 'light' | 'dark';
}
```

---

## Methods

### render()

```typescript
adapter.render(grain: string): string
```

---

## CLI Binary

```bash
ai-sem [command] [options]
```

### Commands

| Command | Description |
|---------|-------------|
| `render` | Render G-Lang file |

### Options

| Option | Description |
|--------|-------------|
| `--input, -i` | Input file |
| `--output, -o` | Output file |
| `--watch, -w` | Watch mode |
| `--theme` | Theme (light/dark) |
