import { useEffect, useRef, useState } from 'react';
import { CANVAS_W, CANVAS_H, resolveLayerColor, type StrangeAttractorConfig } from '../themes';
import { makeRng } from './noise';

const W = CANVAS_W;
const H = CANVAS_H;
const ITERATIONS = 250_000;
const WARMUP     = 300;

// ── Parameter derivation ──────────────────────────────────────────────────────
// Clifford attractor: x' = sin(a·y) + c·cos(a·x)
//                    y' = sin(b·x) + d·cos(b·y)
//
// Bad parameter sets produce fixed points or small limit cycles — a handful of
// distinct points that look blank on canvas. We detect this by mapping a short
// trial trajectory onto a 32×32 grid and requiring at least 120 distinct cells
// to be visited (≈12% coverage). This catches both fixed points AND orbits that
// have spread but repeat the same few locations.

const GRID = 32;
const GRID_CELLS = GRID * GRID;
const MIN_CELLS  = 120; // need ≥120/1024 grid cells for a visually rich orbit

function isRichAttractor(a: number, b: number, c: number, d: number): boolean {
  let x = 0.1, y = 0.2;
  const seen = new Uint8Array(GRID_CELLS);
  let uniqueCells = 0;

  for (let i = 0; i < 2500; i++) {
    const nx = Math.sin(a * y) + c * Math.cos(a * x);
    const ny = Math.sin(b * x) + d * Math.cos(b * y);
    x = nx; y = ny;

    if (i > 100) {
      // Clifford outputs are bounded within roughly ±3
      const gx = Math.floor((x + 3) / 6 * GRID);
      const gy = Math.floor((y + 3) / 6 * GRID);
      if (gx >= 0 && gx < GRID && gy >= 0 && gy < GRID) {
        const idx = gy * GRID + gx;
        if (seen[idx] === 0) {
          seen[idx] = 1;
          uniqueCells++;
          if (uniqueCells >= MIN_CELLS) return true; // early exit
        }
      }
    }
  }

  return false;
}

function cliffordParams(seed: number): [number, number, number, number] {
  // Try up to 20 seed offsets — each costs ~0.2ms (2500 iterations of trig)
  for (let attempt = 0; attempt < 20; attempt++) {
    const rng = makeRng(seed * 2053 + 7919 + attempt * 31337);
    const a = rng() * 3.6 - 1.8;
    const b = rng() * 3.6 - 1.8;
    const c = rng() * 3.6 - 1.8;
    const d = rng() * 3.6 - 1.8;
    if (isRichAttractor(a, b, c, d)) return [a, b, c, d];
  }
  // Fallback: known-good classic Clifford parameters
  return [-1.4, 1.6, 1.0, 0.7];
}

// ── Density map ───────────────────────────────────────────────────────────────

interface DensityResult {
  density: Uint32Array;
  maxDensity: number;
}

function computeDensity(seed: number): DensityResult {
  const [a, b, c, d] = cliffordParams(seed);
  const PAD = 0.07;

  // Pass 1 — find bounding box
  let x = 0.1, y = 0.2;
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;

  for (let i = 0; i < ITERATIONS + WARMUP; i++) {
    const nx = Math.sin(a * y) + c * Math.cos(a * x);
    const ny = Math.sin(b * x) + d * Math.cos(b * y);
    x = nx; y = ny;
    if (i >= WARMUP) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;

  // Pass 2 — fill density grid
  const density = new Uint32Array(W * H);
  x = 0.1; y = 0.2;
  let maxDensity = 0;

  for (let i = 0; i < ITERATIONS + WARMUP; i++) {
    const nx = Math.sin(a * y) + c * Math.cos(a * x);
    const ny = Math.sin(b * x) + d * Math.cos(b * y);
    x = nx; y = ny;

    if (i >= WARMUP) {
      const cx = Math.floor(((x - minX) / rangeX * (1 - 2 * PAD) + PAD) * W);
      const cy = Math.floor(((y - minY) / rangeY * (1 - 2 * PAD) + PAD) * H);
      if (cx >= 0 && cx < W && cy >= 0 && cy < H) {
        const idx = cy * W + cx;
        const val = ++density[idx];
        if (val > maxDensity) maxDensity = val;
      }
    }
  }

  return { density, maxDensity };
}

// ── Component ─────────────────────────────────────────────────────────────────

export function StrangeAttractor(cfg: StrangeAttractorConfig) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Compute after paint (not during render) so the synchronous heavy work
  // doesn't freeze React's scheduler and corrupt other foundation switches.
  const [result, setResult] = useState<DensityResult | null>(null);

  useEffect(() => {
    let cancelled = false;
    const r = computeDensity(cfg.seed);
    if (!cancelled) setResult(r);
    return () => { cancelled = true; };
  }, [cfg.seed]);

  // Draw whenever result or visual params change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);
    if (!result || result.maxDensity === 0) return;

    const hex    = resolveLayerColor(cfg.color);
    const r      = parseInt(hex.slice(1, 3), 16);
    const g      = parseInt(hex.slice(3, 5), 16);
    const b      = parseInt(hex.slice(5, 7), 16);
    const maxA   = (cfg.opacity / 100) * 0.92;
    const logMax = Math.log1p(result.maxDensity) || 1;

    const imageData = ctx.createImageData(W, H);
    const data      = imageData.data;

    for (let i = 0; i < W * H; i++) {
      const count = result.density[i];
      if (count === 0) continue;

      const t     = Math.log1p(count) / logMax;
      const alpha = Math.round(t * maxA * 255);

      const px = i * 4;
      data[px]     = r;
      data[px + 1] = g;
      data[px + 2] = b;
      data[px + 3] = alpha;
    }

    ctx.putImageData(imageData, 0, 0);
  }, [result, cfg.color, cfg.opacity]);

  return (
    <canvas
      ref={canvasRef}
      width={W}
      height={H}
      style={{ position: 'absolute', inset: 0 }}
    />
  );
}
