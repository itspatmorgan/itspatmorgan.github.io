# YouTube & Figma Slides Embed Support for Project Detail Pages

## Context

The portfolio site's project detail pages currently only support static hero images and inline markdown images. The live Framer site features YouTube video embeds and Figma Slides embeds on 4 of 5 projects. These are central to the storytelling — the YouTube videos are project presentations and the Figma Slides are interactive decks viewers can click through. Adding embed support is essential before launch.

## Approach: MDX with inline components

Embed components are used directly in `.mdx` content files, giving full control over where they appear in each project's narrative. The content collection already supports `.mdx` files — no infrastructure changes needed.

- **YouTube**: Use `astro-embed` package (148K+ downloads). Its `<YouTube>` component uses `lite-youtube-embed` — shows a thumbnail + play button, loads zero YouTube JS until user clicks. Privacy-enhanced mode built in.
- **Figma Slides**: Custom `FigmaEmbed.astro` component (no community package exists).

## Files to modify

| File | Change |
|------|--------|
| `package.json` | Add `astro-embed` dependency |
| `src/components/FigmaEmbed.astro` | **New** — Figma Slides iframe component |
| `src/styles/global.css` | Add styling for `lite-youtube` element to match site aesthetic |
| `src/content/projects/query-language.md` | **Rename to `.mdx`**, add embed components |
| `src/content/projects/expansion.md` | **Rename to `.mdx`**, add embed components |
| `src/content/projects/characters.md` | **Rename to `.mdx`**, add embed components |
| `src/content/projects/gpts.md` | **Rename to `.mdx`**, add embed components |

No changes to: `content.config.ts` (already accepts `.mdx`), `ProjectLayout.astro`, `[...slug].astro`, or `vision.md` (no embeds).

## Step 1: Install `astro-embed`

```bash
pnpm add astro-embed
```

## Step 2: Create `FigmaEmbed.astro`

**`src/components/FigmaEmbed.astro`**

Props:
- `src` — Pre-constructed Figma embed URL
- `title` — Accessible iframe title
- `caption?` — Optional caption text below embed

Styling:
- `aspect-ratio: 16/10` (standard slide ratio)
- `rounded-lg border border-border bg-card` (matches site image/card treatment)
- `overflow-hidden` for rounded corner clipping on iframe
- `loading="lazy"` (embeds are typically lower on page)
- Caption: `font-mono text-xs text-muted-foreground` centered below

## Step 3: Style YouTube embed

**`src/styles/global.css`** — Add styles targeting `lite-youtube` custom element:
- `rounded-lg border border-border overflow-hidden` to match the site's card/image aesthetic
- Ensure dark/light mode compatibility

## Step 4: Convert 4 project files to `.mdx` and add embeds

Rename `.md` → `.mdx`, add import lines and embed components at the appropriate positions.

**Content placement** (matching the live Framer site structure):
- YouTube embed goes after the opening blockquote (challenge statement), before the narrative sections
- Figma Slides embed goes at the end, after Project Details, in a "Slides" section

**Embed data** from `.reference/references/urls.md`:

| Project | YouTube ID | Figma Slides embed URL |
|---------|-----------|----------------------|
| query-language | `74FdNELZCKU` | `embed.figma.com/slides/UlMqhnukdHWCr2yrdVgcx2/Slides---J1-Query-Builder?node-id=12-921&embed-host=share` |
| expansion | `4Kp97t0rbLU` | `embed.figma.com/slides/JROpqyRbw3qVunUcfx5JHu/Slides---SigSci-Expansion?node-id=9-1239&embed-host=share` |
| characters | `DZ7Mf1qNa2c` | `embed.figma.com/slides/FDYHhdO6ZRWcfAjYPEtxBp/Slides---Claude-Characters?node-id=178-299&embed-host=share` |
| gpts | `ymcaXr5ZjjI` | `embed.figma.com/slides/ScIDMmUlqu0zY3LBn3NAil/Slides---GPT-Guides?node-id=17-141&embed-host=share` |

Example MDX usage in a project file:
```mdx
---
title: "Making a Complex Query Language Approachable"
# ... existing frontmatter unchanged
---

import { YouTube } from 'astro-embed';
import FigmaEmbed from '@/components/FigmaEmbed.astro';

> How might we help new users understand and leverage...

<YouTube id="74FdNELZCKU" />

## Challenge
...content...

## Project Details
...content...

## Slides

<FigmaEmbed
  src="https://embed.figma.com/slides/UlMqhnukdHWCr2yrdVgcx2/Slides---J1-Query-Builder?node-id=12-921&embed-host=share"
  title="Query Builder presentation slides"
  caption="You can click through the slides directly"
/>
```

## Verification

1. `pnpm dev` — visit all 5 project pages
2. Confirm YouTube embeds show thumbnail + play button on 4 projects; clicking loads the video
3. Confirm `vision.md` still renders correctly (unchanged, no embeds)
4. Confirm Figma Slides embeds load and are interactive
5. Test light + dark mode
6. Test responsive at mobile widths
7. `pnpm build` — no build errors

## Notes

- Figma embeds require files to have "Anyone with the link can view" sharing enabled
- YouTube loads zero JS until user clicks play (lite-youtube-embed)
- Embed components render inside `<div class="prose">` — styles may need `.prose lite-youtube` and `.prose .figma-embed` selectors to ensure proper spacing/width
- No CSP changes needed (GitHub Pages doesn't set restrictive frame-src headers)
