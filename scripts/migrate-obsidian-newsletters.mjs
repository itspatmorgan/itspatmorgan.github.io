/**
 * One-time migration: update existing Obsidian newsletter frontmatter to the new schema.
 *
 * Run from the repo root:
 *   node scripts/migrate-obsidian-newsletters.mjs [--dry-run]
 *
 * What it does to each .md file in Writing/Newsletters/:
 *   - Extracts title from first # H1 in body (if no title in frontmatter)
 *   - Renames 'published' -> 'publishedDate'
 *   - Renames 'source' -> 'canonicalUrl'
 *   - Converts 'status: Published' -> 'draft: false', anything else -> 'draft: true'
 *   - Removes 'author' and 'status'
 *   - Adds 'website: false' and 'image: ' if not present
 *   - Reorders: shared fields first, obsidian-only fields (website, created) at end
 *
 * Delete this script after the migration is confirmed.
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import { homedir } from 'os';

const DRY_RUN = process.argv.includes('--dry-run');
const VAULT = process.env.OBSIDIAN_VAULT ?? join(homedir(), 'Obsidian/itspatmorgan-obsidian');
const NEWSLETTERS_DIR = join(VAULT, 'Writing/Newsletters');

let synced = 0, skipped = 0, errors = 0;

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return null;
  return { raw: match[1], body: match[2] };
}

function extractTitle(body) {
  const match = body.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

function parseSimpleYaml(raw) {
  const fields = {};
  const lines = raw.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    // Multi-line array (e.g. categories:\n  - Newsletter)
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
    // Inline array
    const inlineArray = line.match(/^(\w+):\s*\[(.*)]\s*$/);
    if (inlineArray) {
      fields[inlineArray[1]] = inlineArray[2].split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
      i++;
      continue;
    }
    // Scalar
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
  const ORDER = [
    'title', 'description', 'publishedDate', 'categories', 'tags',
    'image', 'canonicalUrl', 'draft', 'website', 'created',
  ];
  const lines = [];
  for (const key of ORDER) {
    if (!(key in fields)) continue;
    const val = fields[key];
    if (Array.isArray(val)) {
      lines.push(`${key}:`);
      for (const item of val) lines.push(`  - ${item}`);
    } else if (typeof val === 'boolean') {
      lines.push(`${key}: ${val}`);
    } else if (val === '' || val === null || val === undefined) {
      lines.push(`${key}: `);
    } else {
      // Quote strings that contain colons or start with special chars
      const needsQuotes = /[:#\[\]{}&*!|>'"%@`]/.test(String(val)) || String(val).startsWith(' ');
      lines.push(`${key}: ${needsQuotes ? `"${String(val).replace(/"/g, '\\"')}"` : val}`);
    }
  }
  return lines.join('\n');
}

function migrateFile(filePath) {
  const content = readFileSync(filePath, 'utf8');
  const parsed = parseFrontmatter(content);
  if (!parsed) {
    console.warn(`  SKIP (no frontmatter): ${filePath}`);
    skipped++;
    return;
  }

  const fields = parseSimpleYaml(parsed.raw);
  let changed = false;

  // Extract title from H1 if missing
  if (!fields.title) {
    const title = extractTitle(parsed.body);
    if (title) {
      fields.title = title;
      changed = true;
    }
  }

  // published -> publishedDate
  if ('published' in fields && !('publishedDate' in fields)) {
    fields.publishedDate = fields.published;
    delete fields.published;
    changed = true;
  }

  // source -> canonicalUrl
  if ('source' in fields && !('canonicalUrl' in fields)) {
    fields.canonicalUrl = fields.source;
    delete fields.source;
    changed = true;
  }

  // status -> draft
  if ('status' in fields) {
    fields.draft = fields.status !== 'Published';
    delete fields.status;
    changed = true;
  } else if (!('draft' in fields)) {
    fields.draft = true;
    changed = true;
  } else {
    // Normalise string 'true'/'false' to boolean
    if (typeof fields.draft === 'string') {
      fields.draft = fields.draft === 'false' ? false : true;
      changed = true;
    }
  }

  // Remove author
  if ('author' in fields) {
    delete fields.author;
    changed = true;
  }

  // Add website if missing
  if (!('website' in fields)) {
    fields.website = false;
    changed = true;
  }

  // Add image if missing
  if (!('image' in fields)) {
    fields.image = '';
    changed = true;
  }

  if (!changed) {
    skipped++;
    return;
  }

  const newFrontmatter = serializeFrontmatter(fields);
  const newContent = `---\n${newFrontmatter}\n---\n${parsed.body}`;

  if (DRY_RUN) {
    console.log(`  DRY RUN: ${filePath}`);
  } else {
    writeFileSync(filePath, newContent, 'utf8');
  }
  synced++;
}

const files = readdirSync(NEWSLETTERS_DIR).filter(f => f.endsWith('.md'));
console.log(`Migrating ${files.length} files in ${NEWSLETTERS_DIR}${DRY_RUN ? ' (dry run)' : ''}...\n`);

for (const file of files) {
  try {
    migrateFile(join(NEWSLETTERS_DIR, file));
  } catch (err) {
    console.error(`  ERROR: ${file} — ${err.message}`);
    errors++;
  }
}

console.log(`\nDone. ${synced} migrated, ${skipped} skipped (already up to date or no frontmatter), ${errors} errors.`);
if (errors > 0) process.exit(1);
