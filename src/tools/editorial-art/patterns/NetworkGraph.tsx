import { CANVAS_W, CANVAS_H } from '../themes';

interface NetworkGraphProps {
  opacity: number;  // 0-1 float
  color: string;
}

const W = CANVAS_W;
const H = CANVAS_H;

// Fixed node positions as fractions — arranged to avoid the left text zone
const NODES = [
  { x: 0.52, y: 0.12 },
  { x: 0.68, y: 0.22 },
  { x: 0.82, y: 0.10 },
  { x: 0.92, y: 0.30 },
  { x: 0.74, y: 0.42 },
  { x: 0.58, y: 0.55 },
  { x: 0.88, y: 0.55 },
  { x: 0.96, y: 0.70 },
  { x: 0.64, y: 0.72 },
  { x: 0.78, y: 0.85 },
  { x: 0.48, y: 0.82 },
  { x: 0.35, y: 0.65 },
];

const EDGES = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [1, 4], [4, 5], [4, 6], [6, 7],
  [5, 8], [8, 9], [8, 10], [10, 11],
  [5, 11], [0, 5], [3, 6], [7, 9],
];

export function NetworkGraph({ opacity, color }: NetworkGraphProps) {
  
  const pts = NODES.map((n) => ({ x: n.x * W, y: n.y * H }));

  return (
    <svg
      style={{ position: 'absolute', inset: 0 }}
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
    >
      <g opacity={opacity}>
        {/* Edges */}
        {EDGES.map(([a, b], i) => (
          <line
            key={i}
            x1={pts[a].x}
            y1={pts[a].y}
            x2={pts[b].x}
            y2={pts[b].y}
            stroke={color}
            strokeWidth={1}
          />
        ))}
        {/* Nodes */}
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={4} fill={color} />
        ))}
        {/* Ring on primary node */}
        <circle cx={pts[4].x} cy={pts[4].y} r={12} fill="none" stroke={color} strokeWidth={1} />
      </g>
    </svg>
  );
}
