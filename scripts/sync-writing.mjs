/**
 * Sync newsletter articles from Obsidian to the Astro writing collection.
 *
 * Run from the repo root:
 *   node scripts/sync-writing.mjs [--dry-run]
 *
 * Picks up any file in Writing/Newsletters/ with 'website: true'.
 * Strips Obsidian-only fields (created, website), slugifies the title,
 * and writes to src/content/writing/<slug>.md.
 *
 * Idempotent — skips files whose content hasn't changed.
 * Fails loudly if required fields (title, description, publishedDate) are missing.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { homedir } from 'os';
import YAML from 'yaml';

const DRY_RUN = process.argv.includes('--dry-run');
const VAULT = process.env.OBSIDIAN_VAULT ?? join(homedir(), 'Obsidian/itspatmorgan-obsidian');
const NEWSLETTERS_DIR = join(VAULT, 'Writing/Newsletters');
const OUTPUT_DIR = resolve('src/content/writing');
const OBSIDIAN_ONLY = new Set(['created', 'website', 'author']);
const REQUIRED = ['title', 'description', 'publishedDate'];
const WEBSITE_OWNED = ['visual'];

let synced = 0, skipped = 0, errors = 0;

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return null;
  return { raw: match[1], body: match[2] };
}

function parseYaml(raw) {
  return YAML.parse(raw) ?? {};
}

// Convert kebab-case tags to display format (e.g. "context-engineering" → "Context Engineering").
// Single-word tags pass through unchanged, preserving casing like "AI".
function displayTag(tag) {
  if (!tag.includes('-')) return tag;
  return tag.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function serializeFrontmatter(fields) {
  const ORDER = [
    'title', 'description', 'publishedDate', 'categories', 'theme', 'tags',
    'visual', 'image', 'canonicalUrl', 'draft',
  ];
  const lines = [];
  // Known fields in order
  for (const key of ORDER) {
    if (!(key in fields)) continue;
    appendField(lines, key, fields[key]);
  }
  // Any remaining fields not in ORDER (future-proofing)
  for (const [key, val] of Object.entries(fields)) {
    if (ORDER.includes(key) || OBSIDIAN_ONLY.has(key)) continue;
    appendField(lines, key, val);
  }
  return lines.join('\n');
}

function appendField(lines, key, val) {
  if (val === '' || val === null || val === undefined) {
    // Skip empty optional fields — absent is cleaner than a blank value
    // and prevents Zod url()/date() validators from rejecting empty strings.
    return;
  }

  if (Array.isArray(val)) {
    if (val.length === 0) return;
    const items = key === 'tags' ? val.map(displayTag) : val;
    lines.push(`${key}:`);
    for (const item of items) lines.push(`  - ${item}`);
  } else if (typeof val === 'boolean') {
    lines.push(`${key}: ${val}`);
  } else if (typeof val === 'object') {
    lines.push(`${key}:`);
    const nested = YAML.stringify(val, { lineWidth: 0 }).trimEnd();
    for (const line of nested.split('\n')) lines.push(`  ${line}`);
  } else {
    const needsQuotes = /[:#\[\]{}&*!|>'"%@`]/.test(String(val)) || String(val).startsWith(' ');
    lines.push(`${key}: ${needsQuotes ? `"${String(val).replace(/"/g, '\\"')}"` : val}`);
  }
}

function readExistingFields(outPath) {
  if (!existsSync(outPath)) return {};
  const existing = parseFrontmatter(readFileSync(outPath, 'utf8'));
  if (!existing) return {};
  return parseYaml(existing.raw);
}

function isGeneratedImagePath(image, slug) {
  return typeof image === 'string' && image.startsWith(`/images/writing/${slug}/feature.`);
}

function cleanBody(body) {
  return body
    // Strip leading H1 — WritingLayout renders title as <h1>
    .replace(/^#[^#][^\n]*\n?/, '')
    // Strip all Substack CDN images (decorative banners, section dividers)
    .replace(/^!\[.*?\]\(https:\/\/substackcdn\.com\/[^\)]*\)\n?/gm, '')
    // Strip "Welcome to Unknown Arts" newsletter boilerplate
    .replace(/^\*Welcome to Unknown Arts[^\n]*\n?/gm, '')
    // Strip "Similar Posts" section and everything after (Substack recommendation embeds)
    .replace(/\n#{2,3}\s*Similar Posts[\s\S]*/i, '')
    // Strip subscription CTAs
    .replace(/^\*{1,3}(Find this useful|Not subscribed yet)[^\n]*\*{1,3}\n?/gm, '')
    // Collapse 3+ consecutive blank lines down to 2
    .replace(/\n{3,}/g, '\n\n')
    .trim() + '\n';
}

function syncFile(filePath, fileName) {
  const content = readFileSync(filePath, 'utf8');
  const parsed = parseFrontmatter(content);
  if (!parsed) return;

  const fields = parseYaml(parsed.raw);
  const websiteVal = fields.website;
  if (websiteVal !== 'true' && websiteVal !== true) return;

  // Validate required fields
  const missing = REQUIRED.filter(k => !fields[k] || fields[k] === '');
  if (missing.length > 0) {
    console.error(`  ERROR: ${fileName} — missing required fields: ${missing.join(', ')}`);
    errors++;
    return;
  }

  // Strip Obsidian-only fields
  for (const key of OBSIDIAN_ONLY) delete fields[key];

  // Normalise draft to boolean
  if (typeof fields.draft === 'string') {
    fields.draft = fields.draft === 'false' ? false : true;
  }

  const slug = slugify(fields.title);
  const outPath = join(OUTPUT_DIR, `${slug}.md`);
  const existingFields = readExistingFields(outPath);

  for (const key of WEBSITE_OWNED) {
    if (existingFields[key] !== undefined) fields[key] = existingFields[key];
  }
  if (existingFields.visual && isGeneratedImagePath(existingFields.image, slug)) {
    fields.image = existingFields.image;
  }

  const newFrontmatter = serializeFrontmatter(fields);
  const body = cleanBody(parsed.body);
  const newContent = `---\n${newFrontmatter}\n---\n${body}`;

  if (existsSync(outPath) && readFileSync(outPath, 'utf8') === newContent) {
    skipped++;
    return;
  }

  if (DRY_RUN) {
    console.log(`  DRY RUN → ${slug}.md`);
  } else {
    writeFileSync(outPath, newContent, 'utf8');
    console.log(`  synced → ${slug}.md`);
  }
  synced++;
}

const files = readdirSync(NEWSLETTERS_DIR).filter(f => f.endsWith('.md'));
console.log(`Scanning ${files.length} newsletters${DRY_RUN ? ' (dry run)' : ''}...\n`);

for (const file of files) {
  try {
    syncFile(join(NEWSLETTERS_DIR, file), file);
  } catch (err) {
    console.error(`  ERROR: ${file} — ${err.message}`);
    errors++;
  }
}

console.log(`\nDone. ${synced} synced, ${skipped} unchanged, ${errors} errors.`);
if (errors > 0) process.exit(1);
