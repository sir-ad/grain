#!/usr/bin/env node

/**
 * Grain MCP server.
 * Implements a minimal stdio JSON-RPC transport for MCP tool discovery and execution.
 */

import { createRequire } from 'node:module';
import process from 'node:process';

import { BUILTIN_PRIMITIVES, GLangParser } from '@grain.sh/core';

const require = createRequire(import.meta.url);
const packageJson = require('../package.json') as { name: string; version: string };

interface JSONRPCRequest {
  jsonrpc: '2.0';
  id?: string | number | null;
  method: string;
  params?: Record<string, unknown>;
}

interface JSONRPCResponse {
  jsonrpc: '2.0';
  id: string | number | null;
  result?: unknown;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

const parser = new GLangParser();
const supportedProtocolVersions = ['2025-11-05', '2024-11-05'] as const;

const tools = {
  'grain.parse': {
    description: 'Parse a Grain document into an AST.',
    inputSchema: {
      type: 'object',
      properties: {
        grain: { type: 'string', description: 'The Grain document to parse.' }
      },
      required: ['grain']
    },
    handler: async (args: { grain: string }) => {
      const result = parser.parse(args.grain);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ valid: result.errors.length === 0, ast: result.ast, errors: result.errors }, null, 2)
          }
        ],
        structuredContent: {
          valid: result.errors.length === 0,
          ast: result.ast,
          errors: result.errors
        }
      };
    }
  },
  'grain.validate': {
    description: 'Validate a Grain document against built-in primitives.',
    inputSchema: {
      type: 'object',
      properties: {
        grain: { type: 'string', description: 'The Grain document to validate.' }
      },
      required: ['grain']
    },
    handler: async (args: { grain: string }) => {
      const result = parser.parse(args.grain);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ valid: result.errors.length === 0, errors: result.errors }, null, 2)
          }
        ],
        structuredContent: {
          valid: result.errors.length === 0,
          errors: result.errors
        },
        isError: result.errors.length > 0
      };
    }
  },
  'grain.primitives.list': {
    description: 'List the built-in Grain primitives supported by the runtime.',
    inputSchema: {
      type: 'object',
      properties: {}
    },
    handler: async () => {
      const primitives = Object.keys(BUILTIN_PRIMITIVES);
      return {
        content: [
          {
            type: 'text',
            text: primitives.join(', ')
          }
        ],
        structuredContent: {
          primitives
        }
      };
    }
  },
  'grain.message.create': {
    description: 'Generate a basic assistant message wrapper.',
    inputSchema: {
      type: 'object',
      properties: {
        role: { type: 'string', description: 'Message role', default: 'assistant' },
        content: { type: 'string', description: 'Message text content' }
      },
      required: ['content']
    },
    handler: async (args: { role?: string; content: string }) => {
      const grain = `<message role="${args.role ?? 'assistant'}"><stream>${args.content}</stream></message>`;
      return {
        content: [
          {
            type: 'text',
            text: grain
          }
        ],
        structuredContent: {
          grain
        }
      };
    }
  }
} as const;

function sendMessage(message: JSONRPCResponse): void {
  const payload = JSON.stringify(message);
  const frame = `Content-Length: ${Buffer.byteLength(payload, 'utf8')}\r\n\r\n${payload}`;
  process.stdout.write(frame);
}

function createSuccess(id: string | number | null, result: unknown): JSONRPCResponse {
  return {
    jsonrpc: '2.0',
    id,
    result
  };
}

function createError(id: string | number | null, code: number, message: string, data?: unknown): JSONRPCResponse {
  return {
    jsonrpc: '2.0',
    id,
    error: {
      code,
      message,
      data
    }
  };
}

async function handleRequest(request: JSONRPCRequest): Promise<JSONRPCResponse | null> {
  const id = request.id ?? null;

  switch (request.method) {
    case 'initialize': {
      const requestedVersion = typeof request.params?.protocolVersion === 'string'
        ? request.params.protocolVersion
        : supportedProtocolVersions[0];

      if (!supportedProtocolVersions.includes(requestedVersion as typeof supportedProtocolVersions[number])) {
        return createError(id, -32602, `Unsupported protocol version: ${requestedVersion}`);
      }

      return createSuccess(id, {
        protocolVersion: requestedVersion,
        capabilities: {
          tools: {
            listChanged: false
          }
        },
        serverInfo: {
          name: packageJson.name,
          version: packageJson.version
        }
      });
    }

    case 'notifications/initialized':
      return null;

    case 'ping':
      return createSuccess(id, {});

    case 'tools/list':
      return createSuccess(id, {
        tools: Object.entries(tools).map(([name, definition]) => ({
          name,
          description: definition.description,
          inputSchema: definition.inputSchema
        }))
      });

    case 'tools/call': {
      const toolName = request.params?.name;
      if (typeof toolName !== 'string' || !(toolName in tools)) {
        return createError(id, -32602, `Unknown tool: ${String(toolName)}`);
      }

      const definition = tools[toolName as keyof typeof tools];
      const argumentsPayload = (request.params?.arguments ?? {}) as Record<string, unknown>;
      const result = await definition.handler(argumentsPayload as never);
      return createSuccess(id, result);
    }

    default:
      return createError(id, -32601, `Method not found: ${request.method}`);
  }
}

function drainBuffer(state: { raw: Buffer }): void {
  for (;;) {
    const separatorIndex = state.raw.indexOf('\r\n\r\n');
    if (separatorIndex === -1) {
      return;
    }

    const headerText = state.raw.slice(0, separatorIndex).toString('utf8');
    const contentLengthMatch = headerText.match(/Content-Length:\s*(\d+)/i);
    if (!contentLengthMatch) {
      state.raw = Buffer.alloc(0);
      return;
    }

    const contentLength = Number(contentLengthMatch[1]);
    const frameLength = separatorIndex + 4 + contentLength;
    if (state.raw.length < frameLength) {
      return;
    }

    const payload = state.raw.slice(separatorIndex + 4, frameLength).toString('utf8');
    state.raw = state.raw.slice(frameLength);

    let request: JSONRPCRequest;
    try {
      request = JSON.parse(payload) as JSONRPCRequest;
    } catch {
      sendMessage(createError(null, -32700, 'Invalid JSON'));
      continue;
    }

    handleRequest(request)
      .then((response) => {
        if (response) {
          sendMessage(response);
        }
      })
      .catch((error) => {
        sendMessage(createError(request.id ?? null, -32603, error instanceof Error ? error.message : 'Internal error'));
      });
  }
}

export function startServer(): void {
  const state = { raw: Buffer.alloc(0) };

  process.stdin.on('data', (chunk: Buffer) => {
    state.raw = Buffer.concat([state.raw, chunk]);
    drainBuffer(state);
  });

  process.stdin.resume();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}
