---
title: How Vibe Coding Improved My Data Viz Prototypes
description: Why I skipped Figma and rebuilt my data viz workflow in code instead
publishedDate: 2025-05-11
categories:
  - Newsletter
theme: AI
tags:
  - AI
  - Prototyping
  - Data Visualization
visual:
  version: 1
  theme: Design
  background: warm-dark-gray
  generator:
    type: isoline
    seed: 716
    levels: 12
    scale: 350
    strokeWidth: 0.7
    opacity: 75
    color: copper
  lightMode:
    color: bronze
    opacity: 100
    strokeWidth: 1.05
  texture: 0
  grain: 24
image: /images/writing/how-vibe-coding-improved-my-data-viz-prototypes/feature.jpg
canonicalUrl: "https://www.unknownarts.co/p/the-first-time-vibe-coding-actually"
draft: false
---

Not all vibe coding is useful. But sometimes, it actually helps you do the job better, faster.

Over the past year, I explored a lot of AI tooling during my sabbatical, mostly for personal creative work. I was excited but skeptical about the benefits for my professional product design workflow.

Tools like [Bolt.new](https://bolt.new/), [Lovable](https://lovable.dev/), and [Figma Make](https://www.figma.com/make/) are fun to experiment with, but in a real product environment, especially one like cybersecurity, there’s no way I’m handing off that code and expecting it to reach production.

Then [I joined Sublime Security.](https://www.linkedin.com/posts/itspatmorgan_well-folks-im-back-in-the-startup-game-activity-7308884444239536128--Ek7?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAZtQegB-nJjdIi9kT7naAeZHCCWYKlWcqg) And within a couple weeks, I found a use case for vibe coding that actually made sense. Not as an engineering shortcut, but as a clearer, faster way to communicate design intent inside a constrained, technical system.

## The quick turnaround data viz challenge

Shortly into my new role, our team was preparing for [RSA Conference](https://www.rsaconference.com/) in San Francisco, a major security industry event. We wanted to showcase a dashboard visualizing the value of our new AI security agent.

This posed some immediate challenges:

1. As a new employee, I hadn't yet built out many system resources in Figma
2. Creating static mockups of data visualizations is always a pain
3. We use [Apache ECharts](https://echarts.apache.org/en/index.html) for our visualization library, which comes with its own constraints and capabilities

I had a choice: either spend a bunch of time reverse engineering ECharts components into Figma mockups, or find another approach.

## Why static mockups fall short for data viz

If you've designed dashboards before, you know the pain of communicating data visualizations through static design files:

- Interaction details are easier to miss
- Realistic data distributions are time-consuming to fake
- Ignoring library constraints leads to design–dev mismatches
- Engineers still have to translate designs back into library-compatible configurations

All of this is tedious at best.

In my case, since we were already committed to using ECharts, I would effectively be recreating assets that already exist in code, using up my limited time and introducing more opportunity for error.

Ultimately, I decided that wrangling Figma to communicate these charts would’ve cost more time than it was worth.

Screenshot of my workstation. ChatGPT on left, Echarts dev environment on right.

## A better approach: Safe environments for vibe prototyping

Instead of fighting these limitations, I decided to work directly with the tools our engineers use.

ECharts has a built-in [playground demo mode](https://echarts.apache.org/examples/en/editor.html?c=area-stack) where you can prototype specific chart types right in the browser. And since it’s a well-known, publicly documented library, major LLMs like those from OpenAI and Anthropic know about its capabilities. This let me set up a simple vibe coding workspace: ChatGPT on one side, ECharts sandbox on the other.

With this setup, I could:

1. Ask ChatGPT about ECharts capabilities and syntax
2. Describe what I wanted to achieve from a design perspective
3. Generate code that I could immediately test in the sandbox
4. Iterate rapidly until the visualization matched my design intent
5. Share working examples directly with the engineering team using the sandbox's share link

This approach greatly reduced the [design execution gap](https://www.unknownarts.co/p/the-design-execution-gap-8db).

Engineers could see and feel exactly what I wanted, within the constraints of the library they needed to use to achieve the task.

## What made this valuable

The most important outcome was that I communicated the design intent more clearly and quickly by leaning into a tool that was better suited for the job than static mockups.

I don't know how much of the code I generated was actually used by the engineers on my team. But that's not what mattered.

The value came from:

- **Staying within actual technical constraints** rather than designing fantasy interfaces
- **Exploring possibilities more efficiently** than reading documentation
- **Prototyping in the actual medium** that would be used in production
- **Communicating design intent more clearly** through interactive prototypes

Most importantly, this approach respected everyone’s role. I wasn’t trying to be an engineer—I was using code as a tool to express intent, nothing more.

## When vibe coding actually makes sense in production product design environments

This experience helped me crystallize when the current AI vibe coding tools are genuinely valuable for product designers:

1. **When the goal is communication, not production**
	- Using code to express intent, not commit to implementation details
2. **When there's a safe sandbox environment**
	- Places to experiment where nothing mission-critical can break
3. **When working within well-defined, constrained systems**
	- Charting libraries, design systems, UI frameworks with clear documentation
4. **When the traditional design-to-development handoff creates friction**
	- Highly interactive elements that static mockups can't adequately represent
5. **When the design execution translation cost is high**
	- Complex experiences and interactions where misalignment is expensive

## Vibing beyond data visualization

The point of all of this is not to turn myself into a person who pushes code to production (I don’t want that responsibility).

The point is to communicate my intent as clearly as possible to the people responsible for building it, maximizing the chances we build something great, with quality and speed.

Data visualization is a familiar example that nearly every product designer has grappled with at some point. But this workflow will become increasingly important as the non-deterministic and interactive nature of AI data and workflows requires us to use tools that better communicate designs for those fluid experiences.

This project wasn’t a grand statement about the future of product design. It was simply the best option to get the job done well.

Product design exists to help the team create the thing we’re all trying to build together.

And I’ll happily use any tool that improves the odds we get there.

Until next time,

Patrick
