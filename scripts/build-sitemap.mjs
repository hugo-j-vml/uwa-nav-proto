#!/usr/bin/env node
/**
 * Converts data/sitemap.csv into src/data/sitemap.json and validates it.
 *
 * CSV format: one column per level (L1, L2, L3, ...). Each row puts its label
 * in exactly one column; its parent is the nearest row above it at the
 * previous level. This is the usual "indented IA spreadsheet" layout, so the
 * IA can be edited in Excel / Google Sheets and exported as CSV.
 *
 * Usage: npm run sitemap   (also runs automatically before dev and build)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const csvPath = join(root, 'data/sitemap.csv');
const outPath = join(root, 'src/data/sitemap.json');

/** Minimal CSV parser that handles quoted fields with commas and "" escapes. */
function parseCsv(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = '';
    } else field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const slugify = (s) =>
  s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const rows = parseCsv(readFileSync(csvPath, 'utf8').replace(/^﻿/, ''));
const [header, ...body] = rows;
const errors = [], warnings = [];
const rootNode = { children: [] };
const stack = [rootNode]; // stack[level] = last node seen at that level (level 1-based)
let count = 0, maxDepth = 0;

body.forEach((cells, i) => {
  const line = i + 2;
  const filled = cells.map((c, idx) => [c.trim(), idx]).filter(([c]) => c);
  if (filled.length === 0) return; // blank row
  if (filled.length > 1) { errors.push(`Row ${line}: more than one column filled (${filled.map(f => f[0]).join(' | ')})`); return; }
  const [label, idx] = filled[0];
  const level = idx + 1;
  const parent = stack[level - 1];
  if (!parent) { errors.push(`Row ${line}: "${label}" is at level ${level} but has no parent at level ${level - 1} above it`); return; }
  const slug = slugify(label);
  if (!slug) { errors.push(`Row ${line}: "${label}" produces an empty URL slug`); return; }
  const path = parent.path ? `${parent.path}/${slug}` : slug;
  if (parent.children.some(c => c.slug === slug)) errors.push(`Row ${line}: duplicate label "${label}" under the same parent`);
  const node = { id: path, label, slug, path, level, children: [] };
  parent.children.push(node);
  stack[level] = node;
  stack.length = level + 1;
  count++; maxDepth = Math.max(maxDepth, level);
});

// Warn on duplicate labels anywhere (allowed, but can confuse test participants)
const seen = new Map();
(function walk(nodes) { for (const n of nodes) { seen.set(n.label, (seen.get(n.label) || 0) + 1); walk(n.children); } })(rootNode.children);
for (const [label, n] of seen) if (n > 1) warnings.push(`Label "${label}" appears ${n} times in different places`);

if (errors.length) {
  console.error(`\nSitemap has ${errors.length} error(s):\n  - ${errors.join('\n  - ')}\n`);
  process.exit(1);
}
writeFileSync(outPath, JSON.stringify({ generated: new Date().toISOString(), source: 'data/sitemap.csv', columns: header, nodes: rootNode.children }, null, 2) + '\n');
console.log(`Sitemap: ${count} pages, ${rootNode.children.length} top-level items, max depth ${maxDepth} -> src/data/sitemap.json`);
if (warnings.length) console.warn(`Warnings:\n  - ${warnings.join('\n  - ')}`);
