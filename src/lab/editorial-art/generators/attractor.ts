import { CANVAS_W, CANVAS_H, type StrangeAttractorConfig, type RenderContext } from '../themes';
import { makeRng } from './noise';

const W = CANVAS_W;
const H = CANVAS_H;
const ITERATIONS = 250_000;
const WARMUP     = 300;
const GRID       = 32;
const MIN_CELLS  = 120;

export interface AttractorData {
  xs: Float32Array;
  ys: Float32Array;
  count: number;
  // Pre-computed screen-space bounds for normalisation
  minX: number; maxX: number; minY: number; maxY: number;
}

function isRichAttractor(a: number, b: number, c: number, d: number): boolean {
  let x = 0.1, y = 0.2;
  const seen = new Uint8Array(GRID * GRID);
  let unique = 0;
  for (let i = 0; i < 2500; i++) {
    const nx = Math.sin(a*y) + c*Math.cos(a*x);
    const ny = Math.sin(b*x) + d*Math.cos(b*y);
    x = nx; y = ny;
    if (i > 100) {
      const gx = Math.floor((x+3)/6*GRID);
      const gy = Math.floor((y+3)/6*GRID);
      if (gx >= 0 && gx < GRID && gy >= 0 && gy < GRID) {
        const idx = gy*GRID + gx;
        if (!seen[idx]) { seen[idx] = 1; if (++unique >= MIN_CELLS) return true; }
      }
    }
  }
  return false;
}

function deriveParams(seed: number): [number, number, number, number] {
  const rng = makeRng(seed);
  const range = () => (rng() * 4 - 2);
  for (let attempt = 0; attempt < 200; attempt++) {
    const a = range(), b = range(), c = range(), d = range();
    if (isRichAttractor(a, b, c, d)) return [a, b, c, d];
  }
  return [-1.7, 1.3, -0.1, -1.2]; // known-good fallback
}

export function generateAttractor(cfg: StrangeAttractorConfig): AttractorData {
  const [a, b, c, d] = deriveParams(cfg.seed);
  const xs = new Float32Array(ITERATIONS);
  const ys = new Float32Array(ITERATIONS);
  let x = 0.1, y = 0.2;
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

  for (let i = 0; i < WARMUP; i++) {
    const nx = Math.sin(a*y) + c*Math.cos(a*x);
    const ny = Math.sin(b*x) + d*Math.cos(b*y);
    x = nx; y = ny;
  }
  for (let i = 0; i < ITERATIONS; i++) {
    const nx = Math.sin(a*y) + c*Math.cos(a*x);
    const ny = Math.sin(b*x) + d*Math.cos(b*y);
    x = nx; y = ny;
    xs[i] = x; ys[i] = y;
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  return { xs, ys, count: ITERATIONS, minX, maxX, minY, maxY };
}

const PAD = 0.07;

function toScreen(
  v: number, min: number, max: number, size: number,
): number {
  return ((v - min) / (max - min) * (1 - 2 * PAD) + PAD) * size;
}

// progress 0→1:
//   < 0.99 — plot raw points (fast, animatable)
//   ≥ 0.99 — density-map render (full quality)
export function drawAttractor(
  ctx: CanvasRenderingContext2D,
  data: AttractorData,
  color: string,
  opacity: number,
  w: number,
  h: number,
  render: RenderContext,
): void {
  const { xs, ys, count, minX, maxX, minY, maxY } = data;
  const maxA = (opacity / 100) * 0.92;

  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  const ambient = render.motion.mode === 'ambient';

  if (ambient) {
    const speed = render.motion.speed / 100;
    const intensity = Math.pow(render.motion.intensity / 100, 1.05);
    const time = render.time * (0.00005 + speed * 0.00017);
    const sampleCount = Math.min(count, Math.floor(70_000 + 110_000 * intensity));
    const start = Math.floor((time % 1) * count);
    const pointSize = Math.max(1, Math.round(Math.min(w, h) / CANVAS_H));

    ctx.save();
    ctx.fillStyle = color;
    ctx.globalCompositeOperation = 'lighter';

    for (let i = 0; i < sampleCount; i++) {
      const idx = (start + i) % count;
      const px = Math.floor(toScreen(xs[idx], minX, maxX, w));
      const py = Math.floor(toScreen(ys[idx], minY, maxY, h));
      if (px < 0 || px >= w || py < 0 || py >= h) continue;
      const local = i / sampleCount;
      const envelope = Math.sin(local * Math.PI);
      ctx.globalAlpha = Math.min(0.22, maxA * (0.035 + envelope * (0.08 + 0.14 * intensity)));
      ctx.fillRect(px, py, pointSize, pointSize);
    }

    ctx.restore();
    return;
  }

  const visibleCount = Math.floor(count * Math.min(render.progress, 1));

  // Accumulate density at logical resolution so richness is canvas-size-independent
  const logW = W;
  const logH = H;
  const density = new Uint32Array(logW * logH);
  let maxDensity = 0;

  for (let i = 0; i < visibleCount; i++) {
    const px = Math.floor(toScreen(xs[i], minX, maxX, logW));
    const py = Math.floor(toScreen(ys[i], minY, maxY, logH));
    if (px >= 0 && px < logW && py >= 0 && py < logH) {
      const idx = py * logW + px;
      const val = ++density[idx];
      if (val > maxDensity) maxDensity = val;
    }
  }

  const logMax = Math.log1p(maxDensity) || 1;
  const offscreen = new OffscreenCanvas(logW, logH);
  const offCtx = offscreen.getContext('2d') as OffscreenCanvasRenderingContext2D;
  const imageData = offCtx.createImageData(logW, logH);
  const pixels = imageData.data;

  for (let i = 0; i < logW * logH; i++) {
    if (!density[i]) continue;
    const t = Math.log1p(density[i]) / logMax;
    const px = i * 4;
    pixels[px]     = r;
    pixels[px + 1] = g;
    pixels[px + 2] = b;
    pixels[px + 3] = Math.round(t * maxA * 255);
  }
  offCtx.putImageData(imageData, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(offscreen, 0, 0, w, h);
}
