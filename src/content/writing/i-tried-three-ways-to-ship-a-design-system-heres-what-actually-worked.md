---
title: "I Tried Three Ways to Ship a Design System. Here's What Actually Worked."
description: Shipping a successful system takes more than aesthetics - it takes a strategic rollout plan.
publishedDate: 2025-06-01
categories:
  - Newsletter
canonicalUrl: "https://www.unknownarts.co/p/design-systems-fail-because-of-strategy"
draft: false
---
Made by me with Midjourney.

Nobody wants to hear this, but creating and landing a new design system in existing software is an 18-month project. At best.

Most teams don't make it that far.

I know because I've been the designer on three of these projects, working on complex enterprise apps in cybersecurity and dev tools. Each attempt taught me something new, gradually learning why rollout strategy matters more than immediate aesthetic design choices. What started as hard-won lessons became a framework I now use to guide these decisions.

The products looked different, the teams varied, but the pattern was consistent: great designs failed when implementation was an afterthought, while strategic rollouts succeeded regardless of aesthetic ambition.

Here's what those three attempts taught me.

## The "blow it up" strategy (and why it crushed us)

At Tenable, we went big with a clean-slate redesign of the entire security platform. New visual system, modern components, the works. We spent months crafting something that looked incredible in our design files—the kind of work that gets featured on Dribbble and design twitter.

But once we tried to land it in the actual product, the complexity crushed us. We weren't just updating a visual theme; we were rewiring years of logic and layout. Dependencies stacked up like dominoes. Every component touched three others. Every page required six teams to coordinate.

A year later, the project was dead and the product was worse off than when we started. The head of product design was removed. The CPO followed soon after. We'd burned through enormous resources chasing a vision that couldn't survive contact with reality.

The "blow it up" approach feels creatively satisfying in the moment because it gives you a blank canvas. But software isn't built for wholesale change. It's built for iteration. Fighting that fundamental truth is a losing battle.

## The "Ship of Theseus" strategy (and why it stalled)

At Signal Sciences (now a part of Fastly), we tried the opposite approach. Instead of redesigning everything at once, we'd replace components gradually—like the [ancient thought experiment](https://en.wikipedia.org/wiki/Ship_of_Theseus) where Theseus replaces every plank of his ship over time.

This felt smarter. More aligned with how software actually works. We'd swap out discrete elements over time: style tokens first, then form elements, then navigation patterns, etc. Piece by piece, we’d build our way into a completely new system.

It was working... until it wasn't. Progress was slow and it was hard for the team to maintain momentum. We lacked a sense of urgency and slowly came to a standstill. The company got acquired, and the project froze, half-done.

We ended up with the same old ship, just with 50% new parts. Not worse than before, but not the transformation we'd promised either.

## The "land and expand" strategy (and why it worked)

At JupiterOne, I tried a different approach. Instead of redesigning everything or replacing pieces one by one, we picked one major feature as our pilot project.

This gave us a contained space to design holistically while limiting scope and risk. We built our component library (we called it "Juno") alongside the feature refresh. The real-world context informed the design of the components; the design of the components shaped the real-world feature we shipped.

Once we had the core of a working system and a showcase of what it could do, expanding to other parts of the platform became easier. Other teams could see the value, they had concrete examples to work with, and the organizational support built naturally.

Eighteen months later, the system was live across the platform. Not because we forced it everywhere at once, but because we gave it room to prove itself first and then gradually expand to fit the needs of every product surface.

## Why implementation strategy beats aesthetics

Here's the uncomfortable truth: your beautiful design mockups don't matter if you can't land them in the product.

I've seen teams spend months perfecting component libraries that never get implemented. I've watched gorgeous redesigns die in development hell. I've been part of projects where the design quality was exceptional but the rollout strategy was nonexistent.

The difference in a successful project isn't just having better designers or more skilled developers (although that helps, of course). It's about understanding that replacing a system isn't a visual exercise—it's an architectural one. In most cases, you're not just changing how things look; you're changing how they're built, maintained, and evolved.

That's why implementation strategy is just as crucial as design quality - you need both to succeed. An aesthetically bland system that actually ships beats a perfect system that never sees production. Even if it doesn’t satisfy your immediate urge for novelty, that well-architected UI system will give you the runway to dial in the visual aesthetics over time to the level of fidelity you’re seeking.

## What this means for your next system

If you're starting a design system overhaul, resist the urge to redesign everything.

Instead:

- **Pick your landing zone carefully.** Choose a feature that's important but not mission-critical. Complex enough to test your system and visible enough to build support, but contained enough to manage risk.
- **Design in context, not isolation.** Build your components alongside real feature work. Let the constraints of actual implementation inform your decisions.
- **Plan for expansion from day one.** Your pilot isn't just a proof of concept, it's the foundation everything else will build on. Make sure what you’re building can support that weight.
- **Measure adoption, not perfection.** Success isn't having the most beautiful component library. It's having a system that teams actually use to ship better products faster.

Nobody wants to hear that their beautiful designs might fail because of boring implementation decisions.

But in my experience, that's exactly what happens.

The sooner you accept that reality and plan accordingly, the sooner you can ship systems that make the impact you’re hoping for.

Until next time,

Patrick

***Find this valuable?*** Share it with someone who’d appreciate it.

**Want more like this?** I post insights every weekday on LinkedIn — join me there.

 Get essays every Sunday — 7,000+ already do.
