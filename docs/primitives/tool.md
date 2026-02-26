# Tool

Function/tool execution.

---

## Purpose

Display AI calling a function — search, API call, calculation — and its result.

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
  CANCELLED RETRY
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
