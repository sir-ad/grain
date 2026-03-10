---
title: CLI API | CLIAdapter and grain Executable
description: Reference the @grain.sh/cli adapter API, renderer options, watch behavior, and the production grain executable for terminal-first workflows.
---
# CLI API

`@grain.sh/cli` gives Grain a terminal surface. It is useful for local validation, automation output, and reviewing Grain documents without building a browser UI first.

---

## CLIAdapter

```typescript
import { CLIAdapter } from '@grain.sh/cli';

const adapter = new CLIAdapter(options);
```

## What To Use It For

- inspect Grain output during development
- render saved `.glang` fixtures in CI or local automation
- debug parser and state-machine behavior in a terminal-first workflow

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

## Operational Notes

- The `grain` executable is the canonical binary name.
- Watch mode should be used against a real file path so content changes are re-read from disk.
- For contract debugging, pair the CLI with `@grain.sh/core` tests or parser fixtures.
