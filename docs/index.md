---
layout: home
title: Grain Docs | AI Interface Layer
description: Learn Grain, the spec-first interaction layer for AI interfaces, with guides for web, CLI, MCP, agent runtimes, and production deployment.

hero:
  name: Grain
  text: Universal interaction layer for AI interfaces
  tagline: Standard vocabulary for every surface where AI meets humans — or AI meets AI.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/sir-ad/grain

features:
  - title: 10 Core Primitives
    details: Core interaction types with companion elements for results, warnings, actions, and progress.
    icon: ⚛️
  - title: G-Lang
    details: Declarative syntax AI can output, any frontend can render.
    icon: 📝
  - title: Multi-Platform
    details: Web, CLI, MCP, agents — same spec.
    icon: 🌐
  - title: State Machines
    details: Explicit states for consistent UX.
    icon: 🔄
  - title: Zero Dependencies
    details: ~15KB total. No frameworks.
    icon: 🪶
  - title: Extensible
    details: Add custom primitives. Enterprise theming.
    icon: 🧩
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: linear-gradient(120deg, #2155ff 18%, #42a7ea 82%);
}
.vp-doc h1 {
  font-weight: 700 !important;
  letter-spacing: -0.02em;
}
</style>

## Why Grain

Grain gives AI producers and interface surfaces one shared contract. A model, orchestration layer, or tool runner can emit Grain once, and adapters can render the same document consistently in the browser, terminal, MCP surface, or agent runtime.

The documentation site is treated as part of the product contract. If an example on this site stops parsing or rendering, that is a repo bug rather than a low-priority docs mismatch.

## What This Site Covers

- The Grain language contract and core primitives.
- Reference APIs for the runtime packages and adapters.
- Production-oriented notes for npm delivery, GitHub Pages deployment, and local preview.

## Local Preview

Use the canonical preview command from the repository root:

```bash
pnpm docs:preview
```

The docs site is deployed as a GitHub Pages project site under `/grain/`, so the correct local preview URL is `http://127.0.0.1:<port>/grain/`. Opening `/` is expected to return `404`.
