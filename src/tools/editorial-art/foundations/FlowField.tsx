import { useMemo } from 'react';
import { CANVAS_W, CANVAS_H, resolveLayerColor, type FlowFieldConfig } from '../themes';
import { noise, makeRng } from './noise';

const W = CANVAS_W;
const H = CANVAS_H;
const STEP_PX = 4; // fixed world-space step per iteration

// ── Path generation ───────────────────────────────────────────────────────────

function generatePaths(cfg: FlowFieldConfig): string[] {
  const { seed, density, steps, scale, curl } = cfg;
  const curlRad = (curl * Math.PI) / 180;
  const rng = makeRng(seed);
  const paths: string[] = [];

  for (let i = 0; i < density; i++) {
    let x = rng() * W;
    let y = rng() * H;
    const pts: string[] = [`M ${x.toFixed(1)},${y.toFixed(1)}`];

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

// ── Component ─────────────────────────────────────────────────────────────────

export function FlowField(cfg: FlowFieldConfig) {
  const paths = useMemo(
    () => generatePaths(cfg),
    // regenerate only when the field-shaping params change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cfg.seed, cfg.density, cfg.steps, cfg.scale, cfg.curl],
  );

  const strokeColor = resolveLayerColor(cfg.color);
  const opacity = (cfg.opacity / 100) * 0.65;

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
