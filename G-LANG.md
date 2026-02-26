# G-Lang — AI Semantics Language

> The declarative syntax for AI interactions.

## Overview

G-Lang is an XML-based declarative language designed for:
1. AI models to output valid, renderable AI interactions
2. Developers to write and debug AI interfaces
3. Any platform to parse and render consistently

## Design Principles

1. **AI-Generatable** — Simple enough for AI to output correctly
2. **Human-Readable** — Developers can read and write it
3. **Parseable** — No complex parsing required
4. **Extensible** — Custom elements allowed
5. **State-Inclusive** — States and events embedded

---

## Quick Examples

### Hello World
```grain
<message role="assistant">
  <stream>Hello!</stream>
</message>
```

### With Tool Call
```grain
<tool name="search" args='{"q": "weather"}' status="running" />
<tool name="search" status="complete">
  <result>Sunny, 28°C</result>
</tool>
```

### With Approval
```grain
<approve type="tool_call" action="Send email">
  <warning>This will send an email to user@example.com</warning>
</approve>
```

---

## Element Reference

### `<message>`

A conversation message.

**Attributes:**
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `role` | `user` \| `assistant` \| `system` \| `tool` | `assistant` | Message sender |
| `stream` | `true` \| `false` | `false` | Stream the message |
| `id` | string | auto | Unique message ID |

**Content:** Any primitives (stream, think, tool, artifact, etc.)

**Example:**
```grain
<message role="assistant" id="msg-123">
  <think model="chain-of-thought" visible="false">
    The user is asking about weather in Mumbai.
  </think>
  <stream>The weather in Mumbai is sunny, 28°C.</stream>
  <artifact type="image" title="Weather Icon">
    [image data]
  </artifact>
</message>
```

---

### `<think>`

AI reasoning or chain-of-thought.

**Attributes:**
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `model` | string | `chain-of-thought` | Reasoning model |
| `visible` | `true` \| `false` | `false` | Default visibility |
| `depth` | `shallow` \| `medium` \| `deep` | `medium` | Reasoning depth |

**Content:** Plain text

**Example:**
```grain
<think model="tree-of-thought" visible="true" depth="deep">
  Let me consider multiple approaches:
  1. Recursive solution - O(n) space
  2. Iterative solution - O(1) space
  3. Divide and conquer - O(n log n)
  
  I'll recommend option 2 for efficiency.
</think>
```

---

### `<stream>`

Streaming text content.

**Attributes:**
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `speed` | `fast` \| `normal` \| `slow` | `normal` | Streaming speed |
| `cursor` | `true` \| `false` | `true` | Show cursor |
| `markdown` | `true` \| `false` | `false` | Parse markdown |

**Content:** Text content (may include markdown if markdown=true)

**Example:**
```grain
<stream speed="fast" cursor="true" markdown="true">
# Hello World

This is **bold** and *italic*.

```javascript
console.log('Hello');
```
</stream>
```

---

### `<tool>`

A tool/function call.

**Attributes:**
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string | required | Tool name |
| `args` | JSON | `{}` | Tool arguments |
| `status` | `pending` \| `running` \| `complete` \| `error` | `pending` | Tool status |
| `mode` | `automatic` \| `manual` | `automatic` | Execution mode |
| `timeout` | number | 30000 | Timeout in ms |

**Content:** `<input>`, `<result>`, `<progress>`, `<error>` elements

**Example:**
```grain
<tool name="get_weather" args='{"city": "Mumbai"}' status="running">
  <input>City: Mumbai</input>
  <progress>Fetching weather data...</progress>
</tool>

<tool name="get_weather" status="complete">
  <result temperature="28" condition="sunny" humidity="65" />
</tool>

<tool name="get_weather" status="error">
  <error code="API_ERROR" message="Failed to fetch weather data" />
</tool>
```

---

### `<artifact>`

Structured content display.

**Attributes:**
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `type` | string | required | `code`, `image`, `chart`, `document`, `file`, `video`, `audio` |
| `language` | string | - | For code: language |
| `title` | string | - | Display title |
| `filename` | string | - | For downloadable files |
| `downloadable` | `true` \| `false` | `false` | Allow download |
| `copyable` | `true` \| `false` | `false` | Allow copy |
| `editable` | `true` \| `false` | `false` | Allow editing |
| `runnable` | `true` \| `false` | `false` | Allow execution |

**Content:** Text or nested stream

**Example:**
```grain
<artifact type="code" language="javascript" title="hello.js" 
         copyable="true" downloadable="true">
function hello() {
  console.log('Hello, World!');
}
</artifact>

<artifact type="image" title="Generated Image">
  [base64 image data]
</artifact>

<artifact type="chart" title="Sales Chart">
  [chart data]
</artifact>
```

---

### `<context>`

Context attachment (files, URLs, memory).

**Attributes:**
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `type` | string | required | `file`, `url`, `memory`, `memory_chip`, `conversation` |
| `id` | string | required | Unique identifier |
| `name` | string | - | Display name |
| `preview` | string | - | Preview text |
| `size` | number | - | File size |
| `mimeType` | string | - | MIME type |
| `removable` | `true` \| `false` | `true` | Allow removal |

**Self-closing element.**

**Example:**
```grain
<context type="file" id="doc-123" name="spec.pdf" 
         size="1024000" mimeType="application/pdf" />

<context type="url" id="url-456" name="Wikipedia"
         preview="Free encyclopedia..." />

<context type="memory_chip" id="mem-789" name="Project Context">
  User is building an AI interface library
</context>
```

---

### `<approve>`

Human-in-the-loop approval.

**Attributes:**
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `type` | string | required | `tool_call`, `action`, `delete`, `consent` |
| `action` | string | required | What needs approval |
| `warning` | string | - | Warning message |
| `timeout` | number | 60000 | Auto-expire timeout |
| `auto` | `true` \| `false` | `false` | Auto-approve |

**Content:** `<option>` elements

**Example:**
```grain
<approve type="tool_call" action="Send email to user@example.com" 
         warning="This will send an email to an external address">
  <option label="Cancel"></option>
  <option label="Send Email"></option>
</approve>

<approve type="delete" action="Delete file: config.yaml"
         warning="This action cannot be undone">
  <option label="Keep File"></option>
  <option label="Delete Forever"></option>
</approve>
```

---

### `<branch>`

Conversation branch/fork.

**Attributes:**
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `id` | string | required | Branch ID |
| `label` | string | - | Branch label |
| `active` | `true` \| `false` | `false` | Is active branch |
| `mergeable` | `true` \| `false` | `false` | Can merge |
| `parent` | string | - | Parent branch ID |

**Content:** Any primitives

**Example:**
```grain
<branch id="alt-1" label="Alternative: Recursive Approach" active="true">
  <message role="assistant">
    <artifact type="code" language="javascript">
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
    </artifact>
  </message>
</branch>
```

---

### `<state>`

Global AI state indicator.

**Attributes:**
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `status` | string | required | `idle`, `loading`, `thinking`, `streaming`, `error`, `offline` |
| `message` | string | - | Status message |
| `progress` | number | - | 0-100 progress |
| `eta` | number | - | Estimated seconds |
| `animated` | `true` \| `false` | `true` | Show animation |

**Example:**
```grain
<state status="thinking" message="Analyzing your request..." />

<state status="streaming" progress="65" eta="30" />

<state status="error" message="Connection lost" />
```

---

### `<error>`

Error display with recovery.

**Attributes:**
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `code` | string | required | Error code |
| `message` | string | required | Human message |
| `recoverable` | `true` \| `false` | `false` | Can recover |

**Content:** `<action>` elements

**Example:**
```grain
<error code="RATE_LIMIT" message="Too many requests. Please wait 30 seconds." 
       recoverable="true">
  <action name="retry" label="Retry Now" />
  <action name="cancel" label="Cancel" />
</error>

<error code="AUTH_FAILED" message="Authentication required" recoverable="false">
  <action name="login" label="Log In" />
</error>
```

---

### `<input>`

User input field.

**Attributes:**
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `type` | string | required | `text`, `file`, `image`, `voice`, `multimodal` |
| `placeholder` | string | - | Placeholder text |
| `autofocus` | `true` \| `false` | `false` | Auto-focus |
| `maxlength` | number | - | Character limit |
| `multiline` | `true` \| `false` | `false` | Multi-line |
| `attachments` | `true` \| `false` | `false` | Allow attachments |
| `voice` | `true` \| `false` | `false` | Enable voice |

**Content:** `<suggestion>` elements

**Example:**
```grain
<input type="text" placeholder="Ask me anything..." 
       multiline="true" attachments="true">
  <suggestion>Explain quantum computing</suggestion>
  <suggestion>Write a Python script</suggestion>
</input>
```

---

### `<action>`

Interactive action button.

**Attributes:**
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string | required | Action identifier |
| `label` | string | - | Button label |
| `primary` | `true` \| `false` | `false` | Primary action |

**Self-closing element.**

**Example:**
```grain
<action name="copy" label="Copy" />
<action name="regenerate" label="Regenerate" primary="true" />
<action name="dismiss" label="Dismiss" />
```

---

### Nested Elements

#### `<input>` inside `<tool>`
```grain
<tool name="send_email" status="pending">
  <input>To: user@example.com</input>
  <input>Subject: Hello</input>
</tool>
```

#### `<result>` inside `<tool>`
```grain
<tool name="search" status="complete">
  <result found="42">
    <item id="1">Result 1</item>
    <item id="2">Result 2</item>
  </result>
</tool>
```

#### `<progress>` inside `<tool>`
```grain
<tool name="download" status="running">
  <progress value="45" max="100">45% complete</progress>
</tool>
```

---

# Grammar (Complete EBNF)

```ebnf
document     = { element | whitespace | comment } ;

element      = message 
             | think 
             | stream 
             | tool 
             | artifact 
             | context 
             | approve 
             | branch 
             | state 
             | error 
             | input 
             | action 
             | custom_element ;

message      = "<message"
                 [ ws "role=" ( "user" | "assistant" | "system" | "tool" ) ]
                 [ ws "stream=" ( "true" | "false" ) ]
                 [ ws "id=" string ]
                 ">" content "</message>" ;

think        = "<think"
                 [ ws "model=" string ]
                 [ ws "visible=" ( "true" | "false" ) ]
                 [ ws "depth=" ( "shallow" | "medium" | "deep" ) ]
                 ">" content "</think>" ;

stream       = "<stream"
                 [ ws "speed=" ( "fast" | "normal" | "slow" ) ]
                 [ ws "cursor=" ( "true" | "false" ) ]
                 [ ws "markdown=" ( "true" | "false" ) ]
                 ">" content "</stream>" ;

tool         = "<tool"
                 ws "name=" string
                 [ ws "args=" json ]
                 [ ws "status=" ( "pending" | "running" | "complete" | "error" ) ]
                 [ ws "mode=" ( "automatic" | "manual" ) ]
                 [ ws "timeout=" number ]
                 ">" { tool_content } "</tool>" ;

tool_content  = input | result | progress | error ;

input        = "<input>" content "</input>" ;

result       = "<result"
                 [ ws json_content ]
                 ">" [ { item } ] "</result>" ;

item         = "<item" [ ws "id=" string ] ">" content "</item>" ;

progress     = "<progress"
                 [ ws "value=" number ]
                 [ ws "max=" number ]
                 ">" content "</progress>" ;

artifact     = "<artifact"
                 ws "type=" ( "code" | "image" | "chart" | "document" | "file" | "video" | "audio" )
                 [ ws "language=" string ]
                 [ ws "title=" string ]
                 [ ws "filename=" string ]
                 [ ws "downloadable=" ( "true" | "false" ) ]
                 [ ws "copyable=" ( "true" | "false" ) ]
                 [ ws "editable=" ( "true" | "false" ) ]
                 [ ws "runnable=" ( "true" | "false" ) ]
                 ">" content "</artifact>" ;

context      = "<context"
                 ws "type=" ( "file" | "url" | "memory" | "memory_chip" | "conversation" )
                 ws "id=" string
                 [ ws "name=" string ]
                 [ ws "preview=" string ]
                 [ ws "size=" number ]
                 [ ws "mimeType=" string ]
                 [ ws "removable=" ( "true" | "false" ) ]
                 "/>" ;

approve      = "<approve"
                 ws "type=" ( "tool_call" | "action" | "delete" | "consent" )
                 ws "action=" string
                 [ ws "warning=" string ]
                 [ ws "timeout=" number ]
                 [ ws "auto=" ( "true" | "false" ) ]
                 ">" { option } "</approve>" ;

option       = "<option"
                 ws "label=" string
                 [ ws "primary=" ( "true" | "false" ) ]
                 ">" "</option>" ;

branch       = "<branch"
                 ws "id=" string
                 [ ws "label=" string ]
                 [ ws "active=" ( "true" | "false" ) ]
                 [ ws "mergeable=" ( "true" | "false" ) ]
                 [ ws "parent=" string ]
                 ">" { element } "</branch>" ;

state        = "<state"
                 ws "status=" ( "idle" | "loading" | "thinking" | "streaming" | "error" | "offline" )
                 [ ws "message=" string ]
                 [ ws "progress=" number ]
                 [ ws "eta=" number ]
                 [ ws "animated=" ( "true" | "false" ) ]
                 ">" "</state>" ;

error        = "<error"
                 ws "code=" string
                 ws "message=" string
                 [ ws "recoverable=" ( "true" | "false" ) ]
                 ">" { action } "</error>" ;

input        = "<input"
                 ws "type=" ( "text" | "file" | "image" | "voice" | "multimodal" )
                 [ ws "placeholder=" string ]
                 [ ws "autofocus=" ( "true" | "false" ) ]
                 [ ws "maxlength=" number ]
                 [ ws "multiline=" ( "true" | "false" ) ]
                 [ ws "attachments=" ( "true" | "false" ) ]
                 [ ws "voice=" ( "true" | "false" ) ]
                 ">" { suggestion } "</input>" ;

suggestion   = "<suggestion>" content "</suggestion>" ;

action       = "<action"
                 ws "name=" string
                 [ ws "label=" string ]
                 [ ws "primary=" ( "true" | "false" ) ]
                 "/>" ;

custom_element = "<" name { ws attribute } [ "/" | ">" content "</" name ] ;

content      = { text | whitespace } ;

text         = { any_char - "<" - ">" } ;

string       = '"' { any_char - '"' } '"' ;

json         = "{" [ ws { key ":" ws value { "," ws key ":" ws value } } ] "}" ;

json_content = ws { key ":" ws value { "," ws key ":" ws value } } ;

key          = string ;

value        = string | number | "true" | "false" | "null" | json ;

number       = [ "-" ] { digit } [ "." { digit } ] ;

whitespace   = { " " | "\t" | "\n" | "\r" } ;

comment      = "<!--" { any_char } "-->" ;

name         = letter { letter | digit | "-" | "_" } ;

attribute    = name "=" ( string | number ) ;

letter       = "A".."Z" | "a".."z" ;

digit        = "0".."9" ;

any_char     = ? all characters ? ;
```

---

# Parsing Guidelines

## Simple Regex Parser (For Basic Usage)

```javascript
function parseGrain(grainString) {
  // Extract messages
  const messageRegex = /<message[^>]*>([\s\S]*?)<\/message>/g;
  const messages = [];
  let match;
  
  while ((match = messageRegex.exec(grainString)) !== null) {
    messages.push({
      type: 'message',
      content: match[1].trim(),
      attrs: parseAttributes(match[0])
    });
  }
  
  return messages;
}

function parseAttributes(element) {
  const attrs = {};
  const regex = /(\w+)="([^"]*)"/g;
  let match;
  while ((match = regex.exec(element)) !== null) {
    attrs[match[1]] = match[2];
  }
  return attrs;
}
```

## XML Parser (For Full Compliance)

Use any standard XML parser:

```javascript
import { DOMParser } from 'xmldom';

const parser = new DOMParser();
const doc = parser.parseFromString(grainString, 'text/xml');

// Get all messages
const messages = doc.getElementsByTagName('message');
for (const msg of messages) {
  console.log({
    role: msg.getAttribute('role'),
    stream: msg.getAttribute('stream'),
    content: msg.textContent
  });
}
```

---

# Best Practices

## 1. Always Close Tags
```grain
<!-- Good -->
<message role="assistant">
  <stream>Hello</stream>
</message>

<!-- Bad -->
<message role="assistant">
  <stream>Hello
</message>
```

## 2. Quote Attributes
```grain
<!-- Good -->
<tool name="search" status="running" />

<!-- Bad -->
<tool name=search status=running />
```

## 3. Use Self-Closing for Empty Content
```grain
<!-- Good -->
<context type="file" id="123" name="doc.pdf" />

<!-- Avoid -->
<context type="file" id="123" name="doc.pdf"></context>
```

## 4. Escape Special Characters
```grain
<!-- For literal < or > in content -->
<stream>&lt;script&gt;alert('xss')&lt;/script&gt;</stream>
```

---

# Version

This specification is versioned: **1.0.0**
