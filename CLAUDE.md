# CLAUDE.md

## Project overview

Personal portfolio site for Patrick Morgan (itspatmorgan). Migrated from Framer to a custom Astro + Tailwind + shadcn/ui codebase. Targets design and tech leaders with a warm, minimal aesthetic.

## Workflow

This project uses a plan → track → build → document workflow. Follow this process for all non-trivial work.

### Planning

Before starting implementation, create a plan in `.claude/plans/` with a descriptive filename (e.g., `hover-shimmer.md`). Plans should include:
- **Context** — What problem this solves and why it matters
- **Approach** — Technical strategy and key decisions
- **Files to modify** — Table of files and what changes
- **Steps** — Ordered implementation steps
- **Verification** — How to confirm the work is correct

Plans are committed to the repo so they're publicly visible and linkable from issues.

### Task tracking

All work is tracked through [GitHub Issues](https://github.com/itspatmorgan/itspatmorgan.github.io/issues) and the [Personal Website](https://github.com/users/itspatmorgan/projects/2) project board.

**When starting work on an issue:**
- Move the issue to "In progress" on the project board: `gh project item-edit --project-id <id> --id <item-id> --field-id <status-field-id> --single-select-option-id <in-progress-option-id>`
- Create a plan in `.claude/plans/` if one doesn't exist
- Link the plan from the issue as a comment

**When completing work:**
- Close the issue with `gh issue close <number> --reason completed`
- The project board auto-moves closed issues to "Done"
- Link relevant commits from the issue

**Creating new issues:**
- Use labels from both dimensions (where + what)
- Where: `home`, `resume`, `projects`, `writing`
- What: `design`, `content`, `infrastructure`, `documentation`
- Keep descriptions concise — link to plans for detail

### Directory roles

| Directory | Role | Contents |
|-----------|------|----------|
| `.claude/plans/` | Claude's output | Implementation plans created during planning sessions |
| `.reference/` | Patrick's input | Briefs, outlines, screenshots, design tokens, reference URLs — context that informs the work |
| `TODO.md` | Pointer | Links to the project board and issues; documents the label taxonomy |

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

- **projects** (`src/content/projects/*.{md,mdx}`) — Case studies. Fields: `title`, `type` (professional | experiment), `description`, `skills[]`, `thumbnail`, `heroImage?`, `sortOrder`, `draft`. Four projects use `.mdx` for embed components; one uses `.md`.
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

### Embeds

Project detail pages support YouTube and Figma Slides embeds via MDX:
- **YouTube:** `astro-embed` package (`<YouTube id="..." posterQuality="max" />`). Uses `lite-youtube-embed` — shows thumbnail, loads zero JS until play click.
- **Figma Slides:** Custom `<FigmaEmbed>` component (`src/components/FigmaEmbed.astro`). Uses `/deck/` URL path for presentation mode (not `/slides/` which shows editor view).
- Embed styles are in `global.css` under `/* Embed styles within prose */`.

## Image conventions

| Pattern | Size | Purpose |
|---|---|---|
| `feature-*` | 2400x2400 (square) | Home page project cards |
| `thumbnail.*` | 1920x1080 (16:9) | Project detail page hero via `heroImage` field |
| `career-*.svg` | Variable | Logo carousel (white SVGs, inverted in light mode via `.logo-adaptive`) |
| Profile images in `/images/profiles/` | Variable | Commendation author headshots |

## Naming conventions

The site uses specific terminology consistently:
- **"Resume"** (not "Experience") — nav, URL `/resume`, footer link
- **"Writing"** (not "Blog") — nav, URL `/writing`, content collection name, home page section label
- **"Kind Words"** (not "Commendations" or "Testimonials") — home page section label

## Known issues

- `src/pages/style-guide.astro` has a pre-existing syntax error (line 32) — not blocking
