# Home Page Evolution

## Context

The current home page is structured as a marketing scroll: hero → projects → lab → writing → kind words → CTA. It communicates *what* Patrick has built but not *who he is* or *why those things connect*. The resume page holds career context that most visitors never see.

The goal is to transform the home page into an experience that earns interviews at companies like Anthropic, OpenAI, and Cursor — places that want people operating at the frontier of design and technology. The experience itself needs to make that case, not just the content. Someone landing on this page should feel like they're already looking at the work of someone who belongs there.

The reference point is [mackenziechild.me](https://www.mackenziechild.me/) — not to copy the visual style, but to match the structural philosophy: a portrait of a person who makes things across multiple modes, told through evidence you can explore rather than read.

### The four-pillar narrative

The home page needs to communicate four things in equal measure:

- **Work** — He does the professional job at a high level
- **Lab** — He actually builds as a designer, pushing technical limits
- **Writing** — He thinks in public, consistently and eloquently, with real readership
- **Community** — He shows up for people and the field

These are not ranked sections. They are four facets of the same person, and the visual weight of each should reflect that.

## What changes

### Remove: Resume page
The resume page (`src/pages/resume.astro`) is replaced by:
1. A compact career strip on the home page (the arc and job list)
2. A future About page (separate initiative) for the personal narrative

Remove "Resumé" from the nav in `src/data/site-config.ts`. The About page nav item will be added when that page is built. For now the nav becomes: Writing, Lab.

### Add: Career strip (home page)
A compact, text-only job list that sits between the hero and the Work section. No logos (company names aren't recognizable enough to earn the visual weight). Displays: company, role, and years for all 6 roles from `src/data/experience.ts`.

This is information density without resume formality — context that earns the projects that follow it.

### Evolve: Hero
The current hero is two sentences. It needs to be a genuine POV statement that signals frontier thinking. Keep the photo, name, and social icons. The bio copy needs to:
- Say what Patrick believes, not just what he does
- Name current work (Sublime, Unknown Arts, building this site)
- Feel like a person wrote it, not a job application

The arc nodes from the resume page (`Strategist → Developer → Designer → Writer → Builder`) are strong and should migrate here rather than disappear.

### Restructure: Work section
Currently projects are the dominant first section after the hero. They move to sit underneath the career strip, anchored by employer context.

**Recent companies (Sublime Security, JupiterOne):** Up to 2 project cards each, linking to full case study pages. Note: new Sublime project pages need to be created as a separate content effort — the structure will be ready to receive them.

**Older companies (Signal Sciences, Tenable, Amex, Leo Burnett):** Light treatment. One representative image + 2–3 sentences of personal reflection per company, no case study link. These exist as evidence of range, not as portfolio pieces.

### Elevate: Lab section
Currently lab is behind a section header and two cards. It needs to be a first-class pillar with equal visual weight to Work. The lab experiments are Patrick's primary differentiator against other product designers targeting the same roles — most have case studies, almost none have live interactive work they built themselves.

The section should make you want to touch it, not just read it. Lab cards should show more of the live experience, and the section should feel inviting rather than archival.

### Refine: Writing section
The Unknown Arts card stays — it's strong. The article list below it should become curated rather than chronological (latest 3). Featured pieces should be chosen for how well they demonstrate thinking about product, AI, and craft — including essays like "how I built this site" that a case study could never communicate.

### Add: Community section
Replaces the existing "Kind Words" section with a broader framing. Includes:
- The existing commendation quotes (masonry grid, already strong)
- Photos from meetups Patrick has hosted — humanizing evidence of showing up for the field

Meetup photos need to be sourced and added to `/public/images/`. A new data structure may be needed to manage them alongside commendations, or they can be a simple array of image paths with captions.

## Files to modify

| File | Change |
|------|--------|
| `src/pages/index.astro` | Major restructure — hero, career strip, four pillars |
| `src/pages/resume.astro` | Delete |
| `src/data/site-config.ts` | Remove Resumé nav item |
| `src/data/commendations.ts` | No change to existing data; Community section may add meetup photo data separately |
| `src/data/experience.ts` | No structural change; career strip reads from this |
| `src/scripts/home-animations.ts` | Update to cover new sections and remove resume-specific logic |

## Implementation steps

### Step 1 — Nav + resume removal
- Remove "Resumé" from `siteConfig.nav`
- Delete `src/pages/resume.astro`
- Verify no broken internal links to `/resume`

### Step 2 — Hero evolution
- Update bio copy: POV statement, current work, personal voice
- Migrate arc nodes (`Strategist → Developer → Designer → Writer → Builder`) from resume page into hero
- Keep photo, name, social icons, animation behavior

### Step 3 — Career strip
- New section below hero
- Reads from `src/data/experience.ts`
- Text-only: company · role · years, one per line
- Visually quiet — mono font, muted color, no borders or cards
- No interactivity in this phase (click-to-expand could come later)

### Step 4 — Restructure Work section
- Move below career strip
- Update section label from "Projects" to "Work"
- **Project card treatment:** thumbnail + project title only — no description, no skill badges, no impact statement. The title (already written as a thesis statement) + image is the hook; full detail lives on the project page. Use a `compact` variant of `ProjectCard` or a simpler inline component.
- Recent companies (Sublime, JupiterOne): up to 2 compact project cards each, linking to case study pages
- Older companies: new light-treatment component — 1 image + 2–3 sentence personal reflection, no link

### Step 5 — Elevate Lab section
- Give Lab equal visual prominence to Work
- Enhance lab cards to show more of the live experience
- Consider showing all current lab entries (not just 2) given elevated status

### Step 6 — Refine Writing section
- Keep Unknown Arts card as-is
- Replace latest-3 article list with a curated set (likely 3–4 hand-selected pieces)
- Add a way to feature specific articles — a `featured: true` field on writing frontmatter, or a hardcoded list in index.astro

### Step 7 — Community section
- Rename section from "Kind Words" to "Community"
- Keep existing commendations masonry grid
- Add meetup photos (requires Patrick to provide photos and captions)
- Design photo treatment — probably small grid or strip, warm and candid in feel

### Step 8 — Animation + polish pass
- Update `home-animations.ts` to cover new sections
- Verify entrance animations feel right at new scroll positions
- Mobile pass: each section should work well at small viewport

## Sequencing notes

Steps 1–4 can be done in one PR since they're structurally related (career strip and work restructure are interdependent). Steps 5–7 can be done as a second PR. Step 8 is polish after both are in.

Step 7 (Community photos) is blocked on Patrick providing the images. The commendations grid can ship first; photos drop in when ready.

New Sublime project pages are a separate content effort that slots into the Work section structure once built.

## Verification

- Desktop: four pillars feel visually equal; nothing dominates the scroll
- Mobile: hero reads as a standalone business card; full name, role, current work, contact links visible without scroll
- Dark mode: all new sections match established dark mode treatment
- No broken links (especially from the resume page removal)
- Build passes with no errors
