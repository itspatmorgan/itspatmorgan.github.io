---
title: Build a Design OS
description: How a prototype environment became a shared operating layer for design
publishedDate: 2026-08-30
categories:
  - Newsletter
theme: Design
tags:
  - Design
  - AI
  - Code
visual:
  version: 1
  theme: Design
  background: warm-dark-gray
  generator:
    type: isoline
    seed: 53
    levels: 12
    scale: 350
    strokeWidth: 0.7
    opacity: 75
    color: copper
  texture: 0
  grain: 24
image: /images/writing/build-a-design-os/feature.jpg
canonicalUrl: "https://www.unknownarts.com/p/build-a-design-os"
draft: false
---
## Introduction

Recently, I shared a [video walkthrough](https://www.youtube.com/watch?v=628c4YuxAEM) of an AI-assisted design environment I've been building for my team at Sublime.

AI has made it easier than ever for designers to create working software. But teams still lack good ways to get ongoing leverage from that work.

For much of the last generation, Figma became the shared workspace for design teams. If you were looking for a design artifact, there was a good chance you would look in Figma. That made the work easier to find and collaborate on.

Now AI tools have scattered the work again. Prototypes live in tools like Claude or v0, design principles live in documents, and research context lives somewhere else. The things we make are often disconnected from one another and from the context that should inform them.

This creates a frustrating gap: designers can make more than ever, but the work doesn't necessarily compound. Each new prototype starts from scratch. Each agent needs to be reintroduced to the same principles, constraints, and design context over and over again.

I was running into this problem with my team at the start of 2026, so I started building an environment my team is now calling a **Design OS**. This is the first part of a series about building one. In it, I'll explain what I mean by *Design OS*, how I arrived at the idea in the first place, and why I think more teams may need this kind of shared foundation.

## The missing layer between prototypes and production

At the end of 2025, my team was making prototypes with a mix of AI apps. These were useful, but often also isolated.

Our prototypes lived inside the tool where they were made and weren't connected to each other, our production code, or our team's preferred workflow. We didn't even have a central place to see what teammates were making, much less build on their work.

The obvious alternative was to prototype directly in production. In theory, this gives you the holy grail: a single source of truth between engineering and design. In practice, it made design exploration too painful for me. I found the production repository too slow and complicated for the exploratory and iterative design that's central to my role.

The problem is that prototype code and production code serve fundamentally different purposes. Production code needs to optimize for shipping and maintaining a performant product at scale while prototype code needs to optimize for speed, flexibility, and divergence. I wrote more about this distinction in my article [Prototype Code Is Not Production Code (And That's Okay)](https://www.unknownarts.com/p/prototype-code-is-not-production).

You need both sides of that spectrum to design and ship a good product. A prototype should be able to change direction quickly, without worrying about scale or production constraints, while still benefiting from shared foundations, reusable primitives, and a connection to the product it may influence. So I started looking for an environment with the freedom of a prototype, but enough shared structure for the work to compound over time.

## I had seen this model before

This idea wasn't new to me.

I started my tech career in 2013 as a "design technologist" at American Express, a front-end developer embedded on a product design team. Believe it or not, we had a small *team* of design technologists who built and maintained an environment for prototyping designs in code.

The final design deliverable for our team was a high-fidelity, responsive web experience built with actual front-end code. *This was intentionally not the exact production code.* The production team used a different, legacy tech stack that was good for shipping big financial software but painful for prototyping.

That separation served us well. A working code prototype communicated responsive design intent much better than static screens, while shared stylesheets and scripts made it more likely that the final product would look and feel like the design team intended.

This process worked well, but it took a dedicated team of design technologists to code the prototypes and maintain the associated tooling. Since leaving Amex in 2016, I have never worked at another company with the resources to hire that type of team.

So for close to a decade, that way of working wasn't an option.

Then, at the start of 2026, AI changed that calculation.

When I dove into Claude Code in January, I quickly recognized that the models and harnesses had become good enough for me to build the tools to enable that kind of workflow on my own. I might still need occasional support with things like infrastructure requests, but I no longer needed even a single dedicated engineer to unlock this way of working.

The long-closed door had opened.

## The system emerged from the work

My first attempt at setting up an environment was modest. I had a couple of HTML prototypes in Claude, and my teammate [Joe Salowitz](https://www.linkedin.com/in/joesalowitz/) had a few artifacts of his own. I wanted to put them in one repository, deploy them somewhere, and give the team a shared place to see what we were making.

I spent the early days setting up that basic scaffolding to show a simple proof of concept to the team. I kept the prototypes low fidelity, grayscale, and wireframe-like, intentionally closer to [Balsamiq](https://balsamiq.com/) mockups than a polished product interface because I didn't yet know how to best match our production code. Even those simple, low-fidelity but interactive prototypes started adding value for me right away.

Soon after I had set up the skeleton of our environment for product design, our creative design team also needed a place to share tools they had been building. I rearchitected the site and changed the name to something that felt more inclusive: *Design Studio*.

Today, Design Studio supports design work across Sublime. Product designers use it for everything from low-fidelity exploration to high-fidelity prototypes that influence production. Product managers sketch early ideas for new features, while creative designers explore ideas and build self-service tools for our marketing organization.

As more people used the environment, I started curating more of the context around the work directly into it, including our design principles, personas, and project briefs. As I wrote in [AI Needs a Plan](https://www.unknownarts.com/p/ai-needs-a-plan), the best agent work usually starts with a written brief, not a one-shot prompt.

By then, the environment had grown from a place to make prototypes into a shared foundation of tools and context that helps people and agents understand how our team designs.

## From design systems to design operating systems

A **Design OS** brings the systems and processes of design together in software so they can be used by both people and agents. The idea builds on two practices that already exist in many design organizations: *design systems* and *design operations*.

*Design systems* codify what a team makes: the components, tokens, patterns, and principles that help designers and engineers create a consistent product.

*Design operations* organize how a team works: the processes, tools, and documentation that help people collaborate and keep the design function moving.

Design teams have always documented principles and processes, but those assets only influenced the work when someone chose to apply them. In a Design OS, that context can become available at the moment of work. A design principle can inform an agent's critique. A persona can shape a design exploration. A brief can guide the work directly. As I argued in [Your Instructions Now Run Like Code](https://www.unknownarts.com/p/your-instructions-now-run-like-code), plain-English documentation is becoming machine-executable, which makes these assets much more directly useful.

For this approach to work, those assets need a shared home where people and agents can access, modify, and build on them.

## Why code is the foundation

A codebase gives the Design OS somewhere to live. It lets design intent be shared, connected to other assets, and put into practice.

That has always been possible in theory, but until recently code wasn't very accessible to designers. Agents change that dynamic by acting as translators into and out of code. They can turn a designer's plain-English intent into working software, then translate that software back into something the designer can use and evaluate.

This builds on the argument I made in [AI Runs on Text. So Should You.](https://www.unknownarts.com/p/ai-runs-on-text-so-should-you): when your thinking lives in plain text, it becomes an asset that both you and AI can read, reuse, and extend. Code just happens to be a more structured form of plain text, which makes it easier for agents to interpret and act on reliably.

The goal here is not to make designers write code. It's to make design intent executable. When a codebase holds the team's foundations, conventions, and decisions, an agent can translate a designer's instructions into working artifacts and carry that context forward. Each new piece of work can then build on what came before it.

## A map for what comes next

This article is the introduction to a longer series I'll be writing about building a Design OS. There's a lot to cover, from prerequisites like setting up a local development environment to the specific technical choices that make Design Studio work. I'll keep writing essays about the broader philosophical questions around design, software, and AI, but this series will be the spine of my practical writing in the coming weeks and months.

You may not need the exact system I'm building, but my goal is to give you enough context and practical guidance to build a Design OS that makes sense for you, one piece at a time.

Until next time,

Patrick
