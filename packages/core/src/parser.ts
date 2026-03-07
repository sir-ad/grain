/**
 * Grain Language Parser
 * Parses Grain Language syntax into an AST
 */

import { Validator } from './validator';
import type { ASTNode, ParserOptions, ParseResult } from './types';

export class GLangParser {
  private validator: Validator;
  private options: ParserOptions;
  private buffer: string = '';
  // private state: 'text' | 'tag' | 'attr' | 'attrValue' = 'text';

  constructor(options: ParserOptions = {}) {
    this.options = options;
    this.validator = new Validator();
  }

  /**
   * Parse complete Grain Language string into AST
   */
  parse(input: string): ParseResult {
    this.reset();
    return this.parseChunk(input, true);
  }

  /**
   * Parse an incoming chunk of Grain Language stream
   */
  parseChunk(chunk: string, isDone: boolean = false): ParseResult {
    if (!chunk && !isDone) {
      return { ast: null, errors: [{ message: 'Input chunk must be a string' }] };
    }

    this.buffer += chunk;

    try {
      // In a real implementation this would be a full state machine lexer
      // For this refactor we will approximate it to prove the concept
      const tokens = this.lexBuffer(isDone);
      const ast = this.parseTokens(tokens);

      if (this.options.validate !== false && isDone) {
        const validationResult = this.validator.validate(ast);
        if (!validationResult.valid) {
          return { ast: null, errors: validationResult.errors };
        }
      }

      return { ast, errors: [] };
    } catch (error) {
      return {
        ast: null,
        errors: [{ message: error instanceof Error ? error.message : 'Parse error' }]
      };
    }
  }

  reset() {
    this.buffer = '';
  }

  /**
   * Tokenize current buffer safely
   */
  private lexBuffer(isDone: boolean): Array<{ type: string; value: string; position: number }> {
    const tokens: Array<{ type: string; value: string; position: number }> = [];

    // Remove comments
    const cleanInput = this.buffer.replace(/<!--[\s\S]*?-->/g, '');

    // Match XML-like tags (Stateful regex approximation)
    const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9-]*)|(\s+([a-zA-Z-]+)="([^"]*)")|(\/>|>|<\/)/g;

    let match;
    let lastIndex = 0;
    let lastValidIndex = 0;

    while ((match = tagRegex.exec(cleanInput)) !== null) {
      // Check if this tag looks incomplete at the end of the buffer
      if (!isDone && match.index + match[0].length === cleanInput.length && !match[5]) {
        // Stop, wait for more chunks
        break;
      }

      if (match.index > lastIndex) {
        const text = cleanInput.slice(lastIndex, match.index);
        // Only emit text if it isn't pure whitespace between strictly formatted tags, 
        // or just emit raw if we wanted strict preservation.
        if (text.trim()) {
          tokens.push({ type: 'TEXT', value: text, position: lastIndex });
        }
      }

      if (match[1]) {
        const isClosing = cleanInput[match.index + 1] === '/';
        tokens.push({
          type: isClosing ? 'TAG_CLOSE' : 'TAG_OPEN',
          value: match[1],
          position: match.index
        });
      } else if (match[3]) {
        tokens.push({
          type: 'ATTR',
          value: match[3],
          position: match.index
        });
        tokens.push({
          type: 'ATTR_VALUE',
          value: match[4],
          position: match.index
        });
      } else if (match[5]) {
        tokens.push({
          type: match[5] === '/>' ? 'SELF_CLOSE' : 'TAG_END',
          value: match[5],
          position: match.index
        });
      }

      lastIndex = tagRegex.lastIndex;
      lastValidIndex = lastIndex;
    }

    // Handle dangling text if done, or wait if not done
    if (isDone && lastIndex < cleanInput.length) {
      const text = cleanInput.slice(lastIndex);
      if (text.trim()) {
        tokens.push({ type: 'TEXT', value: text, position: lastIndex });
      }
    }

    if (isDone) {
      this.reset();
    } else {
      // Keep unparsed tail in buffer
      this.buffer = cleanInput.slice(lastValidIndex);
    }

    return tokens;
  }

  /**
   * Parse tokens into AST
   */
  private parseTokens(tokens: Array<{ type: string; value: string; position: number }>): ASTNode {
    const root: ASTNode = {
      type: 'document',
      children: [],
      position: 0
    };

    const stack: ASTNode[] = [root];

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (token.type === 'TAG_OPEN') {
        const node: ASTNode = {
          type: token.value,
          attributes: {},
          children: [],
          position: token.position
        };

        while (i + 1 < tokens.length && tokens[i + 1].type === 'ATTR') {
          const attrName = tokens[i + 1].value;
          const attrValue = tokens[i + 2]?.type === 'ATTR_VALUE' ? tokens[i + 2].value : '';
          node.attributes![attrName] = attrValue;
          i += 2;
        }

        if (i + 1 < tokens.length && tokens[i + 1].type === 'SELF_CLOSE') {
          stack[stack.length - 1].children!.push(node);
        } else {
          stack.push(node);
        }
      } else if (token.type === 'TAG_CLOSE') {
        if (stack.length > 1) {
          const node = stack.pop();
          if (node) {
            stack[stack.length - 1].children!.push(node);
          }
        }
      } else if (token.type === 'TEXT') {
        const textNode: ASTNode = {
          type: 'text',
          value: token.value,
          position: token.position
        };
        stack[stack.length - 1].children!.push(textNode);
      }
    }

    // Auto-close unclosed tags for streaming tolerance
    while (stack.length > 1) {
      const node = stack.pop();
      if (node) stack[stack.length - 1].children!.push(node);
    }

    return root;
  }
}

/**
 * Create a parser instance
 */
export function createParser(options?: ParserOptions): GLangParser {
  return new GLangParser(options);
}
