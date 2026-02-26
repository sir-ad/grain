# Contributing to AI Semantics

> Thank you for your interest in contributing!

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Setup

```bash
# Clone the repository
git clone https://github.com/sir-ad/ai-semantics.git
cd ai-semantics

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test
```

---

## Project Structure

```
ai-semantics/
├── packages/
│   ├── core/          # Core runtime (parser, state machine, etc.)
│   ├── web/           # Web adapter
│   ├── cli/           # CLI adapter
│   └── mcp/           # MCP adapter
├── docs/              # Documentation
└── tools/            # Build tools
```

---

## Making Changes

### 1. Create a branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 2. Make your changes

Follow these guidelines:

- **Code style**: Use ESLint + Prettier (configured)
- **Types**: All code must be TypeScript with proper types
- **Tests**: Add tests for new functionality
- **Commits**: Use conventional commits

### 3. Commit format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Maintenance

Example:
```
feat(core): add new state machine for branch primitive

Add support for conversation branching with merge functionality.
Includes states: created, expanded, collapsed, active, merged.

Closes #123
```

### 4. Submit a Pull Request

1. Push your branch
2. Open a Pull Request
3. Fill in the PR template
4. Wait for review

---

## Coding Standards

### TypeScript

```typescript
// Good
interface User {
  id: string;
  name: string;
}

function getUser(id: string): User | null {
  // ...
}

// Avoid
function getUser(id: string): any {
  // ...
}
```

### Naming

- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Classes**: PascalCase
- **Files**: kebab-case.ts

### Error Handling

```typescript
// Good
try {
  await doSomething();
} catch (error) {
  if (error instanceof SpecificError) {
    // Handle specific error
  }
  // Log and re-throw or handle gracefully
}

// Avoid
try {
  await doSomething();
} catch (error) {
  console.log(error); // Don't just log
}
```

---

## Testing

### Unit Tests

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

### Writing Tests

```typescript
import { describe, it, expect } from 'vitest';
import { GLangParser } from '../parser';

describe('GLangParser', () => {
  it('should parse a simple message', () => {
    const parser = new GLangParser();
    const result = parser.parse('<message role="assistant">Hello</message>');
    
    expect(result.errors).toHaveLength(0);
    expect(result.ast).not.toBeNull();
  });
});
```

---

## Documentation

### Updating Docs

- API docs are in `docs/`
- README files are in each package
- Keep docs in sync with code changes

### Building Docs

```bash
pnpm --filter @ai-semantics/docs build
```

---

## Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/) + [Changesets](https://github.com/changesets/changesets).

### Making a Release

```bash
# Add a changeset
pnpm changeset add

# Update version and publish
pnpm release
```

---

## Getting Help

- **Discord**: https://discord.gg/ai-semantics
- **Issues**: https://github.com/sir-ad/ai-semantics/issues
- **Discussions**: https://github.com/sir-ad/ai-semantics/discussions

---

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- GitHub contributors page

---

Thank you for contributing!
