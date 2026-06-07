# Scaffold Plan: Personal Website Migration from Framer

## Context

Patrick is migrating his portfolio site off Framer to a custom, self-owned codebase. The goals: own the code, version on GitHub, deploy to GitHub Pages, stop paying for Framer, and maintain a markdown-first authoring workflow. The site serves as a professional portfolio targeting design/tech leaders, with secondary use as a knowledge base for writing.

Existing content is ready: 5 project case studies (markdown), 4 blog posts (markdown), 37 image assets (SVGs, JPGs, PNGs), and detailed reference screenshots of the current dark-themed Framer site.

---

## Tech Stack: Astro + React + Tailwind + shadcn/ui

**Astro v5** is the best fit for this project. Here's why:

| Requirement | Why Astro wins |
|---|---|
| Markdown authoring | Built-in Content Collections with Zod-validated frontmatter schemas |
| shadcn/ui components | Supports React components via islands architecture — use React only where interactivity is needed |
| Minimal JS / fast loading | Ships zero JS by default; aligns with the minimal, fast-loading aesthetic of the inspiration sites |
| GitHub Pages | Official `withastro/action` handles build + deploy |
| AI-native development | `.astro` syntax is essentially HTML + frontmatter — highly readable by Claude Code |
| Custom design flexibility | Full Tailwind + React when needed; not locked into any template system |
| Low maintenance | Static output, no server, minimal dependencies |

**Full stack:**
- **Framework:** Astro v5 (static output)
- **UI Components:** shadcn/ui (React), used selectively as Astro islands
- **Styling:** Tailwind CSS v4 + `@tailwindcss/typography`
- **Content:** Markdown via Astro Content Collections (Zod schemas)
- **Language:** TypeScript
- **Package Manager:** pnpm
- **Fonts:** Geist Sans (primary/body) + Geist Mono (code, accents, UI details) — both self-hosted
- **Deploy:** GitHub Pages via GitHub Actions
- **Dev Environment:** DevContainer for GitHub Codespaces

---

## Project Structure

```
personal-website/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
│   ├── fonts/                      # Self-hosted Geist Mono woff2 files
│   ├── images/
│   │   ├── logos/                   # SVG career + square logos
│   │   ├── projects/               # Organized by project slug
│   │   │   ├── query/
│   │   │   ├── expansion/
│   │   │   ├── vision/
│   │   │   ├── characters/
│   │   │   └── gpts/
│   │   ├── brand/                   # Logo variants, profile picture
│   │   └── unknown-arts/
│   └── favicon.svg
├── src/
│   ├── content/
│   │   ├── projects/                # 5 markdown case studies
│   │   └── blog/                    # 4+ markdown blog posts
│   ├── content.config.ts            # Zod schemas for collections
│   ├── components/
│   │   ├── ui/                      # shadcn/ui components (Button, Badge, Card, etc.)
│   │   ├── layout/                  # Header, Footer, Navigation, ThemeToggle
│   │   ├── home/                    # Hero, ProjectCard, LogoCarousel, etc.
│   │   ├── experience/              # CareerTimeline, TimelineEntry
│   │   ├── projects/                # ProjectHero, YouTubeEmbed, FigmaEmbed
│   │   ├── blog/                    # BlogPostCard, BlogPostHeader
│   │   └── shared/                  # SocialLinks, SubstackEmbed, Prose, Container
│   ├── layouts/
│   │   ├── BaseLayout.astro         # HTML shell, meta, fonts, theme-init
│   │   ├── PageLayout.astro         # Base + header + footer
│   │   ├── ProjectLayout.astro      # Project detail wrapper
│   │   └── BlogLayout.astro         # Blog post wrapper
│   ├── pages/
│   │   ├── index.astro              # Home
│   │   ├── experience.astro         # Career timeline
│   │   ├── blog/
│   │   │   ├── index.astro          # Blog listing
│   │   │   └── [...slug].astro      # Dynamic blog posts
│   │   └── projects/
│   │       └── [...slug].astro      # Dynamic project pages
│   ├── styles/
│   │   └── global.css               # Tailwind directives, CSS vars, font-face
│   ├── lib/
│   │   └── utils.ts                 # cn() class merge utility
│   └── data/
│       ├── experience.ts            # Structured career timeline data
│       ├── social-links.ts          # Social URLs
│       └── site-config.ts           # Site metadata, nav items
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── components.json                  # shadcn/ui config
├── package.json
└── .gitignore
```

---

## Content Architecture

### Projects Collection Schema

Frontmatter is minimal — only metadata needed for listing pages, routing, and filtering. Everything else lives in the markdown body where it belongs.

```yaml
---
title: "Making a Complex Query Language Approachable"
type: "professional"          # or "experiment" — drives layout template
description: "JupiterOne faced a critical user adoption challenge..."
skills: ["Interaction Design", "Prototyping", "UI Design"]
thumbnail: "/images/projects/query/thumbnail.jpg"
sortOrder: 1
draft: false
---

## Challenge Statement

How might we help new users understand and leverage...

## Challenge

JupiterOne's graph-based security platform...

## Approach
...
```

**What stays in frontmatter** (needed for cards/listings/routing):
- `title`, `type`, `description`, `skills`, `thumbnail`, `sortOrder`, `draft`

**What lives in the markdown body** (it's content, not metadata):
- Challenge statement, project summary sections, team/duration/tools details, video embeds, Figma embeds, feature images, impact statements — all of this is just written naturally in markdown

The `type` field drives which template renders the page: professional projects show Challenge/Approach/Solution/Impact; experiments show Inspiration/Solution/Opportunities/Learnings.

### Blog Collection Schema

Kept close to your existing Obsidian frontmatter. Only additions are `slug` (for URL routing) and `description` (for meta tags / listing cards).

```yaml
---
title: "AI Runs on Text. So Should You."
slug: "ai-runs-on-text"
description: "Why plain text is where human thinking and AI capability meet."
publishedDate: 2026-02-02
categories: ["Newsletter"]
tags: ["AI", "Markdown"]
draft: false
---
```

Dropped from original: `subtitle` (can just be the first line of the body), `series`, `sourceUrl`, `author` (it's always you). These can be added later if needed.

### Migration from existing files

The current markdown files use informal structure (unstructured "Title:", "Skills:" text blocks in the body, Obsidian-style `[[author]]` links). Migration involves:
- Extracting metadata into proper YAML frontmatter fields
- Renaming files to URL-friendly slugs
- Moving files into `src/content/{collection}/`
- Reorganizing the 37 assets from flat `/assets/` into `public/images/` organized by purpose

---

## Styling & Theming

- **Typography:** Geist Sans as the primary body/heading font; Geist Mono for code blocks, UI accents, metadata, and anywhere a monospace touch adds that "designer-y" feel
- **Light mode default** with class-based dark mode toggle
- **Color palette** derived from the Unknown Arts brand aesthetic: warm blacks, golds/ambers, creams, stone grays
- **CSS custom properties** for theme tokens (shadcn/ui pattern), switching between light and dark via `.dark` class
- **Inline theme-init script** in `<head>` to prevent flash of wrong theme on load
- **Tailwind Typography** plugin for consistent markdown prose styling

---

## Implementation Phases (Strategic Sequencing)

The idea: get a working vertical slice live as fast as possible, then widen. Each phase ends with something you can see and react to.

### Phase 1: Foundation + Deployment Pipeline
**Goal:** `pnpm dev` works, site deploys to GitHub Pages, you can see a page in the browser.

- Init Astro project (minimal template, TypeScript strict)
- Add integrations: React, Tailwind, MDX
- Init shadcn/ui + install starter components (Button, Badge, Card, Toggle)
- Set up Tailwind config with theme tokens (Geist Sans + Geist Mono fonts, color palette, dark mode)
- Create `global.css` with CSS custom properties for light/dark themes
- Download Geist Sans + Geist Mono fonts to `public/fonts/`
- Create BaseLayout + PageLayout (HTML shell, meta, theme-init script, header/footer)
- Create a minimal `index.astro` with placeholder content to verify everything renders
- Init git, `.gitignore`, push to GitHub
- Set up GitHub Actions deploy workflow
- **Checkpoint:** Site is live on GitHub Pages with a placeholder page. Dev server runs locally.

### Phase 2: Content Migration
**Goal:** All existing content is in the system with validated schemas. No new pages yet — just the data layer.

- Define content collection schemas in `src/content.config.ts` (projects + blog)
- Migrate 5 project markdown files → `src/content/projects/` with restructured frontmatter
- Migrate 4 blog markdown files → `src/content/blog/` with restructured frontmatter
- Reorganize 37 image assets from flat `/assets/` → organized `public/images/` structure
- Verify: `pnpm build` succeeds with all content schema-validated
- **Checkpoint:** Content is structured, validated, and queryable. Original `/assets`, `/blogs`, `/projects` dirs can be archived or removed.

### Phase 3: First Vertical Slice — One Project Page
**Goal:** Establish all the design patterns by building one complete project detail page end-to-end.

- Build shared components: Header, Footer, Navigation, ThemeToggle (React island), Container, Prose
- Build project components: ProjectHero, SkillChips, ProjectSummary, YouTubeEmbed, FigmaEmbed, ProjectDetails
- Build ProjectLayout.astro
- Build dynamic `src/pages/projects/[...slug].astro` with conditional rendering (professional vs experiment)
- Style one project page fully — this is where the visual language gets established (spacing, typography scale, card styles, color usage)
- **Checkpoint:** Navigate to `/projects/query-language` and see a fully styled, real project page. This sets the design direction for everything else.

### Phase 4: Home Page
**Goal:** The most important page — the first impression.

- Build home section components: Hero (name, photo, headline, social links), LogoCarousel, ProjectCard, ProjectsSection, UnknownArtsSection, WritingSamples
- Wire up real content from project + blog collections
- Build SocialLinks, SubstackEmbed shared components
- Style the full home page
- **Checkpoint:** Home page shows real projects, writing samples, and brand identity. All project cards link to working detail pages.

### Phase 5: Remaining Pages
**Goal:** Complete the page set.

- **Experience page:** Career timeline data (`src/data/experience.ts`), BulletPoints, CareerTimeline, TimelineEntry components
- **Blog listing + posts:** BlogPostCard, BlogPostHeader, BlogLayout, listing page at `/blog`, dynamic posts at `/blog/[slug]`
- **Checkpoint:** Full site navigation works. All pages render with real content.

### Phase 6: Polish & SEO
**Goal:** Production-ready details.

- Open Graph + Twitter Card meta tags per page
- Favicon
- Canonical URLs
- Responsive audit (mobile, tablet, desktop)
- Dark/light mode audit across all pages
- Performance check (`pnpm build` output size, Lighthouse)
- **Checkpoint:** Site is ready for sharing with hiring managers.

### Deferred (do when needed)
- **DevContainer config** — encapsulate the dev environment once the stack is stable
- **Resume PDF** — not a priority right now

---

## Verification

- `pnpm dev` starts local server at localhost:4321
- All 5 project pages render at `/projects/{slug}`
- All 4 blog posts render at `/blog/{slug}`
- Dark/light mode toggle works without flash
- `pnpm build` produces static output with zero errors
- Content schema validation catches malformed frontmatter
- Responsive layout works at mobile and desktop widths
- GitHub Actions deploys successfully to Pages

---

## What stays out of scope (for now)

- Detailed visual polish and interaction design (iterative refinement phase)
- Social proof / testimonials section content
- Resume PDF
- DevContainer setup (defer until stack is stable)
- Custom domain DNS setup
- Analytics integration
- Image optimization pipeline (assets are already reasonably sized)
