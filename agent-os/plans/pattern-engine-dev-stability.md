# Pattern Engine Dev Stability

## Context

The Pattern Engine route previously hit Vite `504 (Outdated Optimize Dep)` errors for lazily discovered dependencies. After adding optimizer includes, the dev server still logged React `Invalid hook call` warnings on normal pages. Investigation showed the warning was not caused by the Pattern Engine preview surfaces; it came from the site-wide React `LocalTime` footer island.

## Approach

Keep `/lab/pattern-engine` as the interactive React app and keep generated Pattern Engine surfaces on the Lab thumbnail and home newsletter card. Remove the tiny React footer local-time island and implement it as plain DOM scripting, matching the sidebar time implementation. This removes unnecessary site-wide React hydration while preserving the designed generated pattern visuals.

## Files to Modify

- `astro.config.mjs`: keep pre-optimization for Pattern Engine runtime dependencies.
- `src/components/layout/Footer.astro`: replace the `LocalTime` React island with inline DOM time updates.
- `src/components/LocalTime.tsx`: remove the now-unused component.

## Verification

- Start dev with a fresh optimizer pass.
- Request `/lab`, `/`, and `/lab/pattern-engine`.
- Confirm `/lab` and `/` no longer trigger React invalid-hook warnings.
- Run `pnpm build`.
