/**
 * Agent-to-Agent Communication Protocol
 * Defines the envelope for agent handoffs and message exchange
 */

import { type ASTNode, GLangParser } from '@grain.sh/core';

export interface AgentEnvelope {
    id: string;
    from: string;
    to: string;
    timestamp: string;
    payload: string; // G-Lang content
    metadata?: Record<string, any>;
}

export class AgentAdapter {
    private parser: GLangParser;

    constructor() {
        this.parser = new GLangParser();
    }

    /**
     * Pack G-Lang content into an agent envelope
     */
    pack(content: string, from: string, to: string, metadata?: any): AgentEnvelope {
        return {
            id: Math.random().toString(36).substring(7),
            from,
            to,
            timestamp: new Date().toISOString(),
            payload: content,
            metadata
        };
    }

    /**
     * Unpack an envelope and verify the G-Lang content
     */
    unpack(envelope: AgentEnvelope): { ast: ASTNode | null, errors: any[] } {
        const result = this.parser.parse(envelope.payload);
        return {
            ast: result.ast,
            errors: result.errors
        };
    }

    /**
     * Create a handoff message including full context
     */
    createHandoff(targetAgent: string, fromAgent: string, contextId: string, summary: string): string {
        return `<context id="${contextId}" type="conversation">
  <think visible="true">Performing handoff to ${targetAgent}...</think>
  <message role="system">HANDOFF: ${summary}</message>
</context>`;
    }
}
