---
title: "Prototype Code Is Not Production Code (And That's Okay)"
description: "Why the most important distinction in vibe coding is the one nobody's talking about"
publishedDate: 2026-03-02
categories: ["Newsletter"]
tags: ["AI", "Prototyping"]
image: "/images/writing/img-prototype-code.jpg"
draft: false
---

I'm building a design prototyping environment for my team right now. Using Claude Code, I'm pulling select primitives from our production system, standing up a space where designers can work in real code without touching the production pipeline.

The key decision isn't what to include. It's what to deliberately leave out.

Prototype code and production code serve fundamentally different purposes. That's not a new idea. But vibe coding tools are making it dangerously easy to forget, tricking people into thinking they should generate code and ship it in one motion. That sounds like efficiency, but it often means skipping a crucial step that developers have understood for decades.

## Prototype code explores. Production code endures

Prototype code is exploratory. Its job is to make an idea tangible enough to react to, share, and refine. There's often no backend, just static mock data standing in for the real thing. You're not thinking about scale or security. You're hacking, in the best sense of the word: making the thing exist so you can start to test it.

Kent Beck captured the right sequence in the context of test-driven development: _make it work, make it right, make it fast_. Prototype code lives in that first phase. The current vibe coding conversation tends to start and end with "make it work" and while that might hold up in small personal projects, large-scale production software requires more rigor.

Crafting production code for major applications is a different beast. You're building for systems that other systems depend on. That means thinking carefully about scale, performance, security, edge cases, and the engineering constraints of whatever framework you're operating inside. It's not just having higher standards for the same code; it's often a genuinely different kind of code.

## The stakes clarify the separation

I've spent the last nine years designing cybersecurity software, where the distinction between prototype and production carries real weight.

In my current role at [Sublime](https://sublime.security/), our platform sits in the line of email processing for the companies we serve. If we miss something important, we don't just cause a problem for ourselves; we affect our customers' business operations. Pushing bad code doesn't just take down our service, it potentially costs our customers thousands or even millions of dollars.

Production-grade engineering in this environment requires genuine thoroughness. Anything entering the codebase needs to be well vetted and understood by people with the context to evaluate it. That's not unnecessary bureaucracy, it's the appropriate level of diligence for what's at risk.

However, operating purely within that production mindset means you don't give yourself much freedom to experiment. You can't explore as widely or move as fast as prototype work demands when every change carries that kind of consequence. A space for prototyping needs its own protection: not from thoughtfulness, but from production constraints it's not meant to satisfy.

The goal should be two protected spaces with a deliberate pathway between them. The exploratory, expressive work stays in the prototype environment, doing its job by being unconstrained. And core elements from that workflow transfer over to the production environment to jumpstart the rigorous engineering process.

## This pattern is older than vibe coding

My first job in tech was as a front-end developer embedded on a product design team at American Express. We built a standalone prototyping environment using [Jekyll](https://jekyllrb.com/), with styles and scripts synced to and from production.

We built freely outside the Microsoft ASP.NET production pipeline AmEx ran on, avoiding technical constraints that were irrelevant to the design process. When prototypes were ready, we handed them off to the engineering org. They took the core pieces straight up and chopped up everything else to fit into their framework.

The separation was intentional, and it worked. The problem was that it required a team of five design engineers to make it happen. You needed dedicated specialists to write that prototype code. Most companies couldn't staff for that, so despite its benefits, most design organizations didn't follow this process.

## The specialist requirement has changed. The distinction didn't

The distinction between prototype code and production code is as true as it's ever been. What's changed is how you can act on it.

If your team couldn't afford to prototype in code before, that constraint just disappeared thanks to tools like Claude Code. I've been thinking about rebuilding something like that AmEx environment for years. But only now in the last few months, has it become feasible for me to do it.

My advice for teams right now? Invest in building this type of prototyping environment. Give your team a space to explore freely in code with AI assistance and stop worrying about whether that code is production-ready. It was never supposed to be. Then strategically sync relevant assets to safely jump-start production engineering.

Until next time,
Patrick

---

## In Practice

### Audit your prototype-production boundary

Map your workflow from first idea to final handoff. Find the blur between exploration and production. Then decide what should cross the boundary between them and what shouldn't.

1. **Map and label** your workflow stages as exploration or production.
2. **Find the blur** where you're applying the wrong mindset to the wrong phase.
3. **Draw the line.** Which assets should sync across environments? Which ones should stay separate? Define boundaries that make each side stronger.

---

## Go Deeper

- ["Sneak Peek: Intercom's AI Prototyping Workflow"](https://youtu.be/_9OdGDjFrCw?si=TazybRtBrWEwqnXS) — [Jayneil Dalal](https://www.linkedin.com/in/jayneil/)
  - A behind-the-scenes look at how the design team at Intercom is actively building and using this kind of prototype-first workflow in practice. A useful proof point that this approach is already working at scale.
- ["Prototypes and Production"](https://adactio.com/journal/14562) — Jeremy Keith
  - Keith nails the mindset distinction at the heart of this essay. His test for whether you're in the wrong mode is simple and useful: if you're building a prototype and catch yourself thinking about the right class name for a component, you've drifted into production thinking.
- ["Make It Work, Make It Right, Make It Fast"](https://wiki.c2.com/?MakeItWorkMakeItRightMakeItFast=) — C2 Wiki
  - The canonical internet discussion of the sequence referenced in today's essay. Attributed to Kent Beck, with roots in Unix philosophy going back to the early 1980s. A quick read that unpacks what each phase actually means in practice.
