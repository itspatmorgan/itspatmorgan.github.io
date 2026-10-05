# Publishing Maintenance

## Status

Complete

## Context

The writing import exposed stale vault configuration. Metadata uses the GitHub
Pages hostname despite the custom domain, and detail routes include drafts.

## Desired Outcome

Routine targeted sync works with the current vault, site-owned metadata uses
itspatmorgan.com, and draft Work and Writing entries have no generated routes.

## Approach

Support an explicit published-source directory and the current vault structure,
retain legacy Newsletters compatibility, and give clear source-path errors.
Update shared domain configuration and filter detail-route collections.

## Scope

In: Publishing configuration, domain metadata, draft routes, and documentation.
Out: Deployment, sitemap, 404 page, dependency upgrades, and CI changes.

## Files To Modify

- `scripts/sync-writing.mjs`: source-directory configuration and validation.
- `.env.example`, local `.env.local`, `README.md`: publishing setup.
- `src/data/site-config.ts`: custom domain.
- `src/pages/{work,writing}/[...slug].astro`: exclude drafts.
- `agent-os/system-map.md`, `agent-os/learnings/writing-sync.md`: current workflow.

## Steps

- [x] Update publishing configuration.
- [x] Correct site metadata and draft routes.
- [x] Verify targeted sync, error handling, build, and generated public surface.

## Review

- Product: Published work is discoverable; unfinished work stays unpublished.
- Editorial: Preserve article canonical URLs and website-owned visuals.
- Design: No visual changes.
- Architecture: Reuse collection filters and existing sync workflow.
- Maintenance: Document explicit local configuration and legacy compatibility.
- Verification: Normal targeted dry run succeeded without a temporary adapter.
  Current vault-root discovery and legacy-folder compatibility also passed.
  Invalid source paths report actionable errors. Production build passed with
  42 pages; draft gpts and characters routes were absent. Generated homepage,
  About, Work, and Writing metadata uses the custom domain. The imported article
  retains its external canonical URL. `git diff --check` passed.

## Learnings

Updated the system map, writing-sync learning, README, and environment example.
Local source configuration stays in ignored `.env.local`. No new durable learning
or cross-agent guidance is needed beyond these existing documentation updates.
