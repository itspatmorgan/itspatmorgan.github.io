---
title: How to Avoid Technical Lock-In for Better Software Design
description: Making intentional design decisions to keep your options open
publishedDate: 2022-11-06
categories:
  - Newsletter
theme: Systems Thinking
tags:
  - Software
  - Technical Design
  - Design Systems
visual:
  version: 1
  theme: Systems Thinking
  background: warm-dark-gray
  generator:
    type: voronoi
    seed: 669
    count: 60
    jitter: 60
    strokeWidth: 0.6
    opacity: 75
    color: copper
  lightMode:
    color: bronze
    opacity: 100
    strokeWidth: 0.9
  texture: 0
  grain: 24
image: /images/writing/how-to-avoid-technical-lock-in-for-better-software-design/feature.jpg
canonicalUrl: "https://www.unknownarts.co/p/the-subtle-art-of-keeping-your-options"
draft: false
---
## Introducing “Lock-in”

Early in his book “ [You Are Not A Gadget](https://www.amazon.com/You-Are-Not-Gadget-Manifesto/dp/0307389979) ”, [Jaron Lanier](http://www.jaronlanier.com/general.html) explains the powerful phenomenon of technological “lock-in”. The example he uses is [MIDI](https://en.wikipedia.org/wiki/MIDI), the music technology that underlies a vast majority of modern music tooling. MIDI was developed in the early 1980s and while it unlocked a ton of musical opportunities, it wasn’t without its limitations.

A key limiting factor was that it approached musicality from the viewpoint of a keyboardist. This works for many scenarios but presents challenges to faithfully representing musicality that can’t neatly align to the layout of notes as they’re presented on a keyboard.

Despite its limitations, MIDI became the standard and foundation upon which almost all of modern music-making rests. It’s so foundational, that to replace it at this point is a practical impossibility in most cases. To remove it would be akin to pulling out the one Jenga block that’s holding up the rest of the tower; it simply can’t stand without it.

That, in a nutshell, is lock-in.

It’s something that limits our progress and yet can’t be removed.

A state where some foundational technical choice ultimately makes it hard to innovate and improve your product or service.

Switching costs become prohibitive, both practically and psychologically. Practically speaking, the cost of changing course becomes financially irresponsible for a business, even if it makes logical sense. And psychologically speaking, the [Sunk Cost Fallacy](https://thedecisionlab.com/biases/the-sunk-cost-fallacy) makes it challenging to abandon the thing in which you’ve invested so much time and effort.

## Confronting lock-in in our day-to-day as designers and developers

MIDI lock-in is an example with outsized impact, but it is a good representation of something we face constantly when designing software: we’re trying to ship useful iterations without limiting ourselves unnecessarily in the process.

In my experience, teams accidentally lock themselves in way more often than they’d like to admit. They make a decision based on immediate needs but also overreach in their implementation, creating something that’s overly specific and rigid that they end up regretting.

A few common places I see lock-in manifest:

### Selecting programming languages or frameworks

This one’s squarely in the camp of engineering, but the languages and frameworks you choose to use on day one have a significant impact on your options on day 1,000 or even 10,000. There’s no one right answer, but when you pick a language or framework, you take both its strengths and weaknesses. Don’t overthink it, but be intentional because you’ll be living with those strengths and weaknesses indefinitely. Trying to rearchitect an existing product’s codebase into another language or framework is a huge, complicated, and expensive undertaking that’s rarely worth the investment for most companies.

### Selecting UI libraries (either basic or data viz)

This is where design starts to really feel the tangible impacts of lock-in.

Which UI libraries your team chooses has a big impact on what makes sense from a design implementation perspective. For instance, on my team at JupiterOne, we use a combination of three third-party libraries to power the majority of our experience: [Material-UI](https://mui.com/) (for core UI), [ReCharts](https://recharts.org/en-US/) (for standard data viz), and [ReGraph](https://cambridge-intelligence.com/regraph/) (for graph database visualization).

We’re a small company without the staffing or expertise to build many of these complex UIs in-house, so it makes strategic sense for us to use vendor-built elements to deliver on our cyber-security use cases. That said, each library has its inherent limitations. And to the extent that we depend on them, we also choose to lock ourselves into the implementations they can support.

### Crafting components instead of establishing patterns

Many teams’ first instinct is to try to capture and enforce all UI design logic within programmable elements (usually called “components”). While I’m all for officially componentizing lots of standard design decisions, overdoing it can have lasting negative impacts, particularly on macro-level patterns like CRUD conventions or form structures. When you attempt to enforce design programmatically at that level you create a high degree of immediate lock-in which, in my experience, is almost always regretted sooner rather than later. While you do allow the potential for more inconsistency by not enforcing those patterns programmatically, you gain the kind of flexibility which enables good iterative design.

## Learning to play the long game

Encountering and confronting lock-in can be frustrating.

As people who like to make stuff it sucks to feel limited regardless of where that feeling is coming from; whether it’s confronting the impact of past decisions or trying to make decisions in the present to avoid trouble in the future.

The *ideal solution* for your design vision is rarely the best solution ***right now,*** so be mindful to not overreach prematurely. Laying the solid groundwork that points you in the direction of that vision is less sexy, but it’s important work that requires a lot of maturity and discipline to execute. One day, your future self will thank you because you kept your options open enough to be able to make a bold decision when the moment truly called for it.

Here are a few takeaways to be mindful of for each discipline:

**Takeaways for designers:**

- Simply staying aware that lock-in exists goes a long way in helping you make design decisions that help more than they hurt.
- Realize that the more complexity you add now, the harder it will be to pivot or change direction later.
- Prefer solutions that are flexible over those that are rigid, unless you are sure you need the rigidity.

**Takeaways for developers:**

- Designers often can’t see the extent of the existing lock-in and also have a harder time gauging the potential impact of future lock-in. In this area, they often “don’t know what they don’t know” and rely on you to guide them out of technical dead ends.
- If a proposed design will force you to construct a brittle experience, push back, and guide the design toward something more sound. A more resilient experience is almost always a better one.
- Be wary of which libraries you choose to rely on
- Be intentional about which design decisions you choose to enforce programmatically

At the end of the day, the biggest thing to remember as an in-house designer or developer is that you’ll probably be the one to end up dealing with the fallout of your own choices.

You’re not just doing a contract and going on your merry way.

Your current project will set up the next project and the one after that.

So think of your future self and be their friend.

Play the long game and avoid lock-in.

Your future self will thank you.
