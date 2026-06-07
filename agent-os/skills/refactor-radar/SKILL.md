---
name: refactor-radar
description: Use when asked to review this repository for targeted refactors, maintenance opportunities, or compounding improvements before implementation. Produces ranked findings for approval and can route approved work into an Agent OS plan, GitHub Issue, Notion Task, or tiny direct fix.
---

# Refactor Radar

## Purpose

Find targeted refactors and maintenance opportunities that would make future
work easier, safer, or clearer.

This skill is part of the compounding workflow: the agent reviews a focused
slice of the codebase, identifies small improvements, asks for approval, then
turns approved items into plans, tasks, or implementation.

## Cadence

Run when requested, before a maintenance pass, or after several related changes
have accumulated. This is not a requirement for every feature. It can be run
manually now and scheduled through automation later.

## Skill Contract

- Load only the context needed for the focused review area.
- Produce small, ranked recommendations before implementation.
- Ask for approval before making broad changes.
- Prefer links to canonical Agent OS files over repeating their contents.
- Keep findings verifiable with narrow commands or browser checks.

## Inputs

- `agent-os/strategy.md`
- `agent-os/system-map.md`
- Relevant files in `agent-os/conventions/`
- Recent plans in `agent-os/plans/`
- Existing open GitHub Issues, project board items, or Notion Tasks when
  available

## Review Areas

Rotate through focused slices rather than auditing the whole repo every time:

- Public repo entrypoint: `README.md`
- Routes and public surface: `src/pages/`
- Content model and schemas: `src/content/`, `src/content.config.ts`
- Publishing scripts: `scripts/`
- Lab experiences: `src/lab/`, `src/content/lab/`, `/lab` routes
- Shared UI and layouts: `src/components/`, `src/layouts/`
- Agent OS and operating context: `AGENTS.md`, `agent-os/`, `CLAUDE.md`
- Deployment and infrastructure: `.github/workflows/`, package scripts

## Evaluation Criteria

Look for opportunities that are:

- targeted enough to review in one sitting,
- clearly tied to current strategy or maintenance cost,
- likely to reduce future confusion or repeated work,
- verifiable with a narrow command or browser check, and
- not merely cosmetic churn.

## Output

Return a short ranked list:

```md
# Refactor Radar Findings

## Recommended

1. Title
   - Area:
   - Why now:
   - Suggested scope:
   - Verification:
   - Suggested destination: plan | GitHub Issue | Notion Task | immediate fix

## Not Now

- Item and reason.

## No Action

- Areas reviewed with no recommendation.
```

## Approval Rule

Do not implement radar findings automatically unless the user explicitly asks.
After approval, create or update the smallest useful artifact:

- `agent-os/plans/` for repo-local implementation work,
- GitHub Issues for tracked website work,
- Notion Tasks for cross-project orchestration, or
- direct implementation for a tiny approved fix.

## Seed Questions

Use these as prompts during early runs. They are not a static backlog.

- Should `/resume` remain, redirect, or be retired now that `/work` exists?
- Should `src/content/projects` stay as the internal name or eventually become
  `work`?
- Is `README.md` still concise as the public home base?
- Are task-tracking pointers centralized in Agent OS, GitHub Issues, the project
  board, and Notion Tasks?
- Is the writing sync flow still boring, deterministic, and documented in the
  right canonical places?
- Is the writing visual schema stable enough for more generated art variants?
- Are Lab entries polished enough to stay public?
- Is `style-guide.astro` still useful as an internal reference, or should it be
  refreshed, hidden, or removed?
