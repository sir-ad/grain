# Getting Started

## What is AI Semantics?

AI Semantics defines a **standard vocabulary** for every surface where AI interacts with humans or other AI.

Every AI tool reinvents:
- How streaming text appears
- How tool calls display
- How artifacts render
- How "thinking" is shown

**Users pay the learning tax every time.**

AI Semantics makes it standard.

---

## Installation

### Web (CDN)

```html
<script src="https://cdn.ai-semantics.dev/v1/ai-semantics-web.js"></script>
<link rel="stylesheet" href="https://cdn.ai-semantics.dev/v1/ai-semantics-web.css">
```

### Web (npm)

```bash
npm install @ai-semantics/web
```

### CLI

```bash
npm install -g @ai-semantics/cli
```

### MCP

```bash
npm install @ai-semantics/mcp
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

| Without AI Semantics | With AI Semantics |
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

## Next Steps

1. [Quick Start Guide](/guide/quick-start) — Build your first AI interface
2. [Primitives](/primitives/overview) — Explore the 10 primitives
3. [G-Lang](/g-lang/syntax) — Learn the syntax

---

<style>
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
