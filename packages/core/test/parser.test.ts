import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { GLangParser } from '../src/parser';

const repoRoot = path.resolve(__dirname, '../../..');
const docsWithExecutableExamples = [
  'README.md',
  'QUICK-START.md',
  'SPEC.md',
  'GRAIN-LANGUAGE.md',
  'docs/g-lang/examples.md',
  'docs/g-lang/syntax.md',
  'docs/guide/getting-started.md',
  'docs/guide/quick-start.md',
  'docs/primitives/tool.md',
  'docs/primitives/approve.md',
  'docs/primitives/error.md',
  'docs/primitives/overview.md'
];

function extractGrainBlocks(filePath: string): string[] {
  const source = readFileSync(path.join(repoRoot, filePath), 'utf8');
  const blocks: string[] = [];
  const lines = source.split('\n');
  let inside = false;
  let current: string[] = [];

  for (const line of lines) {
    if (!inside && line.trim() === '```grain') {
      inside = true;
      current = [];
      continue;
    }

    if (inside && line.trim() === '```') {
      inside = false;
      blocks.push(current.join('\n'));
      current = [];
      continue;
    }

    if (inside) {
      current.push(line);
    }
  }

  return blocks;
}

describe('GLangParser', () => {
  it('parses single-quoted attributes used by public examples', () => {
    const parser = new GLangParser();
    const result = parser.parse(`<tool name="search" args='{"q":"weather"}' status="running" />`);

    expect(result.errors).toEqual([]);
    expect(result.ast?.children?.[0]).toMatchObject({
      type: 'tool',
      attributes: {
        name: 'search',
        args: '{"q":"weather"}',
        status: 'running'
      }
    });
  });

  it('accepts documented result, progress, warning, action, and option children', () => {
    const parser = new GLangParser();
    const result = parser.parse(`
      <tool name="send_email" status="running">
        <input>To: user@example.com</input>
        <progress value="45" max="100">45%</progress>
        <result delivered="false">Queued</result>
      </tool>
      <approve type="tool_call" action="Send email" status="pending">
        <warning>This will send an external email.</warning>
        <option label="Cancel"></option>
        <option label="Send" primary></option>
      </approve>
      <error code="RATE_LIMIT" message="Too many requests" recoverable="true">
        <action name="retry" label="Retry" />
      </error>
    `);

    expect(result.errors).toEqual([]);
  });

  it('rejects mismatched closing tags', () => {
    const parser = new GLangParser();
    const result = parser.parse('<message><stream>Hello</message></stream>');

    expect(result.ast).toBeNull();
    expect(result.errors[0]?.message).toContain('Mismatched closing tag');
  });

  it('rejects unknown attributes and unsupported children on completed input', () => {
    const parser = new GLangParser();
    const result = parser.parse(`
      <tool name="search" nope="true">
        <artifact type="code">bad</artifact>
      </tool>
    `);

    expect(result.ast).toBeNull();
    expect(result.errors.map((error) => error.message)).toEqual([
      'Unknown attribute: nope',
      'artifact is not allowed inside tool'
    ]);
  });

  it('rejects unquoted attribute values in completed input', () => {
    const parser = new GLangParser();
    const result = parser.parse('<tool name=search status=running />');

    expect(result.ast).toBeNull();
    expect(result.errors[0]?.message).toContain('Attribute values must be quoted');
  });

  it('keeps incomplete chunks buffered until the closing input arrives', () => {
    const parser = new GLangParser();
    const first = parser.parseChunk('<tool name="search"', false);
    const second = parser.parseChunk(" args='{\"q\":\"weather\"}' />", true);

    expect(first.errors).toEqual([]);
    expect(first.ast?.children).toEqual([]);
    expect(second.errors).toEqual([]);
    expect(second.ast?.children?.[0]).toMatchObject({
      type: 'tool',
      attributes: {
        name: 'search',
        args: '{"q":"weather"}'
      }
    });
  });

  it('parses public Grain examples from the repo contract docs', () => {
    const parser = new GLangParser();

    for (const filePath of docsWithExecutableExamples) {
      const blocks = extractGrainBlocks(filePath);
      expect(blocks.length, `${filePath} should contain Grain examples`).toBeGreaterThan(0);

      for (const block of blocks) {
        const result = parser.parse(block);
        expect(result.errors, `Failed to parse ${filePath} example:\n${block}`).toEqual([]);
      }
    }
  });
});
