# Lab Foundation Refactor

## Context

The site currently has a narrowly named Tools section at `/tools`, with the Editorial Art Tool as the only hosted item. The next iteration should broaden this into a Lab section for hosted tools, experiments, and smaller interaction design showcases.

The Lab should feel like a gallery of working artifacts, not a blog index or a case-study section. Each item should have a generated or artifact-derived preview, a short amount of context, and a route where the work can be used or experienced.

## Approach

- Replace `/tools` with `/lab`; remove the old tools routes without redirects.
- Add a `lab` Astro content collection so each item can provide title, description, preview key, experience type, draft state, and lightweight MDX body copy.
- Move Editorial Art implementation code from `src/tools/editorial-art/` to `src/lab/editorial-art/`.
- Add Pixel Wave as the second Lab item, using the existing animation script as a focused interaction demo.
- Use a Lab index gallery driven by the content collection and preview keys.

## Files to Modify

- `src/content.config.ts` — add the Lab content collection schema.
- `src/content/lab/*.mdx` — add Editorial Art and Pixel Wave context entries.
- `src/pages/lab/` — add Lab index and item routes.
- `src/pages/tools/` — remove old Tools routes.
- `src/lab/editorial-art/` — new home for the Editorial Art implementation.
- `src/components/` — add reusable Lab preview and Pixel Wave text helpers.
- `src/pages/index.astro` — reuse the Pixel Wave text helper for home page text.
- `src/layouts/WritingLayout.astro` — update generated-art links and imports.
- `src/components/layout/Footer.astro` — change Tools link to Lab.
- `AGENTS.md` — document durable Lab conventions.

## Steps

1. Add Lab collection schema and initial MDX entries.
2. Move Editorial Art route and implementation namespace.
3. Build Lab index gallery with generated previews.
4. Add Pixel Wave demo page and reusable text helper.
5. Update links/imports and repository guidance.
6. Verify build, stale references, and local page behavior.

## Verification

- `pnpm build`
- Search for stale `/tools` links and `@/tools/editorial-art` imports.
- Run `pnpm dev` and verify `/lab`, `/lab/editorial-art`, `/lab/pixel-wave`, the homepage Pixel Wave animation, and writing generated-art links.
