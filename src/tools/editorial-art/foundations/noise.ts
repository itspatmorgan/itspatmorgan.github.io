// Shared deterministic noise and RNG utilities for generative foundations

function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a: number, b: number, t: number): number {
  return a + t * (b - a);
}

function hash(ix: number, iy: number, seed: number): number {
  const n = Math.sin(ix * 127.1 + iy * 311.7 + seed * 74.3) * 43758.5453;
  return n - Math.floor(n);
}

// Smooth value noise → [0, 1)
export function noise(x: number, y: number, seed: number): number {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = fade(x - xi), yf = fade(y - yi);
  return lerp(
    lerp(hash(xi, yi, seed),     hash(xi + 1, yi, seed),     xf),
    lerp(hash(xi, yi + 1, seed), hash(xi + 1, yi + 1, seed), xf),
    yf,
  );
}

// Seeded LCG RNG → [0, 1)
export function makeRng(seed: number): () => number {
  let s = ((seed * 1664525 + 1013904223) >>> 0);
  return (): number => {
    s = ((s * 1664525 + 1013904223) >>> 0);
    return s / 0x100000000;
  };
}
