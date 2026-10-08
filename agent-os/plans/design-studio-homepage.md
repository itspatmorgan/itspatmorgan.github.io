# Design Studio Homepage Feature

## Status

Complete — initial concept implemented and verified for local review.

## Context

The homepage introduces Patrick as a designer who builds, but Design Studio has
no direct presence. Its dedicated page presents a substantial open-source
product that connects design systems, agent collaboration, and prototyping.
The user approved giving it a dedicated homepage feature and navigation link,
and requested this work on its own branch.

## Desired Outcome

Visitors recognize Design Studio as a current, authored product and can explore
it directly from the homepage and primary navigation.

## Current Concept

Sequence: introduction → Design Studio → Work → Lab → Writing → Community.

A full-width project card uses the same rounded border, textured image area,
and hover treatment as Work. A Featured section label follows the homepage's
section-header pattern. On desktop, a small static connected-artifact preview
sits on the left and concise copy on the right. On mobile, the preview sits above
the copy, matching the other project cards. The entire card links to Design
Studio, with no nested controls. This replaces the first editorial feature,
which the user found too similar to a competing hero and disruptive to the
homepage's modular rhythm.

Copy:

- Section label: Featured
- Card metadata: Open source · Design tooling
- Title: Design Studio
- Body: An open-source prototyping environment I built to bring interfaces,
  diagrams, canvases, and documents together with coding agents.
- Link: Explore Design Studio →

The introduction names and links Design Studio in place of the generic reference
to building software with agents. Primary navigation places Design Studio after
Work, using the Hugeicons canvas outline icon to match the other sidebar icons.

## Approach

Use Astro and existing semantic styling tokens. Reuse StudioAtmosphere with its
new optional static mode rather than adding a new visualization or homepage
demo. The dedicated page retains the component's default interactive behavior.
Keep setup on the dedicated page. Make only the changes required for the feature
and its discovery paths.

## Scope

In: homepage copy and feature; desktop/mobile navigation; operating map.

Out: case-study collections, Lab restructuring, dedicated-page redesign,
publishing, and unrelated navigation refactors.

## Files To Modify

- `src/pages/index.astro`: introduction and dedicated feature before Work.
- `src/components/design-studio/StudioAtmosphere.astro`: optional static mode for
  use inside the linked project card.
- `src/components/layout/Sidebar.astro`: Design Studio navigation and mark.
- `src/data/site-config.ts`: mobile/shared navigation entry.
- `src/components/layout/MobileNav.astro`: seventh-item entrance timing.
- `agent-os/system-map.md`: homepage orientation.

## Steps

- [x] Inspect existing homepage, product page, and conventions.
- [x] Create `codex/design-studio-homepage`.
- [x] Draft the concept and copy.
- [x] Implement the first version.
- [x] Verify build, responsive layouts, themes, and navigation.
- [x] Record review and durable-learning decision.

## Review

- Product: Design Studio leads current proof of work and links to its own page.
- Editorial: Use full product name and clearly establish Patrick's authorship.
- Design: Match existing warmth, typography, spacing, and restrained palette.
- Architecture: Existing Astro component; no new client framework or collection.
- Maintenance: Reuse established product art and keep the scope narrow.
- Verification: `pnpm build` passed (43 pages); `git diff --check` passed.
  Browser review at 1280px desktop and 390px mobile confirmed the feature's
  two-column/stacked layouts, light and dark desktop styling, motion pause
  control, and navigation from the feature and mobile menu to Design Studio.
  Existing illustration includes reduced-motion handling; no new motion was
  introduced. Screenshots captured in `/private/tmp/design-studio-home-concept/`.
  After user feedback, checked the full-width card at desktop and 390px mobile,
  both desktop themes, whole-card navigation, and the dedicated page's retained
  motion control. Build passed again; revised screenshots use `module-*` names.

## Learnings

Updated the system map for the new homepage hierarchy. No separate learning
note or cross-agent rule is needed. The design review established that homepage
project features should share the surrounding modules' visual language; larger
editorial compositions can compete with the personal introduction.
