# Align Design Studio illustrations

## Status

Complete locally; not deployed.

## Context and Desired Outcome

The user wants professional drafting illustrations with fewer labels and
distinct compositions. Use the existing hero and design operating system
illustrations as the visual authority for the local/published workflow,
agent-choice, and customization illustrations.

## Approach and Scope

Use layered sheets, subtle rotation, construction lines, restrained accent,
and hatching from the existing illustrations. Keep only the Design Studio
name within the affected app drawings. Remove external annotations and example
prototype labels. Keep the existing theme and layout.

## Files To Modify

- src/components/design-studio/StudioWorkflow.astro: both illustrations.
- src/components/design-studio/StudioOwnership.astro: agent choice and customization.
- This plan: record review and verification.

## Steps

- [x] Inspect current artwork and visual references.
- [x] Refine existing SVG artwork and accessible descriptions.
- [x] Build and verify desktop/mobile in both themes.

## Review

- Product: local conversation/preview and published interactive viewing remain clear.
- Editorial: no redundant captions or Feedback Inbox labels within these drawings.
- Design: consistent drafting language; avoid playful decorative motifs.
- Architecture: extend existing SVG component without libraries or bitmap assets.
- Maintenance: share line weights, palette, and geometry across both drawings.
- Verification: production build, diff check, desktop and mobile browser review.

## Learnings

The existing hero and operating-system illustrations define this page's visual
language. Extending those patterns produces greater consistency than adding a
separate drafting style. Text inside illustrations should communicate identity
or necessary meaning; section copy already explains the concepts. This scoped
direction is recorded here; no new cross-project convention is needed.

## Verification

Production build passes (43 pages), and git diff --check passes. Browser review
verified the two illustrations at desktop width in light and dark themes and
at 390px in the stacked layout with no horizontal overflow. Descriptive SVG
labels preserve the local-versus-published meaning. Desktop screenshots:
/private/tmp/design-studio-workflow-drafting-dark.jpg and
/private/tmp/design-studio-workflow-drafting-light.jpg. Mobile screenshot:
/private/tmp/design-studio-workflow-drafting-mobile.jpg. The refined drawings
use the existing component and semantic theme tokens; no dependency changes.

## User-directed consistency revision

The initial precision pass used too many annotations and repeated Feedback
Inbox. The final workflow pair uses a selected flow element on an active canvas
for local work and linked, overlapping viewing sheets for publication. Removed
outside labels, captions, sample titles, and review labels. The agent-choice
illustration connects the existing Codex, Claude, and Cursor marks to one Design
Studio; customization connects theme, component, and asset sheets to an interface.
The hero, operating-system drawing, and file-type drawing remain the reference.

Final verification: build passes (43 pages), diff check passes, desktop light
and dark reviews pass, and the revised drawings fit at 390px without horizontal
overflow. SVG descriptions explain the compositions for assistive technology.
Workflow SVGs each contain only the Design Studio name as visible text. Final
screenshots: /private/tmp/design-studio-workflow-aligned.jpg and
/private/tmp/design-studio-ownership-aligned.jpg. Changes remain local.

## Focal-point refinement

Following annotated feedback, the local workflow now gives the agent chat
half the window and emphasizes its conversation and composer; the Design
Studio preview is quieter. Publication uses one browser sheet with a large
foreground share-link control instead of three linked screens. Customization
uses two before-and-after interfaces with a change arrow, replacing the busy
theme/component/asset arrangement. Necessary visible labels are Agent,
Design Studio, and Share link; customization has no labels.

Build passes (43 pages), and diff check passes. Reviewed the revised pair and
customization at desktop and 390px, including light and dark themes. At 390px
the document width matches the viewport. Updated screenshots:
/private/tmp/design-studio-workflow-refined.jpg and
/private/tmp/design-studio-customization-refined.jpg. This scoped feedback
remains in the plan; no durable convention changes are needed.

Final detail: removed the send-arrow glyph from the local chat composer at the
user's request. User approved publishing the reviewed changes on October 7, 2026.
