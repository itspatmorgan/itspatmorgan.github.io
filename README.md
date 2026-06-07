# itspatmorgan.github.io

Personal portfolio site for Patrick Morgan, built with [Astro](https://astro.build), Tailwind CSS, and shadcn/ui.

This repository contains the source for [itspatmorgan.github.io](https://itspatmorgan.github.io): a warm, minimal, editorial portfolio for product, design, technology, writing, and lab work.

## Start here

- [System map](agent-os/system-map.md) explains how the project is structured, how content works, and how to verify changes.
- [Agent instructions](AGENTS.md) are the shared working guide for Codex, Claude, and other coding agents.
- [Agent OS](agent-os/README.md) contains strategy, plans, and learnings for AI-assisted work on the project.
- [Project board](https://github.com/users/itspatmorgan/projects/2) and [issues](https://github.com/itspatmorgan/itspatmorgan.github.io/issues) track planned and active work.

## Local development

Prerequisites:

- Node.js 20+
- pnpm 10+

Recommended local location:

```text
~/Developer/personal/itspatmorgan.github.io
```

This repo includes a `.mise.toml` for local tool versions. If you use
[mise](https://mise.jdx.dev/), run:

```bash
mise trust
mise install
```

```bash
pnpm install
pnpm dev
```

The dev server runs at `http://localhost:4321`.

Writing sync requires `OBSIDIAN_VAULT` in your shell or in local `.env.local`.

For build, sync, deployment, content, and architecture details, use the [system map](agent-os/system-map.md).
