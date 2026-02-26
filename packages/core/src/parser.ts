/**
 * G-Lang Parser
 * Parses G-Lang syntax into an AST
 */

import { Validator } from './validator';
import type { ASTNode, ParserOptions, ParseResult } from './types';

export class GLangParser {
  private validator: Validator;
  private options: ParserOptions;

  constructor(options: ParserOptions = {}) {
    this.options = options;
    this.validator = new Validator();
  }

  /**
   * Parse G-Lang string into AST
   */
  parse(input: string): ParseResult {
    if (!input || typeof input !== 'string') {
      return {
        ast: null,
        errors: [{ message: 'Input must be a non-empty string' }]
      };
    }

    try {
      const tokens = this.lex(input);
      const ast = this.parseTokens(tokens);
      
      if (this.options.validate !== false) {
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

  /**
   * Async parse for large inputs
   */
  async parseAsync(input: string): Promise<ParseResult> {
    return Promise.resolve(this.parse(input));
  }

  /**
   * Tokenize input string
   */
  private lex(input: string): Array<{ type: string; value: string; position: number }> {
    const tokens: Array<{ type: string; value: string; position: number }> = [];
    let position = 0;

    // Remove comments
    const cleanInput = input.replace(/<!--[\s\S]*?-->/g, '');

    // Match XML-like tags
    const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9-]*)|(\s+([a-zA-Z-]+)="([^"]*)")|(\/>|>|<\/)/g;
    
    let match;
    let lastIndex = 0;

    while ((match = tagRegex.exec(cleanInput)) !== null) {
      // Add text content between tags
      if (match.index > lastIndex) {
        const text = cleanInput.slice(lastIndex, match.index).trim();
        if (text) {
          tokens.push({ type: 'TEXT', value: text, position: lastIndex });
        }
      }

      if (match[1]) {
        // Tag name
        const isClosing = cleanInput[match.index + 1] === '/';
        tokens.push({
          type: isClosing ? 'TAG_CLOSE' : 'TAG_OPEN',
          value: match[1],
          position: match.index
        });
      } else if (match[3]) {
        // Attribute
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
        // Tag end
        tokens.push({
          type: match[5] === '/>' ? 'SELF_CLOSE' : 'TAG_END',
          value: match[5],
          position: match.index
        });
      }

      lastIndex = tagRegex.lastIndex;
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

        // Parse attributes
        while (i + 1 < tokens.length && tokens[i + 1].type === 'ATTR') {
          const attrName = tokens[i + 1].value;
          const attrValue = tokens[i + 2]?.type === 'ATTR_VALUE' ? tokens[i + 2].value : '';
          node.attributes![attrName] = attrValue;
          i += 2;
        }

        // Check if self-closing
        if (i + 1 < tokens.length && tokens[i + 1].type === 'SELF_CLOSE') {
          stack[stack.length - 1].children!.push(node);
        } else {
          stack.push(node);
        }
      } else if (token.type === 'TAG_CLOSE') {
        stack.pop();
      } else if (token.type === 'TEXT') {
        const textNode: ASTNode = {
          type: 'text',
          value: token.value,
          position: token.position
        };
        stack[stack.length - 1].children!.push(textNode);
      }
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
