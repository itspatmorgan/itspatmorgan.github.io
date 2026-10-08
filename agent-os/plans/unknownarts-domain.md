# Unknown Arts Primary Domain

## Status

Complete

## Context and Desired Outcome

Unknown Arts now uses unknownarts.com. All repository links should point there
directly instead of relying on redirects from the previous domain.

## Approach and Scope

Replace the exact old hostname in source, article canonical URLs and body links,
content conventions, and saved references. Preserve www prefixes, paths, query
strings, and article text. Do not modify generated output or external sources.

## Files To Modify

- Site configuration, About page, and Design Studio agent guide.
- Writing Markdown files and saved newsletter/reference material.
- Content convention's canonical URL example.

## Steps and Verification

- [x] Find and replace exact old-domain references.
- [x] Verify no old-domain references remain and production build passes (43 pages).

## Review and Learnings

Mechanical domain change; content convention updated to establish the new
canonical domain. No separate learning note is needed.
