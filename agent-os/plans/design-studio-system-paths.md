# Design Studio system paths

## Status

Complete locally; not deployed.

## Context and desired outcome

The systems section explains older conceptual layers but omits Starter's two
starting paths. The user approved copy describing curation with shadcn/ui or
Untitled UI, and assessment of an existing React system before import.

## Approach and scope

Keep the heading and two-column composition. Use two text blocks for starting
paths; update the drafting illustration to show Instructions (Context, Skills)
and Toolkit (Theme, Components, Assets) feeding one prototype. Synchronize the
Agent guide. No Starter implementation or deployment changes.

## Files and steps

- src/pages/design-studio.astro: approved introduction and two paths.
- src/components/design-studio/StudioFoundation.astro: five-part illustration.
- src/data/design-studio-agent.txt: synchronized system model and pathways.
- Verify production build, diff, and desktop/mobile illustration readability.

## Review and learnings

Source: Starter Systems Guide and setup-design-system reference documents.
Avoid suggesting entire library catalogs ship preinstalled or that arbitrary
production systems import without assessment. Starter HANDOFF.md says the newer
curation guidance needs a refreshed package pin before publishing this claim.
No new durable convention needed; follow the owning Starter documentation.

## Verification

Production build passes (43 pages) and diff check passes. Desktop and 390px
browser reviews confirm the two paths, five-part illustration, and accessible
image description. Mobile has no horizontal overflow. Preview screenshot:
`/private/tmp/design-studio-system-paths.png`.

Illustration padding refinement: uniformly scale the content group to 90% and
center its bounds inside the construction frame, providing approximately 24 SVG
units on each side. Build passes. Reviewed a standalone SVG raster rendering;
browser inspection was unavailable because its tab URL policy blocked access.
