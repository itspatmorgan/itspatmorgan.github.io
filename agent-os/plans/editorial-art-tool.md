# Editorial Art Tool — Implementation Plan

## Context

Feature images for Writing section articles are currently Midjourney-generated collages. They're warm and editorial but manual, inconsistent in naming, and not reproducible. This tool starts replacing that workflow with a browser-based design tool that generates deterministic, on-brand PNGs.

The output serves two surfaces: the personal website (`/writing/[slug]`, OG tags) and Unknown Arts Substack article headers. Both use the same 1200×630 format.

The tool itself is a portfolio artifact — it ships as a live page on the site (`/tools/editorial-art`) and will be documented as a project case study.

Related issue: [#40](https://github.com/itspatmorgan/itspatmorgan.github.io/issues/40)

---

## Brand foundation

Grounded in the exact Unknown Arts brand colors, with supporting neutrals drawn from the reference collage imagery:

**Color tokens:**
| Token | Value | Role |
|---|---|---|
| Champagne light | `#F7CCAB` | Primary brand accent, UA mark, active control ring |
| Champagne bronze | `#B38B6D` | Secondary brand surface / warmer image-reference tone |
| Warm dark gray | `#171716` | Dark background and text on light |
| Paper | `#faf8f4` | Light background |
| Warm off-white | `#ede9e3` | Text on dark |
| Sage gray | `#8b9690` | Supporting reference-image tone |
| Weathered stone | `#6f6860` | Muted layer / supporting reference-image tone |

**Fonts:**
- Geist Variable — article title (editorial weight)
- Geist Mono Variable — theme label, metadata (small caps, tracked)
- Geist Pixel Square — available for future layer options if needed

**Textures:** `debut_light.png` + `debut_dark.png` already used in site cards — available as overlay layers.

**UA mark:** Two geometric SVG shapes — filled shield (U) + outlined equilateral triangle (A). Rendered inline as SVG, no image asset needed.

---

## Approach

### Architecture

A single React island (`client:only`) inside an Astro page at `/tools/editorial-art`. The tool is split into two panels:

- **Left panel** — controls (title input, theme, background, generative foundation, layer options, export)
- **Right panel** — live canvas preview at 1200×630, scaled to fit viewport

Canvas is a styled `div` — no `<canvas>` element. Layers are stacked HTML/CSS/SVG. Export uses `html-to-image` to capture the canvas div at 2× pixel ratio, producing a 2400×1260px PNG (displayed at 1200×630).

### Layer model

Each layer is independently toggleable and has intensity controls:

```
5. UA mark               (SVG, corner-anchored, always on)
4. Type layer            (title + theme label; size/weight/position vary by composition)
3. Layerable options     (texture, grain, overlays, masks, and future motif layers)
2. Generative foundation (flow field now; isolines, attractors, Voronoi, etc. later)
1. Background            (solid color — cream or warm black)
```

### The 5 themes

Theme presets define the default state of all controls. User can adjust any control after selecting a theme.

| Theme | Default bg | Generative direction | Accent |
|---|---|---|---|
| **AI** | Dark (warm black) | Dense computational motion, signal-like structure | Copper |
| **Design** | Light (cream) | Cleaner fields, more open negative space | Copper / muted |
| **Systems Thinking** | Dark (warm black) | Denser, networked, higher-interaction fields | Copper |
| **Creative Practice** | Light (cream) | Texture-forward, warmer, more organic movement | Copper |
| **Career** | Light (cream) | Restrained, directional, quieter compositions | Dark / muted |

All themes use the same brand palette. Variation comes from foundation parameters, background, layer options, and type composition, not one-off static pattern components.

### Controls (left panel)

```
Article title         [text input]
Filename slug         [auto-derived, editable]

Theme                 [AI | Design | Systems | Creative | Career]

Background            [Light | Dark]
Foundation            [Flow field now; more foundations later]
Foundation controls   [Seed, density, steps, scale, curl, stroke, opacity]
Layer options         [Texture/grain now; more overlays later]
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
      UAMark.tsx                # Inline SVG UA mark (shield + triangle)
      themes.ts                 # Theme config objects — defaults for all 5 themes
      foundations/
        FlowField.tsx           # Current generative foundation
```

## Files to modify

| File | Change |
|---|---|
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

### Phase 3 — Generative foundation
9. Build `FlowField.tsx` — seeded particle paths through a deterministic noise field
10. Wire theme defaults to flow-field parameters
11. Add controls for seed, density, steps, scale, curl, stroke, color, and opacity
12. Keep additional visual treatment as layer options that can stack with any foundation

### Phase 4 — Theme configs + control panel
13. Write `themes.ts` — 5 config objects with all default values
14. Build the left control panel — all controls wired to parent state
15. Connect theme selector to defaults (selecting a theme resets controls to that theme's defaults, then user can override)

### Phase 5 — Export + polish
16. Wire Download PNG button to `html-to-image` capture
17. Test export quality across all 5 themes — check font rendering, texture rendering, and mark sizing
18. Add more layer options only when they work across foundations
19. Final visual pass — spacing, type sizing, mark sizing across all themes

---

## Verification

- [ ] Tool loads at `/tools/editorial-art` without errors
- [ ] All 5 theme presets render distinct flow-field defaults
- [ ] Title input updates canvas in real time
- [ ] Long titles (50+ chars) wrap gracefully without breaking layout
- [ ] Download PNG produces a 2400×1260 file (2× of 1200×630)
- [ ] Fonts render correctly in exported PNG (Geist, Geist Mono)
- [ ] UA mark is visible and correctly proportioned in all exports

---

## Future phases (out of scope for now)

- OG image variant (same tool, different crop/composition)
- Substack-specific size variant (if needed)
- Content/frontmatter integration for generated writing images
- More generative foundations: isolines, strange attractors, Voronoi
- Layerable options: masks, line overlays, annotation marks, metadata labels
- Noise/displacement SVG filter layers
- Deploy tool to a public URL for sharing
