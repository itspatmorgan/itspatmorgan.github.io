import { CANVAS_W, CANVAS_H, type IsolineConfig } from '../themes';
import { noise } from './noise';

const W = CANVAS_W;
const H = CANVAS_H;
const CELL = 6;

// Each contour level is an array of line segments [x1,y1, x2,y2]
export type IsolineSegment = [number, number, number, number];
export type IsolineLevel = IsolineSegment[];

function sampleGrid(seed: number, scale: number): number[][] {
  const cols = Math.ceil(W / CELL) + 2;
  const rows = Math.ceil(H / CELL) + 2;
  const grid: number[][] = [];
  for (let r = 0; r < rows; r++) {
    grid[r] = [];
    for (let c = 0; c < cols; c++) {
      grid[r][c] = noise(c * CELL / scale + seed * 0.137, r * CELL / scale + seed * 0.073, seed);
    }
  }
  return grid;
}

function edgeCross(a: number, b: number, t: number): number {
  return (t - a) / (b - a);
}

function traceLevel(grid: number[][], t: number): IsolineLevel {
  const segments: IsolineSegment[] = [];
  const rows = grid.length - 1;
  const cols = grid[0].length - 1;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tl = grid[r][c], tr = grid[r][c + 1];
      const br = grid[r + 1][c + 1], bl = grid[r + 1][c];
      const caseIdx = (tl > t ? 8 : 0) | (tr > t ? 4 : 0) | (br > t ? 2 : 0) | (bl > t ? 1 : 0);
      if (caseIdx === 0 || caseIdx === 15) continue;

      const x0 = c * CELL, y0 = r * CELL;
      const top   = (): [number, number] => [x0 + edgeCross(tl, tr, t) * CELL, y0];
      const right = (): [number, number] => [x0 + CELL, y0 + edgeCross(tr, br, t) * CELL];
      const bot   = (): [number, number] => [x0 + edgeCross(bl, br, t) * CELL, y0 + CELL];
      const left  = (): [number, number] => [x0, y0 + edgeCross(tl, bl, t) * CELL];

      const seg = (a: [number, number], b: [number, number]): IsolineSegment =>
        [a[0], a[1], b[0], b[1]];

      switch (caseIdx) {
        case  1: segments.push(seg(bot(),  left()));  break;
        case  2: segments.push(seg(right(), bot()));  break;
        case  3: segments.push(seg(right(), left())); break;
        case  4: segments.push(seg(top(),  right())); break;
        case  5: segments.push(seg(top(), right()), seg(bot(), left())); break;
        case  6: segments.push(seg(top(),  bot()));   break;
        case  7: segments.push(seg(top(),  left()));  break;
        case  8: segments.push(seg(left(), top()));   break;
        case  9: segments.push(seg(bot(),  top()));   break;
        case 10: segments.push(seg(left(), top()), seg(right(), bot())); break;
        case 11: segments.push(seg(right(), top()));  break;
        case 12: segments.push(seg(left(), right())); break;
        case 13: segments.push(seg(bot(),  right())); break;
        case 14: segments.push(seg(left(), bot()));   break;
      }
    }
  }
  return segments;
}

export function generateIsolines(cfg: IsolineConfig): IsolineLevel[] {
  const grid = sampleGrid(cfg.seed, cfg.scale);
  const levels: IsolineLevel[] = [];
  for (let i = 1; i <= cfg.levels; i++) {
    const segs = traceLevel(grid, i / (cfg.levels + 1));
    if (segs.length) levels.push(segs);
  }
  return levels;
}

// progress 0→1: contour levels appear one by one
export function drawIsolines(
  ctx: CanvasRenderingContext2D,
  levels: IsolineLevel[],
  color: string,
  opacity: number,
  strokeWidth: number,
  w: number,
  h: number,
  progress = 1,
): void {
  const scaleX = w / W;
  const scaleY = h / H;
  const end = Math.max(1, Math.floor(levels.length * progress));

  ctx.save();
  ctx.globalAlpha = (opacity / 100) * 0.70;
  ctx.strokeStyle = color;
  ctx.lineWidth = strokeWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  for (let i = 0; i < end; i++) {
    for (const [x1, y1, x2, y2] of levels[i]) {
      ctx.moveTo(x1 * scaleX, y1 * scaleY);
      ctx.lineTo(x2 * scaleX, y2 * scaleY);
    }
  }
  ctx.stroke();

  ctx.restore();
}
