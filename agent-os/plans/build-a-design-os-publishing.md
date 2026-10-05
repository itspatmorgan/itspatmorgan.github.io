# Publish Build a Design OS

## Status

Complete

## Context

The published August 30, 2026 article is absent from the site's Writing collection.
The Obsidian vault has moved to `~/Developer/obsidian-vault`, with published
articles in `10 Writing/03 Published`. The sync command expects `Newsletters`.
Existing working-copy changes also delete the page routes; preserve them pending
the user's direction.

## Desired Outcome

Import the published article with its metadata, canonical URL, and standard
website-owned editorial art, and verify its route where possible.

## Approach

Use targeted sync through a temporary source adapter for the current vault layout.
Assign the Design theme and generate deterministic art using the existing pipeline.

## Scope

In: One article, its feature image, verification, and any user-authorized route restoration.

Out: Other articles, source-vault edits, sync architecture changes, and deployment.

## Files To Modify

- `src/content/writing/build-a-design-os.md`: published website copy.
- `public/images/writing/build-a-design-os/feature.jpg`: generated editorial art.
- `src/pages/`: restore only if authorized by the user.
- `scripts/sync-writing.mjs`: strip a source title even when a blank line precedes it.

## Steps

- [x] Locate and review the published source.
- [x] Import the article and generate artwork.
- [x] Restore routes from HEAD after the user confirmed deletions were unintentional.
- [x] Build and verify article availability.

## Review

- Product: Article belongs in Writing and is publicly eligible.
- Editorial: Preserve the Obsidian copy and publication metadata.
- Design: Use existing deterministic Design artwork.
- Architecture: Use existing collection and sync pipeline.
- Maintenance: Limit the import to one article.
- Verification: Production build generated 44 pages. Checked the article route,
  canonical URL, complete body, single H1, homepage and Writing listing links,
  and rendered browser layout. A second targeted sync reports unchanged content.

## Learnings

Updated the writing-sync learning with the current source location and temporary
adapter used for this import. No convention or system architecture changed.
