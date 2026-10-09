# Asset Conventions

## Images

Favicons use `public/favicon.svg` as the canonical dots mark. After changing it,
run `node scripts/generate-favicons.mjs` to regenerate every PNG, Apple touch
icon, and ICO fallback. Raster variants use the light-theme palette; the SVG
adapts to the browser color scheme. Keep favicon URLs stable for crawlers.
The generator also updates the legacy `images/brand/logo-{dark,light}-256.png`
URLs with the current mark so external references cannot fetch retired branding.

| Pattern | Purpose |
| --- | --- |
| `thumbnail-*` | Square work thumbnails, typically 2400x2400 |
| `thumbnail-wide*` | Wide work thumbnails for responsive cards |
| `feature-*` | 16:9 work hero images, typically 1920x1080 |
| `career-*.svg` | Company logos |
| `/images/profiles/` | Kind Words author headshots |
| `/images/writing/<slug>/feature.jpg` | Generated writing feature images |

## Embeds

Project detail pages support:

- YouTube embeds through `astro-embed`
- Figma Slides embeds through `src/components/FigmaEmbed.astro`

Figma presentation embeds should use `/deck/` URLs, not `/slides/` editor URLs.

## Related Files

- `public/images/`
- `src/components/FigmaEmbed.astro`
- `src/content/projects/`
