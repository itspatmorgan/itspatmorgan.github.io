---
title: AI Needs a Plan
description: Why the best agent work starts with a brief, not a one-shot prompt.
publishedDate: 2026-06-07
categories:
  - Newsletter
theme: AI
tags:
  - ai
  - design
  - workflow
visual:
  version: 1
  theme: AI
  background: warm-dark-gray
  generator:
    type: strange-attractor
    seed: 40
    opacity: 85
    color: copper
  texture: 20
  grain: 24
image: /images/writing/ai-needs-a-plan/feature.jpg
canonicalUrl: "https://www.unknownarts.co/p/ai-needs-a-plan"
draft: false
---
The most misleading AI demo is the one-shot.

You know the kind by now: someone types a single prompt, waves a magic wand, and a finished app pops out the other side. It’s impressive, no doubt. But it’s also not how my best work with agents happens.

The best results I get from Claude Code and Codex usually start with a written plan. Not everything demands a plan, but for larger work, I rarely want my first chat on a topic to end in execution. I want it to end in a clear brief.

That should feel familiar to any designer. If a client asked me to “make a website” and gave me no other context, I wouldn’t jump straight into Figma. I’d ask who it’s for, what it needs to communicate, what already exists, and what constraints matter. The work would start with alignment, not execution.

Lately, writing plans has become one of my core design workflows. I start by exploring an idea conversationally (What’s the problem? What do we know? What constraints matter? What is the [single most important thing](https://www.unknownarts.co/p/the-single-most-important-thing) this needs to accomplish?). Then, the output becomes a document the agent can write into Notion, a GitHub issue, or a project file where I can pick it up again as context when I’m ready to execute.

It feels like a condensed version of the first diamond in the [double diamond design process](https://www.designcouncil.org.uk/our-resources/the-double-diamond/). You widen your aperture to understand the problem, converge on a direction, then use that as a springboard to create. The difference now is the sheer speed of execution: the moment you have clarity in writing, an agent can execute on it right away.

That speed is both the opportunity and the risk.

If your plan is clear, the agent can move with scary efficiency in the right direction. If your plan is fuzzy, it can move with scary efficiency in the wrong one.

This is why I find the obsession with one-shotting misleading. The times I have gotten something close to a good result in one shot weren’t the result of skipping the upfront work. They were the result of being meticulous about it.

My [portfolio rebuild](https://www.unknownarts.co/p/how-i-rebuilt-my-portfolio-with-claude) is a good example. Claude did a strong job getting the site into the ballpark on the first shot, but only after I had written a brief, chosen a tech stack, curated image assets, and scoped the work. Even then, what I got was just a decent beginning.

AI can’t read my mind, but it sure can read my writing. It may be super intelligent, but it still needs direction.

My friend [Karl Koch](https://karlkoch.me/) recently wrote about [write-first design](https://karlkoch.me/writing/write-first-design), arguing that design work gets better when designers write the brief instead of waiting for someone else to hand them a spec. As he puts it: “_The difference is who holds the pen_.” In this new agentic workflow, that matters even more because the person holding the pen is often also the one shaping the design and directing the build.

That makes writing less like the step before starting to design and a lot more like the first act of designing.

So no, you don’t need to write a plan for everything. But when the work is complex, consequential, or easy to misunderstand, slow down before you speed up.

The tokens may be flowing, and design components may be ready, but the paragraph is still the cheapest place to be wrong.

Until next time,

Patrick

---

## In Practice

Before starting your next substantial AI task, write a short plan first:

1. What are we trying to accomplish?
2. Why does it matter now?
3. What context should the agent read before acting?
4. What is in scope?
5. What is explicitly out of scope?
6. What would make the result good enough to keep iterating?

Then ask the agent to critique the plan before it executes. Fix the gaps, ambiguities, or risky assumptions in the document first. You are not slowing the work down. You are aiming the machine before pressing go.

## Go Deeper

- [How OpenAI uses Codex](https://cdn.openai.com/pdf/6a2631dc-783e-479b-b1a4-af0cfbd38630/how-openai-uses-codex.pdf): OpenAI's internal Codex guide recommends starting large changes with an implementation plan in Ask Mode before switching into Code Mode.
- [Write the Pitch](https://basecamp.com/shapeup/1.5-chapter-06): 37signals' Shape Up chapter documents their brief format: problem, appetite, solution, rabbit holes, and no-gos.
- [My favorite product management templates](https://www.lennysnewsletter.com/p/my-favorite-templates-issue-37): Lenny Rachitsky's collection includes PRDs, one-pagers, strategy docs, and project brief templates from teams like Square, Asana, Intercom, Product Hunt, and Figma.
