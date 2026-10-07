# Design Studio ownership benefits

## Status

Complete locally; not deployed.

## Context and desired outcome

The foundation section reads generically. Communicate three concrete selling
points: open-source ownership and portable files, familiar agent harnesses,
and practical defaults intended for customization around each team's needs.

## Approach, scope, and files

Update the heading, introduction, and three benefits in src/pages/design-studio.astro.
Reorder existing illustrations to show source files, the agent relationship,
then the customizable environment. Synchronize src/data/design-studio-agent.txt.
Keep existing spacing and responsive columns. No dependency or deployment work.

## Review and verification

Name React, TypeScript, Excalidraw, Mermaid, and Markdown rather than generic
open formats. Name the three plugin hosts and retain the direct-source option.
Name shadcn/ui and Untitled UI as foundations to build on, not complete included
catalogs. Retain the full Design Studio product name and avoid em dashes.
Run pnpm build and diff check. Browser review is currently unavailable because
the bound preview tab is blocked by the browser URL policy; do not bypass it.

Production build passes (43 pages), and diff check passes. Existing responsive
layout is preserved; illustration order now matches the three benefits.

Follow-up illustration: replaced the overlapping standalone windows with one
coding harness containing an agent chat pane and an embedded Design Studio
preview. Updated accessible description. Reviewed standalone SVG raster output
at `/private/tmp/design-studio-harness-illustration.png`; production build passes.
Balanced benefit descriptions to 183, 177, and 182 characters for desktop rhythm.

## Learnings

No new durable convention needed. Specific ownership, interoperability, and
customization benefits replace generic platform claims in this section.
