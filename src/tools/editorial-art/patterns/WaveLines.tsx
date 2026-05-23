import { CANVAS_W, CANVAS_H } from '../themes';

interface WaveLinesProps {
  opacity: number;  // 0-1 float
  color: string;
}

const W = CANVAS_W;
const H = CANVAS_H;
const WAVE_COUNT = 11;
const AMPLITUDE = 20;
const STEP = 8; // px between path points

function wavePath(baseY: number): string {
  const points: string[] = [];
  for (let x = 0; x <= W; x += STEP) {
    const y = baseY + AMPLITUDE * Math.sin((x / W) * Math.PI * 2 * 1.5);
    points.push(x === 0 ? `M ${x},${y}` : `L ${x},${y}`);
  }
  return points.join(' ');
}

const wavePaths = Array.from({ length: WAVE_COUNT }, (_, i) =>
  wavePath((H / (WAVE_COUNT + 1)) * (i + 1))
);

export function WaveLines({ opacity, color }: WaveLinesProps) {
  return (
    <svg style={{ position: 'absolute', inset: 0 }} width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <g stroke={color} fill="none" strokeWidth={1} opacity={opacity}>
        {wavePaths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  );
}
