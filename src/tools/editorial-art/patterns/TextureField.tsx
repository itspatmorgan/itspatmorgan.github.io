import { CANVAS_W, CANVAS_H } from '../themes';

interface TextureFieldProps {
  opacity: number;  // 0-1 float
  color: string;
}

const W = CANVAS_W;
const H = CANVAS_H;

export function TextureField({ opacity, color }: TextureFieldProps) {
  

  return (
    <svg
      style={{ position: 'absolute', inset: 0 }}
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
    >
      <g opacity={opacity} fill="none" stroke={color}>
        {/* Large circle — compositional anchor, right side */}
        <circle cx={W * 0.78} cy={H * 0.44} r={H * 0.38} strokeWidth={1} />
        {/* Inner ring */}
        <circle cx={W * 0.78} cy={H * 0.44} r={H * 0.20} strokeWidth={1} />
        {/* Small filled dot at center */}
        <circle cx={W * 0.78} cy={H * 0.44} r={6} fill={color} stroke="none" />

        {/* Horizontal rule accent */}
        <line x1={W * 0.05} y1={H * 0.72} x2={W * 0.55} y2={H * 0.72} strokeWidth={1} />

        {/* Small grid marks — bottom left corner */}
        {[0, 1, 2, 3].map((i) => (
          <line
            key={`h${i}`}
            x1={W * 0.05}
            y1={H * 0.78 + i * 10}
            x2={W * 0.12}
            y2={H * 0.78 + i * 10}
            strokeWidth={0.75}
          />
        ))}
      </g>
    </svg>
  );
}
