---
title: Turn Your Portfolio Into a Laboratory
description: Why your site should be a space to build, not just a space to present
publishedDate: 2026-05-31
categories:
  - Newsletter
theme: Design
tags:
  - Product Design
  - Portfolio
  - AI Tools
visual:
  version: 1
  theme: Design
  background: warm-dark-gray
  generator:
    type: isoline
    seed: 427
    levels: 12
    scale: 350
    strokeWidth: 1.2
    opacity: 75
    color: copper
  lightMode:
    color: bronze
    opacity: 100
    strokeWidth: 1.5
  texture: 0
  grain: 24
canonicalUrl: "https://www.unknownarts.co/p/turn-your-portfolio-into-a-laboratory"
draft: false
---
> We shape our tools, and thereafter our tools shape us.
> — John Culkin

I didn't plan to build a lab this week. It just happened.

[Last week](https://www.unknownarts.co/p/how-i-rebuilt-my-portfolio-with-claude) I shared how I rebuilt my portfolio from scratch with coding agents. This week I started building *on* that foundation. And what happened surprised me.

Rather than working through an exact list of planned improvements, I found myself just making things. Trying an interaction. Isolating a component. Building a tool to solve a problem I kept running into. And every time something clicked, the same question came up: how can I share this?

The experiments felt interesting and useful but didn't have a natural place to live on my site. They're not full case studies and they don't need to be. You can just try them out directly on the site. But I needed a place to collect them as they surface naturally through my work.

This is how I ended up with [the Lab](https://itspatmorgan.com/lab/), a new section of my site for experimental work. It's a place where I can build things, document them as I go, and share them with no extra work. I kicked it off with three items this week, each one arriving with its own realization.

![Pixel Wave lab page showing the tactile text reveal animation](/images/writing/turn-your-portfolio-into-a-laboratory/pixel-wave.gif)

[**The Pixel Wave**](https://itspatmorgan.com/lab/pixel-wave/) is the hero text effect I built for the site launch. I wished I could promote it a little better as something I designed intentionally. This gave me my first real "aha" moment of the week: why not just give it its own showcase page? Once I had the idea, I quickly spun up the 'Lab' index page with this as my first entry. Now this small thing I put real effort into has a dedicated page, a live demo, and some documentation. A detail elevated into a mini portfolio asset.

![Pattern Engine lab page showing a generated isoline visual](/images/writing/turn-your-portfolio-into-a-laboratory/pattern-engine.png)

[**The Pattern Engine**](https://itspatmorgan.com/lab/pattern-engine/) started as a practical problem. As I've been migrating newsletter articles to my site, I knew I didn't want to deal with porting blog feature images for each one. Instead, I wondered if I could build a tool to make new, on-brand, feature images for me. In just a couple of days, I built the foundation of a generative art system: five algorithmic generators that create unique visuals from each article's parameters, driven autonomously by the coding agents I use to build the site. This is the kind of asset that would have been impossible to make before. The tool is operated primarily by either Claude or Codex, but I built a UI as a lab so that I could think through the functionality and provide feedback to the agents. Now my blogs get unique, interactive art automatically and the UI I built as a playground becomes something anyone can experience. No extra work required.

![Pixel Mark lab page showing logo variants and interaction states](/images/writing/turn-your-portfolio-into-a-laboratory/pixel-mark.png)

[**The Pixel Mark**](https://itspatmorgan.com/lab/pixel-mark/) came last, and by that point I understood the lab pattern well enough to use it deliberately. I wanted to develop a new logo mark for the site, and instead of going back and forth with an agent building directly into the site navigation, I told the agent to make me a lab page where we could iterate on it first. The lab became my actual design workspace, where I could test states, interactions, and timing before the mark landed in the actual site UI. The pattern I'd stumbled into with the first two labs became an intentional tool.

None of this was planned. But that's Culkin's idea in action: I shaped the tool, and then the tool shaped what I made.

The only real way to develop fluency with these tools is to use them consistently on problems you actually care about solving. A lab built into your own site gives you that space.

Another benefit is that once you've built something in your lab, it's already public. That used to be a whole separate effort: export the assets, find somewhere to host them, write up the context. Real friction that quietly killed a lot of experiments and insights before they reached anyone. Now building something and sharing it are the same act.

I didn't plan to build a lab this week. But now that I have one, I can't imagine not having it. If you've been thinking about building your own site, this is one more reason to take the leap.

Until next time,

Patrick

--

**P.S.** If you want the full story on how I set up the environment that made all of this possible, [last week's piece](https://www.unknownarts.co/p/how-i-rebuilt-my-portfolio-with-claude) goes deep on the specific choices I made.

**P.P.S.** If there's something you want to go deeper on, ask. Leave a comment, reply to this email, or find me on X or LinkedIn. Your questions will help me figure out what to write next.
