# Writing sync refresh

## Context

Issue #31 and PR #33 were opened to make newsletter-to-website publishing easier, but the PR is now out of date against `main`. The homepage writing-card changes in the PR are stale, while the core goal remains useful: reliably sync selected Obsidian newsletter articles into the Astro writing collection.

## Approach

- Keep the current `main` homepage implementation.
- Fix the sync script so empty arrays in Obsidian frontmatter are omitted instead of serialized as bare YAML keys.
- Run the sync against the local Obsidian vault and commit the generated website article files.
- Verify the Astro build after syncing.

## Files to modify

| File | Change |
| --- | --- |
| `scripts/sync-writing.mjs` | Skip empty arrays when serializing frontmatter |
| `src/content/writing/*.md` | Add synced newsletter articles marked `website: true` in Obsidian |

## Verification

- `pnpm sync-writing --dry-run`
- `pnpm sync-writing`
- `pnpm build`
