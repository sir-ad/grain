---
title: Getting Started with Grain
description: Install Grain packages, understand the core primitives, and render your first Grain documents across web, CLI, and MCP surfaces.
---
# Getting Started

## What is Grain?

Grain defines a **standard vocabulary** for every surface where AI interacts with humans or other AI.

Every AI tool reinvents:
- How streaming text appears
- How tool calls display
- How artifacts render
- How "thinking" is shown

**Users pay the learning tax every time.**

Grain makes it standard.

---

## Installation

### Web (CDN)

```html
<script src="https://cdn.jsdelivr.net/npm/@grain.sh/web@latest/dist/index.global.js"></script>
```

### Web (npm)

```bash
npm install @grain.sh/web
```

### CLI

```bash
npm install -g @grain.sh/cli
```

### MCP Adapter

```bash
npm install @grain.sh/mcp
```

### MCP Server

```bash
npm install -g @grain.sh/mcp-server
```

---

## Quick Example

```grain
<message role="assistant">
  <stream>Hello! How can I help?</stream>
</message>
```

Renders as:

<div style="padding: 16px; background: #f5f5f5; border-radius: 8px; margin: 16px 0;">
  <div style="background: white; padding: 16px; border-radius: 8px; max-width: 400px;">
    <div style="font-size: 0.875em; color: #666; margin-bottom: 8px;">AI</div>
    <span>Hello! How can I help?</span><span style="display: inline-block; width: 8px; height: 1.2em; background: #000; margin-left: 2px; animation: blink 1s step-end infinite;"></span>
  </div>
</div>

---

## Why This Matters

| Without Grain | With Grain |
|---------------------|-------------------|
| Every AI tool different | Standard primitives |
| Rebuild same UI | Drop in adapters |
| Inconsistent UX | Consistent states |
| AI outputs raw JSON | AI outputs G-Lang |

---

## The Moat

Not the code.

The vocabulary.

If AI models output G-Lang — and every platform renders G-Lang — you have a standard.

That's when any AI can say:

> "Just output G-Lang. The interface handles itself."

---

## What To Install First

- Use `@grain.sh/core` when you need parsing, validation, or state-machine behavior.
- Use `@grain.sh/web` when you need browser rendering and Web Components.
- Use `@grain.sh/cli` when you want the `grain` executable for local inspection or terminal rendering.
- Use `@grain.sh/mcp` and `@grain.sh/mcp-server` when Grain needs to bridge into MCP tooling or server workflows.

If you are evaluating the documentation site itself, the canonical local commands are `pnpm docs:build` and `pnpm docs:preview`.

---

## Next Steps

1. [Quick Start Guide](/guide/quick-start) — Build your first AI interface
2. [Primitives](/primitives/overview) — Explore the core primitives and companion elements
3. [G-Lang](/g-lang/syntax) — Learn the syntax

---

<style>
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
