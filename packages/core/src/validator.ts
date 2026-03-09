/**
 * Validator
 * Validates AST against the Grain primitive registry.
 */

import { BUILTIN_PRIMITIVES } from './extension-registry';
import type { ASTNode, PrimitiveDefinition, ValidationError, ValidationResult } from './types';

export class Validator {
  private readonly primitives: Map<string, PrimitiveDefinition>;

  constructor() {
    this.primitives = new Map(Object.entries(BUILTIN_PRIMITIVES));
  }

  /**
   * Register a custom primitive definition.
   */
  registerPrimitive(name: string, definition: PrimitiveDefinition): void {
    this.primitives.set(name, definition);
  }

  /**
   * Validate an AST.
   */
  validate(ast: ASTNode): ValidationResult {
    const errors: ValidationError[] = [];

    if (!ast) {
      errors.push({ message: 'AST is null or undefined' });
      return { valid: false, errors };
    }

    if (ast.type !== 'document') {
      errors.push({ message: 'Root must be a document node', path: '' });
    }

    ast.children?.forEach((child, index) => {
      this.validateNode(child, `children[${index}]`, errors);
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate a single node.
   */
  private validateNode(node: ASTNode, path: string, errors: ValidationError[]): void {
    if (!node.type) {
      errors.push({ message: 'Node must have a type', path, position: node.position });
      return;
    }

    if (node.type === 'text') {
      return;
    }

    const primitive = this.primitives.get(node.type);
    if (!primitive) {
      if (!node.type.includes('-')) {
        errors.push({ message: `Unknown primitive: ${node.type}`, path, position: node.position });
      }
      return;
    }

    const attributes = node.attributes ?? {};

    if (!primitive.allowUnknownAttributes) {
      for (const [attributeName] of Object.entries(attributes)) {
        if (!(attributeName in primitive.attributes)) {
          errors.push({
            message: `Unknown attribute: ${attributeName}`,
            path: `${path}.${node.type}.@${attributeName}`,
            position: node.position
          });
        }
      }
    }

    for (const [attributeName, definition] of Object.entries(primitive.attributes)) {
      if (definition.required && !(attributeName in attributes)) {
        errors.push({
          message: `Required attribute missing: ${attributeName}`,
          path: `${path}.${node.type}`,
          position: node.position
        });
      }
    }

    for (const [attributeName, attributeValue] of Object.entries(attributes)) {
      const definition = primitive.attributes[attributeName];
      if (!definition) {
        continue;
      }

      if (definition.type === 'boolean' && !['true', 'false'].includes(attributeValue)) {
        errors.push({
          message: `Attribute ${attributeName} must be boolean`,
          path: `${path}.${node.type}.@${attributeName}`,
          position: node.position
        });
      }

      if (definition.type === 'number' && Number.isNaN(Number(attributeValue))) {
        errors.push({
          message: `Attribute ${attributeName} must be number`,
          path: `${path}.${node.type}.@${attributeName}`,
          position: node.position
        });
      }
    }

    node.children?.forEach((child, index) => {
      if (child.type === 'text') {
        if (!primitive.allowText && child.value?.trim()) {
          errors.push({
            message: `${node.type} does not allow text content`,
            path: `${path}.${node.type}[${index}]`,
            position: child.position
          });
        }
        return;
      }

      if (primitive.allowedChildren && !primitive.allowedChildren.includes(child.type)) {
        errors.push({
          message: `${child.type} is not allowed inside ${node.type}`,
          path: `${path}.${node.type}[${index}]`,
          position: child.position
        });
      }

      this.validateNode(child, `${path}.${node.type}[${index}]`, errors);
    });
  }

  /**
   * Validate Grain Language directly via a parser instance.
   */
  validateString(grainString: string, parserInstance?: { parse: (input: string) => { ast: ASTNode | null; errors: ValidationError[] } }): ValidationResult {
    const parser = parserInstance ?? {
      parse: () => ({ ast: null, errors: [{ message: 'Parser required for string validation' }] })
    };
    const result = parser.parse(grainString);

    if (!result.ast) {
      return { valid: false, errors: result.errors };
    }

    return this.validate(result.ast);
  }
}

/**
 * Create a validator instance.
 */
export function createValidator(): Validator {
  return new Validator();
}
