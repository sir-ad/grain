# MCP API

MCP adapter API reference.

---

## MCPAdapter

```typescript
import { MCPAdapter } from '@ai-semantics/mcp';

const adapter = new MCPAdapter(options);
```

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
