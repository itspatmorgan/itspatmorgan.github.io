 # Home Career Moments Module

## Context

The home page Work section currently combines a compact career list with two project cards. The updated direction is to keep the six jobs as the organizing structure, but turn the section into a higher-level interactive briefing module: hover or focus a career item on the left, see a richer work preview on the right, and click through to the matching section on the Work page.

## Approach

- Keep `src/data/experience.ts` as the source of truth for the six jobs.
- Add lightweight per-role `moment` metadata for home-page copy, future media paths, and visual placeholders.
- Build a focused React island for interaction because Astro alone cannot manage hover/focus preview state cleanly across panes.
- Use placeholder generated panels now, while preserving explicit `image` and `video` fields for future real assets.
- Link each item to `/work#<role-slug>` and add matching IDs to the Work timeline.

## Files To Modify

- `src/data/experience.ts`: add role slugs and moment metadata.
- `src/components/CareerMoments.tsx`: new interactive career module.
- `src/pages/index.astro`: replace the current Work section contents.
- `src/pages/work/index.astro`: add section anchors for deep links.

## Steps

1. Extend role data with stable slugs and moment preview content.
2. Build the interactive module with desktop two-pane and mobile stacked behavior.
3. Replace the old home Work split with the new module.
4. Add IDs to Work page timeline entries.
5. Verify with `pnpm build` and browser inspection.

## Verification

- `pnpm build`
- `pnpm dev`
- Browser check at `/` for desktop and mobile responsive states.
- Confirm `/work#sublime-security` and equivalent anchors scroll to the right section.
