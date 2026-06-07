# Writing Sync

## Rule

Use targeted writing sync for normal one-article publishing.

## Why

Targeted sync limits change scope and avoids broad accidental updates from the
Obsidian vault. The website owns presentation-specific metadata while Obsidian
owns article drafts and body copy.

## Use When

- Publishing one selected Unknown Arts article to the website.
- Updating one existing website article from Obsidian.
- Changing the sync script or writing content schema.

## Gotchas

- Website-owned `theme`, `visual`, and `image` frontmatter must be preserved.
- Untargeted `pnpm sync-writing` is a maintenance operation, not the default
  publishing path.
- Synced articles may omit `image`; image-less entries are supported.

## Verification

```bash
pnpm sync-writing -- --title "Article Title" --theme AI --with-art --dry-run
pnpm build
```

## Related Files

- `scripts/sync-writing.mjs`
- `scripts/generate-writing-art.mjs`
- `src/content/writing/`
- `src/content.config.ts`

