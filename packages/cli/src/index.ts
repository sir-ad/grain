#!/usr/bin/env node

/**
 * CLI Adapter for Grain
 * Renders G-Lang to terminal output
 */

import { GLangParser } from 'grain';
import chalk from 'chalk';
import ora from 'ora';
import { readFileSync, watch } from 'fs';
import { resolve } from 'path';

interface CLIOptions {
  input?: string;
  output?: string;
  watch?: boolean;
  theme?: 'light' | 'dark';
}

const ANSI = {
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
  DIM: '\x1b[2m',
  BLACK: '\x1b[30m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  CYAN: '\x1b[36m',
  WHITE: '\x1b[37m',
  TOP_LEFT: '┌',
  TOP_RIGHT: '┐',
  BOTTOM_LEFT: '└',
  BOTTOM_RIGHT: '┘',
  HORIZONTAL: '─',
  VERTICAL: '│',
  CLEAR_SCREEN: '\x1b[2J',
  MOVE_HOME: '\x1b[H'
};

export class CLIAdapter {
  private parser: GLangParser;
  private theme: 'light' | 'dark';
  
  constructor(options: { theme?: 'light' | 'dark' } = {}) {
    this.parser = new GLangParser();
    this.theme = options.theme || 'light';
  }

  render(grain: string): string {
    const result = this.parser.parse(grain);
    if (!result.ast || result.errors.length > 0) {
      return chalk.red(`Parse error: ${result.errors[0]?.message}`);
    }
    return this.renderAST(result.ast);
  }

  private renderAST(node: any): string {
    if (!node) return '';
    if (node.type === 'document') {
      return node.children?.map((c: any) => this.renderAST(c)).join('\n') || '';
    }
    if (node.type === 'text') return node.value || '';

    switch (node.type) {
      case 'message': return this.renderMessage(node);
      case 'stream': return this.renderStream(node);
      case 'think': return this.renderThink(node);
      case 'tool': return this.renderTool(node);
      case 'artifact': return this.renderArtifact(node);
      case 'error': return this.renderError(node);
      case 'approve': return this.renderApprove(node);
      case 'state': return this.renderState(node);
      default: return node.children?.map((c: any) => this.renderAST(c)).join('') || '';
    }
  }

  private renderMessage(node: any): string {
    const role = node.attributes?.role || 'assistant';
    const content = node.children?.map((c: any) => this.renderAST(c)).join(' ');
    return `${chalk.bold(role === 'user' ? 'You' : 'AI')}: ${content}`;
  }

  private renderStream(node: any): string {
    return node.children?.map((c: any) => this.renderAST(c)).join('') || '';
  }

  private renderThink(node: any): string {
    const visible = node.attributes?.visible === 'true';
    if (!visible) return chalk.dim('○ Thinking...');
    const content = node.children?.map((c: any) => this.renderAST(c)).join('\n');
    return `${chalk.dim('│')} ${chalk.dim(content)}`;
  }

  private renderTool(node: any): string {
    const name = node.attributes?.name || 'unknown';
    const status = node.attributes?.status || 'pending';
    const icons: Record<string, string> = { pending: '○', running: '◐', complete: '✓', error: '✗' };
    const colors: Record<string, any> = { pending: chalk.dim, running: chalk.yellow, complete: chalk.green, error: chalk.red };
    return `${colors[status](icons[status])} Tool: ${chalk.bold(name)}`;
  }

  private renderArtifact(node: any): string {
    const type = node.attributes?.type || 'text';
    const content = node.children?.map((c: any) => this.renderAST(c)).join('\n') || '';
    return chalk.cyan(`[${type.toUpperCase()}]\n${content}`);
  }

  private renderError(node: any): string {
    const code = node.attributes?.code || 'ERROR';
    const content = node.children?.map((c: any) => this.renderAST(c)).join(' ') || '';
    return `${chalk.red('✗')} ${chalk.red.bold(code)}: ${chalk.red(content)}`;
  }

  private renderApprove(node: any): string {
    const action = node.attributes?.action || '';
    return `${chalk.yellow('?')} Confirm: ${action}`;
  }

  private renderState(node: any): string {
    const status = node.attributes?.status || 'idle';
    const message = node.attributes?.message || status;
    return chalk.dim(`○ ${message}`);
  }

  private stripAnsi(str: string): string {
    return str.replace(/\x1b\[[0-9;]*m/g, '');
  }
}

async function main() {
  const args = process.argv.slice(2);
  const options: CLIOptions = {};
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--input' || args[i] === '-i') options.input = args[++i];
    else if (args[i] === '--watch' || args[i] === '-w') options.watch = true;
    else if (args[i] === '--theme') options.theme = args[++i] as 'light' | 'dark';
  }

  const adapter = new CLIAdapter({ theme: options.theme });
  
  if (options.input) {
    const content = readFileSync(resolve(options.input), 'utf-8');
    console.clear();
    console.log(adapter.render(content));
    if (options.watch) {
      watch(options.input, () => {
        console.clear();
        console.log(adapter.render(content));
      });
    }
  }
}

export { CLIAdapter };

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
