/**
 * Grain Language Parser
 * Parses Grain Language syntax into an AST.
 */

import { Validator } from './validator';
import type { ASTNode, ParserOptions, ParseResult } from './types';

type Token =
  | { type: 'TEXT'; value: string; position: number }
  | { type: 'OPEN_TAG'; name: string; attributes: Record<string, string>; selfClosing: boolean; position: number }
  | { type: 'CLOSE_TAG'; name: string; position: number };

class ParserError extends Error {
  constructor(message: string, readonly position?: number) {
    super(message);
    this.name = 'ParserError';
  }
}

class IncompleteInputError extends Error {
  constructor(readonly position: number) {
    super('Incomplete input');
    this.name = 'IncompleteInputError';
  }
}

class Tokenizer {
  private index = 0;

  constructor(
    private readonly source: string,
    private readonly allowIncomplete: boolean
  ) {}

  tokenize(): Token[] {
    const tokens: Token[] = [];

    while (this.index < this.source.length) {
      if (this.consumeComment()) {
        continue;
      }

      if (this.isTagStart(this.index)) {
        const token = this.source[this.index + 1] === '/'
          ? this.readClosingTag()
          : this.readOpeningTag();
        tokens.push(token);
        continue;
      }

      const text = this.readText();
      if (text.type === 'TEXT' && text.value.trim()) {
        tokens.push(text);
      }
    }

    return tokens;
  }

  private consumeComment(): boolean {
    if (!this.source.startsWith('<!--', this.index)) {
      return false;
    }

    const commentEnd = this.source.indexOf('-->', this.index + 4);
    if (commentEnd === -1) {
      this.handleUnexpectedEnd();
      return false;
    }

    this.index = commentEnd + 3;
    return true;
  }

  private isTagStart(position: number): boolean {
    if (this.source[position] !== '<') {
      return false;
    }

    if (this.source.startsWith('<!--', position)) {
      return true;
    }

    const next = this.source[position + 1];
    if (!next) {
      return false;
    }

    if (next === '/') {
      return /[A-Za-z]/.test(this.source[position + 2] ?? '');
    }

    return /[A-Za-z]/.test(next);
  }

  private readText(): Token {
    const start = this.index;

    while (this.index < this.source.length && !this.isTagStart(this.index)) {
      this.index += 1;
    }

    return {
      type: 'TEXT',
      value: this.source.slice(start, this.index),
      position: start
    };
  }

  private readOpeningTag(): Token {
    const position = this.index;
    this.index += 1; // <

    const name = this.readName('tag');
    const attributes: Record<string, string> = {};

    while (this.index < this.source.length) {
      this.skipWhitespace();

      if (this.index >= this.source.length) {
        this.handleUnexpectedEnd();
      }

      if (this.source[this.index] === '>') {
        this.index += 1;
        return { type: 'OPEN_TAG', name, attributes, selfClosing: false, position };
      }

      if (this.source[this.index] === '/' && this.source[this.index + 1] === '>') {
        this.index += 2;
        return { type: 'OPEN_TAG', name, attributes, selfClosing: true, position };
      }

      const attributeName = this.readName('attribute');
      this.skipWhitespace();

      let attributeValue = 'true';
      if (this.source[this.index] === '=') {
        this.index += 1;
        this.skipWhitespace();
        attributeValue = this.readAttributeValue();
      }

      attributes[attributeName] = attributeValue;
    }

    this.handleUnexpectedEnd();
  }

  private readClosingTag(): Token {
    const position = this.index;
    this.index += 2; // </
    const name = this.readName('closing tag');
    this.skipWhitespace();

    if (this.index >= this.source.length) {
      this.handleUnexpectedEnd();
    }

    if (this.source[this.index] !== '>') {
      throw new ParserError(`Expected ">" to close </${name}>`, this.index);
    }

    this.index += 1;
    return { type: 'CLOSE_TAG', name, position };
  }

  private readName(context: string): string {
    const start = this.index;
    const first = this.source[this.index];

    if (!first) {
      this.handleUnexpectedEnd();
    }

    if (!/[A-Za-z]/.test(first)) {
      throw new ParserError(`Invalid ${context} name`, this.index);
    }

    this.index += 1;

    while (this.index < this.source.length && /[A-Za-z0-9:_-]/.test(this.source[this.index])) {
      this.index += 1;
    }

    return this.source.slice(start, this.index);
  }

  private readAttributeValue(): string {
    if (this.index >= this.source.length) {
      this.handleUnexpectedEnd();
    }

    const quote = this.source[this.index];
    if (quote !== '"' && quote !== '\'') {
      throw new ParserError('Attribute values must be quoted', this.index);
    }

    this.index += 1;
    const start = this.index;
    const end = this.source.indexOf(quote, start);

    if (end === -1) {
      this.handleUnexpectedEnd();
    }

    this.index = end + 1;
    return this.source.slice(start, end);
  }

  private skipWhitespace(): void {
    while (this.index < this.source.length && /\s/.test(this.source[this.index])) {
      this.index += 1;
    }
  }

  private handleUnexpectedEnd(): never {
    if (this.allowIncomplete) {
      throw new IncompleteInputError(this.index);
    }

    throw new ParserError('Unexpected end of input', this.index);
  }
}

export class GLangParser {
  private readonly validator: Validator;
  private readonly options: ParserOptions;
  private buffer = '';

  constructor(options: ParserOptions = {}) {
    this.options = options;
    this.validator = new Validator();
  }

  /**
   * Parse a complete Grain Language string into an AST.
   */
  parse(input: string): ParseResult {
    this.reset();
    return this.parseChunk(input, true);
  }

  /**
   * Parse an incoming chunk of a Grain Language stream.
   */
  parseChunk(chunk: string, isDone: boolean = false): ParseResult {
    if (typeof chunk !== 'string') {
      return { ast: null, errors: [{ message: 'Input chunk must be a string' }] };
    }

    this.buffer += chunk;

    try {
      const tokens = new Tokenizer(this.buffer, !isDone).tokenize();
      const ast = this.parseTokens(tokens, !isDone);

      if (this.options.validate !== false && isDone) {
        const validationResult = this.validator.validate(ast);
        if (!validationResult.valid) {
          this.reset();
          return { ast: null, errors: validationResult.errors };
        }
      }

      if (isDone) {
        this.reset();
      }

      return { ast, errors: [] };
    } catch (error) {
      if (isDone) {
        this.reset();
      }

      if (error instanceof IncompleteInputError) {
        return {
          ast: this.createDocumentNode(),
          errors: []
        };
      }

      return {
        ast: null,
        errors: [{
          message: error instanceof Error ? error.message : 'Parse error',
          position: error instanceof ParserError ? error.position : undefined
        }]
      };
    }
  }

  reset(): void {
    this.buffer = '';
  }

  private parseTokens(tokens: Token[], allowIncomplete: boolean): ASTNode {
    const root = this.createDocumentNode();
    const stack: ASTNode[] = [root];

    for (const token of tokens) {
      if (token.type === 'TEXT') {
        stack[stack.length - 1].children!.push({
          type: 'text',
          value: token.value,
          position: token.position
        });
        continue;
      }

      if (token.type === 'OPEN_TAG') {
        const node: ASTNode = {
          type: token.name,
          attributes: token.attributes,
          children: [],
          position: token.position
        };

        if (token.selfClosing) {
          stack[stack.length - 1].children!.push(node);
          continue;
        }

        stack.push(node);
        continue;
      }

      const current = stack[stack.length - 1];
      if (stack.length === 1) {
        throw new ParserError(`Unexpected closing tag: </${token.name}>`, token.position);
      }

      if (current.type !== token.name) {
        throw new ParserError(
          `Mismatched closing tag: expected </${current.type}> but found </${token.name}>`,
          token.position
        );
      }

      stack.pop();
      stack[stack.length - 1].children!.push(current);
    }

    if (stack.length > 1) {
      if (!allowIncomplete) {
        const unclosed = stack[stack.length - 1];
        throw new ParserError(`Unclosed tag: <${unclosed.type}>`, unclosed.position);
      }

      while (stack.length > 1) {
        const node = stack.pop();
        if (node) {
          stack[stack.length - 1].children!.push(node);
        }
      }
    }

    return root;
  }

  private createDocumentNode(): ASTNode {
    return {
      type: 'document',
      children: [],
      position: 0
    };
  }
}

/**
 * Create a parser instance.
 */
export function createParser(options?: ParserOptions): GLangParser {
  return new GLangParser(options);
}
