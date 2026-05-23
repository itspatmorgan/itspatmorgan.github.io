import { CANVAS_W, CANVAS_H } from '../themes';

interface TimelineProps {
  opacity: number;  // 0-1 float
  color: string;
}

const W = CANVAS_W;
const H = CANVAS_H;
const TICK_COUNT = 6;
const RULE_Y = H * 0.58;
const RULE_X1 = W * 0.05;
const RULE_X2 = W * 0.92;
const TICK_H = 20;
const DOT_R = 4;

export function Timeline({ opacity, color }: TimelineProps) {
  
  const span = RULE_X2 - RULE_X1;
  const ticks = Array.from({ length: TICK_COUNT }, (_, i) => ({
    x: RULE_X1 + (span / (TICK_COUNT - 1)) * i,
  }));

  return (
    <svg
      style={{ position: 'absolute', inset: 0 }}
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
    >
      <g opacity={opacity} stroke={color} fill="none">
        {/* Main horizontal rule */}
        <line x1={RULE_X1} y1={RULE_Y} x2={RULE_X2} y2={RULE_Y} strokeWidth={1} />

        {/* Tick marks + dots */}
        {ticks.map((tick, i) => (
          <g key={i}>
            <line
              x1={tick.x}
              y1={RULE_Y - TICK_H}
              x2={tick.x}
              y2={RULE_Y + TICK_H}
              strokeWidth={i === 0 || i === TICK_COUNT - 1 ? 1.5 : 1}
            />
            <circle cx={tick.x} cy={RULE_Y} r={DOT_R} fill={color} stroke="none" />
          </g>
        ))}

        {/* Connecting arc between first two ticks — suggests trajectory */}
        <path
          d={`M ${ticks[0].x} ${RULE_Y - TICK_H} Q ${(ticks[0].x + ticks[1].x) / 2} ${RULE_Y - TICK_H * 2.5} ${ticks[1].x} ${RULE_Y - TICK_H}`}
          strokeWidth={1}
        />

        {/* End arrow */}
        <polyline
          points={`${RULE_X2 - 8},${RULE_Y - 5} ${RULE_X2},${RULE_Y} ${RULE_X2 - 8},${RULE_Y + 5}`}
          strokeWidth={1}
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
