# Editorial Art Pipeline

## Context

Follow-up work for [#44](https://github.com/itspatmorgan/itspatmorgan.github.io/issues/44). The editorial art tool can create strong generative images, but writing articles need a repeatable website-owned workflow that keeps Obsidian uncluttered, preserves generated metadata during sync, and avoids committing multi-megabyte PNG exports.

## Approach

- Store website-only `visual` config in repo article frontmatter after Obsidian sync.
- Preserve repo-owned `visual` and generated `image` fields when re-syncing writing from Obsidian.
- Generate deterministic feature images from article slug/theme, using the same theme-to-generator defaults as the editor.
- Optimize committed web assets to 1200x630 progressive JPEGs with `sharp`.
- Use article image captions to expose generator metadata and link back to the tool.
- Keep live rendering, motion, naming refactors, and new generators out of this pass.

## Files to Modify

| File | Change |
|---|---|
| `src/content.config.ts` | Add optional writing `visual` schema |
| `scripts/sync-writing.mjs` | Preserve website-owned fields and use real YAML parsing |
| `scripts/generate-writing-art.mjs` | Generate visual config and optimized feature images |
| `src/layouts/WritingLayout.astro` | Use article images for OG metadata and generator metadata captions |
| `package.json` | Add generation command and image/YAML tooling |

## Verification

- `pnpm generate:writing-art -- --dry-run`
- `pnpm sync-writing -- --dry-run`
- `pnpm build`
- Confirm generated feature images are 1200x630 JPEGs in the tens of KB, not MB.
- Confirm article themes map to distinct generator types.
