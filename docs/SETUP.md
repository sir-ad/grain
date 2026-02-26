# Docs Configuration

## GitHub Pages Setup

The docs are deployed to GitHub Pages via GitHub Actions.

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

Update in `docs/vite.config.ts` if using custom domain:
```ts
export default defineConfig({
  // ...
  srcDir: '.',
  outDir: './dist',
  // For custom domain:
  // base: '/grain/'
})
```
