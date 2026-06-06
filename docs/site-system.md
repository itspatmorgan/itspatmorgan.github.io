# Site System

This is the maintainer guide for Patrick Morgan's personal website. It explains the parts of the system that matter for operating the site, making roadmap decisions, and deciding where to invest future refactoring time.

The short version: this is a static Astro site with content collections, a small set of local publishing scripts, and a growing Lab area for interactive work. The main architectural question is not "how does every component work?" It is "which source owns which kind of content or behavior?"

## System Map

| Area | What it does | Source of truth |
| --- | --- | --- |
| Public site shell | Shared layout, navigation, footer, theme, metadata | `src/layouts/`, `src/components/layout/`, `src/data/site-config.ts` |
| Work | Public portfolio/case-study section at `/work` | `src/content/projects/`, rendered through `/work` routes |
| Writing | Curated website copy of selected Unknown Arts articles | Obsidian for drafts/body, `src/content/writing/` for website output |
| Editorial art | Deterministic feature images and visual metadata for writing | Website-owned frontmatter and `public/images/writing/` |
| Lab | Hosted experiments, tools, and interaction demos | `src/content/lab/`, `src/pages/lab/`, `src/lab/` |
| Community | Community narrative, photos, and Kind Words | `src/pages/community.astro`, `src/data/community.ts`, `src/data/commendations.ts` |
| Deployment | Static build published to GitHub Pages | `.github/workflows/deploy.yml` |
| Work tracking | Issues, project board, implementation plans | GitHub Issues, Personal Website project, `.claude/plans/` |

## Public Routes

| Route | Purpose |
| --- | --- |
| `/` | Home page with featured Work, Lab, Writing, Community, and Kind Words |
| `/about` | Personal narrative and context |
| `/work` | Career timeline plus related portfolio work |
| `/work/<slug>` | Project/case-study detail pages |
| `/lab` | Lab index |
| `/lab/<slug>` | Individual Lab tools or demos |
| `/writing` | Curated writing index with theme filters |
| `/writing/<slug>` | Article detail pages |
| `/community` | Community story, photos, and Kind Words |
| `/colophon` | Public explanation of stack and workflow |
| `/resume` | Legacy resume-style route still present in the codebase |

Public terminology is `Work`, not `Projects`. The internal content collection is still named `projects`, which is fine for now but worth remembering when editing content or routes.

## Commands

```bash
pnpm dev
pnpm build
pnpm preview
pnpm sync-writing
pnpm generate:writing-art
```

- `pnpm dev`: starts Astro at `localhost:4321`.
- `pnpm build`: production build to `dist/`.
- `pnpm preview`: local preview of the production build.
- `pnpm sync-writing`: syncs selected Obsidian newsletter articles into `src/content/writing/`.
- `pnpm generate:writing-art`: generates deterministic writing feature images and website-owned visual metadata.

There is also a maintenance script, `scripts/normalize-obsidian-newsletters.mjs`, for normalizing Obsidian newsletter frontmatter. It is not exposed as a package script.

## Content Model

Content collections are defined in `src/content.config.ts`. Drafts should be filtered before public rendering.

### Work Content

Work items live in `src/content/projects/*.{md,mdx}` and render publicly under `/work/<slug>`.

Common frontmatter:

```yaml
title: "Project Title"
type: "professional"
description: "Short description"
skills: ["Skill 1", "Skill 2"]
thumbnail: "/images/projects/slug/thumbnail-image.jpg"
thumbnailDark: "/images/projects/slug/thumbnail-image-dark.jpg"
thumbnailWide: "/images/projects/slug/thumbnail-wide.jpg"
thumbnailWideDark: "/images/projects/slug/thumbnail-wide-dark.jpg"
heroImage: "/images/projects/slug/feature-image.jpg"
sortOrder: 1
draft: false
```

`thumbnailDark`, `thumbnailWide`, `thumbnailWideDark`, and `heroImage` are optional. Use MDX when a case study needs embeds or custom components.

### Writing Content

Writing lives in `src/content/writing/*.md`. Articles can be edited directly, but most should come from Obsidian through `pnpm sync-writing`.

Common frontmatter:

```yaml
title: "Article Title"
description: "Short description"
publishedDate: 2026-02-22
categories: ["Category"]
theme: "AI"
tags: ["tag1", "tag2"]
visual:
  version: 1
  theme: "AI"
  background: "warm-dark-gray"
  generator:
    type: "strange-attractor"
    seed: 42
    opacity: 85
    color: "copper"
  texture: 20
  grain: 24
image: "/images/writing/article-slug/feature.jpg"
canonicalUrl: "https://www.unknownarts.co/p/article-slug"
draft: false
```

Important ownership rule: Obsidian owns article drafts, body copy, and source publishing metadata. The website owns `visual` and generated `image` fields. `scripts/sync-writing.mjs` preserves those website-owned fields when syncing.

Use `theme` for broad reader-facing filters: `AI`, `Design`, `Systems Thinking`, `Creative Practice`, or `Career`. Use `tags` for lower-level metadata.

### Lab Content

Lab entries live in `src/content/lab/*.mdx` and render under `/lab/<slug>`.

Common frontmatter:

```yaml
title: "Lab Item"
description: "Short description"
slug: "lab-item"
preview: "lab-item"
experience: "demo"
draft: false
```

Use `experience: "app"` for immersive tools and `experience: "demo"` for focused interaction showcases. Put dedicated implementation code in `src/lab/<slug>/`.

## Publishing Workflows

### Writing Sync

`pnpm sync-writing` scans the local Obsidian vault configured by
`OBSIDIAN_VAULT`. Set it in your shell or in an untracked `.env.local` file.
The script reads notes from the vault's `Newsletters/` directory. Only notes
with `website: true` are synced. The script strips Obsidian-only fields,
slugifies from the title, cleans newsletter boilerplate from the body, and
writes to `src/content/writing/<slug>.md`.

For writing sync changes, verify with:

```bash
pnpm sync-writing
pnpm build
```

Use `node scripts/sync-writing.mjs --dry-run` when you want to preview changes without writing files.

### Editorial Art

`pnpm generate:writing-art` generates 1200x630 feature images under:

```text
public/images/writing/<slug>/feature.jpg
```

It also writes `visual` metadata and the generated `image` path into article frontmatter. By default it avoids overwriting existing visual decisions. Use the script flags when intentionally regenerating:

```bash
node scripts/generate-writing-art.mjs --dry-run
node scripts/generate-writing-art.mjs --overwrite-visual
node scripts/generate-writing-art.mjs --overwrite-image
```

This system is strategic because it makes writing visuals repeatable and website-owned instead of depending on one-off external image generation.

## Styling And Interaction

- Tailwind CSS v4 is configured through the Vite plugin, not PostCSS.
- Theme tokens live in `src/styles/global.css` as OKLCH CSS custom properties.
- Use semantic Tailwind tokens such as `text-muted-foreground`, `bg-card`, `border-border`, and `hover:text-accent`.
- Dark mode is class-based with `.dark` on `<html>`.
- Markdown prose uses custom `.prose` styles in `global.css`, not `@tailwindcss/typography`.
- Prefer `.astro` components. Use React only for stateful or interactive UI.
- Motion is used for page-load and interaction flourishes; avoid turning the whole site into an app unless the route is explicitly Lab-style.

## Images

| Pattern | Purpose |
| --- | --- |
| `thumbnail-*` | Square work thumbnails, typically 2400x2400 |
| `thumbnail-wide*` | Wide work thumbnails for responsive cards |
| `feature-*` | 16:9 work hero images, typically 1920x1080 |
| `career-*.svg` | Company logos |
| `/images/profiles/` | Kind Words author headshots |
| `/images/writing/<slug>/feature.jpg` | Generated writing feature images |

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`. The workflow uses `withastro/action@v3` to build and `actions/deploy-pages@v4` to publish to GitHub Pages.

Before merging changes that affect routes, content schema, layouts, scripts, or generated assets, run:

```bash
pnpm build
```

For visual or interactive changes, also run `pnpm dev` and check the affected route in a browser.

## Strategic Maintenance Notes

These are the highest-leverage places to think about future investment.

| Area | Why it matters | Good next decision |
| --- | --- | --- |
| README/docs split | Keeps public repo approachable while preserving system knowledge | Keep README short; grow docs only around real maintainer workflows |
| Work vs projects naming | Public language and internal collection names differ | Leave code as-is for now, or intentionally migrate collection/routes later |
| Writing sync | It is the bridge between newsletter publishing and the website | Keep it boring, deterministic, and well-documented before adding features |
| Editorial art | It gives writing a scalable visual system | Invest here if Writing becomes a bigger portfolio surface |
| Lab | It can become the proof that you build, not just describe | Keep Lab entries polished; avoid adding half-finished experiments publicly |
| `style-guide.astro` | Internal reference route that may or may not still be useful | Decide whether to keep, refresh, noindex, or remove it |
| Agent workflow | Multiple agents now contribute | Keep durable conventions in `AGENTS.md`; keep Claude-only details out of shared docs |

## Refactor Watchlist

- Decide whether `/resume` should remain, redirect, or be retired now that `/work` exists.
- Decide whether `src/content/projects` should stay as the internal name or eventually become `work`.
- Consolidate duplicated workflow guidance between `AGENTS.md`, `TODO.md`, and `docs/`.
- Keep the writing visual schema stable before creating more generated art variants.
- Review whether `TODO.md` still earns its place now that Issues and the project board are the real tracker.
- Decide whether the style guide route is still a useful internal reference.
