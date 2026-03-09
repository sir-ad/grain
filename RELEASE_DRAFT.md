# Draft Release

## Release Title

Grain v1.3.0: Production Readiness Hardening

## Release Tag

`v1.3.0`

## Release Body

This release hardens Grain’s public contract, packaging, docs, and delivery pipeline so the repository matches the product it claims to ship.

### Highlights

- Rewrote the core parser to enforce the documented XML-like Grain syntax, including strict closing-tag matching and support for both single- and double-quoted attributes.
- Expanded runtime support for documented companion elements such as `result`, `progress`, and `warning`.
- Added regression tests that execute documented examples instead of letting docs drift from runtime behavior.
- Fixed the CLI so it ships a real `grain` executable and improved file watching and rendering behavior.
- Replaced the MCP server stub with a real stdio JSON-RPC server package published as `grain-mcp`.
- Unified the public docs around VitePress and removed conflicting deploy/release workflow paths.
- Added a portable root verification path with ESLint, Vitest, and docs builds included in `pnpm check`.
- Moved public browser and installer guidance to jsDelivr-backed URLs.

### Docs And Website

- VitePress is now the canonical public site.
- The playground now uses valid Grain syntax that round-trips through the current parser and web adapter.
- Public trust/navigation pages now include About, Privacy, and Contact.
- Sitemap and robots generation are part of the docs build output.

### Packaging And Release Pipeline

- `@grain.sh/cli` now exposes `grain`.
- `grain-mcp` is the canonical MCP server distributable.
- `create-grain-app` now ships an actual starter template.
- One Pages workflow and one npm publish workflow remain; redundant release workflows were removed.

### Versioning Decision

- This release standardizes all public packages on `1.3.0`.
- Packages previously stuck on `1.0.0-alpha.1` now ship as stable `1.3.0` releases.
- Newly publishable packages `grain-mcp` and `create-grain-app` also debut at `1.3.0` to keep the monorepo release line coherent.

### Verification

- `pnpm check` passes
- `pnpm --dir docs build` passes
- CLI smoke check passes
- MCP stdio initialization smoke check passes

### Follow-Up Before Cutting A Tagged Release

- Decide the version bump strategy across the mixed package versions in this monorepo.
- Run a live-host audit against the deployed docs hostname instead of localhost/static-server output.
- If edge security headers are required, move docs hosting behind a platform that can enforce them instead of relying on GitHub Pages.
