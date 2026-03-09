# Changelog

All notable changes to this repository are documented in this file.

## Unreleased

### Added

- Added parser regression coverage for documented Grain syntax and invalid inputs.
- Added a real `create-grain-app` Vite starter template.
- Added a real stdio MCP server package under `grain-mcp`.
- Added a unified VitePress config, robots file, contact page, and release draft artifacts.
- Added portable repo verification with a root ESLint config and workspace `check` command.

### Changed

- Rewrote the core Grain parser to support strict XML-like parsing, matching closing tags, single- and double-quoted attributes, comments, and chunked input buffering.
- Expanded the documented primitive/companion-element contract to cover `result`, `progress`, `warning`, `actions`, `option`, `suggestion`, `item`, and richer `state` metadata.
- Aligned the validator, types, and extension registry with the published docs and examples.
- Fixed the CLI to expose a real `grain` executable, improve `--watch`, and render newly supported primitives.
- Unified the public documentation around VitePress and removed the legacy split deployment model.
- Switched public browser and installer guidance to jsDelivr-backed asset URLs instead of fake custom CDN paths or GitHub Pages-served installer links.
- Simplified CI/CD to one Pages deploy workflow and one publish workflow.

### Fixed

- Fixed parser/doc mismatches that previously rejected documented examples and accepted malformed closing tags.
- Fixed MCP adapter serialization for document roots and structured tool results.
- Fixed docs playground examples that previously used an invalid brace-based syntax.
- Fixed workspace verification so `pnpm check` works without machine-specific Turbo assumptions.
- Removed tracked generated declaration artifacts from `src/` so source trees only contain authored code.

### Verification

- `pnpm check`
- `pnpm --dir docs build`
- CLI smoke check via `node packages/cli/dist/index.js --version`
- MCP stdio handshake smoke check via `node packages/mcp-server/dist/index.js`
