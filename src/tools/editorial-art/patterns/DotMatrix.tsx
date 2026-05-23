import { CANVAS_W, CANVAS_H } from '../themes';

interface DotMatrixProps {
  opacity: number;  // 0-1 float
  color: string;
}

const W = CANVAS_W;
const H = CANVAS_H;
const SPACING = 26;

const dots = Array.from({ length: Math.ceil(H / SPACING) + 1 }, (_, row) =>
  Array.from({ length: Math.ceil(W / SPACING) + 1 }, (_, col) => ({
    x: col * SPACING + SPACING / 2,
    y: row * SPACING + SPACING / 2,
  }))
).flat();

export function DotMatrix({ opacity, color }: DotMatrixProps) {
  return (
    <svg style={{ position: 'absolute', inset: 0 }} width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <g fill={color} opacity={opacity}>
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={1.5} />
        ))}
      </g>
    </svg>
  );
}
