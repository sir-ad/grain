/**
 * MCP Server for AI Semantics
 * 
 * Provides tools that return G-Lang formatted responses.
 */

import { Server } from '@mcp-sdk/sdk';
import { GLangParser } from '@ai-semantics/core';

const parser = new GLangParser();

/**
 * Create G-Lang formatted tool response
 */
function createToolResponse(name: string, args: Record<string, unknown>, status: string, result?: unknown, error?: string): string {
  let content = `<tool name="${name}" status="${status}"`;
  
  if (args && Object.keys(args).length > 0) {
    content += ` args='${JSON.stringify(args)}'`;
  }
  content += '>';
  
  if (status === 'running') {
    content += `<input>${Object.entries(args).map(([k, v]) => `${k}: ${v}`).join(', ')}</input>`;
  }
  
  if (status === 'complete' && result) {
    if (typeof result === 'object') {
      const attrs = Object.entries(result as Record<string, unknown>)
        .map(([k, v]) => `${k}="${v}"`)
        .join(' ');
      content += `<result ${attrs} />`;
    } else {
      content += `<result>${result}</result>`;
    }
  }
  
  if (status === 'error' && error) {
    content += `<error code="TOOL_ERROR">${error}</error>`;
  }
  
  content += '</tool>';
  return content;
}

/**
 * Available tools
 */
const tools = {
  /**
   * Parse G-Lang string
   */
  parse_grain: {
    description: 'Parse G-Lang string into AST',
    input: {
      grain: 'string'
    },
    handler: async (args: { grain: string }) => {
      const result = parser.parse(args.grain);
      
      return {
        content: createToolResponse('parse_grain', args, 'complete', {
          valid: !result.errors.length,
          errors: result.errors,
          ast: result.ast ? JSON.stringify(result.ast, null, 2) : null
        })
      };
    }
  },

  /**
   * Validate G-Lang
   */
  validate_grain: {
    description: 'Validate G-Lang string against specification',
    input: {
      grain: 'string'
    },
    handler: async (args: { grain: string }) => {
      const result = parser.parse(args.grain);
      
      return {
        content: createToolResponse('validate_grain', args, result.errors.length ? 'error' : 'complete', {
          valid: !result.errors.length,
          errors: result.errors.map(e => e.message)
        }, result.errors.length ? result.errors[0].message : undefined)
      };
    }
  },

  /**
   * Render G-Lang to JSON
   */
  grain_to_json: {
    description: 'Convert G-Lang to JSON structure',
    input: {
      grain: 'string'
    },
    handler: async (args: { grain: string }) => {
      const result = parser.parse(args.grain);
      
      return {
        content: createToolResponse('grain_to_json', args, 'complete', {
          json: JSON.stringify(result.ast, null, 2)
        })
      };
    }
  },

  /**
   * Get primitives info
   */
  list_primitives: {
    description: 'List all available AI Semantics primitives',
    input: {},
    handler: async () => {
      return {
        content: createToolResponse('list_primitives', {}, 'complete', {
          primitives: [
            'stream - Real-time text streaming',
            'think - AI reasoning display',
            'tool - Function/tool execution',
            'artifact - Code, images, documents',
            'input - User input collection',
            'context - Files, URLs, memory',
            'state - Global AI status',
            'error - Failure handling',
            'approve - Human-in-the-loop',
            'branch - Conversation forks'
          ].join('\n')
        })
      };
    }
  },

  /**
   * Create a message
   */
  create_message: {
    description: 'Create a G-Lang message element',
    input: {
      role: 'string',
      content: 'string',
      stream: 'boolean'
    },
    handler: async (args: { role: string; content: string; stream?: boolean }) => {
      const streamAttr = args.stream ? ' stream="true"' : '';
      const grain = `<message role="${args.role}"${streamAttr}>
  <stream>${args.content}</stream>
</message>`;
      
      return {
        content: createToolResponse('create_message', args, 'complete', { grain })
      };
    }
  },

  /**
   * Create a tool call
   */
  create_tool_call: {
    description: 'Create a G-Lang tool call element',
    input: {
      name: 'string',
      args: 'string',
      status: 'string'
    },
    handler: async (args: { name: string; args: string; status: string }) => {
      const grain = `<tool name="${args.name}" args='${args.args}' status="${args.status || 'pending'}" />`;
      
      return {
        content: createToolResponse('create_tool_call', args, 'complete', { grain })
      };
    }
  },

  /**
   * Create an artifact
   */
  create_artifact: {
    description: 'Create a G-Lang artifact element',
    input: {
      type: 'string',
      title: 'string',
      content: 'string',
      language: 'string'
    },
    handler: async (args: { type: string; title: string; content: string; language?: string }) => {
      const langAttr = args.language ? ` language="${args.language}"` : '';
      const grain = `<artifact type="${args.type}" title="${args.title}"${langAttr}>
${args.content}
</artifact>`;
      
      return {
        content: createToolResponse('create_artifact', args, 'complete', { grain })
      };
    }
  }
};

/**
 * Create and start MCP server
 */
async function startServer() {
  const server = new Server({
    name: 'ai-semantics',
    version: '1.0.0-alpha'
  });

  // Register tools
  for (const [name, tool] of Object.entries(tools)) {
    server.tool(name, {
      description: tool.description,
      input: tool.input,
      handler: tool.handler
    });
  }

  // Start server
  await server.start();
  
  console.log('AI Semantics MCP Server running...');
  console.log('Available tools:', Object.keys(tools).join(', '));
}

// Start if run directly
startServer().catch(console.error);

export { startServer, tools };
