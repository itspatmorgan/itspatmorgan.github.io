/**
 * Normalize Obsidian newsletter frontmatter to the canonical schema.
 *
 * Run from the repo root:
 *   node scripts/normalize-obsidian-newsletters.mjs [--dry-run]
 *
 * What it does for each file:
 * - Adds `title` (derived from filename) if missing
 * - Adds `tags: []` if missing
 * - Rewrites frontmatter in canonical field order
 *
 * Idempotent — skips files whose content hasn't changed.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, basename, resolve } from 'path';

const DRY_RUN = process.argv.includes('--dry-run');
loadLocalEnv();

const VAULT = process.env.OBSIDIAN_VAULT;
if (!VAULT) {
  console.error('Missing OBSIDIAN_VAULT. Set it in your shell or in .env.local.');
  process.exit(1);
}

const NEWSLETTERS_DIR = join(VAULT, 'Newsletters');

// Canonical field order matching the Newsletter template
const FIELD_ORDER = [
  'title', 'description', 'publishedDate', 'categories', 'tags',
  'image', 'canonicalUrl', 'draft', 'website', 'created',
];

let normalized = 0, skipped = 0, errors = 0;

function loadLocalEnv() {
  const envPath = resolve('.env.local');
  if (!existsSync(envPath)) return;

  const lines = readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separator = trimmed.indexOf('=');
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    const rawValue = trimmed.slice(separator + 1).trim();
    if (!key || process.env[key] !== undefined) continue;

    process.env[key] = rawValue.replace(/^["']|["']$/g, '');
  }
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return null;
  return { raw: match[1], body: match[2] };
}

function parseSimpleYaml(raw) {
  const fields = {};
  const lines = raw.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const arrayKey = line.match(/^(\w+):\s*$/);
    if (arrayKey && i + 1 < lines.length && lines[i + 1].match(/^\s+-/)) {
      const key = arrayKey[1];
      const items = [];
      i++;
      while (i < lines.length && lines[i].match(/^\s+-/)) {
        items.push(lines[i].replace(/^\s+-\s*/, '').trim());
        i++;
      }
      fields[key] = items;
      continue;
    }
    const inlineArray = line.match(/^(\w+):\s*\[(.*)]\s*$/);
    if (inlineArray) {
      fields[inlineArray[1]] = inlineArray[2].split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
      i++;
      continue;
    }
    const scalar = line.match(/^(\w+):\s*(.*)\s*$/);
    if (scalar) {
      fields[scalar[1]] = scalar[2].replace(/^["']|["']$/g, '');
      i++;
      continue;
    }
    i++;
  }
  return fields;
}

function serializeFrontmatter(fields) {
  const lines = [];
  for (const key of FIELD_ORDER) {
    if (!(key in fields)) continue;
    appendField(lines, key, fields[key]);
  }
  return lines.join('\n');
}

function appendField(lines, key, val) {
  if (Array.isArray(val)) {
    if (val.length === 0) {
      lines.push(`${key}: []`);
    } else {
      lines.push(`${key}:`);
      for (const item of val) lines.push(`  - ${item}`);
    }
  } else if (typeof val === 'boolean') {
    lines.push(`${key}: ${val}`);
  } else if (val === '' || val === null || val === undefined) {
    lines.push(`${key}: `);
  } else {
    const needsQuotes = /[:#\[\]{}&*!|>'"%@`]/.test(String(val)) || String(val).startsWith(' ');
    lines.push(`${key}: ${needsQuotes ? `"${String(val).replace(/"/g, '\\"')}"` : val}`);
  }
}

function titleFromFilename(fileName) {
  return basename(fileName, '.md');
}

function normalizeFile(filePath, fileName) {
  const content = readFileSync(filePath, 'utf8');
  const parsed = parseFrontmatter(content);
  if (!parsed) {
    console.warn(`  SKIP (no frontmatter): ${fileName}`);
    skipped++;
    return;
  }

  const fields = parseSimpleYaml(parsed.raw);
  let changed = false;

  // Add title from filename if missing
  if (!fields.title || fields.title === '') {
    fields.title = titleFromFilename(fileName);
    changed = true;
  }

  // Add empty tags array if missing
  if (!('tags' in fields)) {
    fields.tags = [];
    changed = true;
  }

  // Normalise draft string to boolean
  if (typeof fields.draft === 'string') {
    fields.draft = fields.draft === 'false' ? false : true;
    changed = true;
  }

  // Check if field order already matches canonical order
  const existingKeys = Object.keys(fields).filter(k => FIELD_ORDER.includes(k));
  const expectedKeys = FIELD_ORDER.filter(k => k in fields);
  const orderCorrect = existingKeys.join() === expectedKeys.join();
  if (!orderCorrect) changed = true;

  if (!changed) {
    skipped++;
    return;
  }

  const newFrontmatter = serializeFrontmatter(fields);
  const newContent = `---\n${newFrontmatter}\n---\n${parsed.body}`;

  if (content === newContent) {
    skipped++;
    return;
  }

  if (DRY_RUN) {
    console.log(`  DRY RUN → ${fileName}`);
  } else {
    writeFileSync(filePath, newContent, 'utf8');
    console.log(`  normalized → ${fileName}`);
  }
  normalized++;
}

const files = readdirSync(NEWSLETTERS_DIR).filter(f => f.endsWith('.md'));
console.log(`Normalizing ${files.length} newsletters${DRY_RUN ? ' (dry run)' : ''}...\n`);

for (const file of files) {
  try {
    normalizeFile(join(NEWSLETTERS_DIR, file), file);
  } catch (err) {
    console.error(`  ERROR: ${file} — ${err.message}`);
    errors++;
  }
}

console.log(`\nDone. ${normalized} normalized, ${skipped} unchanged, ${errors} errors.`);
if (errors > 0) process.exit(1);
