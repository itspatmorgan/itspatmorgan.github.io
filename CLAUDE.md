# CLAUDE.md

## Project overview

Personal portfolio site for Patrick Morgan (itspatmorgan). Migrated from Framer to a custom Astro + Tailwind + shadcn/ui codebase. Targets design and tech leaders with a warm, minimal aesthetic.

## Tech stack

- **Framework:** Astro v5 (static output)
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite` plugin (NOT PostCSS)
- **Components:** shadcn/ui (base-nova style, configured in `components.json`)
- **React:** Used only for interactive components (e.g., ThemeToggle). Most components are `.astro` files.
- **Fonts:** Geist Sans (body) + Geist Mono (labels, metadata, code)
- **Package manager:** pnpm 10+
- **Node:** v20+
- **Deployment:** GitHub Pages via GitHub Actions (push to `main`)

## Commands

```bash
pnpm dev        # Dev server on localhost:4321
pnpm build      # Production build to dist/
pnpm preview    # Preview production build
```

## Architecture

### Path aliases

`@/*` maps to `./src/*` (configured in `tsconfig.json`). Always use `@/` imports.

### Content collections

Defined in `src/content.config.ts` with Zod schemas. Two collections:

- **projects** (`src/content/projects/*.md`) — Case studies. Fields: `title`, `type` (professional | experiment), `description`, `skills[]`, `thumbnail`, `heroImage?`, `sortOrder`, `draft`
- **writing** (`src/content/writing/*.md`) — Articles. Fields: `title`, `description`, `publishedDate`, `categories[]`, `tags[]`, `draft`

Query with `getCollection()` from `astro:content`. Filter drafts: `getCollection("writing", ({ data }) => !data.draft)`.

### Layout hierarchy

`BaseLayout.astro` → `PageLayout.astro` (standard pages), `ProjectLayout.astro` (case studies), or `WritingLayout.astro` (articles)

### Key data files

- `src/data/site-config.ts` — Site metadata, nav links, social URLs
- `src/data/commendations.ts` — Testimonial quotes with profile images
- `src/data/experience.ts` — Career timeline roles, sections, and narrative bullet points (resume page)

## Styling conventions

### Color system

OKLCH color tokens as CSS custom properties in `src/styles/global.css`. Light mode uses warm cream tints; dark mode uses rich warm blacks. Key tokens:
- `--background`, `--foreground`, `--card`, `--muted-foreground`, `--accent`, `--border`
- Use Tailwind classes like `text-muted-foreground`, `bg-card`, `border-border`, `hover:text-accent`

### Dark mode

Class-based (`.dark` on `<html>`). Toggle via `ThemeToggle.tsx`. Use `@custom-variant dark (&:is(.dark *))` in CSS. Dark mode preference persists in `localStorage`.

### Section pattern

All home page sections follow this structure:
- Container: `mx-auto max-w-3xl px-6 py-16`
- Section dividers: `border-t border-border` on the section element
- Section labels: `font-mono text-xs uppercase tracking-widest text-muted-foreground`

### Prose

Markdown content uses `.prose` class (custom styles in `global.css`, not `@tailwindcss/typography`).

## Image conventions

| Pattern | Size | Purpose |
|---|---|---|
| `feature-*` | 2400x2400 (square) | Home page project cards |
| `thumbnail.*` | 1920x1080 (16:9) | Project detail page hero via `heroImage` field |
| `career-*.svg` | Variable | Logo carousel (white SVGs, inverted in light mode via `.logo-adaptive`) |
| Profile images in `/images/profiles/` | Variable | Commendation author headshots |

## Known issues

- `src/pages/style-guide.astro` has a pre-existing syntax error (line 32) — not blocking
## Migration status

The site is being migrated from Framer following a phased plan at `/Users/pmwork/Developer/personal-website-plan.md`. Completed phases:
- Phase 1: Foundation (Astro setup, Tailwind, layouts)
- Phase 2: Resume page (career timeline, renamed from "experience" to "resume")
- Phase 3: Project detail pages
- Phase 4: Home page (hero, logo carousel, projects, writing, kind words, CTA, footer)
- Phase 5: Writing section (listing page + article detail pages, renamed from "blog" to "writing")

Remaining: Phase 6 (Polish & Launch)

## Naming conventions

The site uses specific terminology consistently:
- **"Resume"** (not "Experience") — nav, URL `/resume`, footer link
- **"Writing"** (not "Blog") — nav, URL `/writing`, content collection name, home page section label
- **"Kind Words"** (not "Commendations" or "Testimonials") — home page section label
