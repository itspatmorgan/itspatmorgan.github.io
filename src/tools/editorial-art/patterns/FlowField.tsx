import { useMemo } from 'react';
import { CANVAS_W, CANVAS_H, resolveLayerColor, type FlowFieldConfig } from '../themes';

const W = CANVAS_W;
const H = CANVAS_H;
const STEP_PX = 4; // fixed world-space step per iteration

// ── Noise ─────────────────────────────────────────────────────────────────────

function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a: number, b: number, t: number): number {
  return a + t * (b - a);
}

// Deterministic hash → [0, 1)
function hash(ix: number, iy: number, seed: number): number {
  const n = Math.sin(ix * 127.1 + iy * 311.7 + seed * 74.3) * 43758.5453;
  return n - Math.floor(n);
}

// Smooth value noise [0, 1)
function noise(x: number, y: number, seed: number): number {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = fade(x - xi), yf = fade(y - yi);
  return lerp(
    lerp(hash(xi, yi, seed),     hash(xi + 1, yi, seed),     xf),
    lerp(hash(xi, yi + 1, seed), hash(xi + 1, yi + 1, seed), xf),
    yf,
  );
}

// ── Seeded RNG ─────────────────────────────────────────────────────────────────

function makeRng(seed: number) {
  let s = ((seed * 1664525 + 1013904223) >>> 0);
  return (): number => {
    s = ((s * 1664525 + 1013904223) >>> 0);
    return s / 0x100000000;
  };
}

// ── Path generation ───────────────────────────────────────────────────────────

function generatePaths(cfg: FlowFieldConfig): string[] {
  const { seed, density, steps, scale, curl } = cfg;
  const curlRad = (curl * Math.PI) / 180;
  const rng = makeRng(seed);
  const paths: string[] = [];

  for (let i = 0; i < density; i++) {
    let x = rng() * W;
    let y = rng() * H;
    const pts: string[] = [`M ${x.toFixed(1)},${y.toFixed(1)}`];

    for (let s = 0; s < steps; s++) {
      const angle = noise(x / scale, y / scale, seed) * Math.PI * 4 + curlRad;
      x += Math.cos(angle) * STEP_PX;
      y += Math.sin(angle) * STEP_PX;
      if (x < -20 || x > W + 20 || y < -20 || y > H + 20) break;
      pts.push(`L ${x.toFixed(1)},${y.toFixed(1)}`);
    }

    if (pts.length > 2) paths.push(pts.join(' '));
  }

  return paths;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function FlowField(cfg: FlowFieldConfig) {
  const paths = useMemo(
    () => generatePaths(cfg),
    // regenerate only when the field-shaping params change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cfg.seed, cfg.density, cfg.steps, cfg.scale, cfg.curl],
  );

  const strokeColor = resolveLayerColor(cfg.color);
  const opacity = (cfg.opacity / 100) * 0.65;

  return (
    <svg
      style={{ position: 'absolute', inset: 0 }}
      width={W} height={H}
      viewBox={`0 0 ${W} ${H}`}
    >
      <g
        stroke={strokeColor}
        fill="none"
        strokeWidth={cfg.strokeWidth}
        opacity={opacity}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {paths.map((d, i) => <path key={i} d={d} />)}
      </g>
    </svg>
  );
}
