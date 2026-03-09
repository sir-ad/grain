# `@grain.sh/mcp`

Model Context Protocol adapter for translating Grain documents to and from MCP-shaped payloads.

## Install

```bash
npm install @grain.sh/mcp
```

## Usage

```ts
import { MCPAdapter } from '@grain.sh/mcp';

const adapter = new MCPAdapter();

const payload = adapter.toMCP(
  `<tool name="search" status="complete"><result>done</result></tool>`
);

console.log(payload);
```

Docs: https://sir-ad.github.io/grain/
