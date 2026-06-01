# Pattern Engine Rename

## Context

The live Lab tool currently ships publicly as "Editorial Art Tool" at `/lab/editorial-art`. That name is cumbersome and undersells the broader pattern-generation system now used across writing, homepage visuals, and publishing assets.

The public surface needs to become "Pattern Engine" quickly so it can be linked from the newsletter, while avoiding unnecessary conflicts with the active `sidebar-layout-shell` branch.

## Approach

- Rename the public Lab entry, route, metadata, and in-tool label to "Pattern Engine".
- Make `/lab/pattern-engine` the canonical page.
- Remove the old `/lab/editorial-art` page instead of adding a redirect because it has not been publicly linked.
- Keep implementation imports under `src/lab/editorial-art/` for now to avoid avoidable merge churn with `sidebar-layout-shell`.

## Files To Modify

- `src/content/lab/pattern-engine.mdx` - renamed Lab content entry and public copy.
- `src/pages/lab/pattern-engine.astro` - canonical Lab tool page.
- `src/pages/lab/index.astro` - Lab ordering.
- `src/pages/index.astro` - homepage Lab ordering.
- `src/components/lab/LabPreview.astro` - preview key.
- `src/layouts/WritingLayout.astro` - generated visual link and caption.
- `src/lab/editorial-art/index.tsx` - visible tool identity.

## Steps

1. Add this implementation plan.
2. Rename the Lab content entry and public route to `pattern-engine`.
3. Update public labels, links, and preview identifiers.
4. Search for stale active references.
5. Run the narrowest useful build verification.

## Verification

- Run `pnpm build`.
- Confirm there are no active source references to the old public slug or tool name, except internal implementation paths.
