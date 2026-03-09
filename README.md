# Grain

[![NPM Version](https://img.shields.io/npm/v/@grain.sh/core?color=000&labelColor=333&style=flat-square)](https://www.npmjs.com/package/@grain.sh/core)
[![Build Status](https://img.shields.io/github/actions/workflow/status/sir-ad/grain/deploy.yml?branch=main&style=flat-square)](https://github.com/sir-ad/grain/actions)
[![License](https://img.shields.io/github/license/sir-ad/grain?style=flat-square)](https://github.com/sir-ad/grain/blob/main/LICENSE)
[![AI / LLMs](https://img.shields.io/badge/AI%20%2F%20LLMs-Compatible-000000?style=flat-square&logo=openai&logoColor=white)](https://github.com/sir-ad/grain)
[![Agentic](https://img.shields.io/badge/Agentic-Native-000000?style=flat-square&logo=robot&logoColor=white)](https://github.com/sir-ad/grain)
[![Model Context Protocol](https://img.shields.io/badge/MCP-Ready-000000?style=flat-square)](https://github.com/sir-ad/grain)

**The Universal Interaction Layer for AI Interfaces.**

The standard vocabulary for every surface where AI meets humans — or AI meets AI.

---

### The Problem

Every AI tool rebuilds the same wheel: chat UI, streaming text, tool calls, artifact rendering, and human-in-the-loop approvals. Every AI model outputs different JSON formats. Every agent framework uses proprietary message envelopes.

### The Solution

**Grain** makes it standard. If AI models output Grain Language — and every platform knows how to render Grain Language — the interface problem disappears. 

It is the **HTML for AI.**

### Features

- **Pico Sized:** ~15KB core. Zero dependencies.
- **Universal Primitives:** 15+ atomic types including `<stream>`, `<tool>`, `<artifact>`, `<approve>`, `<think>`, `<form>`, `<chart>`, `<table>`, `<layout>`, and `<memory>`.
- **Platform Agnostic:** The exact same Grain Language syntax renders perfectly on Web, CLI, MCP (Model Context Protocol), and between Autonomous Agents.
- **Agent-to-Agent Protocol:** Standardized handoffs and state persistence between multi-agent swarms using Grain Context chunks.
- **Developer First:** Built for ease of use. Grab what you need and own your code.

---

*Unified documentation site is now available at https://sir-ad.github.io/grain/ (under the `/grain/` base path).*

### Quick Start (Web & React)

Create a fully configured Grain application instantly:

```bash
npx create-grain-app@latest my-ai-app
```

### Quick Install (CLI & Core)

Use the core parser locally and install the distributables that expose runtime binaries:

```bash
npm install @grain.sh/core @grain.sh/web
npm install -g @grain.sh/cli
npm install -g grain-mcp
```

Or use the bootstrap script:
```bash
curl -fsSL https://cdn.jsdelivr.net/gh/sir-ad/grain@main/install.sh | sh
```

### Philosophy

Semantic markup. No arbitrary classes. Drop in. Works. Standards, not frameworks.

```grain
<message role="assistant">
  <think model="chain-of-thought" visible="false">
    User asks about weather. Call weather tool.
  </think>
  <stream speed="fast">Checking weather for you...</stream>
  <tool name="get_weather" args='{"city": "Mumbai"}' status="running" />
</message>
```

### Architecture: The Meridian Protocol

Grain operates on the **Meridian Layer**, a standardized interaction plane between diverse AI models and heterogenous interfaces.

```mermaid
graph TD
    subgraph "Interface Layer (Subscribers)"
        Web["@grain.sh/web (DOM)"]
        React["@grain.sh/react"]
        CLI["@grain.sh/cli (ANSI)"]
        Native["Native Mobile"]
    end

    subgraph "The Meridian Engine"
        Core["Grain Core (Parser/AST)"]
        State["State Machine"]
        Stream["Stream Chunking"]
    end

    subgraph "Producer Layer (Model Output)"
        LLM["Large Language Models"]
        MultiAgent["Agent Swarms"]
        MCP["Model Context Protocol"]
    end

    LLM -->|Grain Language| Core
    MultiAgent -->|Grain Language| Core
    MCP -->|Grain Language| Core

    Core --> State
    State --> Stream
    
    Stream --> Web
    Stream --> React
    Stream --> CLI
    Stream --> Native

    style Core fill:#f9f,stroke:#333,stroke-width:4px
    style Web fill:#bbf,stroke:#333,stroke-width:2px
    style CLI fill:#bbf,stroke:#333,stroke-width:2px
```

### What is Grain? The Full AI & Agent Ecosystem

Grain is not just a markup language; it is the **universal interaction layer** for the modern AI stack.

```mermaid
graph TD
    classDef human fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000
    classDef agent fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px,color:#000
    classDef tool fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000
    classDef grain fill:#fff3e0,stroke:#ff9800,stroke-width:4px,color:#000

    User(("👤 Human User")):::human
    
    subgraph "Application Interface (Frontend)"
        ChatUI["React / Web UI (#64;grain.sh/web)"]:::human
        CLI["Terminal CLI (#64;grain.sh/cli)"]:::human
    end

    subgraph "The Grain Interaction Layer"
        GrainDoc{{"📝 Grain Context Document"}}:::grain
    end

    subgraph "Autonomous Ecosystem"
        ChiefAgent["🧠 Chief Orchestrator Agent"]:::agent
        Researcher["🔍 Research Sub-Agent"]:::agent
        Coder["💻 Coder Sub-Agent"]:::agent
        
        Tool1["🔧 Web Search Tool"]:::tool
        Tool2["📂 File System Tool"]:::tool
    end

    User <-->|Types/Clicks| ChatUI
    User <-->|Commands| CLI
    
    ChatUI <-->|Renders & Submits <form>, <approve>| GrainDoc
    CLI <-->|Renders & Submits| GrainDoc
    
    GrainDoc <-->|Parses & Appends <message>, <think>| ChiefAgent
    
    ChiefAgent <-->|Delegates via <agent> tags| Researcher
    ChiefAgent <-->|Delegates via <agent> tags| Coder
    
    Researcher <-->|Executes <tool> tags| Tool1
    Coder <-->|Executes <tool> tags| Tool2

    Tool1 -.->|Returns <artifact>| GrainDoc
    Tool2 -.->|Returns <artifact>| GrainDoc
```

### The MCP & Agent Interaction Layer

How does Grain connect Model Context Protocol (MCP) servers and Autonomous Agents seamlessly in runtime?

```mermaid
sequenceDiagram
    participant User as 👤 Human
    participant UI as 💻 @grain.sh/web
    participant Agent as 🤖 Autonomous Agent
    participant MCP as 🔌 MCP Server

    User->>UI: "Research quantum computing"
    UI->>Agent: <message role="user">Research...</message>
    
    Note over Agent: Agent decides to use an MCP Tool
    Agent-->>UI: <stream>Connecting to knowledgebase...</stream>
    Agent->>MCP: <tool name="mcp_search" args='{"q": "quantum"}'/>
    
    Note over MCP: MCP executes search
    MCP-->>Agent: <artifact type="research_data">...</artifact>
    
    Note over Agent: Agent analyzes the artifact
    Agent-->>UI: <think>Found 5 papers. Summarizing...</think>
    Agent-->>UI: <stream>Here is the summary...</stream>
    
    Note over Agent: Agent needs explicit permission
    Agent-->>UI: <approve action="save_to_db">Save results?</approve>
    
    User->>UI: Clicks [Approve]
    UI->>Agent: <approve type="tool_call" action="save_to_db" status="approved" />
```

### Packages Architecture

| Package | Purpose |
|---|---|
| `@grain.sh/core` | Core parser, chunk-streaming engine, state machines |
| `@grain.sh/react` | Official React hooks & wrappers |
| `@grain.sh/web` | Native Custom HTML Web Components |
| `@grain.sh/cli` | Terminal adapter with the `grain` executable |
| `@grain.sh/mcp` | Model Context Protocol adapter |
| `grain-mcp` | Stdio MCP server for Grain tooling |
| `@grain.sh/agent` | Agent-to-agent communication envelope |

### Documentation

- [Introduction & Quick Start](QUICK-START.md)
- [The Grain Language Spec](SPEC.md)
- [Grain Language Syntax Reference](GRAIN-LANGUAGE.md)
- [System Architecture](ARCHITECTURE.md)

---

MIT License. https://github.com/sir-ad/grain
