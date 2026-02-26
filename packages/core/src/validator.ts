/**
 * Validator
 * Validates AST against specification
 */

import { BUILTIN_PRIMITIVES } from './extension-registry';
import type { ASTNode, ValidationResult, ValidationError, PrimitiveDefinition } from './types';

export class Validator {
  private primitives: Map<string, PrimitiveDefinition>;

  constructor() {
    this.primitives = new Map(Object.entries(BUILTIN_PRIMITIVES));
  }

  /**
   * Register custom primitive
   */
  registerPrimitive(name: string, definition: PrimitiveDefinition): void {
    this.primitives.set(name, definition);
  }

  /**
   * Validate AST
   */
  validate(ast: ASTNode): ValidationResult {
    const errors: ValidationError[] = [];

    if (!ast) {
      errors.push({ message: 'AST is null or undefined' });
      return { valid: false, errors };
    }

    // Validate document structure
    if (ast.type !== 'document') {
      errors.push({ message: 'Root must be a document node', path: '' });
    }

    // Validate children
    if (ast.children) {
      for (let i = 0; i < ast.children.length; i++) {
        const child = ast.children[i];
        this.validateNode(child, `children[${i}]`, errors);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate a single node
   */
  private validateNode(node: ASTNode, path: string, errors: ValidationError[]): void {
    if (!node.type) {
      errors.push({ message: 'Node must have a type', path });
      return;
    }

    // Check if primitive exists
    const primitive = this.primitives.get(node.type);
    if (!primitive) {
      // Allow custom elements (they'll be handled by extensions)
      if (!node.type.includes('-')) {
        errors.push({ message: `Unknown primitive: ${node.type}`, path });
      }
      return;
    }

    // Validate attributes
    if (node.attributes) {
      for (const [attrName, attrValue] of Object.entries(node.attributes)) {
        const attrDef = primitive.attributes[attrName];
        
        if (!attrDef) {
          errors.push({
            message: `Unknown attribute: ${attrName}`,
            path: `${path}.${node.type}.@${attrName}`
          });
          continue;
        }

        // Type check
        const actualType = typeof attrValue;
        const expectedType = attrDef.type;
        
        if (expectedType === 'boolean' && typeof attrValue !== 'boolean') {
          errors.push({
            message: `Attribute ${attrName} must be boolean`,
            path: `${path}.${node.type}.@${attrName}`
          });
        } else if (expectedType === 'number' && typeof attrValue !== 'number') {
          errors.push({
            message: `Attribute ${attrName} must be number`,
            path: `${path}.${node.type}.@${attrName}`
          });
        }
      }

      // Check required attributes
      for (const [attrName, attrDef] of Object.entries(primitive.attributes)) {
        if (attrDef.required && !(attrName in (node.attributes || {}))) {
          errors.push({
            message: `Required attribute missing: ${attrName}`,
            path: `${path}.${node.type}`
          });
        }
      }
    }

    // Validate children recursively
    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        this.validateNode(node.children[i], `${path}.${node.type}[${i}]`, errors);
      }
    }
  }

  /**
   * Validate G-Lang string directly
   */
  validateString(grainString: string): ValidationResult {
    // Import parser here to avoid circular dependency
    const { GLangParser } = require('./parser');
    const parser = new GLangParser({ validate: false });
    const result = parser.parse(grainString);
    
    if (!result.ast) {
      return { valid: false, errors: result.errors };
    }
    
    return this.validate(result.ast);
  }
}

/**
 * Create a validator instance
 */
export function createValidator(): Validator {
  return new Validator();
}
