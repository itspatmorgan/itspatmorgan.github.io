# itspatmorgan.github.io

Personal portfolio site for Patrick Morgan — product designer, writer, and creator of [Unknown Arts](https://www.unknownarts.co).

Built with [Astro](https://astro.build), [Tailwind CSS v4](https://tailwindcss.com), and [shadcn/ui](https://ui.shadcn.com). Deployed to GitHub Pages.

## How we work

This site is built collaboratively with [Claude Code](https://claude.ai/code). The workflow is designed to be transparent — anyone can follow along with what was planned, what decisions were made, and how the work progressed.

**[Project board](https://github.com/users/itspatmorgan/projects/2)** — Kanban view of all work (Backlog → In Progress → Done)

### Workflow

1. **Plan** — Claude Code creates implementation plans in `.claude/plans/`. These capture the approach, file changes, and verification steps before any code is written.
2. **Track** — Each piece of work gets a [GitHub Issue](https://github.com/itspatmorgan/itspatmorgan.github.io/issues) with context and links to the relevant plan. Issues are tracked on the [project board](https://github.com/users/itspatmorgan/projects/2).
3. **Build** — Code is written, reviewed, and committed. Commit messages reference the decisions made during implementation.
4. **Document** — Plans and decision context are linked from issues so the reasoning is preserved alongside the work.

### Labels

Issues are tagged across two dimensions:

| Where | What |
|-------|------|
| `home` · `resume` · `projects` · `writing` | `design` · `content` · `infrastructure` · `documentation` |

### Key directories

| Directory | Purpose |
|-----------|---------|
| `.claude/plans/` | Implementation plans created by Claude Code |
| `.reference/` | Input context — briefs, outlines, screenshots, design tokens, reference URLs |

## Getting started

**Prerequisites:** Node.js 20+ and pnpm 10+

```bash
pnpm install
pnpm dev        # Start dev server at localhost:4321
pnpm build      # Build for production
pnpm preview    # Preview production build locally
```

## Project structure

```
src/
├── components/
│   ├── layout/          # Header, Footer
│   ├── ui/              # shadcn/ui primitives (Badge, Button, etc.)
│   ├── FigmaEmbed.astro # Figma Slides presentation embed
│   ├── LogoCarousel.astro
│   └── ProjectCard.astro
├── content/
│   ├── writing/         # Articles (Markdown)
│   └── projects/        # Case studies (Markdown/MDX)
├── data/
│   ├── site-config.ts   # Site metadata, nav links, social URLs
│   ├── commendations.ts # Testimonial quotes + profile images
│   └── experience.ts    # Career timeline roles + narrative bullet points
├── layouts/
│   ├── BaseLayout.astro    # HTML shell, fonts, theme script
│   ├── PageLayout.astro    # Standard page (header + footer)
│   ├── ProjectLayout.astro # Case study detail page
│   └── WritingLayout.astro # Article detail page
├── pages/
│   ├── index.astro         # Home page
│   ├── resume.astro        # Resume / career timeline
│   ├── projects/[...slug].astro
│   ├── writing/index.astro       # Writing listing page
│   ├── writing/[...slug].astro   # Article detail page
│   └── style-guide.astro
├── styles/
│   └── global.css       # Tailwind config, OKLCH color tokens, prose styles
└── content.config.ts    # Zod schemas for content collections
public/
└── images/
    ├── brand/           # Logos, profile picture
    ├── logos/            # Career company SVGs (logo carousel)
    ├── profiles/        # Commendation author headshots
    ├── projects/        # Case study images (feature-* and thumbnail.*)
    └── unknown-arts/    # Newsletter thumbnail
.claude/
└── plans/               # Claude Code implementation plans
.reference/
├── website-brief.md     # Original project brief and requirements
├── planning.md          # Future project ideas
└── references/          # Screenshots, outlines, design tokens, URLs
```

## Content collections

Content is managed through [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/) with Zod-validated frontmatter.

### Projects (`src/content/projects/*.{md,mdx}`)

```yaml
title: "Project Title"
type: "professional" | "experiment"
description: "Short description"
skills: ["Skill 1", "Skill 2"]
thumbnail: "/images/projects/slug/feature-image.jpg"  # Square image for home page card
heroImage: "/images/projects/slug/thumbnail.jpg"       # Optional — if omitted, no hero image renders
sortOrder: 1
draft: false
```

Projects using `.mdx` can import embed components (YouTube, FigmaEmbed) directly in the content body.

### Writing (`src/content/writing/*.md`)

```yaml
title: "Article Title"
description: "Short description"
publishedDate: 2026-02-22
categories: ["Category"]
tags: ["tag1", "tag2"]
draft: false
```

## Image conventions

| Prefix/name | Dimensions | Usage |
|---|---|---|
| `feature-*` | 2400x2400 (square) | Home page project cards |
| `thumbnail.*` | 1920x1080 (16:9) | Project detail page hero |
| `career-*.svg` | Variable | Logo carousel |
| Profile images | Variable | Commendation cards |

## Styling

- **Tailwind CSS v4** with the `@tailwindcss/vite` plugin (not PostCSS)
- **OKLCH color tokens** defined as CSS custom properties in `global.css`
- **Class-based dark mode** (`.dark` class on `<html>`)
- **shadcn/ui** components configured via `components.json` (base-nova style)
- **Fonts:** Geist Sans (body) + Geist Mono (labels, code)

## Deployment

Pushes to `main` trigger the GitHub Actions workflow (`.github/workflows/deploy.yml`) which builds with Astro and deploys to GitHub Pages.
