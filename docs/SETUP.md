---
title: Docs Configuration
description: Setup guide for Grain documentation site.
---
# Docs Configuration

## Deployment Setup

The documentation site is currently deployed to GitHub Pages via GitHub Actions. Browser bundles and repo-served assets should use jsDelivr rather than GitHub Pages URLs.

### To Enable GitHub Pages:

1. Go to: https://github.com/sir-ad/grain/settings/pages
2. Source: Select **GitHub Actions**
3. The workflow will auto-deploy on push to `main`

### Manual Deploy (if needed):

```bash
cd docs
pnpm install
pnpm build
```

The output will be in `docs/.vitepress/dist` — can be deployed to any static host.

---

## Website URL

Once deployed: `https://sir-ad.github.io/grain`

Update in `docs/.vitepress/config.ts` if using a custom domain:
```ts
export default defineConfig({
  // ...
  // For custom domain:
  // base: '/grain/'
})
```

## CDN Guidance

Prefer jsDelivr for public browser bundles and repo-served installer assets:

```txt
https://cdn.jsdelivr.net/npm/@grain.sh/web@latest/dist/index.global.js
https://cdn.jsdelivr.net/gh/sir-ad/grain@main/install.sh
```
