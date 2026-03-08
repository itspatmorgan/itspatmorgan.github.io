# itspatmorgan.github.io

Personal portfolio site for Patrick Morgan — product designer, writer, and creator of [Unknown Arts](https://www.unknownarts.co).

Built with [Astro](https://astro.build), [Tailwind CSS v4](https://tailwindcss.com), and [shadcn/ui](https://ui.shadcn.com). Deployed to GitHub Pages.

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
│   ├── LogoCarousel.astro
│   └── ProjectCard.astro
├── content/
│   ├── writing/         # Articles (Markdown)
│   └── projects/        # Case studies (Markdown)
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
.reference/              # Design reference assets and planning docs (not deployed)
```

## Content collections

Content is managed through [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/) with Zod-validated frontmatter.

### Projects (`src/content/projects/*.md`)

```yaml
title: "Project Title"
type: "professional" | "experiment"
description: "Short description"
skills: ["Skill 1", "Skill 2"]
thumbnail: "/images/projects/slug/feature-image.jpg"  # Square image for home page card
heroImage: "/images/projects/slug/thumbnail.jpg"       # Optional 16:9 image for detail page
sortOrder: 1
draft: false
```

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
