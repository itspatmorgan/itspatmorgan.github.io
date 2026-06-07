# Skills

Skills are repeatable, self-contained agent capabilities.

Use a skill when the work is not a single known change, but an invokable
capability: inspect the project, apply a specialized workflow, produce a defined
output, and follow explicit guardrails.

## Standard Shape

Each skill lives in its own folder:

```text
skill-name/
  SKILL.md
```

`SKILL.md` must include YAML frontmatter:

```yaml
---
name: skill-name
description: Clear trigger description for when the skill should be used.
---
```

The body should stay concise and include only the procedural knowledge needed to
run the skill: purpose, inputs, workflow, outputs, guardrails, and verification.

Detailed examples, scripts, or references can be added later as bundled
resources when a skill needs them.

## Operating Rules

- Skills should produce small, reviewable outputs.
- Skills should not make broad changes without approval.
- Skills should link to canonical Agent OS files instead of duplicating them.
- Skills can be run manually now and scheduled through automation later.

| Skill | Purpose |
| --- | --- |
| `refactor-radar/` | Find targeted refactors and maintenance opportunities for approval |
