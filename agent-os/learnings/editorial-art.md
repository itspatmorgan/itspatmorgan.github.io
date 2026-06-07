# Editorial Art

## Rule

Writing feature images should be deterministic, website-owned artifacts.

## Why

The art pipeline gives Writing a scalable visual system without depending on
one-off external image decisions. Generated `visual` metadata and `image` paths
belong to the website and should survive Obsidian sync.

## Use When

- Generating or regenerating writing feature images.
- Editing writing frontmatter related to visual presentation.
- Changing the editorial art pipeline.

## Gotchas

- Avoid overwriting existing visual decisions unless intentionally using script
  flags for regeneration.
- Keep the visual schema stable before adding new variants.
- Generated images live under `public/images/writing/<slug>/feature.jpg`.

## Verification

```bash
node scripts/generate-writing-art.mjs --slug article-slug --dry-run
pnpm build
```

## Related Files

- `scripts/generate-writing-art.mjs`
- `src/content/writing/`
- `public/images/writing/`

