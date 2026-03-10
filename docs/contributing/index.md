---
title: Contributing to Grain | Setup, Validation, and PR Expectations
description: Learn how to contribute to Grain with the current repo workflow, validation commands, docs preview flow, and pull request expectations.
---

# Contributing to Grain

Grain treats code, docs, and examples as one product surface. If you change the parser, adapters, packages, or docs, keep the public contract aligned in the same pull request.

## Prerequisites

- Node.js 18 or newer
- pnpm 8 or newer
- Git

## Local Setup

```bash
git clone https://github.com/sir-ad/grain.git
cd grain
pnpm install
pnpm check
```

`pnpm check` is the repo-wide validation entry point. It runs lint, builds, and tests across the workspace.

## Docs Workflow

The documentation site is part of the release surface and should be verified when docs, examples, or public behavior change.

```bash
pnpm docs:build
pnpm docs:preview
pnpm docs:preview:smoke
```

Important preview detail:

- the live site is deployed under the `/grain/` base path
- the local preview URL is `http://127.0.0.1:<port>/grain/`
- opening `/` is expected to return `404`

## Project Structure

```text
grain/
├── packages/
│   ├── core/        # parser, validator, state machines
│   ├── web/         # browser adapter and custom elements
│   ├── cli/         # grain executable and terminal renderer
│   ├── mcp/         # adapter library for MCP payloads
│   ├── mcp-server/  # stdio MCP server package
│   ├── react/       # React wrapper surface
│   └── agent/       # agent-oriented communication helpers
├── docs/            # VitePress documentation site
├── scripts/         # repo tooling and docs helpers
└── .github/workflows/
```

## Change Expectations

- keep public docs and package behavior aligned
- add or update tests when a runtime contract changes
- prefer small, reviewable commits over mixed concern patches
- use conventional commit messages when practical

## Pull Request Checklist

- `pnpm check` passes locally
- `pnpm docs:build` passes if docs or examples changed
- `pnpm docs:preview:smoke` passes if the website or theme changed
- package READMEs and docs examples stay accurate
- release notes or changelog entries are updated when behavior changes materially

## Reporting and Review

- open issues for bugs, docs mismatches, packaging problems, or feature requests
- include the affected package, version, and a minimal Grain snippet when relevant
- call out whether a website issue was observed on the live site or in local preview
