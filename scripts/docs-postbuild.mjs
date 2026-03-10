#!/usr/bin/env node

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../docs/.vitepress/dist');
const sitemapPath = path.join(distDir, 'sitemap.xml');

const rawSitemap = readFileSync(sitemapPath, 'utf8');
const fixedSitemap = rawSitemap
  .replaceAll('<loc>https://sir-ad.github.io/grain</loc>', '<loc>https://sir-ad.github.io/grain/</loc>')
  .replace(/<loc>https:\/\/sir-ad\.github\.io\/(?!grain\/|grain<|grain\/<\/loc>)([^<]*)<\/loc>/g, (_match, relativePath) => {
    const normalizedPath = String(relativePath).replace(/^\/+/, '');
    return `<loc>https://sir-ad.github.io/grain/${normalizedPath}</loc>`;
  });

if (fixedSitemap !== rawSitemap) {
  writeFileSync(sitemapPath, fixedSitemap, 'utf8');
  console.log('Post-processed docs sitemap for the /grain/ base path.');
} else {
  console.log('Docs sitemap already matches the /grain/ base path.');
}

function collectHtmlFiles(directory) {
  const files = [];

  for (const entry of readdirSync(directory)) {
    const fullPath = path.join(directory, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      files.push(...collectHtmlFiles(fullPath));
      continue;
    }

    if (fullPath.endsWith('.html')) {
      files.push(fullPath);
    }
  }

  return files;
}

function rewriteHtml(html) {
  return html
    .replace(/class="VPContent is-home" id="VPContent"/g, 'class="VPContent is-home" id="VPContent" role="main" aria-label="Main documentation content"')
    .replace(/class="DocSearch DocSearch-Button" aria-label="Search"/g, 'class="DocSearch DocSearch-Button" aria-label="Search K" title="Search K"')
    .replace(/<span class="DocSearch-Button-Keys">/g, '<span class="DocSearch-Button-Keys" aria-hidden="true">')
    .replace(/class="VPSwitch VPSwitchAppearance" type="button" role="switch" title(?:="[^"]*")? aria-checked="false"/g, 'class="VPSwitch VPSwitchAppearance" type="button" role="switch" title="Toggle color theme" aria-label="Toggle color theme" aria-checked="false"')
    .replace(/class="VPSwitch VPSwitchAppearance" type="button" role="switch" title(?:="[^"]*")? aria-checked="true"/g, 'class="VPSwitch VPSwitchAppearance" type="button" role="switch" title="Toggle color theme" aria-label="Toggle color theme" aria-checked="true"')
    .replace(/<img class="VPImage logo" src="([^"]+)" alt="Grain logo"/g, '<img class="VPImage logo" src="$1" alt="Grain logo" width="24" height="24" decoding="async"')
    .replace(/target="_blank" rel="noreferrer"/g, 'target="_blank" rel="noreferrer noopener"')
    .replace(/target="_blank" rel="noopener"/g, 'target="_blank" rel="noopener noreferrer"')
    .replace(/aria-label="github"/g, 'aria-label="GitHub" title="GitHub"')
    .replace(/<span class="vpi-social-github"><\/span><\/a>/g, '<span class="vpi-social-github"></span><span class="sr-only">GitHub</span></a>');
}

for (const htmlFile of collectHtmlFiles(distDir)) {
  const rawHtml = readFileSync(htmlFile, 'utf8');
  const fixedHtml = rewriteHtml(rawHtml);

  if (fixedHtml !== rawHtml) {
    writeFileSync(htmlFile, fixedHtml, 'utf8');
  }
}
