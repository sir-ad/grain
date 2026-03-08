---
title: Infrastructure | Grain
description: Build, CI/CD, deployment, and operations for Grain.
---

# Infrastructure

> Build, CI/CD, deployment, and operations.

---

## Repository Setup

### Monorepo Structure

```
grain/
├── packages/
│   ├── core/          # @grain.sh/core
│   ├── web/           # @grain.sh/web
│   ├── cli/           # @grain.sh/cli
│   ├── mcp/           # @grain.sh/mcp
│   ├── agent/         # @grain.sh/agent
│   └── react/         # @grain.sh/react (planned)
├── tools/             # Build tools
├── docs/              # Documentation site
└── package.json       # Workspace root
```

### Package Manager

**pnpm** for monorepo management:

```bash
# Install pnpm if needed
npm install -g pnpm

# Install dependencies
pnpm install

# Add a dependency to a package
pnpm add @grain.sh/core --filter @grain.sh/web
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
 * @grain.sh/core ${require('./package.json').version}
 * Grain - Universal interaction layer for AI
 */`
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
```

---

## CDN Distribution

### Unpkg

```
https://unpkg.com/@grain.sh/web@1.0.0/dist/grain-web.js
https://unpkg.com/@grain.sh/web@1.0.0/dist/grain-web.css
```

### jsDelivr

```
https://cdn.jsdelivr.net/npm/@grain.sh/web@1.0.0/dist/grain-web.js
https://cdn.jsdelivr.net/npm/@grain.sh/web@1.0.0/dist/grain-web.css
```

---

## Local Development

### Setup

```bash
# Clone repository
git clone https://github.com/sir-ad/grain.git
cd grain

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
pnpm --filter @grain.sh/example-web dev

# CLI example
pnpm --filter @grain.sh/example-cli dev
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
docker build -f Dockerfile.dev -t grain:dev .

# Run container
docker run -p 3000:3000 grain:dev
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
