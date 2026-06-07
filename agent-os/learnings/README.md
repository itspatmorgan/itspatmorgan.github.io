# Learnings

Learning notes are reusable project memory extracted from completed work.

A plan records how a task was done. A learning records what future work should
know because the task happened.

## Use Learnings For

- Repeated workflows.
- Gotchas that future agents are likely to rediscover.
- Ownership rules between systems.
- Verification patterns.
- Durable decisions that are too specific for `AGENTS.md`.

## Template

```md
# Learning Name

## Rule

The reusable rule or decision.

## Why

Why this rule exists.

## Use When

When future work should consult this note.

## Gotchas

Known edge cases, traps, or constraints.

## Verification

Commands or checks that prove related work is correct.

## Related Files

- `path`
```

## Promotion Rule

Promote a learning to `agent-os/conventions/` when it becomes a current project
rule. Promote it to `AGENTS.md` when every agent needs the rule in the starting
context. Promote it to `agent-os/system-map.md` when it changes how the site
operates.
