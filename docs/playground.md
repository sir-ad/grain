---
title: Playground | Validate Grain Syntax and Rendering
description: Experiment with valid Grain Language, inspect rendered primitives, and verify examples against the parser and web adapter contract.
---

# Playground

Use this playground to test valid XML-like Grain syntax, inspect how primitives render in the web adapter, and sanity-check examples before copying them into an app or agent runtime.

## What This Verifies

- The current parser accepts the markup you are testing.
- The web adapter can render the resulting document shape.
- Companion elements such as `<result>`, `<progress>`, and `<warning>` behave as part of the documented contract.

## Local Preview Note

When running the documentation site locally, use `pnpm docs:preview` from the repo root and open the exact `/grain/` URL it prints. The project-site base path is part of the deployment contract, so `/` returning `404` is expected.

<Playground />
