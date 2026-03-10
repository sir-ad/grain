---
title: G-Lang Grammar | Structural Rules
description: Reference the structural rules for valid Grain documents, including core primitives, companion elements, and the boundaries enforced by the parser.
---
# G-Lang Grammar

Complete EBNF specification.

---

## Document

```txt
document     = { element } ;
```

---

## Elements

```txt
element      = message | think | stream | tool | artifact | context 
             | approve | branch | state | error | input | action ;
```

---

## Message

```txt
message      = "<message"
                 [ "role=" ( "user" | "assistant" | "system" | "tool" ) ]
                 [ "stream=" ( "true" | "false" ) ]
                 [ "id=" string ]
                 ">" content "</message>" ;
```

---

## Stream

```txt
stream       = "<stream"
                 [ "speed=" ( "fast" | "normal" | "slow" ) ]
                 [ "cursor=" ( "true" | "false" ) ]
                 [ "markdown=" ( "true" | "false" ) ]
                 ">" content "</stream>" ;
```

---

## Think

```txt
think        = "<think"
                 [ "model=" string ]
                 [ "visible=" ( "true" | "false" ) ]
                 [ "depth=" ( "shallow" | "medium" | "deep" ) ]
                 ">" content "</think>" ;
```

---

## Tool

```txt
tool         = "<tool"
                 "name=" string
                 [ "args=" json ]
                 [ "status=" ( "pending" | "running" | "complete" | "error" ) ]
                 [ "mode=" ( "automatic" | "manual" ) ]
                 ">" { tool_content } "</tool>" ;

tool_content = input | result | progress | error ;
```

---

## Artifact

```txt
artifact     = "<artifact"
                 "type=" ( "code" | "image" | "chart" | "document" | "file" | "video" | "audio" )
                 [ "language=" string ]
                 [ "title=" string ]
                 [ "filename=" string ]
                 [ "downloadable=" ( "true" | "false" ) ]
                 [ "copyable=" ( "true" | "false" ) ]
                 ">" content "</artifact>" ;
```

---

## Context

```txt
context      = "<context"
                 "type=" ( "file" | "url" | "memory" | "memory_chip" | "conversation" )
                 "id=" string
                 [ "name=" string ]
                 [ "preview=" string ]
                 [ "removable=" ( "true" | "false" ) ]
                 "/>" ;
```

---

## Approve

```txt
approve      = "<approve"
                 "type=" ( "tool_call" | "action" | "delete" | "consent" )
                 "action=" string
                 [ "warning=" string ]
                 [ "timeout=" number ]
                 ">" { option } "</approve>" ;

option       = "<option" "label=" string ">" "</option>" ;
```

---

## Branch

```txt
branch       = "<branch"
                 "id=" string
                 [ "label=" string ]
                 [ "active=" ( "true" | "false" ) ]
                 ">" { element } "</branch>" ;
```

---

## State

```txt
state        = "<state"
                 "status=" ( "idle" | "loading" | "thinking" | "streaming" | "error" | "offline" )
                 [ "message=" string ]
                 [ "progress=" number ]
                 ">" ;
```

---

## Error

```txt
error        = "<error"
                 "code=" string
                 "message=" string
                 [ "recoverable=" ( "true" | "false" ) ]
                 ">" { action } "</error>" ;
```

---

## Input

```txt
input        = "<input"
                 "type=" ( "text" | "file" | "image" | "voice" | "multimodal" )
                 [ "placeholder=" string ]
                 [ "multiline=" ( "true" | "false" ) ]
                 ">" { suggestion } "</input>" ;

suggestion   = "<suggestion>" content "</suggestion>" ;
```

---

## Action

```txt
action       = "<action"
                 "name=" string
                 [ "label=" string ]
                 [ "primary=" ( "true" | "false" ) ]
                 "/>" ;
```

---

## Data Types

```txt
string       = '"' { any_char - '"' } '"' ;

json         = '{' { key ':' value { ',' key ':' value } } '}' ;

number       = { digit } ;

comment      = '<!--' { any_char } '-->' ;
```
