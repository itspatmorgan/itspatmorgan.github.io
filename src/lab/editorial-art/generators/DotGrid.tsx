import { useMemo } from 'react';
import { CANVAS_W, CANVAS_H, resolveLayerColor, type DotGridConfig } from '../themes';
import { noise } from './noise';

const W = CANVAS_W;
const H = CANVAS_H;

// ── Dot generation ────────────────────────────────────────────────────────────

interface Dot { cx: number; cy: number; r: number }

function generateDots(cfg: DotGridConfig): Dot[] {
  const { seed, spacing, scale, dotSize } = cfg;
  const maxRadius = (dotSize / 100) * (spacing / 2);
  const dots: Dot[] = [];

  // Add one cell of bleed on each edge so dots don't pop in at boundaries
  const cols = Math.ceil(W / spacing) + 2;
  const rows = Math.ceil(H / spacing) + 2;

  for (let row = -1; row < rows; row++) {
    // Hex-offset every other row for a more organic, less grid-like feel
    const hexOffset = (row % 2 === 0) ? 0 : spacing / 2;
    const cy = row * spacing;

    for (let col = -1; col < cols; col++) {
      const cx = col * spacing + hexOffset;

      // Seed offsets spread sample points apart so adjacent seeds look different
      const nx = cx / scale + seed * 0.137;
      const ny = cy / scale + seed * 0.073;
      const n = noise(nx, ny, seed);

      const r = n * maxRadius;
      if (r >= 0.5) dots.push({ cx, cy, r });
    }
  }

  return dots;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function DotGrid(cfg: DotGridConfig) {
  const dots = useMemo(
    () => generateDots(cfg),
    // regenerate only when shape-defining params change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cfg.seed, cfg.spacing, cfg.scale, cfg.dotSize],
  );

  const fillColor = resolveLayerColor(cfg.color);
  const opacity   = (cfg.opacity / 100) * 0.80;

  return (
    <svg
      style={{ position: 'absolute', inset: 0 }}
      width={W} height={H}
      viewBox={`0 0 ${W} ${H}`}
    >
      <g fill={fillColor} opacity={opacity}>
        {dots.map((dot, i) => (
          <circle key={i} cx={dot.cx} cy={dot.cy} r={dot.r} />
        ))}
      </g>
    </svg>
  );
}
