# Nav and Lab Quick Fixes

## Context

The site sidebar is now driven by the pixel mark and should default to the collapsed icon rail for first-time desktop visitors. That makes icon labels more important on hover/focus. The mobile navigation also needs to use less vertical space on iPhone-sized screens, the homepage hero needs to work with the collapsed nav and revised visual rhythm, and the Pixel Mark lab should document the nav switcher interaction now used in production.

## Approach

- Tighten the mobile navigation typography and spacing while preserving the existing overlay structure.
- Remove the mobile "Elsewhere" label and slightly reduce the social section spacing.
- Default the desktop sidebar to collapsed only when no saved preference exists.
- Add a custom, faster sidebar tooltip that works for collapsed icon controls.
- Update the homepage headline and intro copy so Patrick's name appears even when the sidebar is collapsed.
- Remove the career arc nodes from the homepage hero and rebalance the mobile/desktop hero spacing.
- Add a subtle dot-grid texture that anchors the portrait on desktop and becomes a top fade on mobile.
- Coordinate the desktop hero and first Work-card entrance animation.
- Remove the Pixel Wave lab's page divider between the intro and demo area.
- Add a Pixel Mark lab section documenting the sidebar switcher states.

## Files to Modify

- `src/components/layout/MobileNav.astro` — mobile overlay link sizing and social label removal.
- `src/components/layout/Sidebar.astro` — default collapsed behavior and custom collapsed tooltips.
- `src/pages/index.astro` — homepage hero copy, dot-grid texture, and Work entrance hooks.
- `src/scripts/home-animations.ts` — desktop hero-to-Work animation sequencing.
- `src/pages/lab/pixel-wave.astro` — mobile divider cleanup.
- `src/pages/lab/pixel-mark.astro` — add nav switcher documentation section.
- `src/lab/pixel-mark/MarkStates.tsx` — reusable production nav switcher state demo.

## Steps

1. Update mobile nav classes and remove the label.
2. Adjust sidebar collapse initialization and tooltip behavior.
3. Update homepage headline and intro copy.
4. Remove career arc nodes and tune hero spacing/texture.
5. Coordinate desktop entrance animation across hero and Work preview.
6. Remove lab dividers and match lab spacing.
7. Add Pixel Mark nav switcher state docs.
8. Run `pnpm build`.

## Verification

- `pnpm build`
- Browser check for the homepage, mobile nav, and Pixel Mark lab if a dev server is needed after build.
