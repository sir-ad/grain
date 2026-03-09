# Draft Release

## Release Title

Grain v1.3.2: npm README Metadata Fix

## Release Tag

`v1.3.2`

## Release Body

This patch release fixes npm package presentation by shipping package-local READMEs for every public Grain package, so the npm registry now shows installation and usage guidance instead of blank package pages.

### Highlights

- Added package-level READMEs for `@grain.sh/core`, `@grain.sh/web`, `@grain.sh/react`, `@grain.sh/cli`, `@grain.sh/mcp`, `@grain.sh/mcp-server`, `@grain.sh/agent`, and `@grain.sh/create-grain-app`.
- Documented the real install commands, executable names, and minimal usage examples for each package.
- Republished the packages at `1.3.2` so npmjs.com can render the package documentation correctly.

### Versioning Decision

- This release publishes the npm metadata fix as `1.3.2`.
- No runtime APIs changed; the version bump exists so npm can ingest the new package READMEs.

### Verification

- `pnpm check` passes
- `npm pack --dry-run` includes `README.md` for each public package
- npm package pages render README metadata after publish
