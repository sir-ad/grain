# AI Semantics

Universal interaction layer for AI interfaces.

---

### What

Standard vocabulary for every surface where AI meets humans — or AI meets AI.

No more rebuilding chat UI, streaming text, tool calls, artifact rendering. Every AI tool invents this stuff. We're making it standard.

### Size

~15KB. Zero dependencies.

### Philosophy

Like oat.ink, but for AI interfaces:
- Semantic markup. No classes.
- Drop in. Works.
- Standards, not frameworks.

```grain
<message role="assistant">
  <think model="chain-of-thought" visible="false">
    User asks about weather. Call weather tool.
  </think>
  <stream>Checking weather...</stream>
  <tool name="get_weather" args='{"city": "Mumbai"}' status="running" />
</message>
```

Same syntax renders on web, CLI, WhatsApp, Telegram, MCP, agents, voice.

### Primitives

10 atomic types. Compose into anything:

| | |
|---|---|
| stream | think |
| tool | artifact |
| input | context |
| state | error |
| approve | branch |

Each has explicit states. Not just "loading" — but streaming, paused, error, retry.

### Adapters

| | |
|---|---|
| @ai-semantics/web | HTML + CSS |
| @ai-semantics/cli | Terminal |
| @ai-semantics/mcp | JSON ↔ G-Lang |

More coming: React, Vue, WhatsApp, Telegram, Voice.

### Why

AI outputs raw text. Every frontend guesses how to render it. 

If AI models output G-Lang — and every platform knows how to render G-Lang — the interface problem disappears.

That's the play.

### Install

```bash
npm install @ai-semantics/core
npm install @ai-semantics/web
```

CDN: `https://cdn.ai-semantics.dev/v1/ai-semantics-web.js`

### Docs

- [Spec](SPEC.md)
- [G-Lang](G-LANG.md)
- [Architecture](ARCHITECTURE.md)

---

MIT. https://github.com/sir-ad/ai-semantics
