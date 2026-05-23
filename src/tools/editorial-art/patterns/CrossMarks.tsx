import { CANVAS_W, CANVAS_H } from '../themes';

interface CrossMarksProps {
  opacity: number;  // 0-1 float
  color: string;
}

const W = CANVAS_W;
const H = CANVAS_H;
const SPACING = 52;
const ARM = 7;

const marks = Array.from({ length: Math.ceil(H / SPACING) + 1 }, (_, row) =>
  Array.from({ length: Math.ceil(W / SPACING) + 1 }, (_, col) => ({
    x: col * SPACING + SPACING / 2,
    y: row * SPACING + SPACING / 2,
  }))
).flat();

export function CrossMarks({ opacity, color }: CrossMarksProps) {
  return (
    <svg style={{ position: 'absolute', inset: 0 }} width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <g stroke={color} strokeWidth={1} opacity={opacity}>
        {marks.map((m, i) => (
          <g key={i}>
            <line x1={m.x - ARM} y1={m.y} x2={m.x + ARM} y2={m.y} />
            <line x1={m.x} y1={m.y - ARM} x2={m.x} y2={m.y + ARM} />
          </g>
        ))}
      </g>
    </svg>
  );
}
