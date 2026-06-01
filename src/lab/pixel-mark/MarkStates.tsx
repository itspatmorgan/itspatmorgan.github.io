import { useState, useRef, useCallback } from "react";

// ─── Pixel P geometry ────────────────────────────────────────────────────────
// Standard 6-position braille cell. Letter P = positions 1,2,3,4.
// Grid: col1=x10.5, col2=x17.5 · row1=y7, row2=y14, row3=y21
// Spacing = 7 in all directions. Bounding box centered at (14,14) in 28×28 viewBox.

const PIXEL_SIZE = 5;
const PIXEL_RADIUS = 0.6;

const BRAILLE_P: [number, number][] = [
  [10.5, 7],  // position 1 — top-left
  [17.5, 7],  // position 4 — top-right
  [10.5, 14], // position 2 — mid-left
  [10.5, 21], // position 3 — bot-left
];

const GHOST: [number, number][] = [
  [17.5, 14], // position 5 — mid-right
  [17.5, 21], // position 6 — bot-right
];

const ROLL_CONFIGS: [number, number][][] = [
  [[10.5,7],[17.5,7],[10.5,14],[17.5,14]],
  [[10.5,7],[17.5,7],[10.5,21],[17.5,21]],
  [[17.5,7],[17.5,14],[10.5,21],[17.5,21]],
  [[10.5,7],[10.5,14],[17.5,14],[10.5,21]],
  [[10.5,7],[17.5,7],[10.5,14],[17.5,14]],
  BRAILLE_P,
];

// ─── Pixel mark ───────────────────────────────────────────────────────────────

interface BlockMarkProps {
  size?: number;
  bgColor?: string;
  pixelColor?: string;
  bgStroke?: string;
  showGhost?: boolean;
  ghostOpacity?: number;
  pixels?: [number, number][];
}

export function BlockMark({
  size = 48,
  bgColor = "var(--color-foreground)",
  pixelColor = "var(--color-background)",
  bgStroke,
  showGhost = false,
  ghostOpacity = 0.18,
  pixels = BRAILLE_P,
}: BlockMarkProps) {
  const renderPixel = (cx: number, cy: number, i: number, opacity?: number) => (
    <rect
      key={i}
      x={cx - PIXEL_SIZE / 2}
      y={cy - PIXEL_SIZE / 2}
      width={PIXEL_SIZE}
      height={PIXEL_SIZE}
      rx={PIXEL_RADIUS}
      style={{ fill: pixelColor, opacity }}
    />
  );

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Inset slightly when stroked so border isn't clipped by viewBox edge */}
      <rect
        x={bgStroke ? 0.75 : 0}
        y={bgStroke ? 0.75 : 0}
        width={bgStroke ? 26.5 : 28}
        height={bgStroke ? 26.5 : 28}
        rx={bgStroke ? 5.8 : 6.2}
        style={{ fill: bgColor, stroke: bgStroke, strokeWidth: bgStroke ? 1.5 : 0 }}
      />
      {showGhost && GHOST.map(([cx, cy], i) => renderPixel(cx, cy, i, ghostOpacity))}
      {pixels.map(([cx, cy], i) => renderPixel(cx, cy, i))}
    </svg>
  );
}

// ─── State card wrapper ───────────────────────────────────────────────────────

function PlayButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label="Play"
      className="flex h-7 w-7 items-center justify-center rounded border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground disabled:opacity-40"
    >
      <svg width="8" height="10" viewBox="0 0 8 10" fill="currentColor" aria-hidden>
        <path d="M0 0l8 5-8 5V0z" />
      </svg>
    </button>
  );
}

function StateCard({
  label,
  children,
  action,
}: {
  label: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="relative flex min-h-36 items-center justify-center rounded-lg border border-border bg-card p-6">
        {children}
        {action && <div className="absolute bottom-3 right-3">{action}</div>}
      </div>
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

// ─── Interaction state demos ──────────────────────────────────────────────────

function ScaleState() {
  return (
    <div className="cursor-pointer transition-transform duration-300 ease-out hover:scale-110">
      <BlockMark size={48} />
    </div>
  );
}

function LiftState() {
  return (
    <div
      className="cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20 dark:hover:shadow-black/40"
      style={{ borderRadius: "10.6px" }}
    >
      <BlockMark size={48} />
    </div>
  );
}

function InlineState() {
  return (
    <div className="group flex cursor-pointer items-center gap-2">
      <div className="shrink-0 transition-transform duration-300 group-hover:-translate-x-0.5">
        <BlockMark size={28} />
      </div>
      <span className="font-mono text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
        Patrick Morgan
      </span>
    </div>
  );
}

function EntranceMark() {
  const delays = [0, 100, 200, 300];
  return (
    <>
      <svg width={48} height={48} viewBox="0 0 28 28" aria-hidden>
        <rect width="28" height="28" rx={6.2} style={{ fill: "var(--color-foreground)" }} />
        {BRAILLE_P.map(([cx, cy], i) => (
          <rect
            key={i}
            x={cx - PIXEL_SIZE / 2}
            y={cy - PIXEL_SIZE / 2}
            width={PIXEL_SIZE}
            height={PIXEL_SIZE}
            rx={PIXEL_RADIUS}
            style={{
              fill: "var(--color-background)",
              animation: `pixel-in 0.4s cubic-bezier(0.16,1,0.3,1) ${delays[i]}ms both`,
              transformOrigin: `${cx}px ${cy}px`,
            }}
          />
        ))}
      </svg>
      <style>{`
        @keyframes pixel-in {
          from { opacity: 0; transform: scale(0); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}

function AccentState() {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg width={48} height={48} viewBox="0 0 28 28" aria-hidden>
        <rect
          width="28"
          height="28"
          rx={6.2}
          style={{
            fill: hovered ? "var(--color-accent)" : "var(--color-foreground)",
            transition: "fill 0.5s ease",
          }}
        />
        {BRAILLE_P.map(([cx, cy], i) => (
          <rect
            key={i}
            x={cx - PIXEL_SIZE / 2}
            y={cy - PIXEL_SIZE / 2}
            width={PIXEL_SIZE}
            height={PIXEL_SIZE}
            rx={PIXEL_RADIUS}
            style={{
              fill: hovered
                ? "var(--color-accent-foreground)"
                : "var(--color-background)",
              transition: `fill 0.5s ease ${i * 40}ms`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

function RollMark({ rolling, configIdx }: { rolling: boolean; configIdx: number }) {
  return (
    <>
      <div
        style={{
          animation: rolling ? "die-roll 0.72s cubic-bezier(0.16,1,0.3,1) both" : "none",
          transformOrigin: "center",
        }}
      >
        <BlockMark size={48} pixels={ROLL_CONFIGS[configIdx]} />
      </div>
      <style>{`
        @keyframes die-roll {
          0%   { transform: scale(1) rotate(0deg); }
          18%  { transform: scale(0.88) rotate(130deg); }
          38%  { transform: scale(0.90) rotate(260deg); }
          58%  { transform: scale(0.88) rotate(430deg); }
          72%  { transform: scale(1.07) rotate(590deg); }
          86%  { transform: scale(0.96) rotate(700deg); }
          100% { transform: scale(1) rotate(720deg); }
        }
      `}</style>
    </>
  );
}

// ─── Scale strip ─────────────────────────────────────────────────────────────

export function ScaleStrip() {
  const sizes = [
    { size: 16, label: "Favicon" },
    { size: 28, label: "Header" },
    { size: 48, label: "Card" },
    { size: 96, label: "Display" },
  ];
  return (
    <div className="grid grid-cols-2 items-end gap-x-8 gap-y-10 sm:flex sm:gap-8">
      {sizes.map(({ size, label }) => (
        <div key={size} className="flex min-w-0 flex-col items-center gap-3">
          <BlockMark size={size} />
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {label}
          </span>
          <span className="font-mono text-xs text-muted-foreground/50">
            {size}px
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Color variants ───────────────────────────────────────────────────────────

const COLOR_VARIANTS: {
  label: string;
  bgColor: string;
  pixelColor: string;
  bgStroke?: string;
}[] = [
  {
    label: "Default",
    bgColor: "var(--color-foreground)",
    pixelColor: "var(--color-background)",
  },
  {
    label: "Accent",
    bgColor: "var(--color-accent)",
    pixelColor: "var(--color-accent-foreground)",
  },
  {
    label: "Soft",
    bgColor: "var(--color-secondary)",
    pixelColor: "var(--color-secondary-foreground)",
  },
  {
    label: "Outline",
    bgColor: "var(--color-background)",
    pixelColor: "var(--color-foreground)",
    bgStroke: "var(--color-border)",
  },
];

export function MarkVariants() {
  return (
    <div className="grid grid-cols-4 items-center gap-x-8 gap-y-8">
      {COLOR_VARIANTS.map((v) => (
        <div key={`header-${v.label}`} className="flex justify-center">
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{v.label}</span>
        </div>
      ))}

      {COLOR_VARIANTS.map((v) => (
        <div key={`sq-${v.label}`} className="flex justify-center">
          <BlockMark size={48} bgColor={v.bgColor} pixelColor={v.pixelColor} bgStroke={v.bgStroke} />
        </div>
      ))}
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export function MarkStates() {
  const [entranceKey, setEntranceKey] = useState(0);
  const [rolling, setRolling] = useState(false);
  const [configIdx, setConfigIdx] = useState(ROLL_CONFIGS.length - 1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const roll = useCallback(() => {
    if (rolling) return;
    setRolling(true);
    const schedule = [0, 80, 160, 260, 380, 540];
    schedule.forEach((delay, i) => {
      timerRef.current = setTimeout(() => {
        setConfigIdx(i);
        if (i === ROLL_CONFIGS.length - 1) setTimeout(() => setRolling(false), 500);
      }, delay);
    });
  }, [rolling]);

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
      <StateCard label="Scale"><ScaleState /></StateCard>
      <StateCard label="Lift"><LiftState /></StateCard>
      <StateCard label="Inline"><InlineState /></StateCard>
      <StateCard label="Entrance" action={<PlayButton onClick={() => setEntranceKey((k) => k + 1)} />}>
        <EntranceMark key={entranceKey} />
      </StateCard>
      <StateCard label="Accent"><AccentState /></StateCard>
      <StateCard label="Roll" action={<PlayButton onClick={roll} disabled={rolling} />}>
        <RollMark rolling={rolling} configIdx={configIdx} />
      </StateCard>
    </div>
  );
}
