import { CANVAS_W, CANVAS_H, type IsolineConfig, type RenderContext } from '../themes';
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
  render: RenderContext,
): void {
  const scaleX = w / W;
  const scaleY = h / H;
  const end = Math.max(1, Math.floor(levels.length * render.progress));
  const ambient = render.motion.mode === 'ambient';
  const speed = render.motion.speed / 100;
  const intensity = Math.pow(render.motion.intensity / 100, 1.08);
  const time = render.time * (0.00012 + speed * 0.00032);
  const drift = 24 * intensity * Math.min(scaleX, scaleY);

  const point = (x: number, y: number, phase: number): [number, number] => {
    const sx = x * scaleX;
    const sy = y * scaleY;
    if (!ambient || drift <= 0) return [sx, sy];
    const waveA = Math.sin(time + phase + x * 0.012 + y * 0.006);
    const waveB = Math.cos(time * 0.85 + phase + x * 0.004 - y * 0.014);
    return [sx + waveA * drift, sy + waveB * drift];
  };

  ctx.save();
  ctx.globalAlpha = (opacity / 100) * 0.70;
  ctx.strokeStyle = color;
  const scaledStroke = strokeWidth * Math.min(scaleX, scaleY);
  ctx.lineWidth = ambient ? scaledStroke * (1 + 0.45 * intensity) : scaledStroke;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  for (let i = 0; i < end; i++) {
    for (const [x1, y1, x2, y2] of levels[i]) {
      const [px1, py1] = point(x1, y1, i * 0.31);
      const [px2, py2] = point(x2, y2, i * 0.31 + 0.17);
      ctx.moveTo(px1, py1);
      ctx.lineTo(px2, py2);
    }
  }
  ctx.stroke();

  ctx.restore();
}
