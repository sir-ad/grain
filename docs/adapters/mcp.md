# MCP Adapter

Model Context Protocol integration.

---

## Installation

```bash
npm install @ai-semantics/mcp
```

---

## Overview

Tools return G-Lang in JSON format. MCP Adapter converts between:
- G-Lang → MCP JSON
- MCP JSON → G-Lang

---

## G-Lang to MCP

```javascript
import { MCPAdapter } from '@ai-semantics/mcp';

const adapter = new MCPAdapter();

// G-Lang to MCP JSON
const mcp = adapter.toMCP(`
<tool name="get_weather" args='{"city": "Mumbai"}' status="running">
  <input>City: Mumbai</input>
</tool>
`);

console.log(mcp);
```

Output:

```json
{
  "semantic": "tool",
  "name": "get_weather",
  "input": { "city": "Mumbai" },
  "status": "running"
}
```

---

## MCP to G-Lang

```javascript
// MCP JSON to G-Lang
const grain = adapter.fromMCP({
  semantic: 'tool',
  name: 'get_weather',
  output: { temperature: 28, condition: 'sunny' },
  status: 'complete'
});

console.log(grain);
```

Output:

```grain
<tool name="get_weather" status="complete">
  <result temperature="28" condition="sunny" />
</tool>
```

---

## Context Attachment

```javascript
const mcp = adapter.toMCP(`
<context type="file" id="doc-123" name="spec.pdf" />
`);
```

```json
{
  "semantic": "context",
  "type": "file",
  "id": "doc-123",
  "name": "spec.pdf"
}
```

---

## Agent Messages

```javascript
const mcp = adapter.fromMCP({
  semantic: 'agent_message',
  from: 'research_agent',
  to: 'coordinator',
  type: 'task_complete',
  task_id: 'task-456',
  result: {
    semantic: 'artifact',
    type: 'document',
    title: 'Research Summary',
    content: '...'
  }
});
```

---

## Options

```javascript
const adapter = new MCPAdapter({
  includeMetadata: true  // Include duration/tokens
});
```
