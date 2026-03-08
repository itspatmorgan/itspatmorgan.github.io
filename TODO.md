# TODO

Ideas and tasks for the portfolio site.

---

## Completed

- [x] **Initial scaffold** — Astro v5 + React + Tailwind CSS v4 + shadcn/ui, Geist fonts, dark/light theme toggle, GitHub Actions deploy workflow.
- [x] **Content collections** — Zod-validated schemas for projects (5 case studies) and writing (4 articles), organized image assets into structured directories.
- [x] **Project detail pages** — ProjectLayout for all 5 projects.
- [x] **Home page**
- [x] **Writing page** — Listing articles.
- [x] **Resume page** — Career timeline with bullet points
- [x] **Header polish** — PM logo replacing name text, removed hire chip.
- [x] **Footer polish** — Link grid (Home, Resume, Writing, Newsletter, LinkedIn, X), Easter egg style guide link.
- [x] **GitHub Pages deployment** — Configured for root deployment at itspatmorgan.github.io.
- [x] **Documentation** — README and CLAUDE.md with project structure, conventions, and architecture details.

---

## Home Page

- [ ] **Project cards closer to Framer version** — Revisit the project card component to match the layout/styling from the original Framer site more closely.
- [ ] **Mix up project layout** — Instead of five projects stacked vertically, explore alternative layouts (grid, staggered, featured+grid, etc.) to add visual variety.

## Cards & Interactions

- [ ] **Hover shimmer on cards** — Add a subtle hover animation (light shimmer/glow on background) to Writing cards, Unknown Arts cards, and Kind Words cards. Should be understated but enough to bring the cards to life.

## Typography & Effects

- [ ] **Geist Pixel variant** — Explore creative uses for Geist's pixel variant (recently released). Could be used for subtle text effects or interactive moments throughout the site to add texture — e.g., hover transitions, loading states, section labels, or decorative accents.

## Visual Identity

- [ ] **Midjourney textures from Unknown Arts** — Explore incorporating the AI-generated textures/imagery created for newsletter feature images into this site's visual language — e.g., as background elements, section dividers, card backgrounds, or decorative accents to tie the Unknown Arts aesthetic into the portfolio.

## Tooling

- [ ] **Add relevant Claude skills** — Set up Claude Code skills (`.claude/skills/`) for common workflows in this repo — e.g., adding a new writing article, adding a new project, deploying, running quality checks, etc.

## Branding

- [ ] **Replace favicon with PM logo** — The current favicon is still the generic Astro default. Replace it with the PM logo (create appropriate sizes: 16x16, 32x32, apple-touch-icon, etc.) and update `BaseLayout.astro` references.

## Cleanup

- [ ] **Swap feature/thumbnail image prefixes** — The `feature-*` and `thumbnail.*` image naming conventions are currently swapped. Images prefixed with `feature-` should be renamed to `thumbnail-*` (and vice versa), then update all references throughout the codebase (project frontmatter, components, CLAUDE.md image conventions table).

## Documentation

- [ ] **Contributor guide** — Have Claude write a walkthrough guide for new maintainers/contributors that explains how to operate the environment end-to-end: setup, dev workflow, adding content (articles, projects), deployment, key conventions, and where things live.

## Content

- [ ] **Migrate relevant writing** — Bring over additional articles (from Unknown Arts or other publications) that are most relevant to live on the Writing section of this site.

## Project Detail Pages

- [ ] **YouTube embed support** — Add the ability to embed YouTube videos within project detail page markdown content.
- [ ] **Figma Slides embed support** — Add the ability to embed Figma Slides presentations within project detail page markdown content.

## Resume Page

- [ ] **Interactive career labels** — Rethink the bullet-point labels on the timeline. Explore making them interactive — e.g., clickable tags that filter/highlight timeline entries, a toggle layer that reframes the chronological content, or some other way to let the labels act as a narrative lens over the career timeline.
