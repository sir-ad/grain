/**
 * MCP Server for Grain
 * Provides tools that return G-Lang formatted responses.
 */

import { GLangParser } from 'grain';
import '@grain/mcp';

const parser = new GLangParser();

function createToolResponse(name: string, args: Record<string, unknown>, status: string, result?: unknown): string {
  let content = `<tool name="${name}" status="${status}"`;
  if (args && Object.keys(args).length) content += ` args='${JSON.stringify(args)}'`;
  content += '>';
  if (status === 'complete' && result) {
    if (typeof result === 'object') {
      content += `<result ${Object.entries(result as Record<string, unknown>).map(([k, v]) => `${k}="${v}"`).join(' ')} />`;
    } else {
      content += `<result>${result}</result>`;
    }
  }
  content += '</tool>';
  return content;
}

const tools = {
  parse_grain: {
    description: 'Parse G-Lang string into AST',
    handler: async (args: { grain: string }) => {
      const result = parser.parse(args.grain);
      return { content: createToolResponse('parse_grain', args, 'complete', { valid: !result.errors.length, ast: result.ast }) };
    }
  },
  validate_grain: {
    description: 'Validate G-Lang string',
    handler: async (args: { grain: string }) => {
      const result = parser.parse(args.grain);
      return { content: createToolResponse('validate_grain', args, result.errors.length ? 'error' : 'complete', { valid: !result.errors.length }) };
    }
  },
  list_primitives: {
    description: 'List all Grain primitives',
    handler: async () => {
      return { content: createToolResponse('list_primitives', {}, 'complete', { primitives: ['stream', 'think', 'tool', 'artifact', 'input', 'context', 'state', 'error', 'approve', 'branch'].join(', ') }) };
    }
  },
  create_message: {
    description: 'Create a G-Lang message',
    handler: async (args: { role: string; content: string }) => {
      return { content: createToolResponse('create_message', args, 'complete', { grain: `<message role="${args.role}"><stream>${args.content}</stream></message>` }) };
    }
  }
};

async function startServer() {
  console.log('Grain MCP Server running...');
  console.log('Tools:', Object.keys(tools).join(', '));
}

startServer().catch(console.error);

export { startServer, tools };
