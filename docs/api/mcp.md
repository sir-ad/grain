---
title: MCP API | Grain to MCP Adapter Surface
description: Reference the @grain.sh/mcp adapter surface for converting Grain documents to and from MCP payloads.
---
# MCP API

`@grain.sh/mcp` is the bridge between Grain documents and MCP-shaped payloads. Use it when a tool or orchestration layer needs to translate structured Grain interactions into MCP transport objects and back again.

---

## MCPAdapter

```typescript
import { MCPAdapter } from '@grain.sh/mcp';

const adapter = new MCPAdapter(options);
```

## What This Covers

- converting supported Grain primitives into MCP payloads
- reconstructing Grain documents from MCP tool responses and context attachments
- preserving enough semantic structure for downstream renderers to stay consistent

---

## Options

```typescript
interface MCPAdapterConfig {
  includeMetadata?: boolean;
}
```

---

## Methods

### toMCP()

Convert G-Lang to MCP JSON.

```typescript
adapter.toMCP(grain: string): MCPToolResponse | MCPContextAttachment | null
```

### fromMCP()

Convert MCP JSON to G-Lang.

```typescript
adapter.fromMCP(mcp: MCPToolResponse | MCPContextAttachment): string
```

---

## Types

```typescript
interface MCPToolResponse {
  semantic: 'tool';
  name: string;
  input?: Record<string, unknown>;
  output?: unknown;
  status: 'pending' | 'running' | 'complete' | 'error';
  error?: { code: string; message: string };
  metadata?: { duration_ms?: number; tokens_used?: number };
}

interface MCPContextAttachment {
  semantic: 'context';
  type: 'file' | 'url' | 'memory' | 'memory_chip' | 'conversation';
  id: string;
  name?: string;
  preview?: string;
  size?: number;
  mimeType?: string;
}
```

The adapter currently covers `tool`, `context`, and `approve` payloads.

## Integration Notes

- Keep the adapter boundary explicit: Grain is still the higher-level interaction contract.
- Validate inbound Grain before conversion if malformed model output should fail fast.
- Use `@grain.sh/mcp-server` when you need a stdio server process rather than only an adapter library.
