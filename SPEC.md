# AI Semantics — Specification

> The universal interaction layer for the AI era.

## What is AI Semantics?

**AI Semantics** defines a standard vocabulary for every surface where AI interacts with humans or other AI.

Every AI tool reinvents its own interaction patterns. Users pay the learning tax every time. Developers rebuild the same UI components. AI models output inconsistent formats.

AI Semantics solves this by defining:

1. **Universal Primitives** — The 10 atomic interaction types that compose every AI experience
2. **State Machines** — How each primitive behaves, what events occur, what states are valid
3. **G-Lang** — A declarative syntax that AI models can output and any frontend can render
4. **Platform Adapters** — Implementations for web, CLI, chat platforms, MCP, agents, voice

---

## The Core Problem

| Current State | With AI Semantics |
|---------------|-------------------|
| Every AI tool has different streaming behavior | Standard `<stream>` primitive |
| Each chatbot has unique artifact rendering | Standard `<artifact>` primitive |
| Tool calls display differently everywhere | Standard `<tool>` primitive |
| No standard for "AI is thinking" | Standard `<think>` primitive |
| Each model outputs different JSON | Standard G-Lang output |

---

## Design Principles

### 1. Atomic Primitives

Every AI interaction is composed of primitives. We don't build "chat" or "assistant" — we build the building blocks that compose into chat, assistant, agent, or anything else.

### 2. State-First Thinking

Every primitive has explicit states. Not just "loading" and "done" — but "streaming," "paused," "error," "retry," "approved," "rejected." This makes UX consistent.

### 3. AI-Readable, Human-Writable

G-Lang syntax is designed for two audiences:
- AI models can generate valid G-Lang
- Developers can read and write G-Lang directly

### 4. Platform Agnostic

The same specification renders on web, CLI, WhatsApp, Telegram, MCP, agents, voice. Each platform adapts the primitives to its constraints.

### 5. Extensible

New primitives can be added. Enterprises can define domain-specific extensions. The core stays stable; the edges grow.

---

## Version

This specification is versioned using Semantic Versioning.

- **Major**: Breaking changes to primitives, states, or G-Lang syntax
- **Minor**: New primitives, new states, backward-compatible features
- **Patch**: Documentation fixes, clarifications

Current version: **1.0.0-alpha**

---

## Table of Contents

1. [Universal Primitives](#universal-primitives)
2. [State Machines](#state-machines)
3. [G-Lang Syntax](#g-lang-syntax)
4. [Platform Adapters](#platform-adapters)
5. [Extension System](#extension-system)

---

# Universal Primitives

Every AI interaction is composed of these 10 atomic primitives:

```
┌─────────────────────────────────────────────────────────────────┐
│                    UNIVERSAL PRIMITIVES                           │
├─────────────┬─────────────┬─────────────┬─────────────┬─────────┤
│   STREAM    │   THINK    │    TOOL    │  ARTIFACT  │  INPUT  │
├─────────────┼─────────────┼─────────────┼─────────────┼─────────┤
│   CONTEXT   │   STATE    │   ERROR    │  APPROVE   │ BRANCH  │
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

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `think.reveal` | `{ model: string }` | User revealed thinking |
| `think.hide` | `{ model: string }` | User hid thinking |
| `think.complete` | `{ reasoning: string }` | Reasoning finished |

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
  CANCELLED RETRY
```

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `tool.start` | `{ name: string, args: object }` | Tool execution started |
| `tool.progress` | `{ name: string, progress: number }` | Progress update |
| `tool.complete` | `{ name: string, result: object }` | Tool finished |
| `tool.error` | `{ name: string, error: string }` | Tool failed |
| `tool.retry` | `{ name: string, attempt: number }` | Retrying tool |
| `tool.cancel` | `{ name: string }` | Tool cancelled |

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

**States:**

```
LOADING → READY → INTERACTING
    ↓         ↓
   ERROR    EXPANDED
              ↓
           EDITING
```

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `artifact.load` | `{ type: string, url: string }` | Loading started |
| `artifact.ready` | `{ type: string }` | Loaded successfully |
| `artifact.error` | `{ type: string, error: string }` | Load failed |
| `artifact.expand` | `{ type: string }` | User expanded |
| `artifact.copy` | `{ type: string }` | Content copied |
| `artifact.download` | `{ type: string, filename: string }` | Download started |
| `artifact.edit` | `{ type: string, changes: object }` | Content edited |

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

**States:**

```
EMPTY → TYPING → FILLED
    ↓         ↓       ↓
   FOCUSED   PAUSED  SUBMITTING
                         ↓
                     SUBMITTED
```

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `input.focus` | - | Input gained focus |
| `input.blur` | - | Input lost focus |
| `input.change` | `{ value: string }` | Value changed |
| `input.submit` | `{ value: string, attachments: array }` | Form submitted |
| `input.voice.start` | - | Voice recording started |
| `input.voice.stop` | `{ audio: blob }` | Voice recording stopped |
| `input.suggestion.click` | `{ suggestion: string }` | User clicked suggestion |

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

**States:**

```
ATTACHED → LOADING → READY
    ↓         ↓        ↓
  REMOVING   ERROR   EXPANDED
                        ↓
                    PROCESSING
```

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `context.attach` | `{ type: string, id: string }` | Context added |
| `context.load` | `{ type: string, id: string }` | Loading started |
| `context.ready` | `{ type: string, id: string }` | Ready for AI |
| `context.remove` | `{ type: string, id: string }` | User removed |
| `context.error` | `{ type: string, id: string, error: string }` | Load failed |

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

**States:**

```
IDLE ←──────────────────┐
  ↓                     │
LOADING → THINKING → STREAMING
    ↓         ↓          ↓
   ERROR    ERROR      COMPLETE → IDLE
```

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `state.change` | `{ from: string, to: string }` | State changed |
| `state.progress` | `{ progress: number }` | Progress update |

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

**States:**

```
VISIBLE → ACKNOWLEDGED
    ↓           ↓
  DISMISSED   RECOVERING
                  ↓
             RECOVERED
```

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `error.occur` | `{ code: string, message: string }` | Error occurred |
| `error.retry` | `{ code: string }` | User retried |
| `error.dismiss` | `{ code: string }` | User dismissed |
| `error.recover` | `{ code: string }` | Recovery succeeded |

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

**States:**

```
PENDING → SHOWING → APPROVED
    ↓         ↓        ↓
  EXPIRED   DENIED   EXECUTING
                    → COMPLETE
```

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `approve.request` | `{ type: string, action: string }` | Approval requested |
| `approve.show` | `{ type: string }` | User saw request |
| `approve.deny` | `{ type: string, reason: string }` | User denied |
| `approve.expire` | `{ type: string }` | Request timed out |
| `approve.execute` | `{ type: string }` | Action executing |

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

**States:**

```
CREATED → EXPANDED → ACTIVE
    ↓         ↓         ↓
  MERGED   COLLAPSED   MERGING
                      → ACTIVE
```

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `branch.create` | `{ id: string, parent: string }` | Branch created |
| `branch.expand` | `{ id: string }` | User expanded |
| `branch.collapse` | `{ id: string }` | User collapsed |
| `branch.activate` | `{ id: string }` | User switched to branch |
| `branch.merge` | `{ from: string, to: string }` | Branch merged |

---

# State Machines

Each primitive has a defined state machine.

## STREAM State Machine

```
┌─────────┐    ai.start    ┌───────────┐   chunk     ┌───────────┐
│  IDLE   │──────────────→│GENERATING │───────────→│COMPLETE   │
└─────────┘               └───────────┘            └───────────┘
     ↑                         │                        │
     │                         │ pause                  │
     │                         ▼                        │
     │                    ┌─────────┐                   │
     │                    │ PAUSED  │                   │
     │                    └────┬────┘                   │
     │                         │ resume                 │
     │                         ▼                        │
     └──────────────────┌────────────┐                 │
                        │  RESUMING  │─────────────────┘
                        └────────────┘
                              │
                              │ error
                              ▼
                        ┌─────────┐
                        │  ERROR  │
                        └─────────┘
```

**Valid Transitions:**

| From | To | Trigger |
|------|----|---------|
| IDLE | GENERATING | user.send / ai.start |
| GENERATING | COMPLETE | stream.end |
| GENERATING | PAUSED | user.pause |
| GENERATING | ERROR | network.error |
| PAUSED | RESUMING | user.resume |
| RESUMING | GENERATING | - |
| RESUMING | ERROR | network.error |
| COMPLETE | IDLE | new.stream |
| ERROR | GENERATING | user.retry |
| PAUSED | IDLE | user.cancel |

---

## TOOL State Machine

```
┌─────────┐    ai.call    ┌─────────┐   running    ┌─────────┐
│ PENDING │──────────────→│ RUNNING │─────────────→│ COMPLETE│
└─────────┘               └─────────┘              └─────────┘
     │                         │                        │
     │ skip                    │ error                   │
     │ cancel                  ▼                        │
     ▼                   ┌─────────┐                    │
┌─────────┐             │  ERROR  │                    │
│ SKIPPED │             └────┬────┘                    │
└─────────┘                  │ retry                    │
     │                       ▼                          │
     │                  ┌─────────┐                    │
     └──────────────────│ RETRY   │────────────────────┘
                        └─────────┘
                              │
                              │ cancel
                              ▼
                        ┌──────────┐
                        │CANCELLED │
                        └──────────┘
```

**Valid Transitions:**

| From | To | Trigger |
|------|----|---------|
| PENDING | RUNNING | auto-start / user.approve |
| PENDING | SKIPPED | ai.skip |
| PENDING | CANCELLED | user.cancel |
| RUNNING | COMPLETE | tool.return |
| RUNNING | ERROR | tool.error |
| RUNNING | CANCELLED | user.cancel |
| ERROR | RETRY | user.retry |
| ERROR | CANCELLED | user.cancel |
| RETRY | RUNNING | - |
| RETRY | ERROR | tool.error |
| RETRY | CANCELLED | user.cancel |
| COMPLETE | PENDING | new.call |

---

## APPROVE State Machine

```
          ┌─────────┐   show     ┌─────────┐   approve   ┌─────────┐
          │ PENDING │───────────→│ SHOWING │────────────→│ APPROVED│
          └─────────┘            └─────────┘             └────┬────┘
               │                                                │
               │ expire                                          │ execute
               ▼                                                ▼
          ┌─────────┐                                    ┌──────────┐
          │ EXPIRED │                                    │ EXECUTING│
          └─────────┘                                    └────┬─────┘
               │                                                │
               │ deny                                           │ complete
               ▼                                                ▼
          ┌─────────┐                                    ┌─────────┐
          │ DENIED  │                                    │COMPLETE │
          └─────────┘                                    └─────────┘
```

**Valid Transitions:**

| From | To | Trigger |
|------|----|---------|
| PENDING | SHOWING | user.view |
| PENDING | EXPIRED | timeout |
| SHOWING | APPROVED | user.confirm |
| SHOWING | DENIED | user.deny |
| SHOWING | EXPIRED | timeout |
| EXPIRED | PENDING | new.request |
| DENIED | PENDING | new.request |
| APPROVED | EXECUTING | - |
| EXECUTING | COMPLETE | action.done |
| COMPLETE | PENDING | new.request |

---

# G-Lang Syntax

G-Lang is a declarative XML-based syntax for describing AI interactions.

## Design Goals

1. **AI-Generatable** — AI models can output valid G-Lang
2. **Human-Readable** — Developers can write and debug G-Lang
3. **Parseable** — Simple regex or XML parser can handle it
4. **Extensible** — Custom elements can be added
5. **Platform-Adaptable** — Same syntax renders everywhere

---

## Grammar (EBNF)

```ebnf
document     = { element } ;

element      = message | think | stream | tool | artifact | context 
             | approve | branch | state | error | input | action ;

message      = "<message"
                 [ "role=" ( "user" | "assistant" | "system" | "tool" ) ]
                 [ "stream=" ( "true" | "false" ) ]
                 [ "id=" string ]
                 ">" content "</message>" ;

think        = "<think"
                 [ "model=" string ]
                 [ "visible=" ( "true" | "false" ) ]
                 [ "depth=" ( "shallow" | "medium" | "deep" ) ]
                 ">" content "</think>" ;

stream       = "<stream"
                 [ "speed=" ( "fast" | "normal" | "slow" ) ]
                 [ "cursor=" ( "true" | "false" ) ]
                 [ "markdown=" ( "true" | "false" ) ]
                 ">" content "</stream>" ;

tool         = "<tool"
                 "name=" string
                 [ "args=" json ]
                 [ "status=" ( "pending" | "running" | "complete" | "error" ) ]
                 [ "mode=" ( "automatic" | "manual" ) ]
                 ">" { tool_content } "</tool>" ;

artifact     = "<artifact"
                 "type=" ( "code" | "image" | "chart" | "document" | "file" | "video" | "audio" )
                 [ "language=" string ]
                 [ "title=" string ]
                 [ "filename=" string ]
                 [ "downloadable=" ( "true" | "false" ) ]
                 [ "copyable=" ( "true" | "false" ) ]
                 [ "editable=" ( "true" | "false" ) ]
                 ">" content "</artifact>" ;

context      = "<context"
                 "type=" ( "file" | "url" | "memory" | "memory_chip" | "conversation" )
                 "id=" string
                 [ "name=" string ]
                 [ "preview=" string ]
                 [ "removable=" ( "true" | "false" ) ]
                 "/>" ;

approve      = "<approve"
                 "type=" ( "tool_call" | "action" | "delete" | "consent" )
                 "action=" string
                 [ "warning=" string ]
                 [ "timeout=" number ]
                 ">" { approval_option } "</approve>" ;

branch       = "<branch"
                 "id=" string
                 [ "label=" string ]
                 [ "active=" ( "true" | "false" ) ]
                 ">" { element } "</branch>" ;

state        = "<state"
                 "status=" ( "idle" | "loading" | "thinking" | "streaming" | "error" | "offline" )
                 [ "message=" string ]
                 [ "progress=" number ]
                 ">"

error        = "<error"
                 "code=" string
                 "message=" string
                 [ "recoverable=" ( "true" | "false" ) ]
                 ">" { action } "</error>" ;

input        = "<input"
                 "type=" ( "text" | "file" | "image" | "voice" | "multimodal" )
                 [ "placeholder=" string ]
                 [ "multiline=" ( "true" | "false" ) ]
                 [ "maxlength=" number ]
                 ">" { suggestion } "</input>" ;

suggestion   = "<suggestion>" content "</suggestion>" ;

action       = "<action"
                 "name=" string
                 [ "label=" string ]
                 [ "primary=" ( "true" | "false" ) ]
                 "/>" ;

content      = { text | element | CDATA } ;

string       = '"' { any_char - '"' } '"' ;

json         = '{' { key ':' value { ',' key ':' value } } '}' ;
```

---

## Examples

### Simple Chat Message

```grain
<message role="assistant" stream="true">
  <stream>Hello! How can I help you today?</stream>
</message>
```

### With Reasoning

```grain
<message role="assistant">
  <think model="chain-of-thought" visible="false">
    The user is asking for help. They seem to be new to this platform.
    I should provide a friendly introduction and offer specific help.
  </think>
  <stream>Hello! How can I help you today?</stream>
</message>
```

### Tool Call with Approval

```grain
<tool name="send_email" args='{"to": "user@example.com"}' status="pending" mode="manual">
  <input>To: user@example.com</input>
</tool>

<approve type="tool_call" action="Send email to user@example.com" warning="This will send an email to an external address">
  <option label="Cancel"></option>
  <option label="Send Email"></option>
</approve>
```

### Tool Result + Artifact

```grain
<tool name="get_weather" args='{"city": "Mumbai"}' status="complete">
  <result temperature="28" condition="sunny" humidity="65" />
</tool>

<artifact type="chart" title="7-Day Forecast">
  <stream>
    | Day       | Temp | Condition |
    |-----------|------|-----------|
    | Monday    | 28°  | Sunny   |
    | Tuesday   | 27°  | Cloudy  |
    | Wednesday | 26°  | Rain    |
  </stream>
</artifact>
```

### Complete Chat

```grain
<message role="user">
  What's the weather in Mumbai?
</message>

<state status="thinking" message="Thinking..." />

<message role="tool">
  <tool name="get_weather" args='{"city": "Mumbai"}' status="running" />
</message>

<message role="assistant">
  <tool name="get_weather" status="complete">
    <result temperature="28" condition="sunny" />
  </tool>
  <stream>The weather in Mumbai is currently 28°C and sunny.</stream>
  <context type="url" id="weather-mumbai" name="Mumbai Weather" />
</message>
```

### Branch / Alternative Response

```grain
<message role="assistant">
  <stream>Here are three ways to approach this problem:</stream>
</message>

<branch id="branch-1" label="Recursive Solution">
  <message role="assistant">
    <artifact type="code" language="javascript" title="recursive.js">
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
    </artifact>
  </message>
</branch>

<branch id="branch-2" label="Iterative Solution">
  <message role="assistant">
    <artifact type="code" language="javascript" title="iterative.js">
function factorial(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}
    </artifact>
  </message>
</branch>
```

### Error with Recovery

```grain
<error code="RATE_LIMIT" message="Too many requests. Please wait 30 seconds." recoverable="true">
  <action name="retry" label="Retry" />
  <action name="cancel" label="Cancel" />
</error>
```

### Input with Suggestions

```grain
<input type="text" placeholder="Ask me anything..." multiline="true">
  <suggestion>Explain quantum computing</suggestion>
  <suggestion>Write a Python script</suggestion>
  <suggestion>Summarize this article</suggestion>
</input>
```

---

# Platform Adapters

Each platform renders G-Lang according to its constraints.

## Web Adapter

Renders G-Lang to semantic HTML with CSS classes.

### Output

```html
<ai-message role="assistant" streaming>
  <ai-stream speed="normal" cursor="true">Hello!</ai-stream>
</ai-message>
```

### CSS Variables

```css
:root {
  /* Colors */
  --ai-primary: #000000;
  --ai-secondary: #666666;
  --ai-background: #ffffff;
  --ai-surface: #f5f5f5;
  --ai-border: #e0e0e0;
  --ai-error: #dc3545;
  --ai-success: #28a745;
  --ai-warning: #ffc107;
  
  /* Spacing */
  --ai-space-xs: 4px;
  --ai-space-sm: 8px;
  --ai-space-md: 16px;
  --ai-space-lg: 24px;
  --ai-space-xl: 32px;
  
  /* Typography */
  --ai-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --ai-font-mono: 'SF Mono', Monaco, Consolas, monospace;
  
  /* Animation */
  --ai-duration-fast: 150ms;
  --ai-duration-normal: 300ms;
  --ai-ease: ease;
}
```

---

## CLI Adapter

Renders G-Lang to terminal output.

### Example Output

```
┌─ AI ───────────────────────────────────────────┐
│ ○ Thinking...                                  │
├────────────────────────────────────────────────┤
│ The current weather in Mumbai is:             │
│                                                │
│   28°C  Sunny                                 │
│   Humidity: 65%                               │
│                                                │
├────────────────────────────────────────────────┤
│ [Copy] [Regenerate] [Ask Follow-up]            │
└────────────────────────────────────────────────┘
```

### Rendering Rules

| Primitive | Rendering |
|-----------|-----------|
| stream | Typewriter effect |
| think | Hidden by default, prefix when visible |
| tool | Box with status icon |
| artifact | Code blocks with syntax |
| error | Red text with icon |
| approve | checkboxes |
| state | Spinner or dots |

---

## Chat Adapter

Renders G-Lang to messaging platforms.

### Platform Mapping

| Platform | STREAM | TOOL | ARTIFACT | APPROVE |
|----------|--------|------|----------|---------|
| WhatsApp | Text | Buttons | Media cards | Interactive buttons |
| Telegram | Text | Inline keyboard | Photo/Video | Callback buttons |
| Slack | Text | Block Kit | Attachments | Modal dialogs |
| Discord | Text | Embeds | Rich embeds | Button interactions |

---

## MCP Adapter

Tools return G-Lang in JSON format.

### Tool Response

```json
{
  "semantic": "tool",
  "name": "get_weather",
  "input": { "city": "Mumbai" },
  "status": "complete",
  "result": {
    "temperature": 28,
    "condition": "sunny"
  }
}
```

---

## Agent Adapter

For agent-to-agent communication.

### Message Format

```json
{
  "semantic": "agent_message",
  "from": "research_agent",
  "to": "coordinator",
  "type": "task_complete",
  "task_id": "task-456",
  "result": {
    "semantic": "artifact",
    "type": "document",
    "title": "Research Summary",
    "content": "..."
  },
  "metadata": {
    "duration_ms": 45000,
    "tokens_used": 12000
  }
}
```

---

## Voice Adapter

For phone/voice AI interactions.

### Rendering Rules

| Primitive | Voice Rendering |
|-----------|-----------------|
| stream | Spoken aloud |
| think | Not spoken (internal) |
| tool | "I'm checking that now..." |
| artifact | Summarized or skipped |
| approve | "Do you want to proceed?" |
| error | "I'm sorry, I encountered an error" |

---

# Extension System

AI Semantics is designed to be extended.

## Custom Primitives

Extensions can define new primitives:

```javascript
// my-extension.js
export const customAnalytics = {
  name: 'custom-analytics',
  version: '1.0.0',
  
  primitives: {
    'analytics-dashboard': {
      schema: {
        metrics: { type: 'array', required: true },
        timeframe: { type: 'string' },
        comparison: { type: 'boolean' }
      },
      states: ['loading', 'ready', 'error'],
      events: ['load', 'refresh', 'export']
    }
  }
};
```

## Loading Extensions

```javascript
import { registerExtension } from '@ai-semantics/core';
import customAnalytics from './my-extension';

registerExtension(customAnalytics);
```

---

# Changelog

## 1.0.0-alpha (2026-02-26)

- Initial alpha release
- 10 universal primitives defined
- G-Lang syntax specified
- Platform adapters outlined
- Extension system designed
