import { CANVAS_W, CANVAS_H, type FlowFieldConfig } from '../themes';
import { noise, makeRng } from './noise';

const W = CANVAS_W;
const H = CANVAS_H;
const STEP_PX = 4;

export interface FlowPath {
  points: [number, number][];
}

export function generateFlowField(cfg: FlowFieldConfig): FlowPath[] {
  const { seed, density, steps, scale, curl } = cfg;
  const curlRad = (curl * Math.PI) / 180;
  const rng = makeRng(seed);
  const paths: FlowPath[] = [];

  for (let i = 0; i < density; i++) {
    let x = rng() * W;
    let y = rng() * H;
    const points: [number, number][] = [[x, y]];

    for (let s = 0; s < steps; s++) {
      const angle = noise(x / scale, y / scale, seed) * Math.PI * 4 + curlRad;
      x += Math.cos(angle) * STEP_PX;
      y += Math.sin(angle) * STEP_PX;
      if (x < -20 || x > W + 20 || y < -20 || y > H + 20) break;
      points.push([x, y]);
    }

    if (points.length > 2) paths.push({ points });
  }

  return paths;
}

// progress 0→1: each path reveals its points from start to end
export function drawFlowField(
  ctx: CanvasRenderingContext2D,
  paths: FlowPath[],
  color: string,
  opacity: number,
  strokeWidth: number,
  w: number,
  h: number,
  progress = 1,
): void {
  const scaleX = w / W;
  const scaleY = h / H;

  ctx.save();
  ctx.globalAlpha = (opacity / 100) * 0.65;
  ctx.strokeStyle = color;
  ctx.lineWidth = strokeWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  for (const { points } of paths) {
    const end = Math.max(2, Math.floor(points.length * progress));
    ctx.beginPath();
    ctx.moveTo(points[0][0] * scaleX, points[0][1] * scaleY);
    for (let i = 1; i < end; i++) {
      ctx.lineTo(points[i][0] * scaleX, points[i][1] * scaleY);
    }
    ctx.stroke();
  }

  ctx.restore();
}
