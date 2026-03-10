---
title: Tool Primitive | Execution, Progress, and Results
description: Represent tool execution, input payloads, progress updates, structured results, and error states in Grain documents across interactive surfaces.
---
# Tool

Function/tool execution.

---

## Purpose

Display AI calling a function — search, API call, calculation — and its result.

`<tool>` is the bridge between model intent and observable side effects. It lets the interface show what is running, what input was used, and what came back.

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

These companion elements are part of the public Grain contract and should parse cleanly in documented examples.

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

## Operational Guidance

- Use `status` changes to describe the execution lifecycle instead of overloading user-facing text.
- Prefer `<input>` and `<result>` for structured fields that the renderer or adapter may want to inspect later.
- Pair sensitive or externally visible tool calls with `<approve>` when a human checkpoint is required.
