/**
 * Web Adapter Types
 */

import type { ASTNode } from 'grain';

export interface WebAdapterConfig {
  theme?: Record<string, string>;
  classPrefix?: string;
  namespace?: string;
}

export interface RenderOptions {
  container?: HTMLElement | string;
  position?: 'replace' | 'append' | 'prepend' | 'before' | 'after';
  animate?: boolean;
}

export interface WebComponentConfig {
  name: string;
  shadow?: boolean;
  style?: string;
}
