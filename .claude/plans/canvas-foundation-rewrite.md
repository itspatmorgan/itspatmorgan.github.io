# Canvas Foundation Rewrite

## Context

The generative foundations are currently SVG-in-React components. This makes them static (no animation), fragile for color mode switching (two-canvas CSS hack), and hard to reuse as textures. The goal is to port all rendering to imperative canvas with a RAF animation loop, enabling draw-in animation on load and clean reuse anywhere on the site.

Key insight: `Path2D` accepts SVG path strings directly, so FlowField, Isoline, and Voronoi can move to canvas with almost no change to their generation math — only the render output changes.

## Approach

Separate data generation (pure math → typed data) from rendering (canvas draw calls). Add a `useGenerativeCanvas` hook that owns the RAF loop, color mode, and resize. A thin `GenerativeCanvas` component wraps the hook for use anywhere. The tool's `ArtCanvas` becomes a composed view on top of the same canvas primitive.

Each chunk is independently shippable and testable.

## New file structure

```
src/tools/editorial-art/
  foundations/
    flowField.ts        ← replaces FlowField.tsx (generate + draw)
    dotGrid.ts          ← replaces DotGrid.tsx
    isoline.ts          ← replaces Isoline.tsx
    voronoi.ts          ← replaces Voronoi.tsx
    attractor.ts        ← replaces StrangeAttractor.tsx
    noise.ts            ← unchanged
  useGenerativeCanvas.ts  ← new RAF + color mode hook
  GenerativeCanvas.tsx    ← new reusable component
  ArtCanvas.tsx           ← updated: canvas + overlays
  LiveEditorialVisual.tsx ← simplified wrapper
  index.tsx               ← tool UI (updated export path)
  themes.ts               ← unchanged
```

Each foundation file exports:
- `generate(config): Data` — pure function, deterministic, no React
- `draw(ctx, data, color, opacity, w, h, progress): void` — draws to canvas at progress [0, 1]

---

## Chunk 1 — Extract pure data generators

**Goal:** Each foundation has a typed `generate()` function in its own `.ts` file. No React, no SVG, no rendering. The SVG components continue to work unchanged (they call the same logic internally).

### Files

| File | Change |
|---|---|
| `foundations/flowField.ts` | New — exports `generateFlowField(config): FlowFieldPath[]` |
| `foundations/dotGrid.ts` | New — exports `generateDotGrid(config): Dot[]` |
| `foundations/isoline.ts` | New — exports `generateIsolines(config): string[]` |
| `foundations/voronoi.ts` | New — exports `generateVoronoi(config): string` |
| `foundations/attractor.ts` | New — exports `generateAttractor(config): AttractorPoints` |
| `foundations/FlowField.tsx` | Updated — calls `generateFlowField` from new file |
| `foundations/DotGrid.tsx` | Updated — calls `generateDotGrid` from new file |
| `foundations/Isoline.tsx` | Updated — calls `generateIsolines` from new file |
| `foundations/Voronoi.tsx` | Updated — calls `generateVoronoi` from new file |
| `foundations/StrangeAttractor.tsx` | Updated — calls `generateAttractor` from new file |

### Data types

```ts
// flowField.ts
export interface FlowPath { points: [number, number][] }

// dotGrid.ts
export interface Dot { cx: number; cy: number; r: number }

// isoline.ts — string[] (SVG path strings, usable by Path2D)

// voronoi.ts — string (one SVG path string)

// attractor.ts
export interface AttractorPoints { xs: Float32Array; ys: Float32Array; count: number }
```

### Verification
- `pnpm build` passes (no regressions)
- Tool still works in browser

---

## Chunk 2 — Canvas draw functions (full render, progress=1)

**Goal:** Each foundation can draw itself onto a `CanvasRenderingContext2D`. No animation yet — progress defaults to 1 (fully drawn). Add `draw()` export to each new `.ts` file.

### Draw function signatures

```ts
// flowField.ts
export function drawFlowField(
  ctx: CanvasRenderingContext2D,
  paths: FlowPath[],
  color: string, opacity: number, strokeWidth: number,
  w: number, h: number, progress?: number
): void

// dotGrid.ts
export function drawDotGrid(
  ctx: CanvasRenderingContext2D,
  dots: Dot[],
  color: string, opacity: number,
  w: number, h: number, progress?: number
): void

// isoline.ts — uses Path2D(svgString) — almost no new code
// voronoi.ts — uses Path2D(svgString) — almost no new code
// attractor.ts — port existing canvas logic from StrangeAttractor.tsx
```

### Verification
- Add a temporary `<canvas>` to one article page or the tool, call `draw()` directly, confirm it matches the SVG output visually
- Remove temp code before committing

---

## Chunk 3 — `useGenerativeCanvas` hook (static, no animation)

**Goal:** A React hook that owns a `<canvas>` element, generates data on mount/config change, draws once (progress=1), handles color mode changes, and handles container resize.

```ts
// useGenerativeCanvas.ts
export function useGenerativeCanvas(
  config: FoundationConfig,
  bgColor: string,
  opts?: { animate?: boolean }
): { canvasRef: React.RefObject<HTMLCanvasElement>; isDark: boolean }
```

Internals:
- `useState(() => readIsDark())` for initial color mode (same guard as before)
- `MutationObserver` on `document.documentElement` to track mode changes
- `ResizeObserver` on the canvas parent to handle size changes
- `useMemo` to regenerate data only when shape-defining config params change
- Calls `drawXxx(ctx, data, color, opacity, w, h, 1)` on every relevant change

### Verification
- Create a minimal test page or use the tool page to confirm the hook renders correctly
- Resize the window — canvas should redraw cleanly
- Toggle dark mode — canvas should switch colors instantly

---

## Chunk 4 — `GenerativeCanvas` component + wire into article hero

**Goal:** A reusable component that fills its container. Swap it into `LiveEditorialVisual`. This is the first chunk that changes visible behavior.

```tsx
// GenerativeCanvas.tsx
export function GenerativeCanvas({
  config,
  bgColor,
  animate,
}: {
  config: FoundationConfig;
  bgColor: string;
  animate?: boolean;
}) {
  const { canvasRef } = useGenerativeCanvas(config, bgColor, { animate });
  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  );
}
```

`LiveEditorialVisual` becomes:

```tsx
export function LiveEditorialVisual({ visual }: Props) {
  const [isDark, setIsDark] = useState(readIsDark);
  // MutationObserver to track mode changes
  const foundation = { ...visual.generator, color: isDark ? 'copper' : 'bronze' };
  return (
    <GenerativeCanvas
      config={foundation as FoundationConfig}
      bgColor={isDark ? brand.warmDarkGray : brand.paper}
      animate
    />
  );
}
```

### Verification
- Load an article page — canvas renders correctly in light and dark mode
- No flash on load or mode switch
- `pnpm build` passes

---

## Chunk 5 — Draw-in animation

**Goal:** Add an RAF loop to `useGenerativeCanvas` that increments progress 0→1 on initial draw. Each draw function's `progress` parameter controls how much is drawn.

### Progress semantics per foundation

| Foundation | progress behavior |
|---|---|
| Flow Field | Each particle traces `progress * steps` steps along its path |
| Dot Grid | First `progress * dots.length` dots visible, each at full radius |
| Isoline | First `progress * levels` contour lines visible |
| Voronoi | Edge segments drawn up to `progress` fraction of total count |
| Attractor | First `progress * count` points drawn |

### Animation curve

Use an ease-out curve so the drawing starts fast and settles:
```ts
const eased = 1 - Math.pow(1 - progress, 2); // ease-out quad
```

Total draw duration: ~1200ms. Respects `prefers-reduced-motion` (skips to progress=1 immediately).

### Hook update

```ts
// Inside useGenerativeCanvas, when animate=true:
const progressRef = useRef(0);
// RAF loop increments progressRef, calls drawXxx, stops at 1
```

### Verification
- Each foundation animates correctly on article page load
- Reduced motion users see the completed visual immediately
- Re-navigating to an article restarts the animation

---

## Chunk 6 — Update editorial art tool

**Goal:** The tool's `ArtCanvas` uses `GenerativeCanvas` internally instead of SVG components. Export switches from `html-to-image` to the native canvas API.

### Changes

| File | Change |
|---|---|
| `ArtCanvas.tsx` | Replace SVG foundation components with `<GenerativeCanvas animate={false} />`. Keep grain/texture/text as CSS/HTML overlays on top. |
| `index.tsx` (tool) | Replace `toPng` from `html-to-image` with canvas `.toBlob()` export. The canvas ref is now obtained from `GenerativeCanvas` via a forwarded ref or callback. |
| `package.json` | Remove `html-to-image` |

### Export approach

`ArtCanvas` is a positioned container. `GenerativeCanvas` fills it. The text + grain + texture layers are HTML divs positioned on top. For export, use `html-to-image` on the whole container as before — OR, since we now have a real canvas, render everything (background, foundation, overlays) onto an offscreen canvas for clean export. Decide based on complexity.

### Verification
- Tool renders all 5 foundations correctly
- Slider adjustments update the canvas (no animation, instant redraw)
- Download PNG produces correct output
- `pnpm build` passes

---

## Chunk 7 — Cleanup

**Goal:** Remove dead code.

- Delete `foundations/FlowField.tsx`, `DotGrid.tsx`, `Isoline.tsx`, `Voronoi.tsx`, `StrangeAttractor.tsx`
- Remove `html-to-image` from `package.json` (if replaced in chunk 6)
- Remove any unused React imports from foundation files
- `pnpm build` passes with no dead-code warnings

---

## Verification (end-to-end)

- All 5 foundations render in both article hero and editorial art tool
- Dark/light mode switching is instant with no flash
- Draw-in animation plays on article page load
- Reduced motion: static render immediately
- Export (PNG download) from tool works
- `pnpm build` passes
- No regressions on writing index or home page
