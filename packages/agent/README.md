# `@grain.sh/agent`

Agent-to-agent communication envelope for Grain documents.

## Install

```bash
npm install @grain.sh/agent
```

## Usage

```ts
import { AgentAdapter } from '@grain.sh/agent';

const adapter = new AgentAdapter();

const envelope = adapter.pack(
  `<message role="assistant"><stream>Handoff complete.</stream></message>`,
  'planner',
  'executor'
);

const parsed = adapter.unpack(envelope);
console.log(parsed.errors);
```

Docs: https://sir-ad.github.io/grain/
