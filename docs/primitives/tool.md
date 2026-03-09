---
title: Tool
description: Represent tool execution, input payloads, progress updates, and structured results in Grain documents.
---
# Tool

Function/tool execution.

---

## Purpose

Display AI calling a function — search, API call, calculation — and its result.

---

## Try it Live

<Playground />

---

## G-Lang

```grain
<tool name="get_weather" args='{"city": "Mumbai"}' status="running">
  <input>City: Mumbai</input>
</tool>

<tool name="get_weather" status="complete">
  <result temperature="28" condition="sunny" />
</tool>
```

---

## Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `name` | string | Tool identifier |
| `args` | JSON | Input arguments |
| `status` | `pending` \| `running` \| `complete` \| `error` | Current status |
| `mode` | `automatic` \| `manual` | Execution mode |
| `timeout` | number | Max execution time (ms) |

---

## States

```
PENDING → RUNNING → COMPLETE
   ↓         ↓
SKIPPED   ERROR
   ↓         ↓
CANCELLED  RETRY
```

---

## Nested Elements

### `<input>` — Tool input

```grain
<input>City: Mumbai</input>
```

### `<result>` — Tool output

```grain
<result temperature="28" condition="sunny" />
```

### `<progress>` — Progress indicator

```grain
<progress value="45" max="100">45%</progress>
```

### `<error>` — Error state

```grain
<error code="API_ERROR">Failed to fetch</error>
```

---

## Events

| Event | Description |
|-------|-------------|
| `tool.start` | Tool started |
| `tool.progress` | Progress update |
| `tool.complete` | Tool finished |
| `tool.error` | Tool failed |

---

## Examples

### Running state

```grain
<tool name="search" args='{"q": "quantum computing"}' status="running">
  <input>Query: quantum computing</input>
</tool>
```

### Complete with result

```grain
<tool name="calculate" status="complete">
  <result value="42" />
</tool>
```

### Error state

```grain
<tool name="fetch_data" status="error">
  <error code="TIMEOUT">Request timed out after 30s</error>
</tool>
```

### Manual approval required

```grain
<tool name="send_email" status="pending" mode="manual">
  <input>To: user@example.com</input>
  <input>Subject: Hello</input>
</tool>

<approve type="tool_call" action="Send email">
  <warning>This will send an email</warning>
  <option label="Cancel"></option>
  <option label="Send"></option>
</approve>
```

---

## Related

- [Approve](/primitives/approve) — Human approval
- [Artifact](/primitives/artifact) — Display results
- [Playground](/playground) — Try it live
