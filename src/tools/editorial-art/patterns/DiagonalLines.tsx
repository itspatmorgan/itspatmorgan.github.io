import { useId } from 'react';
import { CANVAS_W, CANVAS_H } from '../themes';

interface DiagonalLinesProps {
  opacity: number;  // 0-1 float
  color: string;
}

const W = CANVAS_W;
const H = CANVAS_H;

export function DiagonalLines({ opacity, color }: DiagonalLinesProps) {
  const id = useId().replace(/:/g, '');

  return (
    <svg style={{ position: 'absolute', inset: 0 }} width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <pattern
          id={`diag-${id}`}
          x="0"
          y="0"
          width="22"
          height="22"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(35)"
        >
          <line x1="0" y1="0" x2="0" y2="22" stroke={color} strokeWidth="1" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill={`url(#diag-${id})`} opacity={opacity} />
    </svg>
  );
}
