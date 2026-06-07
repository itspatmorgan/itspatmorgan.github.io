# Phase 4: Home Page Build

## Context
The home page is the most important page — the first impression for design/tech leaders and hiring managers. Currently it's a minimal placeholder with a name, tagline, and "coming soon" message. The reference screenshot (`.reference/references/screenshot-home-page.png`) and the website brief (`.reference/website-brief.md`) show a full-featured page with multiple sections showcasing projects, writing, and social proof.

## Sub-phases

### 4a: Hero + Logo Bar
Rebuild the hero section and add the career logo bar.

**Changes to `src/pages/index.astro`:**
- Profile photo (`/images/brand/profile-picture.jpg`)
- Headline: "Product designer crafting intuitive experiences for high-impact technology"
- Description paragraph about current work (Sublime Security + Unknown Arts)
- Social links row (LinkedIn, Newsletter, X) — reuse `siteConfig.social`
- Career company logo bar using the 8 `career-*.svg` files in `/public/images/logos/`

### 4b: Project Sections
Show professional and experiment projects with cards linking to detail pages.

**New component: `src/components/ProjectCard.astro`**
- Thumbnail image, title, skill badges, description, impact quote
- Links to `/projects/{slug}`
- Reuse existing Badge component

**Changes to `src/pages/index.astro`:**
- "Product Design" section — query 3 professional projects sorted by `sortOrder`
- "AI Experiments" section — query 2 experiment projects sorted by `sortOrder`
- Both use `getCollection("projects")` filtered by `type`

### 4c: Unknown Arts + Writing Samples
Showcase the newsletter and blog content.

**Changes to `src/pages/index.astro`:**
- "Unknown Arts" section — description, stats (7,400+ subscribers, 128 countries, 40% open rate, 190+ articles), thumbnail image, link to newsletter
- "Writing Samples" section — show the 4 blog posts with title, description, date, linking to `/blog/{slug}` (pages don't exist yet but links will be ready)
- Blog posts queried from `getCollection("blog")` sorted by `publishedDate` desc

### 4d: Social Proof + CTA
Add testimonials and closing statement.

**New file: `src/data/commendations.ts`**
- Array of quote objects: `{ name, role, quote }`
- Data from `.reference/references/Outline - Existing Website.md` (12+ commendations)
- Show a curated subset (~6) on the home page

**Changes to `src/pages/index.astro`:**
- "Commendations" section — grid of quote cards
- CTA section: "Let's craft a better future, together." with social links

## Design approach
- All sections live in `src/pages/index.astro` as Astro components (no React needed — no client-side interactivity)
- Consistent section pattern: `border-t border-border` separators, `mx-auto max-w-3xl px-6 py-16`, mono uppercase section labels
- Project cards follow the warm, minimal aesthetic established in Phase 3
- Each sub-phase gets committed separately so we can review and iterate

## Key files
- `src/pages/index.astro` (main file, rewritten)
- `src/components/ProjectCard.astro` (new)
- `src/data/commendations.ts` (new)
- `src/data/site-config.ts` (read only, for social links)
- `src/content.config.ts` (read only, for collection queries)

## Verification
After each sub-phase:
- `preview_screenshot` to verify layout
- Check both light and dark modes
- Verify all links point to correct destinations
- No console or build errors
