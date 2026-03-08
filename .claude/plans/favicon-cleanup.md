# Favicon cleanup and full treatment

**Issue:** #16 — Replace favicon with PM logo

## Context

The site has a working favicon (`logo-dark-256.png`) but carries dead weight from the Astro scaffold (`public/favicon.svg`). The current setup also lacks apple-touch-icon, multiple sizes, and theme adaptation. This plan deletes the stale file, generates proper favicon assets, and adds a theme-aware SVG favicon so the logo adapts to light/dark OS themes.

## Approach

1. **Delete** `public/favicon.svg` (unused Astro default)
2. **Generate favicon PNGs** from existing 512×512 brand assets using `sips` (macOS built-in — no extra dependencies):
   - `public/favicon-32x32.png` (from `logo-dark-256.png`)
   - `public/favicon-16x16.png` (from `logo-dark-256.png`)
   - `public/apple-touch-icon.png` (180×180 from `logo-dark-256.png` — apple-touch always shows on light backgrounds)
3. **Create theme-aware SVG favicon** (`public/favicon.svg`) that embeds both logo PNGs as base64 and uses `prefers-color-scheme` media query to switch between them
4. **Update `BaseLayout.astro`** `<head>` with proper favicon links

## Files to modify

| File | Change |
|------|--------|
| `public/favicon.svg` | Delete Astro default, replace with theme-aware SVG |
| `public/favicon-32x32.png` | New — generated from `logo-dark-256.png` |
| `public/favicon-16x16.png` | New — generated from `logo-dark-256.png` |
| `public/apple-touch-icon.png` | New — 180×180, generated from `logo-dark-256.png` |
| `src/layouts/BaseLayout.astro` | Update favicon `<link>` tags in `<head>` |

## Steps

1. Delete `public/favicon.svg`
2. Generate `public/apple-touch-icon.png` (180×180) via `sips`
3. Generate `public/favicon-32x32.png` via `sips`
4. Generate `public/favicon-16x16.png` via `sips`
5. Create `public/favicon.svg` — theme-aware SVG with embedded base64 PNGs of both logo variants, using `<style>` media queries to toggle visibility
6. Update `BaseLayout.astro` line 25 — replace single `<link>` with:
   ```html
   <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
   <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
   <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
   <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
   ```
7. Verify with dev server and preview tools

## Verification

- Run `pnpm dev` and check the favicon renders in browser
- Confirm no console errors related to missing favicon/icon files
- Verify all new files exist at expected paths
- Check the SVG favicon switches between dark/light when OS theme changes
