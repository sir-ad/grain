---
title: CLI API
description: Reference the `@grain.sh/cli` adapter API, renderer options, and behavior of the `grain` executable.
---
# CLI API

CLI adapter API reference.

---

## CLIAdapter

```typescript
import { CLIAdapter } from '@grain.sh/cli';

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
grain [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--input, -i` | Input file |
| `--output, -o` | Output file |
| `--watch, -w` | Watch mode |
| `--theme` | Theme (light/dark) |
