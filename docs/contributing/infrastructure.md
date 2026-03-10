---
title: Grain Infrastructure | Build, Deploy, Publish, and Preview
description: Understand the current Grain infrastructure, including workspace validation, docs deployment, npm publishing, CDN delivery, and GitHub Pages constraints.
---

# Infrastructure

This page documents the infrastructure that is actually wired into the repository today rather than an aspirational pipeline.

## Workspace and Validation

The repository is a pnpm workspace with the docs site included as a first-class package.

Primary root commands:

```bash
pnpm check
pnpm docs:build
pnpm docs:preview
pnpm docs:preview:smoke
```

What they do:

- `pnpm check` runs repo-wide lint, build, and test validation
- `pnpm docs:build` builds the VitePress site and post-processes generated crawl artifacts
- `pnpm docs:preview` builds the docs, selects a free local port, and starts preview on `127.0.0.1`
- `pnpm docs:preview:smoke` verifies the `/grain/` base path, homepage shell, and browser hydration behavior when a local Chrome installation is available

## Docs Site Deployment

The public docs site is deployed to GitHub Pages as a project site:

- public URL: `https://sir-ad.github.io/grain/`
- base path: `/grain/`
- workflow: `.github/workflows/deploy.yml`

The deploy workflow currently:

1. checks out the repo
2. installs dependencies with pnpm
3. runs `pnpm check`
4. uploads `docs/.vitepress/dist`
5. deploys that artifact to GitHub Pages

## Local Preview Reliability

The repo uses `scripts/docs-preview.mjs` to make preview behavior explicit:

- builds docs before preview unless `--skip-build` is set
- detects occupied default ports such as `4173`
- binds to `127.0.0.1`
- prints the exact working URL
- probes `/grain/` instead of `/`

This matters because the most common local "preview is broken" report is actually a stale process on a default port or a user opening the server root instead of the project-site base path.

## Crawl Artifacts

The docs build publishes crawl artifacts under the project-site base:

- `robots.txt` at `/grain/robots.txt`
- `sitemap.xml` at `/grain/sitemap.xml`

VitePress currently emits sitemap entries that need post-processing for the GitHub Pages project-site base path. The repo corrects that in `scripts/docs-postbuild.mjs`.

## GitHub Pages Constraints

Some issues are hosting-level constraints rather than repo bugs:

- the repository cannot control root-host `robots.txt` for `sir-ad.github.io`
- GitHub Pages does not honor Netlify-style `_headers` files
- response-level headers such as CSP or `X-Frame-Options` are host-controlled

Where possible, the docs site uses HTML-level metadata and accessible markup. Host-level warnings that remain after that should be documented, not papered over with brittle client-side workarounds.

## Package Publishing

Package publishing is handled by `.github/workflows/publish.yml`.

Current release model:

- pushing a `v*` tag triggers publish
- the job uses the `production` environment
- npm auth comes from `secrets.NPM_TOKEN`
- publish runs only after `pnpm check` passes

## CDN Delivery

The browser bundle for `@grain.sh/web` is distributed from npm and can be served via jsDelivr:

```text
https://cdn.jsdelivr.net/npm/@grain.sh/web@<version>/dist/index.global.js
```

jsDelivr is the canonical zero-maintenance CDN path because it maps directly to the npm package and GitHub repository. `cdnjs` is only relevant if the bundle is explicitly mirrored there.

## Operational Checklist

Before shipping a website-facing change:

- verify `pnpm check`
- verify `pnpm docs:build`
- verify `pnpm docs:preview:smoke`
- confirm the generated sitemap uses `/grain/`
- confirm live-site issues are classified as repo-owned or GitHub Pages limitations
