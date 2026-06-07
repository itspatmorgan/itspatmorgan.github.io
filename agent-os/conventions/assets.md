# Asset Conventions

## Images

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
