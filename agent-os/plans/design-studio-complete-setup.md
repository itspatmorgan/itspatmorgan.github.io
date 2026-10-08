# Complete Design Studio setup prompts

## Status

Complete locally; not deployed. User approved the proposed scope.

## Context

The landing page's plugin prompts stop at installation. The current upstream
SETUP.md supports combined creation and Sites publication for Codex, while its
standard plugin prompts still require a separate creation request.

## Desired Outcome

One copyable request per app covers plugin installation, local Design Studio
creation, preview, and workspace handoff. Codex also offers an explicitly gated
ChatGPT Sites prompt for creation and a public review link.

## Approach and Scope

Adapt the upstream procedures to the approved end-to-end requests. Retain the
four app/source choices, beta guidance, direct-source fallback, and honest
restart/new-chat guidance. Keep publication optional and local authoring clear.
No plugin installation, Design Studio creation, upstream edits, or deployment.

## Files To Modify

- src/data/design-studio-setup.ts: complete setup prompts and Sites option.
- src/pages/design-studio.astro: render optional Sites prompt and prerequisite.
- src/data/design-studio-agent.txt: synchronize the plain-text setup guide.
- This plan: verification and learning decision.

## Steps

- [x] Investigate current GitHub SETUP.md and local page; obtain scope approval.
- [x] Update prompts, surrounding copy, and Agent guide.
- [x] Build and review desktop/mobile disclosure and copy behavior.

## Review

- Product: setup ends in a working local Design Studio; Sites is optional.
- Editorial: full Design Studio name; explicit local Codex and Sites prerequisite.
- Design: reuse existing disclosure and prompt styles.
- Architecture: reuse existing copy handlers; no new dependencies.
- Maintenance: upstream SETUP.md owns procedures; page prompts adapt their scope.
- Verification: pnpm build, diff check, browser review.

## Learnings

No new convention or system-map change is needed. Record the current prompt
scope in the existing setup-path plan so its original exact-source claims are
not mistaken for the current implementation.

## Verification

Production build passes (43 pages); git diff --check passes. All five setup
prompts match the Agent guide, and the generated agent.txt route matches its
source. Browser checks verified the Codex local and Sites clipboard contents,
all four disclosures, the direct-source manual link, and readable mobile prompt
wrapping with no horizontal overflow at 390px. Desktop dark-mode proof is at
/private/tmp/design-studio-complete-setup.jpg; preview remains open for review.
The Sites prerequisite appears before its prompt. No installation or publishing
journey was executed; this change updates the instructions for those journeys.

## Setup clarity refinement

At the user's request, removed all first-idea suggestions and paragraphs below
setup prompts. Each choice now contains a short introduction followed by its
prompt and copy action. Codex's local and Sites options have separate headings
and a divider; Sites eligibility and audience context precede its prompt.
Direct-source manual setup links also precede the prompt. Removed unused next
copy from the data and synchronized the Agent guide, keeping prompts unchanged.

Verification: production build passes, diff check passes, all five setup
prompts match the Agent guide, and DOM review confirms every option ends with
its prompt. Browser review verified desktop grouping, mobile wrapping and no
overflow at 390px, and copy feedback. Screenshot:
/private/tmp/design-studio-setup-grouping.jpg. No additional durable convention
is needed; this refinement is recorded in the existing plan.

## Responsive visual follow-ups

The creator portrait now precedes the note in source order and on mobile,
while md order classes retain text-left/photo-right on desktop. Browser review
verified photo-above-note at 390px and photo-right-of-note at desktop width.

After reviewing the hero's stacked layout, the user asked to see the proposed
adjustment. Its illustration is now left-aligned and capped at 400px below
1024px, with a 24px gap and smaller bottom padding. Desktop retains the original
two-column composition. At 954px the hero is 160px shorter. Verified phone
layout and both sides of the 1024px breakpoint; illustration fits throughout.
The full page has a separate 2px overflow at 1023px near the creator portrait;
that issue is outside the hero change. No new durable convention is needed.

## Setup and creator copy refinement

Combined the local-files, team repository, and plugin beta notes beneath the
setup disclosures into one paragraph using the same 16px type. The creator's
story now links to https://www.unknownarts.com/p/build-a-design-os, the canonical
Unknown Arts article recorded in the writing collection and verified online.
Browser DOM confirms the paragraph and destination; production build passes.

Final review supersedes the combined paragraph: removed the local-files,
repository, and beta notes entirely at the user's request. The setup section
now ends with Full setup instructions. Publishing options was renamed and
moved below Explore a published prototype. All four artifact tabs verified
individually in the local server and production preview after server recovery.
User approved publishing the reviewed changes on October 7, 2026.
