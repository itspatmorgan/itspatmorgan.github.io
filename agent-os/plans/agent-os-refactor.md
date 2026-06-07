# Agent OS Refactor

## Status

Complete

## Context

The repository currently stores shared implementation plans in `.claude/plans/`.
That path made sense when Claude was the primary agent surface, but the plans are
project memory rather than Claude-specific state. Durable work artifacts should
be visible, tool-neutral, and useful to Codex, Claude, Cursor, and future agents.

This refactor creates an `agent-os/` operating layer for strategy, plans, and
learnings. The goal is to make each completed unit of work reduce the context
needed for the next one.

## Desired Outcome

- Shared work artifacts live under `agent-os/`.
- Existing plans move from `.claude/plans/` to `agent-os/plans/`.
- `AGENTS.md` describes the updated workflow and plan expectations.
- `agent-os/system-map.md` reflects the website operating map.
- Detailed conventions move out of `AGENTS.md` into modular Agent OS references.
- `docs/site-system.md` moves to `agent-os/system-map.md` so Agent OS is the
  single operating documentation layer.
- Recurring refactor discovery lives in `agent-os/skills/` instead of in the
  system map.
- `TODO.md` is removed because tracking pointers now live in Agent OS and
  external task systems.
- Seed learning notes capture reusable knowledge from existing systems.
- Claude-specific files remain Claude-specific, with durable guidance kept out
  of `.claude/`.

## Approach

Keep the migration structural and low-risk. Move existing plan files without
rewriting their contents, then add the smallest useful scaffolding around them:
an `agent-os` README, strategy document, plans README, and learning notes.

Review should live inside plans for now. Learnings should live separately because
they are reusable across future work.

Detailed conventions should live in `agent-os/conventions/` so `AGENTS.md`
stays short and directive.

`system-map.md` should live at the Agent OS root because it is foundational
orientation: strategy explains why, system-map explains how the website fits
together, conventions explain rules for editing, plans explain current work, and
learnings explain reusable lessons.

## Scope

In:

- Create `agent-os/` scaffolding.
- Move `.claude/plans/*.md` into `agent-os/plans/`.
- Move detailed architecture, content, styling, and asset guidance out of
  `AGENTS.md` into `agent-os/conventions/`.
- Move `docs/site-system.md` to `agent-os/system-map.md` and trim duplicated
  convention details.
- Move static refactor-watchlist content into a repeatable Refactor Radar skill
  with an approval gate.
- Remove `TODO.md` and centralize tracking guidance in Agent OS.
- Add seed strategy and learning documents.
- Update repository guidance and system documentation.
- Remove stale `.claude/plans/` references.

Out:

- Changing site runtime behavior.
- Rewriting historical plan contents.
- Creating a separate reviews directory.
- Installing or configuring external agent plugins.

## Files To Modify

- `agent-os/README.md`: operating layer overview.
- `agent-os/strategy.md`: durable project direction and active tracks.
- `agent-os/plans/README.md`: when and how to use plans.
- `agent-os/plans/*.md`: migrated historical plans plus this refactor plan.
- `agent-os/conventions/*.md`: modular current project conventions.
- `agent-os/skills/*/SKILL.md`: repeatable review and improvement capabilities.
- `agent-os/learnings/README.md`: how learning notes work.
- `agent-os/learnings/*.md`: seed operational learnings.
- `AGENTS.md`: shared agent guidance and repository map.
- `CLAUDE.md`: note that durable plans moved out of Claude-specific paths.
- `agent-os/system-map.md`: website operating map.

## Steps

- [x] Create the refactor branch.
- [x] Create this plan in `agent-os/plans/`.
- [x] Create `agent-os` README, strategy, plans, and learnings scaffolding.
- [x] Move historical plans from `.claude/plans/` to `agent-os/plans/`.
- [x] Move detailed conventions out of `AGENTS.md`.
- [x] Move `system-map.md` into `agent-os/` and trim repeated convention
  details.
- [x] Move refactor watchlist prompts into `agent-os/skills/refactor-radar/SKILL.md`.
- [x] Remove `TODO.md` and absorb its tracking pointers into Agent OS.
- [x] Update `AGENTS.md`, `CLAUDE.md`, and `agent-os/system-map.md`.
- [x] Search for stale `.claude/plans/` references.
- [x] Run `pnpm build`.

## Review

- Product: The workflow should help the site compound useful context without
  adding ceremony to tiny fixes.
- Editorial: Naming should stay plain: strategy, plans, learnings.
- Architecture: Durable artifacts should be tool-neutral; `.claude/` should not
  own shared project memory.
- Maintenance: The folder structure should be easy for future agents to inspect
  before work starts.
- Verification: `rg` should find no stale `.claude/plans/` references in active
  guidance; `pnpm build` should pass.

## Learnings

Capture the reusable operating rule in `agent-os/learnings/agent-os.md` once the
migration is complete.
