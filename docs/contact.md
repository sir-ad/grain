---
title: Contact Grain | Issues and Security
description: Reach the Grain maintainers, report issues, and find the right public channels for technical questions and responsible disclosure.
---

# Contact

Grain is maintained in public. The fastest way to reach the project is through the repository and issue tracker.

## Public Channels

- **GitHub repository:** [github.com/sir-ad/grain](https://github.com/sir-ad/grain)
- **Issue tracker:** [github.com/sir-ad/grain/issues](https://github.com/sir-ad/grain/issues)
- **Package registry:** [@grain.sh/core on npm](https://www.npmjs.com/package/@grain.sh/core)

## What To Use Where

- Use **issues** for bugs, documentation mistakes, packaging problems, and feature requests.
- Use **discussions in a pull request** for implementation feedback tied to a concrete change.
- Use **security reporting channels provided by GitHub** if you need to disclose a vulnerability privately.
- Use **release notes and changelog diffs** when a behavior changed between published versions and you need to confirm whether it was intentional.

## Include Useful Context

When reporting a problem, include:

- the package and version involved
- the Grain document or snippet that triggered the issue
- the runtime surface involved (`web`, `cli`, `mcp`, or `agent`)
- reproduction steps and the expected behavior

For website issues, also include whether you were testing the live site or a local preview. The docs preview is intentionally served from `/grain/`, so a blank page at `/` is not a rendering bug.

## Project Status

Grain is an actively evolving open-source project. Public documentation is treated as the product contract, so documentation bugs and spec mismatches are high-signal reports.
