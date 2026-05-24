import { useMemo } from 'react';
import { CANVAS_W, CANVAS_H, resolveLayerColor, type IsolineConfig } from '../themes';
import { noise } from './noise';

const W = CANVAS_W;
const H = CANVAS_H;
const CELL = 6; // world-space px per grid cell

// ── Grid sampling ─────────────────────────────────────────────────────────────

function sampleGrid(seed: number, scale: number): number[][] {
  const cols = Math.ceil(W / CELL) + 2;
  const rows = Math.ceil(H / CELL) + 2;
  const grid: number[][] = [];
  for (let r = 0; r < rows; r++) {
    grid[r] = [];
    for (let c = 0; c < cols; c++) {
      const nx = (c * CELL) / scale + seed * 0.137;
      const ny = (r * CELL) / scale + seed * 0.073;
      grid[r][c] = noise(nx, ny, seed);
    }
  }
  return grid;
}

// ── Marching squares ──────────────────────────────────────────────────────────
// Corners: TL=bit3, TR=bit2, BR=bit1, BL=bit0

function edgeCross(a: number, b: number, t: number): number {
  return (t - a) / (b - a); // interpolation param [0,1] along edge
}

function traceLevel(grid: number[][], t: number): string {
  const parts: string[] = [];
  const rows = grid.length - 1;
  const cols = grid[0].length - 1;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tl = grid[r][c];
      const tr = grid[r][c + 1];
      const br = grid[r + 1][c + 1];
      const bl = grid[r + 1][c];

      const caseIdx =
        (tl > t ? 8 : 0) |
        (tr > t ? 4 : 0) |
        (br > t ? 2 : 0) |
        (bl > t ? 1 : 0);

      if (caseIdx === 0 || caseIdx === 15) continue;

      const x0 = c * CELL;
      const y0 = r * CELL;

      // Lazily-computed interpolated edge midpoints
      const top   = (): [number, number] => [x0 + edgeCross(tl, tr, t) * CELL, y0];
      const right = (): [number, number] => [x0 + CELL, y0 + edgeCross(tr, br, t) * CELL];
      const bot   = (): [number, number] => [x0 + edgeCross(bl, br, t) * CELL, y0 + CELL];
      const left  = (): [number, number] => [x0, y0 + edgeCross(tl, bl, t) * CELL];

      const seg = (a: [number, number], b: [number, number]): string =>
        `M ${a[0].toFixed(1)},${a[1].toFixed(1)} L ${b[0].toFixed(1)},${b[1].toFixed(1)}`;

      // All 14 non-trivial marching squares cases
      // Saddle cases (5, 10) resolved consistently (no center-value check needed
      // for stylistic isoline rendering — occasional ambiguity is invisible)
      switch (caseIdx) {
        case  1: parts.push(seg(bot(),  left()));  break;
        case  2: parts.push(seg(right(), bot()));  break;
        case  3: parts.push(seg(right(), left())); break;
        case  4: parts.push(seg(top(),  right())); break;
        case  5: parts.push(seg(top(), right()), seg(bot(), left())); break;
        case  6: parts.push(seg(top(),  bot()));   break;
        case  7: parts.push(seg(top(),  left()));  break;
        case  8: parts.push(seg(left(), top()));   break;
        case  9: parts.push(seg(bot(),  top()));   break;
        case 10: parts.push(seg(left(), top()), seg(right(), bot())); break;
        case 11: parts.push(seg(right(), top()));  break;
        case 12: parts.push(seg(left(), right())); break;
        case 13: parts.push(seg(bot(),  right())); break;
        case 14: parts.push(seg(left(), bot()));   break;
      }
    }
  }

  return parts.join(' ');
}

// ── Path generation ───────────────────────────────────────────────────────────

function generateIsolines(cfg: IsolineConfig): string[] {
  const grid = sampleGrid(cfg.seed, cfg.scale);
  const paths: string[] = [];

  for (let i = 1; i <= cfg.levels; i++) {
    // Evenly space thresholds in (0, 1) — avoid 0 and 1 (degenerate edges)
    const t = i / (cfg.levels + 1);
    const d = traceLevel(grid, t);
    if (d) paths.push(d);
  }

  return paths;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function Isoline(cfg: IsolineConfig) {
  const paths = useMemo(
    () => generateIsolines(cfg),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cfg.seed, cfg.levels, cfg.scale],
  );

  const strokeColor = resolveLayerColor(cfg.color);
  const opacity     = (cfg.opacity / 100) * 0.70;

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
