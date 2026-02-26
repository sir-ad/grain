#!/usr/bin/env node

/**
 * CLI Adapter for AI Semantics
 * Renders G-Lang to terminal output
 */

import { GLangParser } from '@ai-semantics/core';
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

/**
 * ANSI escape codes
 */
const ANSI = {
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
  DIM: '\x1b[2m',
  
  // Colors
  BLACK: '\x1b[30m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  MAGENTA: '\x1b[35m',
  CYAN: '\x1b[36m',
  WHITE: '\x1b[37m',
  
  // Backgrounds
  BG_BLACK: '\x1b[40m',
  BG_RED: '\x1b[41m',
  BG_GREEN: '\x1b[42m',
  BG_YELLOW: '\x1b[43m',
  BG_BLUE: '\x1b[44m',
  BG_MAGENTA: '\x1b[45m',
  BG_CYAN: '\x1b[46m',
  BG_WHITE: '\x1b[47m',
  
  // Box drawing
  TOP_LEFT: '┌',
  TOP_RIGHT: '┐',
  BOTTOM_LEFT: '└',
  BOTTOM_RIGHT: '┘',
  HORIZONTAL: '─',
  VERTICAL: '│',
  
  // Effects
  BLINK: '\x1b[5m',
  CURSOR_HIDE: '\x1b[?25l',
  CURSOR_SHOW: '\x1b[?25h',
  
  // Clear
  CLEAR_SCREEN: '\x1b[2J',
  CLEAR_LINE: '\x1b[2K',
  MOVE_HOME: '\x1b[H'
};

/**
 * Render AST to CLI output
 */
export class CLIAdapter {
  private parser: GLangParser;
  private theme: 'light' | 'dark';
  
  constructor(options: { theme?: 'light' | 'dark' } = {}) {
    this.parser = new GLangParser();
    this.theme = options.theme || 'light';
  }

  /**
   * Render G-Lang to CLI output
   */
  render(grain: string): string {
    const result = this.parser.parse(grain);
    
    if (!result.ast || result.errors.length > 0) {
      return chalk.red(`Parse error: ${result.errors[0]?.message}`);
    }

    return this.renderAST(result.ast);
  }

  /**
   * Render AST to string
   */
  private renderAST(node: any): string {
    if (!node) return '';
    
    if (node.type === 'document') {
      return node.children?.map((c: any) => this.renderAST(c)).join('\n') || '';
    }
    
    if (node.type === 'text') {
      return node.value || '';
    }

    switch (node.type) {
      case 'message':
        return this.renderMessage(node);
      case 'stream':
        return this.renderStream(node);
      case 'think':
        return this.renderThink(node);
      case 'tool':
        return this.renderTool(node);
      case 'artifact':
        return this.renderArtifact(node);
      case 'error':
        return this.renderError(node);
      case 'approve':
        return this.renderApprove(node);
      case 'state':
        return this.renderState(node);
      default:
        return node.children?.map((c: any) => this.renderAST(c)).join('') || '';
    }
  }

  private renderMessage(node: any): string {
    const role = node.attributes?.role || 'assistant';
    const content = node.children?.map((c: any) => this.renderAST(c)).join(' ');
    
    const box = this.createBox(content, {
      title: role === 'user' ? ' You ' : ' AI ',
      style: role === 'user' ? 'user' : 'assistant'
    });
    
    return box;
  }

  private renderStream(node: any): string {
    const speed = node.attributes?.speed || 'normal';
    const cursor = node.attributes?.cursor !== 'false';
    const content = node.children?.map((c: any) => this.renderAST(c)).join('') || '';
    
    let rendered = content;
    if (cursor && speed !== 'fast') {
      rendered += '▋';
    }
    
    return rendered;
  }

  private renderThink(node: any): string {
    const visible = node.attributes?.visible === 'true';
    const content = node.children?.map((c: any) => this.renderAST(c)).join('\n') || '';
    
    if (!visible) {
      return chalk.dim('○ Thinking...');
    }
    
    return `${chalk.dim('│')} ${chalk.dim('Reasoning:')}\n${chalk.dim(content)}`;
  }

  private renderTool(node: any): string {
    const name = node.attributes?.name || 'unknown';
    const status = node.attributes?.status || 'pending';
    const content = node.children?.map((c: any) => this.renderAST(c)).join(' ') || '';
    
    const icons: Record<string, string> = {
      pending: '○',
      running: '◐',
      complete: '✓',
      error: '✗'
    };
    
    const colors: Record<string, any> = {
      pending: chalk.dim,
      running: chalk.yellow,
      complete: chalk.green,
      error: chalk.red
    };
    
    const icon = icons[status] || '○';
    const color = colors[status] || chalk.dim;
    
    return `${color(icon)} Tool: ${chalk.bold(name)}${content ? '\n  ' + content : ''}`;
  }

  private renderArtifact(node: any): string {
    const type = node.attributes?.type || 'text';
    const title = node.attributes?.title || '';
    const language = node.attributes?.language || '';
    const content = node.children?.map((c: any) => this.renderAST(c)).join('\n') || '';
    
    let boxContent = content;
    if (language) {
      boxContent = `${chalk.dim(`Language: ${language}`)}\n${content}`;
    }
    
    return this.createBox(boxContent, {
      title: title ? ` ${title} ` : ` ${type.toUpperCase()} `,
      style: 'artifact'
    });
  }

  private renderError(node: any): string {
    const code = node.attributes?.code || 'ERROR';
    const content = node.children?.map((c: any) => this.renderAST(c)).join(' ') || '';
    const recoverable = node.attributes?.recoverable === 'true';
    
    let output = `${chalk.red('✗')} ${chalk.red.bold(code)}: ${chalk.red(content)}`;
    
    if (recoverable) {
      output += `\n${chalk.dim('[Retry] [Cancel]')}`;
    }
    
    return output;
  }

  private renderApprove(node: any): string {
    const action = node.attributes?.action || '';
    const warning = node.attributes?.warning || '';
    const content = node.children?.map((c: any) => this.renderAST(c)).join('\n') || '';
    
    let boxContent = '';
    if (warning) {
      boxContent += `${chalk.yellow('⚠ ' + warning)}\n\n`;
    }
    boxContent += content || 'Confirm this action?';
    
    return this.createBox(boxContent, {
      title: ' Confirm ',
      style: 'warning'
    });
  }

  private renderState(node: any): string {
    const status = node.attributes?.status || 'idle';
    const message = node.attributes?.message || '';
    
    const spinners: Record<string, string> = {
      loading: '◐',
      thinking: '○',
      streaming: '◌'
    };
    
    const spinner = spinners[status] || '○';
    const color = status === 'error' ? chalk.red : chalk.dim;
    
    return `${color(spinner)} ${message || status}`;
  }

  /**
   * Create a box with content
   */
  private createBox(content: string, options: {
    title?: string;
    style?: 'user' | 'assistant' | 'artifact' | 'warning' | 'default';
  } = {}): string {
    const { title = '', style = 'default' } = options;
    
    const width = Math.min(process.stdout.columns - 4 || 60, 80);
    const lines = content.split('\n').filter(l => l.trim());
    
    const borderColors: Record<string, any> = {
      user: chalk,
      assistant: chalk,
      artifact: chalk.cyan,
      warning: chalk.yellow,
      default: chalk
    };
    
    const color = borderColors[style] || chalk;
    const h = color(ANSI.HORIZONTAL);
    
    let box = '';
    
    // Top border
    box += color(ANSI.TOP_LEFT) + h.repeat(width - 2) + color(ANSI.TOP_RIGHT) + '\n';
    
    // Title
    if (title) {
      const pad = width - 4 - title.length;
      box += color(ANSI.VERTICAL) + ' ' + chalk.bold(title) + ' '.repeat(Math.max(0, pad)) + ' ' + color(ANSI.VERTICAL) + '\n';
      box += color(ANSI.VERTICAL) + h.repeat(width - 2) + color(ANSI.VERTICAL) + '\n';
    }
    
    // Content
    for (const line of lines) {
      const pad = width - 4 - this.stripAnsi(line).length;
      box += color(ANSI.VERTICAL) + ' ' + line + ' '.repeat(Math.max(0, pad)) + ' ' + color(ANSI.VERTICAL) + '\n';
    }
    
    // Bottom border
    box += color(ANSI.BOTTOM_LEFT) + h.repeat(width - 2) + color(ANSI.BOTTOM_RIGHT);
    
    return box;
  }

  /**
   * Strip ANSI codes from string
   */
  private stripAnsi(str: string): string {
    return str.replace(/\x1b\[[0-9;]*m/g, '');
  }
}

/**
 * CLI entry point
 */
async function main() {
  const args = process.argv.slice(2);
  const options: CLIOptions = {};
  
  // Parse args
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--input' || args[i] === '-i') {
      options.input = args[++i];
    } else if (args[i] === '--output' || args[i] === '-o') {
      options.output = args[++i];
    } else if (args[i] === '--watch' || args[i] === '-w') {
      options.watch = true;
    } else if (args[i] === '--theme') {
      options.theme = args[++i] as 'light' | 'dark';
    }
  }

  const adapter = new CLIAdapter({ theme: options.theme });
  
  // Render function
  const render = () => {
    if (options.input) {
      const content = readFileSync(resolve(options.input), 'utf-8');
      const output = adapter.render(content);
      console.clear();
      console.log(output);
    }
  };
  
  // Initial render
  render();
  
  // Watch mode
  if (options.watch && options.input) {
    console.log(chalk.dim('\nWatching for changes...'));
    watch(options.input, render);
  }
}

// Export for programmatic use
export { CLIAdapter };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
