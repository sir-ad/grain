#!/usr/bin/env node

import { execFileSync, spawn } from 'node:child_process';
import { once } from 'node:events';
import { existsSync } from 'node:fs';
import { createServer } from 'node:net';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import process from 'node:process';
import { setTimeout as delay } from 'node:timers/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const docsDir = path.join(projectRoot, 'docs');

const HOST = '127.0.0.1';
const BASE_PATH = '/grain/';
const HEALTH_PATH = `${BASE_PATH}`;
const ROOT_PATH = '/';
const DEFAULT_PORTS = [4173, 4174];
const isSmoke = process.argv.includes('--smoke');
const skipBuild = process.argv.includes('--skip-build');

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: projectRoot,
      stdio: options.stdio ?? 'inherit',
      env: process.env
    });

    child.once('error', reject);
    child.once('exit', (code) => {
      if (code === 0) {
        resolve(child);
        return;
      }

      reject(new Error(`${command} ${args.join(' ')} exited with code ${code ?? 'unknown'}`));
    });
  });
}

function getPortDetails(port) {
  try {
    const output = execFileSync('lsof', ['-nP', `-iTCP:${port}`, '-sTCP:LISTEN'], {
      cwd: projectRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();

    if (!output) {
      return null;
    }

    return output.split('\n').slice(1).join('\n');
  } catch {
    return null;
  }
}

function canBind(port) {
  return new Promise((resolve) => {
    const server = createServer();

    server.once('error', () => {
      resolve(false);
    });

    server.listen(port, () => {
      server.close(() => resolve(true));
    });
  });
}

function getEphemeralPort() {
  return new Promise((resolve, reject) => {
    const server = createServer();

    server.once('error', reject);
    server.listen(0, () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        server.close(() => reject(new Error('Could not determine an ephemeral port.')));
        return;
      }

      const { port } = address;
      server.close(() => resolve(port));
    });
  });
}

async function selectPort() {
  const occupied = [];

  for (const port of DEFAULT_PORTS) {
    if (await canBind(port)) {
      return { port, occupied };
    }

    occupied.push({
      port,
      details: getPortDetails(port)
    });
  }

  return {
    port: await getEphemeralPort(),
    occupied
  };
}

function hasNpx() {
  try {
    execFileSync('npx', ['--version'], {
      cwd: projectRoot,
      stdio: ['ignore', 'ignore', 'ignore']
    });
    return true;
  } catch {
    return false;
  }
}

function resolveBrowserExecutable() {
  const candidates = [];

  if (process.platform === 'darwin') {
    candidates.push(
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'
    );
  }

  if (process.platform !== 'win32') {
    try {
      const executable = execFileSync(
        'sh',
        ['-lc', 'command -v google-chrome-stable || command -v google-chrome || command -v chromium || command -v chromium-browser || command -v microsoft-edge || command -v msedge'],
        {
          cwd: projectRoot,
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'ignore']
        }
      ).trim();

      if (executable) {
        candidates.unshift(executable);
      }
    } catch {
      // Ignore lookup failures and fall back to known locations.
    }
  }

  return candidates.find((candidate) => candidate && existsSync(candidate)) ?? null;
}

function runCapture(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd ?? projectRoot,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: process.env
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.once('error', reject);
    child.once('exit', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }

      reject(new Error(stderr.trim() || stdout.trim() || `${command} ${args.join(' ')} exited with code ${code ?? 'unknown'}`));
    });
  });
}

async function fetchWithRetry(url, attempts = 60) {
  let lastError = null;

  for (let index = 0; index < attempts; index += 1) {
    try {
      const response = await fetch(url);
      const text = await response.text();
      return { response, text };
    } catch (error) {
      lastError = error;
      await delay(250);
    }
  }

  throw lastError ?? new Error(`Failed to fetch ${url}`);
}

async function waitForPreview(baseUrl) {
  for (let index = 0; index < 60; index += 1) {
    try {
      const { response, text } = await fetchWithRetry(baseUrl, 1);
      if (response.ok && text.includes('Grain')) {
        return text;
      }
    } catch {
      // Keep retrying while the server starts.
    }

    await delay(250);
  }

  throw new Error(`Preview did not become healthy at ${baseUrl}`);
}

async function smokeCheck(baseUrl) {
  const baseResult = await fetchWithRetry(baseUrl, 10);
  if (!baseResult.response.ok) {
    throw new Error(`Expected ${baseUrl} to return 200, received ${baseResult.response.status}`);
  }

  if (!baseResult.text.includes('Universal interaction layer for AI interfaces')) {
    throw new Error('Homepage hero content did not appear in the preview HTML.');
  }

  if (!baseResult.text.includes('home-playground')) {
    throw new Error('Homepage playground shell did not render in the preview HTML.');
  }

  const origin = new URL(baseUrl).origin;
  const rootResult = await fetchWithRetry(`${origin}${ROOT_PATH}`, 5);
  if (rootResult.response.status !== 404) {
    throw new Error(`Expected ${origin}${ROOT_PATH} to return 404 because the docs base path is ${BASE_PATH}, received ${rootResult.response.status}`);
  }

  await browserSmokeCheck(baseUrl);
}

async function browserSmokeCheck(baseUrl) {
  if (!hasNpx()) {
    console.log('Skipping browser hydration smoke check because `npx` is not available.');
    return;
  }

  const executablePath = resolveBrowserExecutable();
  if (!executablePath) {
    console.log('Skipping browser hydration smoke check because no local Chromium-based browser was found.');
    return;
  }

  const smokeScript = `
    const { chromium } = require('playwright-core');

    const url = process.argv[1];
    const executablePath = process.argv[2];
    const pageErrors = [];

    (async () => {
      const browser = await chromium.launch({ executablePath, headless: true });
      const page = await browser.newPage();
      page.on('pageerror', (error) => pageErrors.push(error.message));

      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForSelector('.home-playground textarea');
      await page.waitForFunction(() => {
        const playground = document.querySelector('.home-playground');
        if (!playground) return false;

        const rendered = playground.querySelector('.rendered');
        const placeholder = playground.querySelector('.placeholder');
        return Boolean(rendered) && !placeholder && rendered.textContent.trim().length > 0;
      }, { timeout: 15000 });

      const hero = await page.evaluate(() => (
        document.querySelector('.VPHero .text')?.textContent ||
        document.querySelector('h1')?.textContent ||
        ''
      ));
      if (!hero.includes('Universal interaction layer for AI interfaces')) {
        throw new Error('Homepage hero content did not render in the browser.');
      }

      if (pageErrors.length > 0) {
        throw new Error('Client-side errors detected: ' + pageErrors.join('; '));
      }

      await browser.close();
    })().catch(async (error) => {
      console.error(error && error.stack ? error.stack : String(error));
      process.exit(1);
    });
  `;

  await runCapture('npx', ['-y', '-p', 'playwright-core', 'node', '-e', smokeScript, baseUrl, executablePath]);
  console.log('Browser hydration smoke check passed.');
}

async function main() {
  if (!skipBuild) {
    console.log('Building docs before preview...');
    await run('pnpm', ['--dir', docsDir, 'build']);
  }

  const { port, occupied } = await selectPort();

  if (occupied.length > 0) {
    console.log('The default docs preview ports are already occupied:');
    for (const entry of occupied) {
      console.log(`- ${entry.port}`);
      if (entry.details) {
        console.log(entry.details);
      }
    }
    console.log(`Using port ${port} instead.`);
  }

  const previewProcess = spawn(
    'pnpm',
    ['--dir', docsDir, 'exec', 'vitepress', 'preview', '--host', HOST, '--port', String(port), '.'],
    {
      cwd: projectRoot,
      stdio: 'inherit',
      env: process.env
    }
  );

  const baseUrl = `http://${HOST}:${port}${HEALTH_PATH}`;

  const terminatePreview = () => {
    if (!previewProcess.killed) {
      previewProcess.kill('SIGTERM');
    }
  };

  process.once('SIGINT', terminatePreview);
  process.once('SIGTERM', terminatePreview);

  try {
    await waitForPreview(baseUrl);
    console.log(`Docs preview ready at ${baseUrl}`);
    console.log(`Note: this VitePress site is mounted at ${BASE_PATH}; opening ${ROOT_PATH} will return 404 by design.`);

    if (isSmoke) {
      await smokeCheck(baseUrl);
      console.log('Docs preview smoke check passed.');
      return;
    }

    await once(previewProcess, 'exit');
  } finally {
    if (isSmoke && previewProcess.exitCode === null && !previewProcess.killed) {
      terminatePreview();
      try {
        await once(previewProcess, 'exit');
      } catch {
        // Ignore teardown errors from the preview child process.
      }
    }

    process.off('SIGINT', terminatePreview);
    process.off('SIGTERM', terminatePreview);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
