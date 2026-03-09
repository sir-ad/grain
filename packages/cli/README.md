# `@grain.sh/cli`

Terminal adapter for rendering Grain documents in the shell.

## Install

```bash
npm install -g @grain.sh/cli
```

## Usage

```bash
grain --input ./conversation.grain
grain --input ./conversation.grain --watch
```

Example document:

```grain
<message role="assistant">
  <stream>Hello from Grain.</stream>
</message>
```

Docs: https://sir-ad.github.io/grain/
