import { describe, expect, it } from 'vitest';

import { MCPAdapter } from '../src/index';

describe('MCPAdapter', () => {
  it('converts a document root tool into MCP data', () => {
    const adapter = new MCPAdapter();
    const result = adapter.toMCP(`<tool name="get_weather" args='{"city":"Mumbai"}' status="running" />`);

    expect(result).toEqual({
      semantic: 'tool',
      name: 'get_weather',
      input: { city: 'Mumbai' },
      output: undefined,
      status: 'running'
    });
  });

  it('serializes object output as a result element with attributes', () => {
    const adapter = new MCPAdapter();
    const grain = adapter.fromMCP({
      semantic: 'tool',
      name: 'get_weather',
      status: 'complete',
      output: { temperature: 28, condition: 'sunny' }
    });

    expect(grain).toContain('<result temperature="28" condition="sunny" />');
  });
});
