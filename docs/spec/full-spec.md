---
title: Full Specification | Grain
description: The complete Grain specification - universal primitives, state machines, and G-Lang syntax.
---

# Grain Specification

> The universal interaction layer for the AI era.

---

## What is Grain?

**Grain** defines a standard vocabulary for every surface where AI interacts with humans or other AI.

Every AI tool reinvents its own interaction patterns. Users pay the learning tax every time. Developers rebuild the same UI components. AI models output inconsistent formats.

Grain solves this by defining:

1. **Universal Primitives** — The atomic interaction types that compose every AI experience
2. **State Machines** — How each primitive behaves, what events occur, what states are valid
3. **Grain Language** — A declarative syntax that AI models can output and any frontend can render
4. **Platform Adapters** — Implementations for web, CLI, chat platforms, MCP, agents, voice

---

## The Core Problem

| Current State | With Grain |
|---------------|------------|
| Every AI tool has different streaming behavior | Standard `<stream>` primitive |
| Each chatbot has unique artifact rendering | Standard `<artifact>` primitive |
| Tool calls display differently everywhere | Standard `<tool>` primitive |
| No standard for "AI is thinking" | Standard `ResultsController` primitive |
| Each model outputs different JSON | Standard Grain Language output |

---

## Design Principles

### 1. Atomic Primitives

Every AI interaction is composed of primitives. We don't build "chat" or "assistant" — we build the building blocks that compose into chat, assistant, agent, or anything else.

### 2. State-First Thinking

Every primitive has explicit states. Not just "loading" and "done" — but "streaming," "paused," "error," "retry," "approved," "rejected." This makes UX consistent.

### 3. AI-Readable, Human-Writable

Grain Language syntax is designed for two audiences:
- AI models can generate valid Grain Language
- Developers can read and write Grain Language directly

### 4. Platform Agnostic

The same specification renders on web, CLI, WhatsApp, Telegram, MCP, agents, voice. Each platform adapts the primitives to its constraints.

### 5. Extensible

New primitives can be added. Enterprises can define domain-specific extensions. The core stays stable; the edges grow.

---

## Version

This specification is versioned using Semantic Versioning.

- **Major**: Breaking changes to primitives, states, or Grain Language syntax
- **Minor**: New primitives, new states, backward-compatible features
- **Patch**: Documentation fixes, clarifications

Current version: **1.0.0**

---

## Universal Primitives

Every AI interaction is composed of these atomic primitives:

```
┌─────────────────────────────────────────────────────────────────┐
│                    UNIVERSAL PRIMITIVES                          │
├─────────────┬─────────────┬─────────────┬─────────────┬─────────┤
│   STREAM    │    THINK    │    TOOL     │  ARTIFACT   │  INPUT  │
├─────────────┼─────────────┼─────────────┼─────────────┼─────────┤
│   CONTEXT   │   STATE     │   ERROR     │   APPROVE   │ BRANCH  │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────┘
```

---

## STREAM

**Purpose:** Display AI output as it generates, character-by-character or chunk-by-chunk.

**Use Cases:**
- Chat messages appearing in real-time
- Code being written live
- Any text that arrives progressively

**Attributes:**

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `speed` | string | No | `fast` (no delay), `normal` (20ms), `slow` (50ms), `custom` |
| `cursor` | boolean | No | Show blinking cursor at end |
| `markdown` | boolean | No | Parse markdown as it streams |
| `highlight` | string | No | Highlight current chunk |

**States:**

```
IDLE → GENERATING → COMPLETE
  ↓
PAUSED
  ↓
RESUMING → COMPLETE
  ↓
ERROR
```

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `stream.start` | `{ content: string }` | Stream began |
| `stream.chunk` | `{ chunk: string, index: number }` | New chunk received |
| `stream.complete` | `{ fullContent: string }` | Stream finished |
| `stream.pause` | `{ index: number }` | Stream paused |
| `stream.resume` | `{ index: number }` | Stream resumed |
| `stream.error` | `{ error: string }` | Stream failed |

---

## THINK

**Purpose:** Display AI reasoning process. Visible or hidden based on user preference.

**Use Cases:**
- Chain-of-thought display
- Model's internal reasoning
- Debugging AI decisions
- Educational explanations

**Attributes:**

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `model` | string | No | Reasoning model name (e.g., "chain-of-thought", "tree-of-thought") |
| `visible` | boolean | No | Default visibility state |
| `depth` | string | No | `shallow` (1-2 steps), `medium` (3-5), `deep` (full) |
| `expandable` | boolean | No | User can toggle visibility |
| `priority` | number | No | Sort order when multiple think blocks |

**States:**

```
HIDDEN → REVEALING → VISIBLE
   ↑         ↑
VISIBLE → HIDING → HIDDEN
   ↓
EXPANDING → COLLAPSING
```

---

## TOOL

**Purpose:** Execute a function/capability and display the result.

**Use Cases:**
- AI calls a function (search, calculate, API call)
- Tool execution status display
- Results returned from tool calls

**Attributes:**

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | Tool identifier |
| `args` | object | No | Input arguments as JSON |
| `mode` | string | No | `automatic` (runs immediately), `manual` (requires approval) |
| `timeout` | number | No | Max execution time in ms |
| `retry` | boolean | No | Allow retry on failure |
| `stream` | boolean | No | Stream tool output |

**States:**

```
PENDING → RUNNING → COMPLETE
   ↓         ↓
SKIPPED   ERROR
   ↓         ↓
CANCELLED  RETRY
```

---

## ARTIFACT

**Purpose:** Display structured content — code, images, documents, files.

**Use Cases:**
- Code blocks with syntax highlighting
- Images generated by AI
- Documents, PDFs, spreadsheets
- Charts and visualizations

**Attributes:**

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | Yes | `code`, `image`, `chart`, `document`, `file`, `video`, `audio` |
| `language` | string | No | For code: programming language |
| `title` | string | No | Display title |
| `filename` | string | No | For downloadable files |
| `size` | object | No | `{ width, height }` for media |
| `downloadable` | boolean | No | Allow download |
| `copyable` | boolean | No | Allow copy to clipboard |
| `runnable` | boolean | No | Allow execution (for code) |
| `editable` | boolean | No | Allow inline editing |

---

## INPUT

**Purpose:** Collect user input — text, files, images, voice.

**Use Cases:**
- Text input field
- File upload area
- Voice recording
- Multimodal input

**Attributes:**

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | Yes | `text`, `file`, `image`, `voice`, `multimodal` |
| `placeholder` | string | No | Placeholder text |
| `autofocus` | boolean | No | Focus on mount |
| `maxlength` | number | No | Character limit |
| `multiline` | boolean | No | Multi-line text area |
| `attachments` | boolean | No | Allow file attachments |
| `voice` | boolean | No | Enable voice input |
| `suggestions` | array | No | Array of suggested inputs |

---

## CONTEXT

**Purpose:** Provide AI with context — files, URLs, memory, memory chips.

**Use Cases:**
- File attachments
- URL references
- Conversation history chips
- Custom memory blocks

**Attributes:**

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | Yes | `file`, `url`, `memory`, `memory_chip`, `conversation` |
| `id` | string | Yes | Unique identifier |
| `name` | string | No | Display name |
| `preview` | string | No | Preview text/thumbnail |
| `size` | number | No | File size in bytes |
| `mimeType` | string | No | MIME type |
| `removable` | boolean | No | User can remove |
| `expandable` | boolean | No | User can view full |

---

## STATE

**Purpose:** Indicate overall AI state — loading, thinking, idle, error.

**Use Cases:**
- Global status indicator
- Typing indicators
- Progress bars
- Connection status

**Attributes:**

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `status` | string | Yes | `idle`, `loading`, `thinking`, `streaming`, `error`, `offline` |
| `message` | string | No | Status message |
| `progress` | number | No | 0-100 progress |
| `eta` | number | No | Estimated seconds remaining |
| `animated` | boolean | No | Show animation |

---

## ERROR

**Purpose:** Display errors, failures, and recovery options.

**Use Cases:**
- API failures
- Rate limits
- Invalid input
- AI errors

**Attributes:**

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `code` | string | Yes | Error code |
| `message` | string | Yes | Human-readable message |
| `recoverable` | boolean | No | Can be retried |
| `details` | object | No | Additional error data |
| `actions` | array | No | Available recovery actions |

---

## APPROVE

**Purpose:** Human-in-the-loop confirmation for sensitive actions.

**Use Cases:**
- Confirm tool execution
- Approve content generation
- Confirm deletions
- Consent for data usage

**Attributes:**

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | Yes | `tool_call`, `action`, `delete`, `consent` |
| `action` | string | Yes | What needs approval |
| `warning` | string | No | Warning message |
| `options` | array | No | Custom approval options |
| `timeout` | number | No | Auto-expire after ms |
| `auto` | boolean | No | Auto-approve if user configured |

---

## BRANCH

**Purpose:** Fork conversation, show alternatives, create variants.

**Use Cases:**
- Show alternative responses
- Conversation branching
- A/B testing variants
- Conversation rollback

**Attributes:**

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Unique branch ID |
| `label` | string | No | Branch label |
| `active` | boolean | No | Is this the active branch |
| `mergeable` | boolean | No | Can be merged back |
| `parent` | string | No | Parent branch ID |

---

## State Machines

Each primitive has a defined state machine.

### STREAM State Machine

```
┌─────────┐  ai.start  ┌───────────┐   chunk   ┌───────────┐
│  IDLE   │────────────→│GENERATING │───────────→│ COMPLETE  │
└─────────┘             └───────────┘           └───────────┘
     ↑                        │
     │                        │ pause
     │                        ▼
     │                  ┌─────────┐
     │                  │ PAUSED  │
     │                  └────┬────┘
     │                       │ resume
     │                       ▼
     └──────────────────┌────────────┐
                        │  RESUMING  │
                        └────────────┘
                              │
                              │ error
                              ▼
                        ┌─────────┐
                        │  ERROR  │
                        └─────────┘
```

---

## Grain Language Syntax

Grain Language is a declarative XML-based syntax for describing AI interactions.

### Grammar (EBNF)

```txt
document = { element } ;

element = message | think | stream | tool | artifact | context
        | approve | branch | state | error | input | action ;

message = "<message"
        [ "role=" ( "user" | "assistant" | "system" | "tool" ) ]
        [ "stream=" ( "true" | "false" ) ]
        [ "id=" string ]
        ">" content "</message>" ;

think = "<think"
      [ "model=" string ]
      [ "visible=" ( "true" | "false" ) ]
      [ "depth=" ( "shallow" | "medium" | "deep" ) ]
      ">" content "ResultsController" ;

stream = "<stream"
       [ "speed=" ( "fast" | "normal" | "slow" ) ]
       [ "cursor=" ( "true" | "false" ) ]
       [ "markdown=" ( "true" | "false" ) ]
       ">" content "</stream>" ;

tool = "<tool"
     "name=" string
     [ "args=" json ]
     [ "status=" ( "pending" | "running" | "complete" | "error" ) ]
     [ "mode=" ( "automatic" | "manual" ) ]
     ">" { tool_content } "</tool>" ;

artifact = "<artifact"
         "type=" ( "code" | "image" | "chart" | "document" | "file" | "video" | "audio" )
         [ "language=" string ]
         [ "title=" string ]
         [ "filename=" string ]
         [ "downloadable=" ( "true" | "false" ) ]
         [ "copyable=" ( "true" | "false" ) ]
         [ "editable=" ( "true" | "false" ) ]
         ">" content "</artifact>" ;
```

---

## Platform Adapters

Each platform renders Grain Language according to its constraints.

### Web Adapter

```javascript
import { WebAdapter } from '@grain.sh/web';

const adapter = new WebAdapter();
adapter.render(`<message role="assistant">
  <stream>Hello!</stream>
</message>`);
```

### CLI Adapter

```bash
grain render --input chat.glang
```

---

## Changelog

### 1.0.0 (2026-03)

- Initial release
- 10 universal primitives defined
- Grain Language syntax specified
- Platform adapters for Web, CLI, MCP
- Extension system designed
