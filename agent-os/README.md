# Agent OS

This folder contains the project operating system for AI-assisted work.

Use it to preserve strategy, plan non-trivial changes, review work before
calling it done, and capture reusable learnings after completion.

## Structure

| Path | Purpose |
| --- | --- |
| `strategy.md` | Durable direction, audience, priorities, tracks, and non-goals |
| `system-map.md` | Operating map for routes, ownership, workflows, deployment, and maintenance |
| `plans/` | Work artifacts for non-trivial changes |
| `conventions/` | Current architecture, content, styling, and asset conventions |
| `learnings/` | Reusable lessons from completed work |
| `skills/` | Repeatable, self-contained agent capabilities for recurring review and improvement |

## Tracking

Work can be tracked through:

- [Personal Website project board](https://github.com/users/itspatmorgan/projects/2)
- [GitHub Issues](https://github.com/itspatmorgan/itspatmorgan.github.io/issues)
- Notion Tasks for cross-project orchestration

## Workflow

```text
strategy -> plan -> implementation -> review -> learning
```

Small fixes can skip the plan. Non-trivial changes should start with a plan,
consult the system map and relevant conventions, and finish by deciding whether
they produced a reusable learning.

Recurring improvement work should use skills. A skill reviews part of the
project, proposes targeted work for approval, and turns approved work into plans,
tasks, or implementation. Skills can be run manually now and scheduled through
automation later.

## Documentation Principle

Agent OS follows single-responsibility documentation: each file owns one kind of
context, avoids repeating neighboring files, and links to the canonical source
for related details.
