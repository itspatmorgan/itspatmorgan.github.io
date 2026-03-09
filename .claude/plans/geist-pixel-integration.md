# Geist Pixel Font Integration

**Issue:** #14 — Explore Geist Pixel font variant for texture

## Context

The site uses Geist Sans (body) and Geist Mono (labels). Vercel released Geist Pixel in Feb 2026 — a bitmap-inspired typeface with 5 variants (Square, Grid, Circle, Triangle, Line). It's free/open-source and shares DNA with Geist Sans.

The goal: use Geist Pixel in two strategic spots — the hero name and the closing CTA — to create a "pixel wave" transition that conveys Patrick's hybrid coder/designer identity. The pixel font represents the code self; the sans-serif represents the designer self.

**Key constraint:** Geist Pixel is NOT a variable font with animation axes. Smooth transitions require per-character dual-layer cross-dissolves (overlapping pixel + sans spans with opacity animation).

## Approach

### Split-flap entrance

Each character briefly cycles through random glyphs in pixel font (3 flips at 80ms each), then settles on the correct letter with a cross-dissolve from pixel to sans. Characters are staggered at 80ms offsets, creating a wave effect reminiscent of airport flip boards.

Each character has three layers:
1. **Spacer** (invisible, in-flow) — sets the wrapper size
2. **Pixel layer** (absolute, starts visible) — Geist Pixel Square
3. **Sans layer** (absolute, starts hidden) — Geist Sans

### Hover interaction (CTA only)

After the CTA split-flap resolves, hovering sends characters near the cursor back to pixel font using a proximity-based effect (120px radius). Characters smoothly blend between pixel and sans based on distance from the cursor.

### Choreographed hero entrance

All hero elements are individually timed for a cohesive sequence:

| Time | Element |
|---|---|
| 0ms | Photo springs in |
| 120ms | "Software Designer" label follows |
| 300ms | Name split-flap begins |
| 1200ms | Description enters (name mostly resolved) |
| 1350ms | Social icons follow |
| 1500ms | Below-fold sections fade in |

### Locations

| Location | Trigger | Interaction |
|---|---|---|
| Hero h1 "Patrick Morgan" | Page load (300ms delay) | Split-flap only |
| CTA "Let's craft a better future, together." | Scroll into view | Split-flap + hover |

## Script architecture

| File | Role |
|---|---|
| `src/scripts/home-animations.ts` | Orchestrator — choreographs hero entrance, section reveals, CTA |
| `src/scripts/pixel-wave.ts` | Split-flap animation (`pixelWave`) + hover interaction (`enablePixelHover`) |
| `src/scripts/scroll-entrance.ts` | Reusable scroll-triggered stagger (`observeSections`) |

## Files modified

| File | Change |
|---|---|
| `public/fonts/GeistPixel-Square.woff2` | Self-hosted font file (~28 KB) |
| `src/styles/global.css` | `@font-face` declaration + `--font-pixel` theme token + `.font-pixel` utility |
| `src/layouts/BaseLayout.astro` | Font preload `<link>` in `<head>` |
| `src/pages/index.astro` | Per-character dual-layer markup for hero + CTA, section entrance data attributes |
| `src/scripts/pixel-wave.ts` | New file — `pixelWave()` and `enablePixelHover()` |
| `src/scripts/scroll-entrance.ts` | New file — `observeSections()` |
| `src/scripts/home-animations.ts` | New file — animation orchestrator |

## Verification

1. `pnpm dev` — confirm font loads without console errors
2. Hero entrance — choreographed sequence: photo, label, split-flap name, description, icons
3. Below-fold sections hidden during hero, fade in after
4. Scroll to CTA — section fades in, split-flap sweeps across tagline
5. CTA hover — characters near cursor flip back to pixel font
6. Dark/light mode — both themes render correctly
7. Mobile viewport — animations work on small screens
