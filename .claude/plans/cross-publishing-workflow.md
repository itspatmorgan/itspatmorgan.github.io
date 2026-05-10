# Cross-Publishing Workflow

## Context

Patrick drafts newsletters in Obsidian, publishes to Substack, then saves the published version to `Writing/Newsletters/` in the vault. Getting articles onto the personal website (itspatmorgan.com) currently requires manual copy/pasting and frontmatter rewriting — too much friction.

The fix: align Obsidian's newsletter frontmatter schema to match the Astro website schema as closely as possible, then write a minimal sync script that does almost no transformation. The template becomes the single source of truth — the Newsletter Session skill references it directly rather than duplicating the frontmatter.

---

## Desired End State

**Publishing a new article to the website:**
1. Draft in Obsidian (no change)
2. Publish to Substack manually (no change — no API)
3. Save published version to `Writing/Newsletters/` in Obsidian (already doing this)
4. Add the Substack URL to `canonicalUrl`, set `draft: false` and `website: true`
5. Run `pnpm sync-writing`
6. Commit + push → auto-deploys

---

## Frontmatter Alignment

### Current Obsidian Newsletter frontmatter
```yaml
created: YYYY-MM-DD
categories: [Newsletter]
author: ["[[Patrick Morgan]]"]
published: YYYY-MM-DD
source: https://substack-url
description: "one-line summary"
status: Draft
tags: []
```

### Current website schema (Astro content.config.ts)
```yaml
title: string          # required
description: string    # required
publishedDate: date    # required
categories: string[]   # default []
tags: string[]         # default []
image: string          # optional
draft: boolean         # default false
```

### Proposed new Obsidian Newsletter frontmatter
```yaml
# --- Shared with website ---
title: "Article Title"           # NEW — move from H1 body line; sync requires no body parsing
description: "One-line summary"  # KEEP
publishedDate: YYYY-MM-DD        # RENAMED from 'published'
categories:
  - Newsletter                   # KEEP
tags: []                         # KEEP
image:                           # NEW OPTIONAL — website hero image path
canonicalUrl:                    # RENAMED from 'source' — Substack URL; also used for SEO canonical link
draft: true                      # ADOPTED from Astro schema — replaces Obsidian's 'status: Draft/Published'
# --- Obsidian-only ---
website: false                   # NEW — opt-in flag; flip to true when ready to sync to site
created: YYYY-MM-DD              # KEEP — used for Bases/sorting
```

**Changes from current:**
- `author` — removed entirely; single-author site, not useful
- `status: Draft/Published` → `draft: true/false` — adopting Astro's field; Obsidian aligns to it
- `published` → `publishedDate` — exact match to website field name
- `source` → `canonicalUrl` — obviously named for its purpose; also wired up as `<link rel="canonical">` in the layout (prevents duplicate content penalty for cross-published articles)
- `title` added to frontmatter — eliminates body parsing in the sync script; H1 in body stays as Obsidian display heading
- `website: false` — opt-in gate; protects old articles from being synced unintentionally

### Proposed website schema additions (content.config.ts)
```ts
canonicalUrl: z.string().url().optional(),
```

The layout will use `canonicalUrl` to render `<link rel="canonical" href={canonicalUrl}>` in the `<head>` when present.

---

## Template as Single Source of Truth

The Newsletter Session skill and any other skills that produce newsletter output should **not** duplicate the frontmatter structure. Instead, they should reference the template directly:

> "When saving the output, read `_OS/Templates/Newsletter.md`. Use its frontmatter structure exactly, filling in the values for this article."

This way, if the template changes, every skill that references it automatically uses the new version — no multi-file updates required.

---

## Files to Modify

| File | System | What changes |
|------|--------|--------------|
| `_OS/Templates/Newsletter.md` | Obsidian | **Primary** — rewrite frontmatter to new schema |
| `_OS/Skills/Newsletter Session.md` | Obsidian | Step 7 output: replace embedded frontmatter with a reference to the template |
| `AGENTS.md` (vault root) | Obsidian | Update Key Frontmatter Fields table |
| `CLAUDE.MD` (vault root) | Obsidian | Same — update Key Frontmatter Fields table |
| `Writing/Newsletters/*.md` | Obsidian | Retroactive migration script |
| `src/content.config.ts` | Website | Add `canonicalUrl` to writing schema |
| `src/layouts/WritingLayout.astro` | Website | Wire up `canonicalUrl` canonical link |
| `src/pages/writing/[...slug].astro` | Website | Pass new props through to layout |
| `scripts/sync-writing.mjs` | Website | New — sync script |
| `scripts/migrate-obsidian-newsletters.mjs` | Website | New — one-time migration, delete after use |
| `package.json` | Website | Add `sync-writing` script command |

---

## Steps

### 1. Update the Newsletter template (Obsidian)

This is the primary change — everything else follows from it. Rewrite `_OS/Templates/Newsletter.md`:

```yaml
---
title: 
description: 
publishedDate: {{date:YYYY-MM-DD}}
categories:
  - Newsletter
tags: []
image: 
canonicalUrl: 
draft: true
website: false
created: {{date:YYYY-MM-DD}}
---
```

Note: fields are ordered shared-first, then Obsidian-only (`website`, `created`), matching the proposed schema above.

### 2. Update the Newsletter Session skill (Obsidian)

In `_OS/Skills/Newsletter Session.md`, find Step 7: Output. Replace the embedded frontmatter block with a reference to the template:

> When saving the finished draft, read `_OS/Templates/Newsletter.md` and use its frontmatter structure exactly — do not reproduce the structure here. Fill in `title`, `description`, and `publishedDate` (today's date) from this session. Leave `canonicalUrl` and `image` blank. Leave `draft: true` and `website: false` until published to Substack.

This makes the template the single source of truth. The skill stays correct automatically when the template changes.

### 3. Update vault guide files (Obsidian)

In both `AGENTS.md` and `CLAUDE.MD`, update the **Key Frontmatter Fields** section. Remove `status`, `published`, `author`. Add `title`, `publishedDate`, `canonicalUrl`, `draft`, `website` with one-line descriptions of each.

### 4. Write the retroactive migration script (Website)

Create `scripts/migrate-obsidian-newsletters.mjs` (one-time use). For each `*.md` in `Writing/Newsletters/` it:
- Renames `published` → `publishedDate`
- Converts `status: Published` → `draft: false`, everything else → `draft: true`
- Renames `source` → `canonicalUrl`
- Removes `author`
- Extracts `title` from the first `# H1` line in the body, adds it to frontmatter (skips if title already present)
- Adds `website: false`, `image:` (blank)
- Writes changes back in-place

Run manually, spot-check a sample of diffs before committing.

### 5. Update website schema (Website)

In `src/content.config.ts`, add to the writing collection:
```ts
canonicalUrl: z.string().url().optional(),
```

### 6. Update WritingLayout and slug route (Website)

In `src/layouts/WritingLayout.astro`:
- Add `canonicalUrl` to the Props interface
- In `<head>` (via PageLayout), pass `canonicalUrl` for a `<link rel="canonical">` tag

In `src/pages/writing/[...slug].astro`, destructure and pass the new field through.

In `src/layouts/PageLayout.astro`, accept and render an optional `canonical` prop as `<link rel="canonical" href={canonical}>` in the `<head>`.

### 7. Write the sync script (Website)

Create `scripts/sync-writing.mjs`:
- Reads `OBSIDIAN_VAULT` from env, falling back to `~/Obsidian/itspatmorgan-obsidian`
- Scans `Writing/Newsletters/*.md` for `website: true`
- For each matching file:
  - Validates `title`, `description`, `publishedDate` are present — exits with a clear error if missing
  - Strips Obsidian-only fields: `created`, `website`
  - Slugifies `title` to produce the output filename
  - Writes to `src/content/writing/<slug>.md`
  - Skips unchanged files (idempotent)
- Prints a summary: N synced, N skipped, N errors

Add to `package.json`:
```json
"sync-writing": "node scripts/sync-writing.mjs"
```

### 8. Test end-to-end

- Pick 2-3 published newsletters, confirm their frontmatter is correct after migration
- Set `website: true` on them
- Run `pnpm sync-writing`
- Run `pnpm build` — confirm no schema validation errors
- Verify articles appear at `/writing` with correct titles, dates, and canonical links

### 9. Retroactive curation (ongoing, manual)

For each older article you want on the website:
1. Open it in Obsidian
2. Confirm `title`, `description`, and `publishedDate` are filled in
3. Add `canonicalUrl` (Substack link)
4. Set `website: true`
5. Run `pnpm sync-writing`

Intentionally manual — the website is a curated selection, not a mirror of all 200+ newsletters.

---

## Verification

- `pnpm build` completes with no content collection errors
- Synced articles appear at `/writing` with correct metadata
- `<link rel="canonical">` is present in article `<head>` when `canonicalUrl` is set
- Running `pnpm sync-writing` twice produces the same result (idempotent)
- New newsletters from the Obsidian template have correct frontmatter out of the box
- Newsletter Session skill Step 7 references the template rather than duplicating frontmatter

---

## What's Not In Scope

- Substack publishing automation (no public API)
- Two-way sync (website → Obsidian)
- Image sync (hero images added manually to `public/images/writing/`)
- Series navigation UI (would need separate design work)
- Automating curation decisions for issue 21
