import { CANVAS_W, CANVAS_H } from '../themes';

interface HalftoneProps {
  opacity: number;  // 0-1 float
  color: string;
}

const W = CANVAS_W;
const H = CANVAS_H;
const COLS = 32;
const ROWS = 17;
const MAX_R = 9;
const MIN_R = 1;

// Dots scale from large (bottom-left) to small (top-right)
const dots = Array.from({ length: ROWS }, (_, row) =>
  Array.from({ length: COLS }, (_, col) => {
    const cx = (col / (COLS - 1)) * W;
    const cy = (row / (ROWS - 1)) * H;
    // t=0 at top-right, t=1 at bottom-left
    const t = ((1 - col / (COLS - 1)) + row / (ROWS - 1)) / 2;
    const r = MIN_R + t * (MAX_R - MIN_R);
    return { cx, cy, r };
  })
).flat();

export function Halftone({ opacity, color }: HalftoneProps) {
  return (
    <svg style={{ position: 'absolute', inset: 0 }} width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <g fill={color} opacity={opacity}>
        {dots.map((d, i) => (
          <circle key={i} cx={d.cx} cy={d.cy} r={d.r} />
        ))}
      </g>
    </svg>
  );
}
