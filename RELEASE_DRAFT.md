# Draft Release

## Release Title

Grain v1.3.1: Scoped Package Naming Correction

## Release Tag

`v1.3.1`

## Release Body

This patch release corrects the npm package names introduced in `v1.3.0` so the published distributables stay under the `@grain.sh` scope, matching the rest of the ecosystem and the existing npm organization.

### Highlights

- Restored the MCP server package name to `@grain.sh/mcp-server`.
- Restored the app scaffolder package name to `@grain.sh/create-grain-app`.
- Kept the executable commands unchanged:
  - `grain-mcp`
  - `create-grain-app`
- Corrected README, install guidance, and release metadata to point at the scoped package names.

### Versioning Decision

- This release publishes the scoped naming correction as `1.3.1`.
- The incorrect unscoped package names from `1.3.0` should be treated as deprecated aliases, not canonical distributables.

### Verification

- `pnpm check` passes
- `pnpm --dir docs build` passes
- npm package manifests resolve to the `@grain.sh` scope for the MCP server and scaffolder packages
