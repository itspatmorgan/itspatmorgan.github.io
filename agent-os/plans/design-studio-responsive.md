# Design Studio Responsive Compositions

## Status

Complete

## Context and Desired Outcome

The hero and design-system compositions work at phone and wide desktop sizes,
but remain stacked too long in between, leaving undersized artwork and excessive
vertical space. Make the transition fluid using the page's available width.

## Approach and Scope

Use a page container query to introduce columns when content has enough room,
scale headline and gaps within those columns, and constrain stacked artwork.
Preserve content, controls, and other page sections. No publishing in this step.

## Files To Modify

- `src/pages/design-studio.astro`: composition layout and responsive typography.
- This plan: review and verification.

## Steps

- [x] Inspect existing layout and illustration constraints.
- [x] Implement adaptive compositions.
- [x] Review phone, intermediate, desktop, and expanded-sidebar widths.
- [x] Run build and record results.

## Review and Learnings

Check headline wrapping, readable text, artwork proportions, section height,
and horizontal overflow. Prefer available-content-width layout decisions to
viewport breakpoints when navigation also consumes horizontal space.

Verified widths from 390px through 1456px, including the expanded navigation at
946px. Both compositions use columns once the page content reaches 640px;
smaller layouts remain stacked. No horizontal overflow was observed. Visually
reviewed phone and intermediate layouts, headline wrapping, and artwork sizing.
`pnpm build` passed with all 43 pages generated.

Follow-up: place the hero illustration above the headline in stacked layouts,
cap it at 192px wide, and reduce the hero's top padding to 24px. Verified at
390px and 485px: the headline, description, and both actions remain visible
within a 799px-high viewport, with no horizontal overflow. Desktop column order
is unchanged.

The layout rationale is retained here; no additional durable learning is needed
for this scoped adjustment.
