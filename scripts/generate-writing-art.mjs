/**
 * Generate deterministic editorial feature images for writing articles.
 *
 * Run from the repo root:
 *   node scripts/generate-writing-art.mjs [--slug article-slug] [--dry-run] [--overwrite-visual] [--overwrite-image]
 *
 * The website repo owns `visual` and generated `image` frontmatter. Obsidian
 * sync preserves those fields, but does not need to carry them in draft notes.
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import sharp from 'sharp';
import YAML from 'yaml';

const CLI = parseArgs(process.argv.slice(2));
const DRY_RUN = CLI.flags.has('dry-run');
const OVERWRITE_VISUAL = CLI.flags.has('overwrite-visual');
const OVERWRITE_IMAGE = CLI.flags.has('overwrite-image');
const TARGET_SLUG = CLI.options.slug;

const WRITING_DIR = resolve('src/content/writing');
const IMAGE_ROOT = resolve('public/images/writing');
const W = 1200;
const H = 630;
const STEP_PX = 4;

const brand = {
  paper: '#faf8f4',
  champagneLight: '#f7ccab',
  champagneBronze: '#b38b6d',
  warmDarkGray: '#171716',
  offWhite: '#ede9e3',
  sageGray: '#8b9690',
  weatheredStone: '#6f6860',
};

const themeDefaults = {
  AI: {
    seedOffset: 42,
    visual: { theme: 'AI', background: 'warm-dark-gray', generator: { type: 'strange-attractor', seed: 42, opacity: 85, color: 'copper' }, texture: 20, grain: 24 },
  },
  Design: {
    seedOffset: 137,
    visual: { theme: 'Design', background: 'warm-dark-gray', generator: { type: 'isoline', seed: 137, levels: 12, scale: 350, strokeWidth: 0.7, opacity: 75, color: 'copper' }, texture: 0, grain: 24 },
  },
  'Systems Thinking': {
    seedOffset: 73,
    visual: { theme: 'Systems Thinking', background: 'warm-dark-gray', generator: { type: 'voronoi', seed: 73, count: 60, jitter: 60, strokeWidth: 0.6, opacity: 75, color: 'copper' }, texture: 0, grain: 24 },
  },
  'Creative Practice': {
    seedOffset: 256,
    visual: { theme: 'Creative Practice', background: 'warm-dark-gray', generator: { type: 'flow-field', seed: 256, density: 150, steps: 100, scale: 320, curl: 30, strokeWidth: 1.0, opacity: 75, color: 'copper' }, texture: 20, grain: 24 },
  },
  Career: {
    seedOffset: 512,
    visual: { theme: 'Career', background: 'warm-dark-gray', generator: { type: 'dot-grid', seed: 512, spacing: 22, scale: 300, dotSize: 70, opacity: 70, color: 'copper' }, texture: 0, grain: 24 },
  },
  default: {
    seedOffset: 256,
    visual: { theme: 'default', background: 'warm-dark-gray', generator: { type: 'flow-field', seed: 256, density: 150, steps: 100, scale: 320, curl: 30, strokeWidth: 1.0, opacity: 75, color: 'copper' }, texture: 20, grain: 24 },
  },
};

let updated = 0;
let generated = 0;
let skipped = 0;
let errors = 0;

function parseArgs(argv) {
  const flags = new Set();
  const options = {};

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--') continue;
    if (!arg.startsWith('--')) continue;

    const [rawKey, inlineValue] = arg.slice(2).split(/=(.*)/s);
    if (inlineValue !== undefined) {
      options[rawKey] = inlineValue;
      continue;
    }

    const next = argv[i + 1];
    if (next && !next.startsWith('--')) {
      options[rawKey] = next;
      i++;
    } else {
      flags.add(rawKey);
    }
  }

  return { flags, options };
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return null;
  return { raw: match[1], body: match[2] };
}

function serializeFrontmatter(fields) {
  const order = [
    'title', 'description', 'publishedDate', 'categories', 'theme', 'tags',
    'visual', 'image', 'canonicalUrl', 'draft',
  ];
  const lines = [];

  for (const key of order) {
    if (fields[key] !== undefined) appendField(lines, key, fields[key]);
  }
  for (const [key, value] of Object.entries(fields)) {
    if (!order.includes(key)) appendField(lines, key, value);
  }

  return lines.join('\n');
}

function appendField(lines, key, value) {
  if (value === '' || value === null || value === undefined) return;

  if (Array.isArray(value)) {
    if (value.length === 0) {
      lines.push(`${key}: []`);
      return;
    }
    lines.push(`${key}:`);
    for (const item of value) lines.push(`  - ${item}`);
    return;
  }

  if (typeof value === 'object') {
    lines.push(`${key}:`);
    const nested = YAML.stringify(value, { lineWidth: 0 }).trimEnd();
    for (const line of nested.split('\n')) lines.push(`  ${line}`);
    return;
  }

  if (typeof value === 'boolean') {
    lines.push(`${key}: ${value}`);
    return;
  }

  const stringValue = String(value);
  const needsQuotes = /[:#\[\]{}&*!|>'"%@`]/.test(stringValue) || stringValue.startsWith(' ');
  lines.push(`${key}: ${needsQuotes ? `"${stringValue.replace(/"/g, '\\"')}"` : stringValue}`);
}

function slugSeed(slug) {
  let hash = 2166136261;
  for (const char of slug) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash) % 999 + 1;
}

function makeRng(seed) {
  let s = ((seed * 1664525 + 1013904223) >>> 0);
  return () => {
    s = ((s * 1664525 + 1013904223) >>> 0);
    return s / 0x100000000;
  };
}

function fade(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a, b, t) {
  return a + t * (b - a);
}

function hash(ix, iy, seed) {
  const n = Math.sin(ix * 127.1 + iy * 311.7 + seed * 74.3) * 43758.5453;
  return n - Math.floor(n);
}

function noise(x, y, seed) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = fade(x - xi);
  const yf = fade(y - yi);
  return lerp(
    lerp(hash(xi, yi, seed), hash(xi + 1, yi, seed), xf),
    lerp(hash(xi, yi + 1, seed), hash(xi + 1, yi + 1, seed), xf),
    yf,
  );
}

function layerColor(color) {
  if (color === 'copper') return brand.champagneLight;
  if (color === 'bronze') return brand.champagneBronze;
  if (color === 'sage') return brand.sageGray;
  if (color === 'muted') return brand.weatheredStone;
  if (color === 'dark') return brand.warmDarkGray;
  return brand.paper;
}

function hexToRgb(hex) {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

function deriveVisual(fields, slug) {
  const theme = fields.theme || 'default';
  const defaults = themeDefaults[theme] ?? themeDefaults.default;
  const visual = structuredClone(defaults.visual);
  visual.theme = theme;
  visual.generator.seed = ((slugSeed(slug) + defaults.seedOffset - 1) % 999) + 1;
  return {
    version: 1,
    ...visual,
  };
}

function generatedImagePath(slug) {
  return `/images/writing/${slug}/feature.jpg`;
}

function backgroundColor(visual) {
  if (visual.background === 'paper') return brand.paper;
  if (visual.background === 'off-white') return brand.offWhite;
  return brand.warmDarkGray;
}

function generateFlowPaths(generator) {
  const { seed, density, steps, scale, curl } = generator;
  const curlRad = (curl * Math.PI) / 180;
  const rng = makeRng(seed);
  const paths = [];

  for (let i = 0; i < density; i++) {
    let x = rng() * W;
    let y = rng() * H;
    const pts = [`M ${x.toFixed(1)},${y.toFixed(1)}`];

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

function generateDots(generator) {
  const { seed, spacing, scale, dotSize } = generator;
  const maxRadius = (dotSize / 100) * (spacing / 2);
  const dots = [];
  const cols = Math.ceil(W / spacing) + 2;
  const rows = Math.ceil(H / spacing) + 2;

  for (let row = -1; row < rows; row++) {
    const hexOffset = row % 2 === 0 ? 0 : spacing / 2;
    const cy = row * spacing;

    for (let col = -1; col < cols; col++) {
      const cx = col * spacing + hexOffset;
      const n = noise(cx / scale + seed * 0.137, cy / scale + seed * 0.073, seed);
      const r = n * maxRadius;
      if (r >= 0.5) dots.push({ cx, cy, r });
    }
  }

  return dots;
}

const CELL = 6;

function sampleGrid(seed, scale) {
  const cols = Math.ceil(W / CELL) + 2;
  const rows = Math.ceil(H / CELL) + 2;
  const grid = [];
  for (let r = 0; r < rows; r++) {
    grid[r] = [];
    for (let c = 0; c < cols; c++) {
      grid[r][c] = noise((c * CELL) / scale + seed * 0.137, (r * CELL) / scale + seed * 0.073, seed);
    }
  }
  return grid;
}

function edgeCross(a, b, t) {
  return (t - a) / (b - a);
}

function traceLevel(grid, t) {
  const parts = [];
  const rows = grid.length - 1;
  const cols = grid[0].length - 1;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tl = grid[r][c];
      const tr = grid[r][c + 1];
      const br = grid[r + 1][c + 1];
      const bl = grid[r + 1][c];
      const caseIdx = (tl > t ? 8 : 0) | (tr > t ? 4 : 0) | (br > t ? 2 : 0) | (bl > t ? 1 : 0);
      if (caseIdx === 0 || caseIdx === 15) continue;

      const x0 = c * CELL;
      const y0 = r * CELL;
      const top = () => [x0 + edgeCross(tl, tr, t) * CELL, y0];
      const right = () => [x0 + CELL, y0 + edgeCross(tr, br, t) * CELL];
      const bot = () => [x0 + edgeCross(bl, br, t) * CELL, y0 + CELL];
      const left = () => [x0, y0 + edgeCross(tl, bl, t) * CELL];
      const seg = (a, b) => `M ${a[0].toFixed(1)},${a[1].toFixed(1)} L ${b[0].toFixed(1)},${b[1].toFixed(1)}`;

      switch (caseIdx) {
        case 1: parts.push(seg(bot(), left())); break;
        case 2: parts.push(seg(right(), bot())); break;
        case 3: parts.push(seg(right(), left())); break;
        case 4: parts.push(seg(top(), right())); break;
        case 5: parts.push(seg(top(), right()), seg(bot(), left())); break;
        case 6: parts.push(seg(top(), bot())); break;
        case 7: parts.push(seg(top(), left())); break;
        case 8: parts.push(seg(left(), top())); break;
        case 9: parts.push(seg(bot(), top())); break;
        case 10: parts.push(seg(left(), top()), seg(right(), bot())); break;
        case 11: parts.push(seg(right(), top())); break;
        case 12: parts.push(seg(left(), right())); break;
        case 13: parts.push(seg(bot(), right())); break;
        case 14: parts.push(seg(left(), bot())); break;
      }
    }
  }

  return parts.join(' ');
}

function generateIsolines(generator) {
  const grid = sampleGrid(generator.seed, generator.scale);
  const paths = [];
  for (let i = 1; i <= generator.levels; i++) {
    const d = traceLevel(grid, i / (generator.levels + 1));
    if (d) paths.push(d);
  }
  return paths;
}

function circumcircle(pa, pb, pc) {
  const [ax, ay] = pa;
  const [bx, by] = pb;
  const [cx, cy] = pc;
  const D = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
  if (Math.abs(D) < 1e-10) return { cx: 0, cy: 0, r2: Infinity };
  const a2 = ax * ax + ay * ay;
  const b2 = bx * bx + by * by;
  const c2 = cx * cx + cy * cy;
  const ux = (a2 * (by - cy) + b2 * (cy - ay) + c2 * (ay - by)) / D;
  const uy = (a2 * (cx - bx) + b2 * (ax - cx) + c2 * (bx - ax)) / D;
  return { cx: ux, cy: uy, r2: (ax - ux) ** 2 + (ay - uy) ** 2 };
}

function generatePoints(count, jitter, rng) {
  const jFrac = jitter / 100;
  const cols = Math.max(2, Math.round(Math.sqrt(count * (W / H))));
  const rows = Math.max(2, Math.round(count / cols));
  const cw = W / cols;
  const ch = H / rows;
  const pts = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = (c + 0.5) * cw + (rng() - 0.5) * cw * jFrac;
      const y = (r + 0.5) * ch + (rng() - 0.5) * ch * jFrac;
      pts.push([Math.max(1, Math.min(W - 1, x)), Math.max(1, Math.min(H - 1, y))]);
    }
  }

  return pts;
}

function bowyerWatson(pts) {
  const n = pts.length;
  const m = Math.max(W, H) * 10;
  const allPts = [...pts, [W / 2, -m], [W / 2 + m, H + m], [W / 2 - m, H + m]];
  const si = n;
  let tris = [{ a: si, b: si + 1, c: si + 2 }];

  for (let pi = 0; pi < n; pi++) {
    const [px, py] = allPts[pi];
    const bad = tris.map((t) => {
      const cc = circumcircle(allPts[t.a], allPts[t.b], allPts[t.c]);
      return (px - cc.cx) ** 2 + (py - cc.cy) ** 2 < cc.r2;
    });
    const edgeCount = new Map();
    tris.forEach((t, ti) => {
      if (!bad[ti]) return;
      for (const [ea, eb] of [[t.a, t.b], [t.b, t.c], [t.c, t.a]]) {
        const key = ea < eb ? `${ea},${eb}` : `${eb},${ea}`;
        edgeCount.set(key, (edgeCount.get(key) ?? 0) + 1);
      }
    });
    tris = tris.filter((_, ti) => !bad[ti]);
    for (const [key, cnt] of edgeCount) {
      if (cnt === 1) {
        const [ea, eb] = key.split(',').map(Number);
        tris.push({ a: ea, b: eb, c: pi });
      }
    }
  }

  return { tris: tris.filter((t) => t.a < n && t.b < n && t.c < n), allPts };
}

function generateVoronoi(generator) {
  const pts = generatePoints(generator.count, generator.jitter, makeRng(generator.seed));
  const { tris, allPts } = bowyerWatson(pts);
  const cc = tris.map((t) => circumcircle(allPts[t.a], allPts[t.b], allPts[t.c]));
  const edgeToTris = new Map();

  tris.forEach((t, ti) => {
    for (const [ea, eb] of [[t.a, t.b], [t.b, t.c], [t.c, t.a]]) {
      const key = ea < eb ? `${ea},${eb}` : `${eb},${ea}`;
      const arr = edgeToTris.get(key) ?? [];
      arr.push(ti);
      edgeToTris.set(key, arr);
    }
  });

  const parts = [];
  const clip = 400;
  for (const triIdx of edgeToTris.values()) {
    if (triIdx.length !== 2) continue;
    const c1 = cc[triIdx[0]];
    const c2 = cc[triIdx[1]];
    const in1 = c1.cx > -clip && c1.cx < W + clip && c1.cy > -clip && c1.cy < H + clip;
    const in2 = c2.cx > -clip && c2.cx < W + clip && c2.cy > -clip && c2.cy < H + clip;
    if (!in1 && !in2) continue;
    parts.push(`M ${c1.cx.toFixed(1)},${c1.cy.toFixed(1)} L ${c2.cx.toFixed(1)},${c2.cy.toFixed(1)}`);
  }

  return parts.join(' ');
}

function isRichAttractor(a, b, c, d) {
  const grid = 32;
  const seen = new Uint8Array(grid * grid);
  let uniqueCells = 0;
  let x = 0.1;
  let y = 0.2;

  for (let i = 0; i < 2500; i++) {
    const nx = Math.sin(a * y) + c * Math.cos(a * x);
    const ny = Math.sin(b * x) + d * Math.cos(b * y);
    x = nx;
    y = ny;

    if (i > 100) {
      const gx = Math.floor(((x + 3) / 6) * grid);
      const gy = Math.floor(((y + 3) / 6) * grid);
      if (gx >= 0 && gx < grid && gy >= 0 && gy < grid) {
        const idx = gy * grid + gx;
        if (seen[idx] === 0) {
          seen[idx] = 1;
          uniqueCells++;
          if (uniqueCells >= 120) return true;
        }
      }
    }
  }

  return false;
}

function cliffordParams(seed) {
  for (let attempt = 0; attempt < 20; attempt++) {
    const rng = makeRng(seed * 2053 + 7919 + attempt * 31337);
    const a = rng() * 3.6 - 1.8;
    const b = rng() * 3.6 - 1.8;
    const c = rng() * 3.6 - 1.8;
    const d = rng() * 3.6 - 1.8;
    if (isRichAttractor(a, b, c, d)) return [a, b, c, d];
  }
  return [-1.4, 1.6, 1.0, 0.7];
}

function generateAttractorDots(generator) {
  const [a, b, c, d] = cliffordParams(generator.seed);
  let x = 0.1;
  let y = 0.2;
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  const pts = [];

  for (let i = 0; i < 45000; i++) {
    const nx = Math.sin(a * y) + c * Math.cos(a * x);
    const ny = Math.sin(b * x) + d * Math.cos(b * y);
    x = nx;
    y = ny;
    if (i < 300) continue;
    pts.push([x, y]);
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }

  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;
  return pts.filter((_, i) => i % 5 === 0).map(([px, py]) => ({
    cx: (((px - minX) / rangeX) * 0.86 + 0.07) * W,
    cy: (((py - minY) / rangeY) * 0.86 + 0.07) * H,
  }));
}

function renderAttractorBuffer(visual) {
  const generator = visual.generator;
  const bg = hexToRgb(backgroundColor(visual));
  const fg = hexToRgb(layerColor(generator.color));
  const iterations = 250000;
  const warmup = 300;
  const pad = 0.07;

  const buildDensity = ([a, b, c, d]) => {
    const density = new Uint32Array(W * H);
    let x = 0.1;
    let y = 0.2;
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (let i = 0; i < iterations + warmup; i++) {
      const nx = Math.sin(a * y) + c * Math.cos(a * x);
      const ny = Math.sin(b * x) + d * Math.cos(b * y);
      x = nx;
      y = ny;
      if (i >= warmup) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }

    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;
    let maxDensity = 0;
    let uniquePixels = 0;
    x = 0.1;
    y = 0.2;

    for (let i = 0; i < iterations + warmup; i++) {
      const nx = Math.sin(a * y) + c * Math.cos(a * x);
      const ny = Math.sin(b * x) + d * Math.cos(b * y);
      x = nx;
      y = ny;

      if (i >= warmup) {
        const cx = Math.floor(((x - minX) / rangeX * (1 - 2 * pad) + pad) * W);
        const cy = Math.floor(((y - minY) / rangeY * (1 - 2 * pad) + pad) * H);
        if (cx >= 0 && cx < W && cy >= 0 && cy < H) {
          const idx = cy * W + cx;
          if (density[idx] === 0) uniquePixels++;
          const val = ++density[idx];
          if (val > maxDensity) maxDensity = val;
        }
      }
    }

    return { density, maxDensity, uniquePixels };
  };

  let result = buildDensity(cliffordParams(generator.seed));
  if (result.uniquePixels < 4000) {
    result = buildDensity([-1.4, 1.6, 1.0, 0.7]);
  }

  const output = Buffer.alloc(W * H * 3);
  const logMax = Math.log1p(result.maxDensity) || 1;
  const maxA = (generator.opacity / 100) * 0.92;

  for (let i = 0; i < W * H; i++) {
    const count = result.density[i];
    const alpha = count === 0 ? 0 : (Math.log1p(count) / logMax) * maxA;
    const px = i * 3;
    output[px] = Math.round(bg[0] * (1 - alpha) + fg[0] * alpha);
    output[px + 1] = Math.round(bg[1] * (1 - alpha) + fg[1] * alpha);
    output[px + 2] = Math.round(bg[2] * (1 - alpha) + fg[2] * alpha);
  }

  return output;
}

function renderGenerator(generator) {
  const color = layerColor(generator.color);

  if (generator.type === 'flow-field') {
    const paths = generateFlowPaths(generator).map((d) => `<path d="${d}" />`).join('');
    return `<g stroke="${color}" fill="none" stroke-width="${generator.strokeWidth}" opacity="${(generator.opacity / 100) * 0.65}" stroke-linecap="round" stroke-linejoin="round">${paths}</g>`;
  }

  if (generator.type === 'dot-grid') {
    const dots = generateDots(generator).map((dot) => `<circle cx="${dot.cx.toFixed(1)}" cy="${dot.cy.toFixed(1)}" r="${dot.r.toFixed(2)}" />`).join('');
    return `<g fill="${color}" opacity="${(generator.opacity / 100) * 0.80}">${dots}</g>`;
  }

  if (generator.type === 'isoline') {
    const paths = generateIsolines(generator).map((d) => `<path d="${d}" />`).join('');
    return `<g stroke="${color}" fill="none" stroke-width="${generator.strokeWidth}" opacity="${(generator.opacity / 100) * 0.70}" stroke-linecap="round" stroke-linejoin="round">${paths}</g>`;
  }

  if (generator.type === 'voronoi') {
    const d = generateVoronoi(generator);
    return `<g stroke="${color}" fill="none" stroke-width="${generator.strokeWidth}" opacity="${(generator.opacity / 100) * 0.75}" stroke-linecap="round" stroke-linejoin="round"><path d="${d}" /></g>`;
  }

  const dots = generateAttractorDots(generator).map((dot) => `<circle cx="${dot.cx.toFixed(1)}" cy="${dot.cy.toFixed(1)}" r="0.55" />`).join('');
  return `<g fill="${color}" opacity="${(generator.opacity / 100) * 0.55}">${dots}</g>`;
}

function renderSvg(visual) {
  const bg = backgroundColor(visual);
  const layer = renderGenerator(visual.generator);

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${bg}" />
  <filter id="grain" x="0%" y="0%" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.72 0.68" numOctaves="4" stitchTiles="stitch" />
    <feColorMatrix type="saturate" values="0" />
  </filter>
  ${layer}
  <rect width="${W}" height="${H}" filter="url(#grain)" opacity="${(visual.grain / 100) * 0.16}" style="mix-blend-mode:screen" />
</svg>`;
}

async function writeOptimizedImage(visual, outPath) {
  if (DRY_RUN) return;
  mkdirSync(dirname(outPath), { recursive: true });

  if (visual.generator.type === 'strange-attractor') {
    await sharp(renderAttractorBuffer(visual), {
      raw: { width: W, height: H, channels: 3 },
    })
      .jpeg({ quality: 82, progressive: true, mozjpeg: true })
      .toFile(outPath);
    return;
  }

  const svg = renderSvg(visual);
  await sharp(Buffer.from(svg))
    .resize(W, H, { fit: 'cover' })
    .jpeg({ quality: 82, progressive: true, mozjpeg: true })
    .toFile(outPath);
}

async function processFile(fileName) {
  const slug = fileName.replace(/\.md$/, '');
  const filePath = join(WRITING_DIR, fileName);
  const content = readFileSync(filePath, 'utf8');
  const parsed = parseFrontmatter(content);
  if (!parsed) {
    skipped++;
    return;
  }

  const fields = YAML.parse(parsed.raw) ?? {};
  let changed = false;

  if (!fields.visual || OVERWRITE_VISUAL) {
    fields.visual = deriveVisual(fields, slug);
    changed = true;
  }

  const imagePath = generatedImagePath(slug);
  const imageOutPath = join(IMAGE_ROOT, slug, 'feature.jpg');
  const imageIsGenerated = fields.image === imagePath;
  const imageExists = existsSync(imageOutPath);

  if (!imageIsGenerated || !imageExists || OVERWRITE_IMAGE) {
    await writeOptimizedImage(fields.visual, imageOutPath);
    fields.image = imagePath;
    changed = true;
    generated++;
  }

  if (changed) {
    const next = `---\n${serializeFrontmatter(fields)}\n---\n${parsed.body}`;
    if (DRY_RUN) {
      console.log(`  DRY RUN -> ${slug}`);
    } else {
      writeFileSync(filePath, next, 'utf8');
      console.log(`  updated -> ${slug}`);
    }
    updated++;
  } else {
    skipped++;
  }
}

const files = readdirSync(WRITING_DIR)
  .filter((file) => file.endsWith('.md'))
  .filter((file) => !TARGET_SLUG || file === `${TARGET_SLUG}.md`)
  .sort();

if (TARGET_SLUG && files.length === 0) {
  console.error(`No writing article found for slug "${TARGET_SLUG}".`);
  process.exit(1);
}

console.log(`Generating writing art for ${files.length} article${files.length === 1 ? '' : 's'}${TARGET_SLUG ? ' (targeted)' : ''}${DRY_RUN ? ' (dry run)' : ''}...\n`);

for (const file of files) {
  try {
    await processFile(file);
  } catch (err) {
    errors++;
    console.error(`  ERROR: ${file} — ${err.message}`);
  }
}

console.log(`\nDone. ${updated} updated, ${generated} images generated, ${skipped} unchanged, ${errors} errors.`);
if (errors > 0) process.exit(1);
