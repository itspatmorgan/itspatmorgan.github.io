# Align favicon formats with the dots mark

## Context and outcome

The SVG favicon uses the dots logo, but the live PNG and Apple touch assets
still serve the old PM monogram. All advertised formats should show the same
mark, including search crawlers and clients that request `/favicon.ico`.

## Approach and scope

Generate PNGs at 16, 32, 48, and 96px, the Apple touch icon, and a multi-size ICO
from `public/favicon.svg` using the existing sharp dependency. Keep the adaptive
SVG and render raster fallbacks in the light-theme palette. Add larger PNG links
to BaseLayout. Preserve stable favicon URLs and replace old contents.

## Verification and learning

Inspect generated assets and ICO entries, run the production build, and verify
published asset hashes after deployment. Search/provider caches may refresh later.
Document SVG as the canonical source and the regeneration command in asset
conventions so future branding updates don't leave stale raster fallbacks.

Local verification: generated 96px and Apple touch images visually match the
dots mark; file inspection confirms PNG dimensions and four ICO entries.
Production build passes (43 pages); diff check passes. Live verification follows
the GitHub Pages deployment.
