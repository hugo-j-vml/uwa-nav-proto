#!/usr/bin/env node
/**
 * Converts data/sitemap.csv into src/data/sitemap.json and validates it.
 *
 * CSV format: one column per level (L1, L2, L3, ...). Two styles work, and can be mixed:
 *   - indented: each row has one label; its parent is the nearest item above it
 *     one level up
 *   - paths: a row lists a chain left to right (Study, Study areas, Architecture
 *     and Design); repeated labels under the same parent are merged
 * If a row skips a level, the item goes under the most recent item one level up
 * (with a warning).
 * The optional columns below apply to the last (deepest) label on the row.
 *
 * Optional extra columns (any order, after or before the level columns):
 *   template  landing | content | course | cobranded
 *             (blank = landing for L1, content for everything else)
 *   eyebrow   course pages: small heading above the title (e.g. Undergraduate)
 *   intro     course pages: intro line under the title
 *   body      course pages: paragraph under the in-page tabs
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

const rows = parseCsv(readFileSync(csvPath, 'utf8').replace(/^\uFEFF/, ''));
const [header, ...body] = rows;
const errors = [], warnings = [];
const TEMPLATES = ['landing', 'content', 'course', 'cobranded'];
const META = ['template', 'eyebrow', 'intro', 'body'];

// Work out which columns are levels (L1, L2, ...) and which are extra fields
const levelCols = [], metaCols = {};
header.forEach((h, idx) => {
  const name = h.trim().toLowerCase();
  const m = name.match(/^l(\d+)$/);
  if (m) levelCols.push({ idx, level: Number(m[1]) });
  else if (META.includes(name)) metaCols[name] = idx;
  else if (name) warnings.push(`Column "${h.trim()}" isn't recognised and is ignored`);
});
levelCols.sort((a, b) => a.level - b.level);
if (!levelCols.length) { console.error('Sitemap CSV needs level columns named L1, L2, L3 ...'); process.exit(1); }

const rootNode = { children: [] };
const stack = [rootNode];  // stack[level] = current node at that level on this branch (level 1-based)
const lastSeen = [rootNode]; // lastSeen[level] = most recent node created at that level anywhere above
let count = 0, maxDepth = 0;

body.forEach((cells, i) => {
  const line = i + 2;
  const filled = levelCols.map(({ idx, level }) => [(cells[idx] || '').trim(), level]).filter(([c]) => c);
  if (filled.length === 0) return; // blank row
  const meta = Object.fromEntries(Object.entries(metaCols).map(([k, idx]) => [k, (cells[idx] || '').trim()]));

  // A row can hold one label (indented style) or a path of labels left to right
  // (e.g. "Study, Study areas, Architecture and Design"). Labels that already
  // exist under the same parent are reused, so repeating "Study" on each row is fine.
  filled.forEach(([label, level], j) => {
    const isLast = j === filled.length - 1;
    let parent = stack[level - 1];
    if (!parent || (j > 0 && filled[j - 1][1] !== level - 1)) {
      // Level skipped: attach to the most recent item one level up (agreed rule)
      parent = lastSeen[level - 1];
      if (!parent) { errors.push(`Row ${line}: "${label}" is at level ${level} but there is no level ${level - 1} item above it`); return; }
      warnings.push(`Row ${line}: "${label}" skips a level; placed under "${parent.label}"`);
    }
    const slug = slugify(label);
    if (!slug) { errors.push(`Row ${line}: "${label}" produces an empty URL slug`); return; }
    let node = parent.children.find(c => c.slug === slug);
    if (!node) {
      const path = parent.path ? `${parent.path}/${slug}` : slug;
      node = { id: path, label, slug, path, level, template: '', children: [] };
      parent.children.push(node);
      count++; maxDepth = Math.max(maxDepth, level);
    }
    if (isLast) {
      let template = (meta.template || '').toLowerCase().replace(/[^a-z]/g, '');
      if (template === 'cobrandedsite') template = 'cobranded';
      if (template && !TEMPLATES.includes(template)) errors.push(`Row ${line}: template "${meta.template}" isn't one of ${TEMPLATES.join(', ')}`);
      else if (template) node.template = template;
      for (const k of ['eyebrow', 'intro', 'body']) if (meta[k]) node[k] = meta[k];
    }
    stack[level] = node;
    stack.length = level + 1;
    lastSeen[level] = node;
  });
});

// Default templates: landing for top level, content for everything else
(function defaults(nodes) { for (const n of nodes) { if (!n.template) n.template = n.level === 1 ? 'landing' : 'content'; defaults(n.children); } })(rootNode.children);

// Warn on duplicate labels anywhere (allowed, but can confuse test participants)
const seen = new Map();
(function walk(nodes) { for (const n of nodes) { seen.set(n.label, (seen.get(n.label) || 0) + 1); walk(n.children); } })(rootNode.children);
for (const [label, n] of seen) if (n > 1) warnings.push(`Label "${label}" appears ${n} times in different places`);

if (errors.length) {
  console.error(`\nSitemap has ${errors.length} error(s):\n  - ${errors.join('\n  - ')}\n`);
  process.exit(1);
}
writeFileSync(outPath, JSON.stringify({ generated: new Date().toISOString(), source: 'data/sitemap.csv', columns: header, nodes: rootNode.children }, null, 2) + '\n');
const byTemplate = {};
(function tally(nodes) { for (const n of nodes) { byTemplate[n.template] = (byTemplate[n.template] || 0) + 1; tally(n.children); } })(rootNode.children);
console.log(`Sitemap: ${count} pages, ${rootNode.children.length} top-level items, max depth ${maxDepth} -> src/data/sitemap.json`);
console.log(`Templates: ${Object.entries(byTemplate).map(([k, v]) => `${k} ${v}`).join(', ')}`);
if (warnings.length) console.warn(`Warnings:\n  - ${warnings.join('\n  - ')}`);
