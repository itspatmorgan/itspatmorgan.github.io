# Colophon, Local Time, and Footer Dot Grid

## Context

Issue #30 called for a `/blueprints` colophon page documenting the site's stack and tooling for curious peers. This closes that issue under the name `/colophon` (more conventional). The work expanded into two related affordances — a live local time widget in the footer and a dot grid replacing the flow-field — all of which share the "made with care" narrative.

## Approach

Three distinct additions shipped together since they all touch the footer and share a design rationale:

1. **`/colophon` page** — structured as a `<dl>` with mono labels and prose descriptions, three sections (Stack, AI Agents, Infrastructure), all tool names linked to their homepages.
2. **`LocalTime.tsx`** — a minimal React component showing `Los Angeles, CA · HH:MM AM/PM` using the `America/Los_Angeles` timezone, updating every 60 seconds via `setInterval`.
3. **Footer dot grid** — replaced the `flow-field` generative pattern with `dot-grid` (spacing 16, dotSize 58, muted/bronze) for a subtler, pixel-metaphor-consistent texture.

## Files Modified

| File | Change |
|------|--------|
| `src/pages/colophon.astro` | New page at `/colophon` |
| `src/components/LocalTime.tsx` | New React component for live local time |
| `src/components/layout/Footer.astro` | Added LocalTime + Colophon + Style Guide links; swapped flow-field → dot-grid; added LocalTime import |

## Steps

1. Build `LocalTime.tsx` with `useEffect` / `setInterval` pattern
2. Create `colophon.astro` with three section groups and linked `<dt>` labels
3. Update `Footer.astro` bottom bar: left side `© · Colophon · Style Guide`, right side `<LocalTime />`
4. Swap footer generative pattern from `flow-field` to `dot-grid` with tuned opacity per mode

## Verification

- `/colophon` renders with three sections and all labels linked externally
- Footer bottom bar shows live time in Geist Mono, LA timezone
- Dot grid visible in both dark (muted, opacity 30) and light (bronze, opacity 62) modes with gradient mask fade
- All existing footer links and layout unaffected
