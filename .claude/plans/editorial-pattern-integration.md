# Editorial Pattern Integration

## Context

The editorial art tool now provides deterministic generator foundations that can carry more of the site's visual identity. This pass brings those patterns into the main portfolio experience without turning the site into a motion-heavy showcase.

## Approach

- Reuse the existing `GenerativeCanvas` and generator config types.
- Add a small decorative React island for theme-aware, ambient pattern surfaces.
- Integrate patterns into the global footer and the home page Unknown Arts newsletter feature.
- Keep motion reveal-based and hover/focus replay-based, respecting reduced motion.

## Files to Modify

- `src/lab/editorial-art/GenerativePatternSurface.tsx`: reusable pattern surface island.
- `src/components/layout/Footer.astro`: global footer pattern treatment.
- `src/pages/index.astro`: Unknown Arts newsletter feature pattern treatment.
- `src/styles/global.css`: writing-list accent styling.

## Steps

1. Create the reusable pattern surface with light/dark awareness and parent-triggered replay.
2. Add a quiet footer pattern behind the existing footer content.
3. Replace the static newsletter banner image with a stronger animated Unknown Arts pattern hero.
4. Add a restrained hover strip to writing list items.
5. Verify with build and browser checks.

## Verification

- Run `pnpm build`.
- Run `pnpm dev` and inspect home, writing, project, resume, and lab routes in light/dark mode.
- Confirm reduced-motion users do not receive replay animation.
