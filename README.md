# AI Semantics

> The universal interaction layer for the AI era.

**AI Semantics** defines a standard vocabulary for every surface where AI interacts with humans or other AI.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/Version-1.0.0--alpha-red)](https://github.com/sir-ad/ai-semantics)
[![Discord](https://img.shields.io/badge/Discord-Join-blue)](https://discord.gg/ai-semantics)

---

## The Problem

Every AI tool reinvents its own interaction patterns:

- ChatGPT, Claude, Perplexity all have different streaming behaviors
- Each chatbot has unique artifact rendering
- Tool calls display differently everywhere
- No standard for "AI is thinking"
- Each model outputs different JSON

**Users pay the learning tax every time.**

---

## The Solution

AI Semantics provides:

1. **Universal Primitives** — 10 atomic interaction types
2. **State Machines** — Explicit state definitions for consistent UX
3. **G-Lang** — Declarative syntax AI can output, any frontend can render
4. **Platform Adapters** — Web, CLI, Chat, MCP, Agent, Voice

---

## Quick Example

```grain
<message role="assistant">
  <think model="chain-of-thought" visible="false">
    User is asking about weather. I should call the weather tool.
  </think>
  <stream>Let me check the weather for you...</stream>
  <tool name="get_weather" args='{"city": "Mumbai"}' status="running" />
</message>

<message role="assistant">
  <tool name="get_weather" status="complete">
    <result temperature="28" condition="sunny" />
  </tool>
  <stream>The weather in Mumbai is currently 28°C and sunny.</stream>
</message>
```

Renders consistently on web, CLI, WhatsApp, Telegram, MCP, agents, voice.

---

## Installation

```bash
# Web (npm)
npm install @ai-semantics/web

# Web (CDN)
<script src="https://cdn.ai-semantics.dev/v1/web.js"></script>

# CLI
npm install -g @ai-semantics/cli

# React
npm install @ai-semantics/react
```

---

## Core Concepts

### 1. Universal Primitives

10 atomic interaction types:

| Primitive | Purpose |
|-----------|---------|
| `STREAM` | Real-time text streaming |
| `THINK` | AI reasoning display |
| `TOOL` | Function/tool execution |
| `ARTIFACT` | Code, images, documents |
| `INPUT` | User input collection |
| `CONTEXT` | Files, URLs, memory |
| `STATE` | Global AI status |
| `ERROR` | Failure handling |
| `APPROVE` | Human-in-the-loop |
| `BRANCH` | Conversation forks |

### 2. State Machines

Every primitive has explicit states:

```
STREAM: IDLE → GENERATING → COMPLETE
TOOL: PENDING → RUNNING → COMPLETE
APPROVE: PENDING → SHOWING → APPROVED/DENIED
```

### 3. G-Lang

XML-based syntax designed for:
- AI models can output it
- Developers can read/write it
- Any platform can parse it

---

## Platform Support

| Platform | Package | Status |
|----------|---------|--------|
| Web | `@ai-semantics/web` | Alpha |
| React | `@ai-semantics/react` | Planned |
| Vue | `@ai-semantics/vue` | Planned |
| CLI | `@ai-semantics/cli` | Alpha |
| MCP | `@ai-semantics/mcp` | Alpha |
| WhatsApp | `@ai-semantics/chat` | Planned |
| Telegram | `@ai-semantics/chat` | Planned |
| Agent | `@ai-semantics/agent` | Alpha |
| Voice | `@ai-semantics/voice` | Planned |

---

## Documentation

- [Specification](SPEC.md) — Core primitives and state machines
- [G-Lang](G-LANG.md) — Syntax reference
- [Quick Start](QUICK-START.md) — Get started fast
- [Architecture](ARCHITECTURE.md) — System design

---

## Why This Matters

**The moat is not the code.**

The moat is the vocabulary:

- If AI models output G-Lang
- If every platform renders G-Lang
- If developers think in G-Lang primitives

...then you have a standard.

That's when any AI can say:
> "Just output G-Lang. The interface handles itself."

---

## Contributing

Contributions welcome! Please read our [Contributing Guide](CONTRIBUTING.md).

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Links

- GitHub: https://github.com/sir-ad/ai-semantics
- Discord: https://discord.gg/ai-semantics
- Website: https://ai-semantics.dev
