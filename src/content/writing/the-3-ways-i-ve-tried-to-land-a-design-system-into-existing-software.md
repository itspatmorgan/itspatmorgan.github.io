---
title: The 3 Ways I’ve Tried to Land a Design System Into Existing Software
description: A success, a partial success, and a failure in systems strategy
publishedDate: 2023-04-10
categories:
  - Newsletter
canonicalUrl: "https://www.unknownarts.co/p/the-3-ways-ive-tried-to-land-a-design"
draft: false
---
> I have not failed. I’ve just found ten thousand ways that won’t work.
> 
> [Thomas Edison](https://www.goodreads.com/quotes/8287-i-have-not-failed-i-ve-just-found-10-000-ways-that)

## Intro

I recently had the pleasure of speaking with a team that’s starting on the journey to land a new design system into an enterprise web app. It’s an exciting time, but also an important moment; how they set and communicate their strategy will heavily influence the potential impact of their work.

Today we’ll explore the strategies I’ve tried for establishing design systems in existing software products at three high-growth tech companies.

Each team used a different strategy for executing the new design vision and while none is 100% right or wrong, they all have trade-offs which I’ll dig into so that you can avoid my mistakes.

Now let’s get to it!

---

Source: The Ringer

## The “blow it up” strategy

### What is it?

You know this strategy. It’s the classic “redesign” project.

In some ways it’s the bread and butter of [waterfall-style design](https://business.adobe.com/blog/basics/waterfall) and development: “Old design isn’t working? Let’s come up with a completely new one all at once!” You try to install an entire system via a reimagined product in one fell swoop.

You get to “flip the switch” to a new experience which can feel awesome but you take on a big burden and a lot of risk in pursuit of that wow factor.

### What do I think about it?

I’ll be upfront: I think this is a bad idea for software. It’s just a bad match for the medium.

***Design*** is very good at big, wholesale change. ***Software*** is very bad at it.

From a design standpoint “blowing it up” is comfortable because it gives a level of perceived creative freedom that people like when making something new. There’s also real merit in being able to step back and design holistically so that you can get the big picture you need to inform how system elements should work in harmony.

From an implementation perspective “blowing it up” is a nightmare. It’s very complex and introduces many dependencies which ramp up the risk. Not only are you trying to design and architect a new experience from scratch, but you’re also trying to ensure that it matches the existing functionality of the old version. That’s a lot of moving pieces.

The experience you’re trying to replace was likely built iteratively over time. Even with the benefit of seeing its current state, the process of re-architecting every feature is lengthy and error-prone. The scope is enormous, which makes this strategy unappealing in all but the most drastic of circumstances.

Due to its high complexity and extended time frame, it’s also possible this strategy gets terminated part way through. This not only makes the whole endeavor feel like a colossal waste of time but can actually leave the new experience worse than the original. A bad outcome for everyone involved.

### How did it manifest in my career?

In my experience, this often manifests when a change occurs in product leadership. People tend to exaggerate the flaws of the software they inherit because it’s not something they personally made. It’s like the exact opposite of the “ [Ikea Effect](https://thedecisionlab.com/biases/ikea-effect) ”; It doesn’t reflect the new leader’s decision-making so the knee-jerk reaction is to blow it up and “do it their way”.

This is the strategy that my team took at [Tenable](https://www.tenable.com/). We did some very cool design work but ultimately failed to deliver on the vision. The experience we designed was [Dribbble](https://dribbble.com/) \-worthy but neither pragmatic nor feasible given our real-world constraints. The project got mostly scrapped after a year of hard work and the experience we shipped was, in my opinion, worse than the original. At best it was a far cry from the “visionary” design we set out to achieve. Also in the process of this slow breakdown, the head of product design got removed from his position and then the chief product officer followed suit.

### Verdict

A clear failure. Would not recommend it. 👎

---

Source: Wikimedia Commons

## The “Ship of Theseus” strategy

### What is it?

The [“Ship of Theseus”](https://www.betterbydesign.cc/i/112989459/the-ship-of-theseus) strategy is the yang to the “blow it up” yin. For context, here’s the first line of the [Wikipedia entry](https://en.wikipedia.org/wiki/Ship_of_Theseus):

> *The **Ship of Theseus** is a thought experiment about whether an object that has had all of its components replaced remains fundamentally the same object.*

In the case of the namesake (the Greek legend Theseus), the story goes that over time he replaced every piece of his ship with a new version. So, after swapping out every board, sail, and so on for a new one, the question was: is it the same ship?

A team following the “Ship of Theseus” strategy would not attempt a wholesale redesign but instead attempt consistent, specific replacements over time. Their goal is to morph the existing experience into something entirely new by swapping all the component pieces for a new version.

### What do I think about it?

It’s a safer strategy than blowing it up but it’s also tough, just for different reasons. It’s more aligned with best practices for iterative software delivery, but due to how incremental it is it’s harder to use it to set up significant design breakthroughs.

Perhaps the biggest issue is that the level of effort for this strategy depends a lot on how systematized your design already is. Good luck trying to swap every instance of a low-level component if you don’t already have a somewhat centralized way to do so. Just like “blowing it up” it’ll be very error-prone and take an eternity.

Another potential issue arises when the new design vision represents a significant aesthetic departure from what exists. In that case, you have two options:

1. You accept that your new elements may feel out of place in the platform for a while until you can get a critical mass of design updated.
2. You have to dial back your desired aesthetic changes so that they fit better within the bounds of the existing product.

Neither option feels that satisfying for the team despite the technical improvements you might achieve. You’re like “Great, we updated all our buttons to be on the system!”… but overall the product feels basically the same as before which in this context feels like a letdown.

Ultimately this strategy can lead the team to feel like they’re walking in quicksand making little visible progress for their effort. So even though it feels safer at the start, it’s easier for motivation to wane over time and for this kind of project to also get abandoned part way through.

### How did it manifest in my career?

This is the strategy my team took at [Signal Sciences](https://www.signalsciences.com/).

It was mostly successful, but the implementation took long enough to reach a critical mass that it eventually stalled. This was then amplified by the company being acquired by [Fastly](https://www.fastly.com/), stopping progress in its tracks.

Thankfully, by going this route the partially delivered design vision didn’t leave the experience any worse than it was before progress stopped. The design just ended up in a weird place where it was partly on the old system and partly on the new one. It was clearly still the same old ship just with maybe 50% new pieces.

### Verdict

A partial success. Would recommend it if the circumstances are right. 🥲

---

Source: Kevin Indig

## The “land & expand” strategy

### What is it?

“ [Land and expand](https://www.betterbydesign.cc/i/104024275/land-and-expand) ” is a phrase I borrowed from SaaS sales. It describes a customer acquisition and sales growth process in which the first goal is to land a customer on a small deal. Get them in the door. Then as that customer uses your product, you build trust with them by consistently adding more value, expanding your position over time.

With design systems, “landing” a system looks like a very scoped-down version of the “blow it up” strategy. You pick a specific, representative portion of your applications(s) to redesign. This landing spot serves as the initial testing ground and pilot program for your nascent system. Ideally, it is just big enough to represent the majority of the components and patterns that you need to get going.

Then once you’ve done your contained “blow up” and landed the system, “expanding” looks more like the “Ship of Theseus” strategy in that it’s a gradual drive to adopt and refine system elements across all corners of the platform.

### What do I think about it?

I like it! For a number of reasons! 🥳

- It gives designers a big enough scope of work upfront to think holistically while also limiting that scope to one landing point, reducing complexity, dependencies, and risk.
- The landing point serves as a de facto testing ground for the system. No matter how well-defined a component looks in isolation, it isn’t until you put it in context that you know for sure if it’s delivering.
- You get both a system starter kit and a visible chunk of new feature UI that represents it, helping you feel the momentum and build organizational support for expanding the system.
- It allows most of your customer-facing feature design workflows to continue business as usual while you establish system foundations.

### How did it manifest in my career?

This is the strategy I adopted when I joined [JupiterOne](https://jupiterone.com/) in 2021. We started with a pilot project and gradually drove adoption across the platform over the course of roughly 18 months.

#### Landing

At JupiterOne we picked our integrations feature as our system landing point. We thought it was a good candidate for two reasons:

1. It was already in need of work due to new constraints from the company’s growth.
2. It was an important feature but not the highest profile. So it had sufficient complexity to test the system but not a ton of organizational pressure to deliver anything too mind-blowing.

We stood up the first version of our component library (which we named “Juno”) in tandem with starting work on the feature refresh. The context of the feature development informed the design of the components and the new composition of the components in turn informed the refresh of the feature. Meanwhile, the other 95% of JupiterOne continued to serve our customers in its existing form.

#### Expanding

As the feature and system rounded into shape we brought a second team onboard to begin leveraging Juno components in another part of the platform with the agreement that they would help us test and refine.

This was the first of many expansion points.

Over time, some sections adopted Juno in a more incremental “Ship of Theseus” style, gradually pulling in targeted updates while other sections required something closer to a “blow it up” approach. But in both cases, since the core system elements had already been established, the process of re-architecting was substantially more approachable.

### Verdict

Feels like the sweet spot. Would recommend it! 😇

---

## In sum

- Don’t “blow it up” with software products unless you truly have no alternative.
- Try to enable “Ship of Theseus” style enhancements, just don’t expect that approach to be the best for establishing *new* systems.
- Aim to “land” your system with a well-scoped pilot project and then gradually “expand” it over time to the rest of your platform.
