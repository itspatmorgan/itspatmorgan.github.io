# Plans

Plans are work artifacts for non-trivial changes. Use them when work affects
multiple files, public behavior, content architecture, deployment, or durable
project conventions.

Small fixes do not need a plan unless requested.

## Template

```md
# Plan Name

## Status

Planned | In progress | Complete | Archived

## Context

What problem this solves and why it matters.

## Desired Outcome

What should be true when this is done.

## Approach

Technical, content, or design strategy.

## Scope

In:

Out:

## Files To Modify

- `path`: reason

## Steps

- [ ] Step

## Review

- Product:
- Editorial:
- Design:
- Architecture:
- Maintenance:
- Verification:

## Learnings

What reusable knowledge should be captured after completion.
```

## Completion Rule

Before marking a plan complete, decide whether the work should:

- create no durable learning,
- update an existing learning note,
- create a new learning note,
- update `agent-os/conventions/` because a convention changed,
- update `AGENTS.md` because cross-agent guidance changed, or
- update `agent-os/system-map.md` because the system changed.
