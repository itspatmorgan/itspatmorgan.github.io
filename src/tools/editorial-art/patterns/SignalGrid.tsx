import { CANVAS_W, CANVAS_H } from '../themes';

const CHARS = ['0', '1', '0', '0', '1', '·', '1', '0', '—', '|', '0', '1'];
const COL_SIZE = 32;
const ROW_SIZE = 28;
const COLS = Math.ceil(CANVAS_W / COL_SIZE) + 1;
const ROWS = Math.ceil(CANVAS_H / ROW_SIZE) + 1;

interface SignalGridProps {
  opacity: number;  // 0-1 float
  color: string;
}

export function SignalGrid({ opacity, color }: SignalGridProps) {
  

  const cells = Array.from({ length: ROWS }, (_, row) =>
    Array.from({ length: COLS }, (_, col) => ({
      char: CHARS[(row * COLS + col * 3 + row * 7) % CHARS.length],
      // Fade cells near the left (text area) and fade edges
      fade: Math.min(
        1,
        (col / COLS) * 2,        // fade in from left
        ((COLS - col) / COLS) * 4 // fade out at right edge
      ),
    }))
  );

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        fontFamily: "'Geist Pixel Square', monospace",
        fontSize: 14,
        lineHeight: `${ROW_SIZE}px`,
        letterSpacing: '0.08em',
        color: color,
        opacity,
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
      }}
    >
      {cells.map((row, ri) => (
        <div key={ri} style={{ display: 'flex' }}>
          {row.map((cell, ci) => (
            <span
              key={ci}
              style={{
                width: COL_SIZE,
                textAlign: 'center',
                opacity: cell.fade,
              }}
            >
              {cell.char}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
