# System Map

This is the operating map for Patrick Morgan's personal website. It explains how
the site fits together, which system owns which kind of content or behavior, and
where to look before changing something.

The agents folder uses single-responsibility documentation: each file owns one kind of
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
| Deployment | Static build published to Cloudflare Workers, with PR previews | `.github/workflows/deploy.yml`, `.github/workflows/preview.yml`, `wrangler.jsonc` |
| Work orchestration | Strategy, conventions, learnings, issues, project board, and cross-project tasks | `agents/`, GitHub Issues, Personal Website project, Notion Tasks |

## Public Routes

| Route | Purpose |
| --- | --- |
| `/` | Home page with a dedicated Design Studio feature before Work, Writing, Lab, Community, and Kind Words |
| `/about` | Personal narrative and context |
| `/work` | Career timeline plus related portfolio work |
| `/work/<slug>` | Project/case-study detail pages |
| `/work/query-builder-preview` | Noindex Query Builder presentation using native recreations of the Figma UI, automatic looping walkthroughs, and curated original prototype flows in `src/components/query-builder/` |
| `/lab` | Lab index |
| `/lab/<slug>` | Individual Lab tools or demos |
| `/writing` | Curated writing index with theme filters |
| `/writing/<slug>` | Article detail pages |
| `/community` | Community story, photos, and Kind Words |
| `/colophon` | Public explanation of stack and workflow |
| `/design-studio` | Design Studio project landing page: animated product scenes, proof, and agent setup prompts |
| `/design-studio-demo/` | Interactive Studio build included by the website deployment |
| `/design-studio/agent.txt` | Plain-text Design Studio brief and setup guide, shared with the landing page's Agent mode |

The Design Studio landing page uses the case-study slide system (`case-study.css`,
`studio-case.css`) inside the Showcase shell. Its scenes are native recreations of the
open-source Studio's Feedback Inbox sample and Product system, in
`src/components/design-studio/` (`StudioShapes`, `StudioSystem`, `StudioDocs`), with
the `Spectrum` scene shared from the case study. "Try the live demo" links to the
`/design-studio-demo/` build rather than embedding it.

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
untracked `.env.local` file (see `.env.example`). The script reads notes from
`10 Writing/03 Published/`, falling back to `Newsletters/` for legacy vaults.
Set `OBSIDIAN_NEWSLETTERS_DIR` to an explicit source folder when needed; it
takes precedence over the vault root. Shell values take precedence over the
same keys in `.env.local`. Only notes with `website: true` are synced. The script
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

- `agents/conventions/architecture.md`: Astro, layout, content collection, and
  React usage conventions
- `agents/conventions/content.md`: public terminology and frontmatter
  conventions
- `agents/conventions/styling.md`: visual design, Tailwind, prose, and
  interaction conventions
- `agents/conventions/assets.md`: image and embed conventions
- `agents/learnings/writing-sync.md`: reusable writing sync gotchas
- `agents/learnings/editorial-art.md`: reusable editorial art gotchas

## Deployment

Pushes to `main` and manual dispatches trigger `.github/workflows/deploy.yml`.
Design Studio's `Publish demo` workflow also dispatches it after successful source
checks. The Studio repository owns the `WEBSITE_DEPLOY_TOKEN` secret: a fine-grained
token with Actions read/write access to this website repository only.

The workflow builds Astro with its declared pnpm version, resolves the Studio
repository by permanent GitHub ID `1401250166`, and selects the latest successful
`main` push of its `checks.yml` workflow. It checks out that exact source commit,
builds with Studio's mise toolchain and `STUDIO_BASE_PATH=/design-studio-demo/`,
then copies the result into `dist/design-studio-demo/`. These build steps live in
`.github/actions/build-site/`, shared by production and previews. The combined
output is deployed to the `itspatmorgan` Cloudflare Worker (static assets only,
configured in `wrangler.jsonc`), which serves itspatmorgan.com and www as custom
domains. Studio source stays in
its own repository.
A failed source run cannot replace the last passing demo. An absent passing run
fails the website build rather than publishing an unverified source commit.

Pull requests from this repository run `.github/workflows/preview.yml`: the same
build, then `wrangler versions upload --preview-alias pr-<number>`, which leaves
production untouched and comments a stable `pr-<number>-itspatmorgan.<subdomain>.workers.dev`
link on the PR. Both workflows use the `CLOUDFLARE_API_TOKEN` and
`CLOUDFLARE_ACCOUNT_ID` repository secrets. Dependabot and fork PRs are built
and checked but get no preview link. The preview build is a pull request's only
build: `.github/workflows/checks.yml` runs the audit, script tests and type check
without building. Every build ends with `pnpm check:site`, which fails on broken
local links and pages missing a title, description or share image.

Cloudflare Web Analytics runs with automatic setup on the itspatmorgan.com zone:
Cloudflare injects its cookieless beacon at the edge, so the site has no analytics
code. Don't add a manual beacon snippet, which would count visits twice.

Disable the Studio repository's old Pages site when switching deployments so it
cannot claim the product page's `/design-studio/` path after the source rename.
The root `404.html` supports direct demo URLs without redirecting their path and
provides browser redirects from `/design-studio-starter/`. Cloudflare serves it
for missing routes (`not_found_handling: "404-page"`) with HTTP 404. Other missing website paths retain the website's 404 page.

Local `pnpm build` builds Astro alone. To preview the combined output, first build
Studio in its own checkout with `STUDIO_BASE_PATH=/design-studio-demo/ pnpm build`,
then run `node scripts/include-studio-demo.mjs /absolute/path/to/studio/dist` after
the Astro build. A host must serve root `404.html` for missing routes. Local Vite
preview continues to proxy the live demo for ordinary website development.

Before merging changes that affect routes, content schema, layouts, scripts, or generated assets, run:

```bash
pnpm build
```

For visual or interactive changes, also run `pnpm dev` and check the affected route in a browser.

## Maintenance

Use `agents/skills/refactor-radar/SKILL.md` for recurring refactor discovery,
maintenance review, and approval-based cleanup work.
