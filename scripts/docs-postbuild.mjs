#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';
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
