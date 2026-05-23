# Editorial Art Tool — Implementation Plan

## Context

Feature images for Writing section articles are currently Midjourney-generated collages. They're warm and editorial but manual, inconsistent in naming, and not reproducible. This tool replaces that workflow with a browser-based design tool that generates deterministic, on-brand PNGs from article metadata.

The output serves two surfaces: the personal website (`/writing/[slug]`, OG tags) and Unknown Arts Substack article headers. Both use the same 1200×630 format.

The tool itself is a portfolio artifact — it ships as a live page on the site (`/tools/editorial-art`) and will be documented as a project case study.

Related issue: [#40](https://github.com/itspatmorgan/itspatmorgan.github.io/issues/40)

---

## Brand foundation

Extracted directly from the site's existing design system:

**Color tokens (OKLCH):**
| Token | Value | Role |
|---|---|---|
| Cream | `oklch(0.98 0.004 80)` | Light background |
| Warm black | `oklch(0.14 0.01 60)` | Dark background |
| Copper accent | `oklch(0.72 0.10 75)` | UA brand color — used across all themes |
| Warm off-white | `oklch(0.92 0.01 80)` | Text on dark |
| Dark text | `oklch(0.15 0.01 60)` | Text on light |
| Muted | `oklch(0.50 0.01 60)` | Secondary labels |

**Fonts:**
- Geist Variable — article title (editorial weight)
- Geist Mono Variable — theme label, metadata (small caps, tracked)
- Geist Pixel Square — AI theme pattern layer (already in site)

**Textures:** `debut_light.png` + `debut_dark.png` already used in site cards — available as overlay layers.

**UA mark:** Two geometric SVG shapes — filled shield (U) + outlined equilateral triangle (A). Rendered inline as SVG, no image asset needed.

---

## Approach

### Architecture

A single React island (`client:only`) inside an Astro page at `/tools/editorial-art`. The tool is split into two panels:

- **Left panel** — controls (title input, theme, background, pattern, layers, export)
- **Right panel** — live canvas preview at 1200×630, scaled to fit viewport

Canvas is a styled `div` — no `<canvas>` element. Layers are stacked HTML/CSS/SVG. Export uses `html-to-image` to capture the canvas div at 2× pixel ratio, producing a 2400×1260px PNG (displayed at 1200×630).

### Layer model

Each layer is independently toggleable and has intensity controls:

```
5. UA mark          (SVG, corner-anchored, always on)
4. Type layer       (title + theme label; size/weight/position vary by composition)
3. Pattern layer    (SVG pattern per theme — see themes below)
2. Texture layer    (debut PNG overlay at variable opacity)
1. Background       (solid color — cream or warm black)
```

### The 5 themes

Theme presets define the default state of all controls. User can adjust any control after selecting a theme.

| Theme | Default bg | Pattern | Pattern accent | Geist Pixel? |
|---|---|---|---|---|
| **AI** | Dark (warm black) | Signal grid — binary character rain using Geist Pixel Square | Copper | Yes |
| **Design** | Light (cream) | Composition grid — golden ratio / rule-of-thirds lines | Copper | No |
| **Systems Thinking** | Dark (warm black) | Network — nodes + connector lines forming an abstract graph | Copper | No |
| **Creative Practice** | Light (cream) | Texture-forward — debut texture at high opacity, minimal geometry | Copper | No |
| **Career** | Light (cream) | Timeline — horizontal rule progression with milestone marks | Copper | No |

All themes use copper as the single brand accent. Variation comes from background, pattern style, and type composition — not separate accent colors.

### Controls (left panel)

```
Article title         [text input]
Filename slug         [auto-derived, editable]

Theme                 [AI | Design | Systems | Creative | Career]

Background            [Light | Dark]
Pattern style         [3–4 named variants per theme]
Pattern intensity     [Subtle | Medium | Bold]
Texture               [Off | Subtle | Heavy]
Grain                 [Off | Subtle | Heavy]
Composition           [Centered | Left-weighted | Offset]

─────────────────────
[Download PNG]
```

### Export

- `html-to-image` captures the canvas div at `pixelRatio: 2`
- Filename: `{slug}-feature.png`
- User manually places the file in `public/images/writing/{slug}/` and updates frontmatter

---

## Files to create

All tool assets live under `src/tools/editorial-art/` — self-contained, no collision risk with future tools.

```
src/
  pages/
    tools/
      editorial-art.astro       # Page shell, metadata, layout
  tools/
    editorial-art/
      index.tsx                 # Main React component — panel layout, state
      ArtCanvas.tsx             # The live canvas div — receives props, renders layers
      ControlPanel.tsx          # Left panel — all controls
      UAMark.tsx                # Inline SVG UA mark (shield + triangle)
      themes.ts                 # Theme config objects — defaults for all 5 themes
      patterns/
        SignalGrid.tsx          # AI — Geist Pixel character grid
        CompositionGrid.tsx     # Design — golden ratio / rule-of-thirds lines
        NetworkGraph.tsx        # Systems Thinking — nodes + connector edges
        TextureField.tsx        # Creative Practice — texture-forward layer
        Timeline.tsx            # Career — horizontal progression marks
```

## Files to modify

| File | Change |
|---|---|
| `src/content.config.ts` | Add optional `visualTheme` and `visualVariant` fields to writing schema |
| `src/data/site-config.ts` | Add tools nav entry if appropriate |

---

## Steps

### Phase 1 — Canvas foundation
1. Install `html-to-image` (`pnpm add html-to-image`)
2. Create `/tools/editorial-art` Astro page with basic layout
3. Build `ArtCanvas.tsx` — static 1200×630 div with correct aspect ratio and preview scaling
4. Build `UAMark.tsx` — SVG mark from geometric primitives, positioned bottom-right
5. Render canvas with background color + UA mark only — verify it looks right in browser

### Phase 2 — Type layer
6. Add title rendering to canvas — Geist Sans, large, positioned by composition prop
7. Add theme label — Geist Mono, small-caps, tracked, muted color
8. Test title wrapping, overflow, and size scaling for long titles

### Phase 3 — Pattern layers
9. Build `SignalGrid.tsx` (AI) — grid of Geist Pixel Square characters, opacity-faded
10. Build `CompositionGrid.tsx` (Design) — SVG lines at golden ratio breakpoints
11. Build `NetworkGraph.tsx` (Systems) — procedural nodes + edges using deterministic positions derived from title string
12. Build `TextureField.tsx` (Creative Practice) — debut texture at variable opacity, with subtle geometric accent
13. Build `Timeline.tsx` (Career) — horizontal rule with evenly-spaced tick marks

### Phase 4 — Theme configs + control panel
14. Write `themes.ts` — 5 config objects with all default values
15. Build `ControlPanel.tsx` — all controls wired to parent state
16. Connect theme selector to defaults (selecting a theme resets controls to that theme's defaults, then user can override)

### Phase 5 — Export + polish
17. Wire Download PNG button to `html-to-image` capture
18. Test export quality across all 5 themes — check font rendering, pattern sharpness
19. Add grain layer (CSS SVG filter `feTurbulence` on a `::after` overlay)
20. Final visual pass — spacing, type sizing, mark sizing across all themes

### Phase 6 — Content integration
21. Update `src/content.config.ts` with optional `visualTheme`/`visualVariant` fields
22. Generate feature images for all 14 existing articles, one theme at a time
23. Move generated PNGs to `public/images/writing/{slug}/feature.png`
24. Update all article frontmatter `image:` fields to new paths
25. Remove old flat images from `public/images/writing/`

---

## Verification

- [ ] Tool loads at `/tools/editorial-art` without errors
- [ ] All 5 theme presets render distinctly and on-brand
- [ ] Title input updates canvas in real time
- [ ] Long titles (50+ chars) wrap gracefully without breaking layout
- [ ] Download PNG produces a 2400×1260 file (2× of 1200×630)
- [ ] Fonts render correctly in exported PNG (Geist, Geist Mono, Geist Pixel)
- [ ] UA mark is visible and correctly proportioned in all exports
- [ ] Images work in website writing cards and article hero positions
- [ ] At least one image tested as a Substack article header

---

## Future phases (out of scope for now)

- OG image variant (same tool, different crop/composition)
- Substack-specific size variant (if needed)
- Pattern variants beyond the first per theme
- Noise/displacement SVG filter layers
- Deploy tool to a public URL for sharing
