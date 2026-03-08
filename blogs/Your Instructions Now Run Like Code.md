---
categories:
  - Newsletter
  - Draft
tags: []
author:
  - "[[Patrick Morgan]]"
created: 2026-02-17
published: 2026-02-23
series: practitioner
---
# Your Instructions Now Run Like Code

Why your plain-English documentation is more valuable than ever

---

Ray Kroc’s genius wasn’t the hamburger.

When he built McDonald’s into a global franchise in the 1950s and 60s, his real innovation was the system. He created a strict operations manual and a training program so thorough that just about anyone could open a location and deliver a consistent experience. No extensive culinary training required. No institutional knowledge passed down by word of mouth. The business lived in the documentation. Anyone who could read it could run it.

That insight became one of the foundational ideas of modern business. The system is the product. If you want to scale, stop doing the work yourself and start designing the machine that does the work. As Michael Gerber summed it up in his classic book _The E-Myth Revisited_: “Work _on_ your business, not _in_ it”.

But Kroc’s model had a hard constraint baked in. Someone still had to pick up that manual and execute it. The ops manual was the asset, but it needed humans to run.

AI removes that constraint.

The plain-English instructions you write today don’t just inform people. They’re machine executable. A well-written prompt reads like a plain English operations manual but executes like code. Your documented thinking runs at machine scale, automatically.

I’m living this in two places right now. At my day job, I’m building a code prototype environment that Claude Code orchestrates while I give direction. To make that work, I’ve had to distill my intentions into markdown documents that live directly in the codebase. A `Claude.md` file captures some core preferences. Linked supporting docs specify more detailed instruction like library choices and project structure. All the knowledge that used to live only in my head now sits in a format Claude can reference and act on. My writing workflow works the same way. I’ve spent months refining the instructions I give Claude in my writing project: my expertise, my style preferences, my audience, how I want it to push back on my drafts. Everything I’d tell a human editor on day one. Neither of those is a clever prompt. They’re operations manuals I’ve distilled over time. And they now run every time I sit down to work.

This is the through-line of everything this series has been building toward in the last few weeks. Getting your thinking into text. Using voice to capture it faster. Curating it into sharp, reusable context. None of that was just about being organized. You were building an operations manual. One that your AI can now run directly.

Kroc needed a franchisee to pick up his manual and follow it. You don’t. Your instructions go straight from your head to execution, with AI as the engine in between.

Document your thinking like Kroc documented his system and you’ll tap into leverage he could only dream of. Then put it to work.

Until next time,  
Patrick

---

## In Practice

### 🎯 Try this

#### Write your first executable operations manual

Pick one task you repeat often. Something you already do well and do consistently.

Now write it down as if you were onboarding someone who has never worked with you.

1. **Name the task and its goal.** As simply as possible: what is this, and what does a good result look like?
2. **List the inputs.** What does the AI need to have in order to start? Examples, context, reference material, a specific document?
3. **Write the process.** Step by step, in plain language. Nothing clever. Just: here’s what I do, here’s how I think about it, here’s what I’m looking for.
4. **Add your taste.** What makes a good version good? What would obviously miss the mark? Write those down too.
5. **Save it as a Markdown file.** Name it clearly. This is now a reusable asset.

Next time you sit down to do that task with your AI, give it this document. Watch what happens when you give it an operations manual instead of a generic prompt.

---

## Go Deeper

- **["The E-Myth Revisited"](https://www.amazon.com/E-Myth-Revisited-Small-Businesses-About/dp/0887307280) — Michael Gerber** — The book behind the Ray Kroc example in today's essay. Gerber's core argument is that most small businesses fail because their owners never make the shift to architecting their business in a way that can operate without them.
- **["Using CLAUDE.md Files"](https://claude.com/blog/using-claude-md-files) — Anthropic** — The official guide to writing AI-readable instruction files that make your operations manual executable. Covers what to include, how to structure it across projects, and how to maintain it as your work evolves.
- **["Introducing Agent Skills"](https://claude.com/blog/skills) — Anthropic** — The next level of this idea. Skills let you package your instructions into reusable, portable capabilities that guide Claude's work. Think of them as micro operations manuals that can run automatically when relevant.