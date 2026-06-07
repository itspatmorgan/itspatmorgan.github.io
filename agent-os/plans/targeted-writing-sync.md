# Targeted Writing Sync

## Context

The common writing workflow is adding one newly finished Obsidian newsletter to the website, not re-syncing every article in the vault. The existing `pnpm sync-writing` command scans every `website: true` newsletter and may update older website articles, which is too broad for routine publishing.

## Approach

- Keep the existing full sync behavior available for maintenance.
- Add targeted sync flags to `scripts/sync-writing.mjs` so a single article can be selected by title or slug.
- In targeted mode, refuse to overwrite an existing website article unless explicitly requested.
- Allow `--theme` to assign website-owned theme metadata during sync.
- Allow `--with-art` to generate deterministic writing visual metadata and the feature image for the synced article only.
- Add a matching target filter to `scripts/generate-writing-art.mjs` so art generation can be scoped to one slug.
- Document the normal one-article workflow in `agent-os/system-map.md`.

## Files to Modify

- `scripts/sync-writing.mjs`: targeted article selection, theme assignment, overwrite guard, and optional art generation.
- `scripts/generate-writing-art.mjs`: target filtering by slug.
- `agent-os/system-map.md`: document the default single-article workflow and maintenance full-sync path.

## Steps

1. Add CLI argument parsing to writing sync and art generation scripts.
2. Implement targeted article lookup and single-article sync behavior.
3. Wire `--with-art` to call the scoped art generator after successful sync.
4. Update documentation with examples.
5. Verify with targeted dry runs, scoped art dry runs, and `pnpm build`.

## Verification

```bash
pnpm sync-writing -- --title "AI Needs a Plan" --theme AI --with-art --dry-run
pnpm generate:writing-art -- --slug ai-needs-a-plan --dry-run
pnpm build
```
