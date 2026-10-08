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

## Initial Concept

Sequence: introduction → Design Studio → Work → Lab → Writing → Community.

A compact editorial feature uses the existing homepage shell. On desktop,
creator-led copy sits beside the existing connected-artifact illustration from
the dedicated page. On mobile, copy precedes the illustration. This first draft
uses that established visual to explain the breadth of the environment; a real
product screenshot is a possible refinement if the illustration feels too
conceptual in context.

Copy:

- Label: Open-source project
- Title: Design Studio
- Lead: A place to turn ideas into working prototypes.
- Body: I built a prototyping environment that brings interfaces, diagrams,
  canvases, and documents together—and gives coding agents a design system to
  work from.
- Link: Explore Design Studio →

The introduction names and links Design Studio in place of the generic reference
to building software with agents. Primary navigation places Design Studio after
Work, using its existing product mark for the collapsed desktop sidebar.

## Approach

Use Astro and existing semantic styling tokens. Reuse StudioAtmosphere rather
than adding a new visualization or homepage demo. Keep setup on the dedicated
page. Make only the changes required for the feature and its discovery paths.

## Scope

In: homepage copy and feature; desktop/mobile navigation; operating map.

Out: case-study collections, Lab restructuring, dedicated-page redesign,
publishing, and unrelated navigation refactors.

## Files To Modify

- `src/pages/index.astro`: introduction and dedicated feature before Work.
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

## Learnings

Updated the system map for the new homepage hierarchy. No separate learning
note or cross-agent rule is needed: this uses existing site components and
conventions. The illustration versus product screenshot choice remains an
editorial refinement for user review, rather than a verification blocker.
