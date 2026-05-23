import { CANVAS_W, CANVAS_H } from '../themes';

interface CompositionGridProps {
  opacity: number;  // 0-1 float
  color: string;
}

const PHI = 1.618;
const W = CANVAS_W;
const H = CANVAS_H;

// Golden ratio breakpoints
const gx1 = W / PHI;        // ~741
const gx2 = W - W / PHI;    // ~459
const gy1 = H / PHI;        // ~389
const gy2 = H - H / PHI;    // ~241

export function CompositionGrid({ opacity, color }: CompositionGridProps) {
  

  return (
    <svg
      style={{ position: 'absolute', inset: 0 }}
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
    >
      <g stroke={color} fill="none" opacity={opacity}>
        {/* Golden ratio vertical lines */}
        <line x1={gx1} y1={0} x2={gx1} y2={H} strokeWidth={1} />
        <line x1={gx2} y1={0} x2={gx2} y2={H} strokeWidth={1} />

        {/* Golden ratio horizontal lines */}
        <line x1={0} y1={gy1} x2={W} y2={gy1} strokeWidth={1} />
        <line x1={0} y1={gy2} x2={W} y2={gy2} strokeWidth={1} />

        {/* Accent circle at golden intersection (right column, upper third) */}
        <circle cx={gx1} cy={gy2} r={H * 0.28} strokeWidth={1} />

        {/* Small corner marks */}
        <line x1={0} y1={0} x2={24} y2={0} strokeWidth={1.5} />
        <line x1={0} y1={0} x2={0} y2={24} strokeWidth={1.5} />
        <line x1={W} y1={H} x2={W - 24} y2={H} strokeWidth={1.5} />
        <line x1={W} y1={H} x2={W} y2={H - 24} strokeWidth={1.5} />
      </g>
    </svg>
  );
}
