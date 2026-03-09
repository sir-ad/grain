#!/usr/bin/env node

/**
 * CLI Adapter for Grain
 * Renders Grain Language to terminal output.
 */

import { readFileSync, watch, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

import { GLangParser, type ASTNode } from '@grain.sh/core';
import chalk from 'chalk';

const require = createRequire(import.meta.url);
const packageJson = require('../package.json') as { version: string };

interface CLIOptions {
  input?: string;
  output?: string;
  watch?: boolean;
  theme?: 'light' | 'dark';
}

const HELP_TEXT = `
Usage:
  grain --input <file> [--watch] [--output <file>]
  grain --help
  grain --version
`.trim();

export class CLIAdapter {
  private readonly parser: GLangParser;
  private readonly theme: 'light' | 'dark';

  constructor(options: { theme?: 'light' | 'dark' } = {}) {
    this.parser = new GLangParser();
    this.theme = options.theme || 'light';
  }

  render(grain: string): string {
    const result = this.parser.parse(grain);
    if (!result.ast || result.errors.length > 0) {
      return chalk.red(`Parse error: ${result.errors[0]?.message}`);
    }

    return this.renderAST(result.ast).trim();
  }

  private renderAST(node: ASTNode): string {
    if (node.type === 'document') {
      return node.children?.map((child) => this.renderAST(child)).filter(Boolean).join('\n') ?? '';
    }

    if (node.type === 'text') {
      return node.value ?? '';
    }

    switch (node.type) {
      case 'message':
        return this.renderMessage(node);
      case 'stream':
        return this.renderChildren(node, '');
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
      case 'result':
        return this.renderResult(node);
      case 'progress':
        return this.renderProgress(node);
      case 'warning':
        return `${chalk.yellow('!')} ${this.renderChildren(node, ' ').trim()}`;
      case 'actions':
        return this.renderChildren(node, '\n');
      case 'action':
      case 'option':
      case 'suggestion':
      case 'item':
        return this.renderChoice(node);
      default:
        return this.renderChildren(node, '');
    }
  }

  private renderMessage(node: ASTNode): string {
    const role = node.attributes?.role || 'assistant';
    const label = role === 'user' ? 'You' : 'AI';
    const content = this.renderChildren(node, '\n').trim();
    return `${chalk.bold(label)}: ${content}`;
  }

  private renderThink(node: ASTNode): string {
    const visible = node.attributes?.visible === 'true';
    if (!visible) {
      return chalk.dim('○ Thinking...');
    }

    return `${chalk.dim('│')} ${this.renderChildren(node, '\n').trim()}`;
  }

  private renderTool(node: ASTNode): string {
    const name = node.attributes?.name || 'unknown';
    const status = node.attributes?.status || 'pending';
    const icons: Record<string, string> = {
      pending: '○',
      running: '◐',
      complete: '✓',
      error: '✗'
    };
    const colors: Record<string, typeof chalk> = {
      pending: chalk,
      running: chalk.yellow,
      complete: chalk.green,
      error: chalk.red
    };

    const children = this.renderChildren(node, '\n').trim();
    const header = `${colors[status] ? colors[status](icons[status] || '○') : chalk.dim('○')} Tool: ${chalk.bold(name)}`;
    return children ? `${header}\n${children}` : header;
  }

  private renderArtifact(node: ASTNode): string {
    const type = node.attributes?.type || 'text';
    const content = this.renderChildren(node, '\n').trim();
    return chalk.cyan(`[${type.toUpperCase()}]\n${content}`);
  }

  private renderError(node: ASTNode): string {
    const code = node.attributes?.code || 'ERROR';
    const message = node.attributes?.message || this.renderChildren(node, ' ').trim();
    return `${chalk.red('✗')} ${chalk.red.bold(code)}: ${chalk.red(message)}`;
  }

  private renderApprove(node: ASTNode): string {
    const action = node.attributes?.action || '';
    const warning = node.attributes?.warning ? `\n${chalk.yellow('!')} ${node.attributes.warning}` : '';
    const choices = node.children
      ?.filter((child) => child.type === 'option' || child.type === 'action')
      .map((child) => this.renderChoice(child))
      .join('\n') ?? '';

    return `${chalk.yellow('?')} Confirm: ${action}${warning}${choices ? `\n${choices}` : ''}`;
  }

  private renderState(node: ASTNode): string {
    const status = node.attributes?.status || 'idle';
    const message = node.attributes?.message || status;
    return chalk.dim(`○ ${message}`);
  }

  private renderResult(node: ASTNode): string {
    const attributes = node.attributes
      ? Object.entries(node.attributes).map(([key, value]) => `${key}: ${value}`).join(', ')
      : '';
    const content = this.renderChildren(node, ' ').trim();
    const value = [attributes, content].filter(Boolean).join(' ');
    return value ? chalk.green(`Result: ${value}`) : chalk.green('Result ready');
  }

  private renderProgress(node: ASTNode): string {
    const value = node.attributes?.value;
    const max = node.attributes?.max;
    const text = this.renderChildren(node, ' ').trim();
    if (value && max) {
      return chalk.yellow(`Progress: ${value}/${max}${text ? ` ${text}` : ''}`);
    }

    return chalk.yellow(`Progress: ${text || 'running'}`);
  }

  private renderChoice(node: ASTNode): string {
    const label = node.attributes?.label || node.attributes?.name || this.renderChildren(node, ' ').trim();
    const primary = node.attributes?.primary === 'true';
    return primary ? chalk.bold(`[${label}]`) : `[${label}]`;
  }

  private renderChildren(node: ASTNode, separator: string): string {
    return node.children?.map((child) => this.renderAST(child)).filter(Boolean).join(separator) ?? '';
  }
}

function renderFile(adapter: CLIAdapter, options: CLIOptions): void {
  if (!options.input) {
    console.error(HELP_TEXT);
    process.exitCode = 1;
    return;
  }

  const content = readFileSync(resolve(options.input), 'utf8');
  const rendered = adapter.render(content);

  if (options.output) {
    writeFileSync(resolve(options.output), `${rendered}\n`, 'utf8');
    return;
  }

  console.clear();
  console.log(rendered);
}

function parseArgs(argv: string[]): CLIOptions {
  const options: CLIOptions = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--input' || arg === '-i') {
      options.input = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === '--output' || arg === '-o') {
      options.output = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === '--watch' || arg === '-w') {
      options.watch = true;
      continue;
    }

    if (arg === '--theme') {
      options.theme = argv[index + 1] as 'light' | 'dark';
      index += 1;
    }
  }

  return options;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(HELP_TEXT);
    return;
  }

  if (args.includes('--version') || args.includes('-v')) {
    console.log(packageJson.version);
    return;
  }

  const options = parseArgs(args);
  const adapter = new CLIAdapter({ theme: options.theme });
  renderFile(adapter, options);

  if (options.watch && options.input) {
    watch(resolve(options.input), { persistent: true }, () => {
      renderFile(adapter, options);
    });
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
