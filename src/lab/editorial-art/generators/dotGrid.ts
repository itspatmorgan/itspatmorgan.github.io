import { CANVAS_W, CANVAS_H, type DotGridConfig } from '../themes';
import { noise } from './noise';

const W = CANVAS_W;
const H = CANVAS_H;

export interface Dot {
  cx: number;
  cy: number;
  r: number;
}

export function generateDotGrid(cfg: DotGridConfig): Dot[] {
  const { seed, spacing, scale, dotSize } = cfg;
  const maxRadius = (dotSize / 100) * (spacing / 2);
  const dots: Dot[] = [];

  const cols = Math.ceil(W / spacing) + 2;
  const rows = Math.ceil(H / spacing) + 2;

  for (let row = -1; row < rows; row++) {
    const hexOffset = (row % 2 === 0) ? 0 : spacing / 2;
    const cy = row * spacing;

    for (let col = -1; col < cols; col++) {
      const cx = col * spacing + hexOffset;
      const nx = cx / scale + seed * 0.137;
      const ny = cy / scale + seed * 0.073;
      const r = noise(nx, ny, seed) * maxRadius;
      if (r >= 0.5) dots.push({ cx, cy, r });
    }
  }

  return dots;
}

// progress 0→1: dots appear left-to-right, top-to-bottom
export function drawDotGrid(
  ctx: CanvasRenderingContext2D,
  dots: Dot[],
  color: string,
  opacity: number,
  w: number,
  h: number,
  progress = 1,
): void {
  const scaleX = w / W;
  const scaleY = h / H;
  const end = Math.floor(dots.length * progress);

  ctx.save();
  ctx.globalAlpha = (opacity / 100) * 0.80;
  ctx.fillStyle = color;

  for (let i = 0; i < end; i++) {
    const { cx, cy, r } = dots[i];
    ctx.beginPath();
    ctx.arc(cx * scaleX, cy * scaleY, r * Math.min(scaleX, scaleY), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
