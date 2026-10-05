# Content Visibility

## Status

Complete

## Context

The local Writing page rendered its content but left it at opacity zero while
entrance modules failed to run. Restarting the dev server restored animation
execution. Multiple page templates rely on JavaScript to reveal static content.

## Desired Outcome

Content remains readable when animation modules fail or JavaScript is unavailable.

## Approach

Remove initial opacity-zero styles from content containers. Existing animation
calls specify their own opacity keyframes and remain available when scripts load.
Remove the homepage Work header's matching CSS hiding rule.

## Scope

In: Static page content visibility and local server recovery.
Out: Decorative overlays, pixel character layers, animation redesign, deployment.

## Files To Modify

- `src/pages/index.astro`: visible hero, cards, and Work heading.
- `src/pages/{writing,work,lab}/index.astro`: visible sections.
- `src/pages/community.astro`, `src/pages/resume.astro`: visible content.
- `src/pages/lab/{pixel-wave,pixel-mark}.astro`: visible headings and content.
- `agent-os/conventions/styling.md`: progressive animation guidance.

## Steps

- [x] Reproduce invisible content and recover the dev server.
- [x] Remove animation-dependent initial hiding.
- [x] Verify build and affected pages in the browser.

## Review

- Product: Content is available independently of decorative animation.
- Editorial: No content changes.
- Design: Preserve existing animation keyframes and decorative layers.
- Architecture: Static content uses visible server-rendered markup.
- Maintenance: Document the visibility requirement.
- Verification: Production build passed with 42 pages. Generated HTML checks
  confirmed visible initial content containers across all eight affected routes.
  Browser checks passed for Home, Writing, Work, and Lab; Writing's Design filter
  worked. Captured the restored homepage. Restarted the dev server after the
  production build and left it running for preview. `git diff --check` passed.

## Learnings

Update the existing styling convention; avoid a separate duplicate learning note.
