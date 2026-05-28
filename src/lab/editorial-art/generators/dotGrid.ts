import { CANVAS_W, CANVAS_H, type DotGridConfig, type RenderContext } from '../themes';
import { noise } from './noise';

const W = CANVAS_W;
const H = CANVAS_H;

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function smoothstep(value: number): number {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

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
  render: RenderContext,
): void {
  const scaleX = w / W;
  const scaleY = h / H;
  const ambient = render.motion.mode === 'ambient';
  const speed = render.motion.speed / 100;
  const intensity = Math.pow(render.motion.intensity / 100, 1.08);
  const time = render.time * (0.00022 + speed * 0.00058);

  ctx.save();
  ctx.fillStyle = color;
  const baseAlpha = (opacity / 100) * 0.80;

  for (let i = 0; i < dots.length; i++) {
    const { cx, cy, r } = dots[i];
    const nx = cx / W;
    const ny = cy / H;
    const dx = nx - 0.42;
    const dy = ny - 0.52;
    const distanceDelay = Math.sqrt(dx * dx + dy * dy) / 0.72;
    const fieldDelay = (Math.sin(cx * 0.017 + cy * 0.011) + 1) * 0.055;
    const revealAlpha = render.progress >= 1
      ? 1
      : smoothstep((render.progress - distanceDelay * 0.78 - fieldDelay) / 0.22);
    if (revealAlpha <= 0) continue;

    const wave = ambient
      ? Math.sin(time + cx * 0.014 + cy * 0.019)
      : 0;
    const animatedRadius = Math.max(0.3, r * (1 + wave * 0.24 * intensity));
    const alphaScale = ambient ? 0.72 + (wave + 1) * 0.38 * intensity : 1;
    ctx.globalAlpha = Math.max(0, Math.min(1, baseAlpha * revealAlpha * alphaScale));
    ctx.beginPath();
    ctx.arc(cx * scaleX, cy * scaleY, animatedRadius * Math.min(scaleX, scaleY), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
