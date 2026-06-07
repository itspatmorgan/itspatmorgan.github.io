# About Page

## Context

Add a dedicated About page that turns Patrick's supplied biography into a polished, personal introduction for the portfolio. The page should help visitors understand the person behind the work, not just the professional chronology.

## Approach

- Create a static Astro route at `/about`.
- Use the existing `PageLayout` shell and restrained section styling.
- Convert the raw biography into essay-like narrative sections.
- Keep the career path present, but treat it as evidence of how Patrick moves through the world rather than the main subject.
- Add a link to the longer Unknown Arts article.
- Add About to desktop sidebar and mobile navigation.

## Files to Modify

- `src/pages/about.astro` - new About page route and content.
- `src/data/site-config.ts` - add About to shared mobile navigation.
- `src/components/layout/Sidebar.astro` - add About to desktop sidebar navigation with an icon.

## Steps

1. Add the new About page.
2. Update shared navigation and sidebar navigation.
3. Run a build check.
4. Note any pre-existing build blockers.

## Verification

- Run `pnpm build`.
- If needed for visual QA, run `pnpm dev` and inspect `/about`.
