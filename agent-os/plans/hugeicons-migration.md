# Hugeicons migration

## Status
Implemented; browser review pending

## Context
Use one icon library across the portfolio and Design Studio preview, matching
the product's Hugeicons rather than maintaining Lucide alongside it.

## Desired Outcome
All standard UI icons use Hugeicons. Lucide imports and dependencies disappear.
Navigation, theme controls, and Lab controls keep their behavior and labels.

## Approach
Use core-free-icons geometry with a native Astro renderer for static surfaces
and the official React renderer for interactive islands. Preserve logos and
bespoke diagram/artwork SVGs. Update shadcn's icon configuration and conventions.

## Scope
In: navigation, theme/menu/back controls, editorial art controls, prototype rail.
Out: custom brand marks, illustrations, generated artwork, unrelated styling.

## Files To Modify
- Icon renderers and existing icon consumers in src/components, src/layouts,
  src/lab/editorial-art, and src/pages/design-studio.astro.
- package.json, pnpm-lock.yaml, components.json, astro.config.mjs.
- agent-os/conventions/styling.md and this plan.

## Steps
- [x] Inventory library and inline control icons.
- [x] Migrate static and React controls.
- [x] Remove Lucide and update configuration.
- [x] Production build and source/dependency checks.
- [ ] Browser visual and interaction review (blocked by current error-page URL policy).

## Review
- Product: preserve control labels and behavior.
- Design: retain restrained outline icons and current dimensions.
- Architecture: no hydration for static icons.
- Maintenance: Hugeicons is the sole standard UI icon library.
- Verification: production build, import scan, desktop/mobile/theme/Lab checks.

## Learnings
Update styling conventions with library and renderer choices.

## Verification results

Production build passes: 43 pages. Source/config/package/lockfile scans contain
no Lucide references. Production HTML includes navigation, prototype, moon, and
sun Hugeicons geometry. Diff check passes. Local dev server restarted.

Browser checks could not run: the current tab was an internal data-URL
connection error page; the browser tool blocked control of that protocol,
including direct navigation from the tab. No alternate browser surface used.

Styling conventions now document Hugeicons and the static/React renderers.
Custom logos, illustrations, and social brand marks are intentionally preserved.
