# Design Studio reading pass

## Status

Complete locally; not deployed.

## Context and Desired Outcome

The landing page has accumulated explanations that compete with its core story.
Cut repeated copy and make essential body text 16px so the page is easier to skim.

## Approach and Scope

Preserve the sections, example, illustrations, creator story, and canonical setup
prompts. Shorten the gallery, system paths, and benefits. Move hosting choices
into native details and the first-project prompt into each expanded setup path.
Keep labels and supporting links at 14px. Simplify the closing invitation.
No dependencies or deployment.

## Files To Modify

- src/pages/design-studio.astro: copy, body sizing, progressive disclosure.

## Steps

- [x] Review current page and preserve existing local edits.
- [x] Make the reading pass.
- [x] Build, inspect generated structure, and check the diff.

## Review and Verification

Keep local editing and published viewing explicit. Preserve named libraries and
file formats, all four setup paths, and clipboard behavior. Native details keeps
hosting accessible without JavaScript. Run pnpm build and git diff --check.
Browser preview remains blocked by URL policy; no workaround will be attempted.

Production build and diff check pass. Generated HTML confirms four setup paths,
each with installation and first-project copy controls, and hosting copy inside
native details. Preserved canonical installation prompts and creator story.
Responsive appearance and live clipboard interaction remain unverified.

## Learnings

No new durable convention: reserve small text for labels and supporting links;
essential explanatory copy should be readable without opening secondary details.

Follow-up: restored the large prototype example above the local/published story.
Added StudioWorkflow.astro with matching native vector illustrations: local agent
chat with embedded Design Studio, and a published Design Studio linked to reviewers.
Production build and diff check pass. Reviewed standalone artwork raster at
/private/tmp/design-studio-workflow-art.png; full-page browser review remains unavailable.

Follow-up: moved the two illustrated workflow blocks into their own labeled
work-and-share section directly before setup. Kept the viewing link and hosting
disclosure with publishing; the gallery now focuses on connected artifacts.
Build and diff check pass; generated HTML confirms the section contents and order.
