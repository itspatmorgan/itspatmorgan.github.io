import { CANVAS_W, CANVAS_H, type FlowFieldConfig, type RenderContext } from '../themes';
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
  render: RenderContext,
): void {
  const scaleX = w / W;
  const scaleY = h / H;
  const ambient = render.motion.mode === 'ambient';
  const speed = render.motion.speed / 100;
  const intensity = Math.pow(render.motion.intensity / 100, 1.05);
  const time = render.time * (0.00016 + speed * 0.0005);
  const baseAlpha = (opacity / 100) * 0.65;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  for (let pathIndex = 0; pathIndex < paths.length; pathIndex++) {
    const { points } = paths[pathIndex];
    const end = Math.max(2, Math.floor(points.length * render.progress));
    const visibleEnd = ambient ? points.length : end;

    if (ambient) {
      ctx.globalAlpha = baseAlpha * (0.18 + 0.22 * intensity);
      ctx.lineWidth = strokeWidth * 0.85;
    } else {
      ctx.globalAlpha = baseAlpha;
      ctx.lineWidth = strokeWidth;
    }

    ctx.beginPath();
    ctx.moveTo(points[0][0] * scaleX, points[0][1] * scaleY);
    for (let i = 1; i < visibleEnd; i++) {
      ctx.lineTo(points[i][0] * scaleX, points[i][1] * scaleY);
    }
    ctx.stroke();

    if (!ambient || points.length < 6) continue;

    const phase = (time + pathIndex * 0.037) % 1;
    const head = Math.floor(phase * points.length);
    const windowSize = Math.max(5, Math.floor(points.length * (0.16 + 0.24 * intensity)));
    const tail = Math.max(0, head - windowSize);

    ctx.globalAlpha = Math.min(1, baseAlpha * (0.65 + 0.55 * intensity));
    ctx.lineWidth = strokeWidth * (1.15 + 0.85 * intensity);
    ctx.beginPath();
    ctx.moveTo(points[tail][0] * scaleX, points[tail][1] * scaleY);
    for (let i = tail + 1; i <= head; i++) {
      ctx.lineTo(points[i][0] * scaleX, points[i][1] * scaleY);
    }
    ctx.stroke();
  }

  ctx.restore();
}
