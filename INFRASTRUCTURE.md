# Infrastructure

> Build, CI/CD, deployment, and operations.

---

## Repository Setup

### Monorepo Structure

```
ai-semantics/
├── packages/
│   ├── core/              # @ai-semantics/core
│   ├── web/               # @ai-semantics/web
│   ├── cli/               # @ai-semantics/cli
│   ├── mcp/               # @ai-semantics/mcp
│   ├── agent/              # @ai-semantics/agent
│   └── react/              # @ai-semantics/react (planned)
├── tools/                  # Build tools
├── docs/                   # Documentation site
└── package.json           # Workspace root
```

### Package Manager

**pnpm** for monorepo management:

```bash
# Install pnpm if needed
npm install -g pnpm

# Install dependencies
pnpm install

# Add a dependency to a package
pnpm add @ai-semantics/core --filter @ai-semantics/web
```

---

## Build System

### Tooling

| Tool | Purpose |
|------|---------|
| **TypeScript** | Type safety |
| **Vite** | Web packages bundling |
| **Rollup** | Library bundling |
| **tsup** | TypeScript bundling |
| **Changesets** | Versioning & changelog |

### Build Configuration

```javascript
// packages/core/tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [],
  banner: {
    js: `/**
 * @ai-semantics/core ${require('./package.json').version}
 * AI Semantics - Universal interaction layer for AI
 */`
  }
});
```

### Web Adapter Build

```javascript
// packages/web/vite.config.ts
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'AISemanticsWeb',
      formats: ['es', 'umd'],
      fileName: 'ai-semantics-web'
    },
    rollupOptions: {
      external: ['@ai-semantics/core'],
      output: {
        globals: {
          '@ai-semantics/core': 'AISemanticsCore'
        }
      }
    }
  }
});
```

---

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - run: pnpm install --frozen-lockfile
      
      - run: pnpm lint
        env:
          TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
          TURBO_TEAM: ${{ secrets.TURBO_TEAM }}
      
      - run: pnpm test
      
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: unittests

  build:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - run: pnpm install --frozen-lockfile
      
      - run: pnpm build
      
      - uses: actions/upload-artifact@v3
        with:
          name: dist
          path: packages/*/dist

  publish:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      
      - run: pnpm config set //registry.npmjs.org/:_authToken $NPM_TOKEN
        env:
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
      
      - run: pnpm publish -r
```

---

## Version Management

### Changesets

```bash
# Install Changesets CLI
pnpm add -D @changesets/cli
pnpm changeset init
```

### Release Workflow

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      
      - run: pnpm install --frozen-lockfile
      
      - name: Create release pull request
        run: pnpm changeset version
      
      - name: Publish to npm
        run: pnpm publish -r
        env:
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
      
      - name: Create GitHub Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          draft: false
```

### Publishing Tags

```bash
# Major release
pnpm changeset pre major
pnpm changeset version
git push --follow-tags
pnpm publish -r

# Minor release
pnpm changeset pre minor
pnpm changeset version
git push --follow-tags
pnpm publish -r
```

---

## CDN Distribution

### Unpkg

```
https://unpkg.com/@ai-semantics/web@1.0.0/dist/ai-semantics-web.js
https://unpkg.com/@ai-semantics/web@1.0.0/dist/ai-semantics-web.css
```

### jsDelivr

```
https://cdn.jsdelivr.net/npm/@ai-semantics/web@1.0.0/dist/ai-semantics-web.js
https://cdn.jsdelivr.net/npm/@ai-semantics/web@1.0.0/dist/ai-semantics-web.css
```

### Cloudflare Pages (Docs)

```yaml
# .github/workflows/docs.yml
name: Deploy Docs

on:
  push:
    branches: [main]
    paths: ['docs/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - run: pnpm install --frozen-lockfile
      
      - name: Build docs
        run: pnpm --filter @ai-semantics/docs build
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: ai-semantics-docs
          directory: packages/docs/dist
```

---

## Local Development

### Setup

```bash
# Clone repository
git clone https://github.com/sir-ad/ai-semantics.git
cd ai-semantics

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Start development
pnpm dev
```

### Running Examples

```bash
# Web example
pnpm --filter @ai-semantics/example-web dev

# CLI example
pnpm --filter @ai-semantics/example-cli dev
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Lint
pnpm lint
pnpm lint:fix
```

---

## Docker

### Development

```dockerfile
# Dockerfile.dev
FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["pnpm", "dev"]
```

### Build

```bash
# Build image
docker build -f Dockerfile.dev -t ai-semantics:dev .

# Run container
docker run -p 3000:3000 ai-semantics:dev
```

---

## Monitoring & Error Tracking

### Sentry Integration

```javascript
// packages/core/src/instrument.ts
import * as Sentry from '@sentry/node';

export function initSentry() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    release: process.env.npm_package_version,
    integrations: [
      Sentry.tracingIntegration(),
    ],
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  });
}
```

---

## Performance Monitoring

### Bundle Analysis

```bash
# Analyze bundle size
pnpm run build && pnpm run analyze

# Compare with previous build
pnpm run build:compare
```

### Lighthouse CI

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse

on: [pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Build
        run: pnpm build && pnpm --filter @ai-semantics/example-web build
      
      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            http://localhost:3000
          uploadArtifacts: true
          temporaryPublicStorage: true
```

---

## Security

### Dependency Scanning

```yaml
# .github/workflows/security.yml
name: Security

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 0 * * 0'

jobs:
  security:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Audit dependencies
        run: pnpm audit
      
      - name: Check vulnerabilities
        run: pnpm audit --audit-level=high
```

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (development/production) | Yes |
| `NPM_TOKEN` | npm publishing token | For publish |
| `SENTRY_DSN` | Sentry error tracking | Optional |
| `ANALYTICS_ID` | Analytics tracking | Optional |

---

## Deployment Checklist

- [ ] All tests passing
- [ ] TypeScript compilation successful
- [ ] Bundle size under limits
- [ ] No security vulnerabilities
- [ ] Documentation updated
- [ ] Examples working
- [ ] Version bumped (if releasing)
- [ ] Changelog updated
- [ ] Git tags pushed

---

This infrastructure ensures:
- **Reliable builds** via pnpm workspaces
- **Fast CI** via caching and parallelization
- **Safe releases** via Changesets
- **Global delivery** via CDN
- **Monitoring** via Sentry
