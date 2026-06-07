/**
 * Sync newsletter articles from Obsidian to the Astro writing collection.
 *
 * Run from the repo root:
 *   node scripts/sync-writing.mjs [--dry-run]
 *   node scripts/sync-writing.mjs --title "Article Title" --theme AI --with-art
 *
 * Picks up any file in Newsletters/ with 'website: true'.
 * Strips Obsidian-only fields (created, website), slugifies the title,
 * and writes to src/content/writing/<slug>.md.
 *
 * Idempotent — skips files whose content hasn't changed.
 * Fails loudly if required fields (title, description, publishedDate) are missing.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { spawnSync } from 'child_process';
import YAML from 'yaml';

const CLI = parseArgs(process.argv.slice(2));
const DRY_RUN = CLI.flags.has('dry-run');
const TARGET_TITLE = CLI.options.title;
const TARGET_SLUG = CLI.options.slug;
const TARGET = TARGET_TITLE || TARGET_SLUG;
const THEME = CLI.options.theme;
const WITH_ART = CLI.flags.has('with-art');
const OVERWRITE = CLI.flags.has('overwrite');

if (CLI.flags.has('help')) {
  printHelp();
  process.exit(0);
}

if (TARGET_TITLE && TARGET_SLUG) {
  console.error('Use either --title or --slug, not both.');
  process.exit(1);
}

if ((THEME || WITH_ART || OVERWRITE) && !TARGET) {
  console.error('--theme, --with-art, and --overwrite are only supported with --title or --slug.');
  process.exit(1);
}

loadLocalEnv();

const VAULT = process.env.OBSIDIAN_VAULT;
if (!VAULT) {
  console.error('Missing OBSIDIAN_VAULT. Set it in your shell or in .env.local.');
  process.exit(1);
}

const NEWSLETTERS_DIR = join(VAULT, 'Newsletters');
const OUTPUT_DIR = resolve('src/content/writing');
const OBSIDIAN_ONLY = new Set(['created', 'website', 'author']);
const REQUIRED = ['title', 'description', 'publishedDate'];
const WEBSITE_OWNED = ['theme', 'visual', 'image'];

let synced = 0, skipped = 0, errors = 0;
let syncedSlug = null;

function parseArgs(argv) {
  const flags = new Set();
  const options = {};

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--') continue;
    if (!arg.startsWith('--')) continue;

    const [rawKey, inlineValue] = arg.slice(2).split(/=(.*)/s);
    if (inlineValue !== undefined) {
      options[rawKey] = inlineValue;
      continue;
    }

    const next = argv[i + 1];
    if (next && !next.startsWith('--')) {
      options[rawKey] = next;
      i++;
    } else {
      flags.add(rawKey);
    }
  }

  return { flags, options };
}

function printHelp() {
  console.log(`Sync newsletter articles from Obsidian to the website.

Usage:
  node scripts/sync-writing.mjs [--dry-run]
  node scripts/sync-writing.mjs --title "Article Title" --theme AI --with-art
  node scripts/sync-writing.mjs --slug article-slug --theme "Systems Thinking" --with-art

Options:
  --title <title>     Sync one Obsidian newsletter by frontmatter title.
  --slug <slug>       Sync one Obsidian newsletter by slugified title.
  --theme <theme>     Assign the website writing theme during targeted sync.
  --with-art          Generate deterministic visual metadata and feature image for the target.
  --overwrite         Allow targeted sync to update an existing website article.
  --dry-run           Show what would change without writing files.
`);
}

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
  if (!parsed) return null;

  const fields = parseYaml(parsed.raw);
  const websiteVal = fields.website;
  if (websiteVal !== 'true' && websiteVal !== true) return null;

  // Validate required fields
  const missing = REQUIRED.filter(k => !fields[k] || fields[k] === '');
  if (missing.length > 0) {
    console.error(`  ERROR: ${fileName} — missing required fields: ${missing.join(', ')}`);
    errors++;
    return null;
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
  if (THEME) fields.theme = THEME;

  const newFrontmatter = serializeFrontmatter(fields);
  const body = cleanBody(parsed.body);
  const newContent = `---\n${newFrontmatter}\n---\n${body}`;
  const outputExists = existsSync(outPath);

  if (outputExists && readFileSync(outPath, 'utf8') === newContent) {
    skipped++;
    return slug;
  }

  if (TARGET && outputExists && !OVERWRITE) {
    console.error(`  ERROR: ${fileName} — ${slug}.md already exists. Re-run with --overwrite to update it.`);
    errors++;
    return null;
  }

  if (DRY_RUN) {
    console.log(`  DRY RUN → ${slug}.md`);
  } else {
    writeFileSync(outPath, newContent, 'utf8');
    console.log(`  synced → ${slug}.md`);
  }
  synced++;
  syncedSlug = slug;
  return slug;
}

function readNewsletterMeta(fileName) {
  const filePath = join(NEWSLETTERS_DIR, fileName);
  const parsed = parseFrontmatter(readFileSync(filePath, 'utf8'));
  if (!parsed) return null;

  const fields = parseYaml(parsed.raw);
  if (fields.website !== 'true' && fields.website !== true) return null;

  return {
    fileName,
    filePath,
    title: fields.title,
    slug: fields.title ? slugify(fields.title) : null,
  };
}

function findTargetFiles(files) {
  if (!TARGET) return files.map((fileName) => ({ fileName, filePath: join(NEWSLETTERS_DIR, fileName) }));

  const expectedSlug = TARGET_SLUG ? slugify(TARGET_SLUG) : null;
  const expectedTitle = TARGET_TITLE ? TARGET_TITLE.trim().toLowerCase() : null;
  const matches = files
    .map(readNewsletterMeta)
    .filter(Boolean)
    .filter((meta) => {
      if (expectedSlug) return meta.slug === expectedSlug;
      return meta.title && meta.title.trim().toLowerCase() === expectedTitle;
    });

  if (matches.length === 0) {
    console.error(`No website-ready Obsidian newsletter found for ${TARGET_TITLE ? `title "${TARGET_TITLE}"` : `slug "${TARGET_SLUG}"`}.`);
    errors++;
    return [];
  }

  if (matches.length > 1) {
    console.error(`Multiple Obsidian newsletters matched ${TARGET_TITLE ? `title "${TARGET_TITLE}"` : `slug "${TARGET_SLUG}"`}:`);
    for (const match of matches) console.error(`  - ${match.fileName}`);
    errors++;
    return [];
  }

  return matches;
}

function generateArtForTarget(slug) {
  if (!WITH_ART || errors > 0) return;
  if (!slug) {
    console.error('  ERROR: Could not determine synced slug for art generation.');
    errors++;
    return;
  }

  if (DRY_RUN) {
    console.log(`  DRY RUN → writing art for ${slug}`);
    return;
  }

  const result = spawnSync(process.execPath, ['scripts/generate-writing-art.mjs', '--slug', slug], {
    cwd: resolve('.'),
    encoding: 'utf8',
    stdio: 'pipe',
  });

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);

  if (result.status !== 0) {
    errors++;
    console.error(`  ERROR: writing art generation failed for ${slug}`);
  }
}

const files = readdirSync(NEWSLETTERS_DIR).filter(f => f.endsWith('.md'));
const targetFiles = findTargetFiles(files);
console.log(`Scanning ${targetFiles.length} newsletter${targetFiles.length === 1 ? '' : 's'}${TARGET ? ' (targeted)' : ''}${DRY_RUN ? ' (dry run)' : ''}...\n`);

for (const file of targetFiles) {
  try {
    const slug = syncFile(file.filePath, file.fileName);
    if (!syncedSlug && slug) syncedSlug = slug;
  } catch (err) {
    console.error(`  ERROR: ${file.fileName} — ${err.message}`);
    errors++;
  }
}

generateArtForTarget(syncedSlug);

console.log(`\nDone. ${synced} synced, ${skipped} unchanged, ${errors} errors.`);
if (errors > 0) process.exit(1);
