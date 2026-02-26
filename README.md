# Grain

Universal interaction layer for AI interfaces.

---

### What

Standard vocabulary for every surface where AI meets humans — or AI meets AI.

No more rebuilding chat UI, streaming text, tool calls, artifact rendering. Every AI tool invents this. We're making it standard.

### Size

~15KB. Zero dependencies.

### Philosophy

Semantic markup. No classes. Drop in. Works. Standards, not frameworks.

```grain
<message role="assistant">
  <think model="chain-of-thought" visible="false">
    User asks about weather. Call weather tool.
  </think>
  <stream>Checking weather...</stream>
  <tool name="get_weather" args='{"city": "Mumbai"}' status="running" />
</message>
```

Same syntax renders on web, CLI, MCP, agents.

### Primitives

10 atomic types:

| | |
|---|---|
| stream | think |
| tool | artifact |
| input | context |
| state | error |
| approve | branch |

Each has explicit states.

### Packages

| | |
|---|---|
| grain | Core: parser, validator, state machine |
| @grain/web | HTML adapter |
| @grain/cli | Terminal adapter |
| @grain/mcp | MCP protocol |

### Why

AI outputs raw text. Every frontend guesses how to render it.

If AI models output G-Lang — and every platform knows how to render G-Lang — the interface problem disappears.

### Install

```bash
npm install grain
npm install @grain/web
```

CDN: `https://cdn.grain.dev/v1/grain-web.js`

### Docs

- [Spec](SPEC.md)
- [G-Lang](G-LANG.md)
- [Architecture](ARCHITECTURE.md)

---

MIT. https://github.com/sir-ad/grain
