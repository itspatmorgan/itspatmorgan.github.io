# System Map

This is the operating map for Patrick Morgan's personal website. It explains how
the site fits together, which system owns which kind of content or behavior, and
where to look before changing something.

Agent OS uses single-responsibility documentation: each file owns one kind of
context, avoids repeating neighboring files, and links to the canonical source
for related details. This file owns system orientation, not editing rules.

## Subsystems

| Area | What it does | Source of truth |
| --- | --- | --- |
| Public site shell | Shared layout, navigation, footer, theme, metadata | `src/layouts/`, `src/components/layout/`, `src/data/site-config.ts` |
| Work | Public portfolio/case-study section at `/work` | `src/content/projects/`, rendered through `/work` routes |
| Writing | Curated website copy of selected Unknown Arts articles | Obsidian for drafts/body, `src/content/writing/` for website output |
| Editorial art | Deterministic feature images and visual metadata for writing | Website-owned frontmatter and `public/images/writing/` |
| Lab | Hosted experiments, tools, and interaction demos | `src/content/lab/`, `src/pages/lab/`, `src/lab/` |
| Community | Community narrative, photos, and Kind Words | `src/pages/community.astro`, `src/data/community.ts`, `src/data/commendations.ts` |
| Deployment | Static build published to GitHub Pages | `.github/workflows/deploy.yml` |
| Work orchestration | Strategy, plans, conventions, learnings, issues, project board, and cross-project tasks | `agent-os/`, GitHub Issues, Personal Website project, Notion Tasks |

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

Content collections are defined in `src/content.config.ts`. Drafts should be
filtered before public rendering.

| Collection | Public route | Source |
| --- | --- | --- |
| Work | `/work/<slug>` | `src/content/projects/*.{md,mdx}` |
| Writing | `/writing/<slug>` | `src/content/writing/*.md` |
| Lab | `/lab/<slug>` | `src/content/lab/*.mdx` |

## Publishing Workflows

### Writing Sync

The normal publishing workflow is targeted: draft the article in Obsidian, mark
it `website: true`, then bring over only that article, assign a website theme,
and generate its deterministic visual.

```bash
pnpm sync-writing -- --title "Article Title" --theme AI --with-art
pnpm build
```

Use `--slug article-slug` instead of `--title` when the slug is easier to work
with. Targeted sync refuses to overwrite an existing website article unless
`--overwrite` is passed.

`pnpm sync-writing` with no target is a maintenance command. It scans the local
Obsidian vault configured by `OBSIDIAN_VAULT`; set it in your shell or in an
untracked `.env.local` file. The script reads notes from the vault's
`Newsletters/` directory. Only notes with `website: true` are synced. The script
strips Obsidian-only fields, slugifies from the title, cleans newsletter
boilerplate from the body, and writes to `src/content/writing/<slug>.md`.

For writing sync changes, verify with:

```bash
pnpm sync-writing -- --title "Article Title" --theme AI --with-art --dry-run
pnpm build
```

Use `node scripts/sync-writing.mjs --dry-run` when you want to preview a full maintenance sync without writing files.

### Editorial Art

`pnpm generate:writing-art` generates 1200x630 feature images under:

```text
public/images/writing/<slug>/feature.jpg
```

It also writes `visual` metadata and the generated `image` path into article frontmatter. By default it avoids overwriting existing visual decisions. Use the script flags when intentionally regenerating:

```bash
node scripts/generate-writing-art.mjs --slug article-slug --dry-run
node scripts/generate-writing-art.mjs --dry-run
node scripts/generate-writing-art.mjs --overwrite-visual
node scripts/generate-writing-art.mjs --overwrite-image
```

This system is strategic because it makes writing visuals repeatable and website-owned instead of depending on one-off external image generation.

## Related References

Use these files for adjacent context:

- `agent-os/conventions/architecture.md`: Astro, layout, content collection, and
  React usage conventions
- `agent-os/conventions/content.md`: public terminology and frontmatter
  conventions
- `agent-os/conventions/styling.md`: visual design, Tailwind, prose, and
  interaction conventions
- `agent-os/conventions/assets.md`: image and embed conventions
- `agent-os/learnings/writing-sync.md`: reusable writing sync gotchas
- `agent-os/learnings/editorial-art.md`: reusable editorial art gotchas

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`. The workflow uses `withastro/action@v3` to build and `actions/deploy-pages@v4` to publish to GitHub Pages.

Before merging changes that affect routes, content schema, layouts, scripts, or generated assets, run:

```bash
pnpm build
```

For visual or interactive changes, also run `pnpm dev` and check the affected route in a browser.

## Maintenance

Use `agent-os/skills/refactor-radar/SKILL.md` for recurring refactor discovery,
maintenance review, and approval-based cleanup work.
