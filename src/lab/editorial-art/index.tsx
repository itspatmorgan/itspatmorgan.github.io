import { useRef, useState, useEffect, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { ChevronDown, RefreshCw, SlidersHorizontal, X } from 'lucide-react';
import { ArtCanvas } from './ArtCanvas';
import {
  themes,
  brand,
  bgPalette,
  brandAccent,
  resolveLayerColor,
  isColorDark,
  staticMotion,
  type LayerColor,
  type Composition,
  type GeneratorConfig,
  type GeneratorType,
  type MotionConfig,
  type MotionMode,
  type FlowFieldConfig,
  type DotGridConfig,
  type IsolineConfig,
  type VoronoiConfig,
  type StrangeAttractorConfig,
  type TextFont,
} from './themes';

// ── Types ─────────────────────────────────────────────────────────────────────

interface AppState {
  bgColor: string;
  generator: GeneratorConfig;
  texture: number;
  grain: number;
  showCaption: boolean;
  showText: boolean;
  title: string;
  slug: string;
  slugEdited: boolean;
  composition: Composition;
  textFont: TextFont;
  motion: MotionConfig;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const CANVAS_W = 1200;
const CANVAS_H = 630;
const CONTROL_LABEL_W = 'w-[4.75rem]';

const GENERATOR_TYPES: { value: GeneratorType; label: string }[] = [
  { value: 'flow-field',        label: 'Flow Field'        },
  { value: 'dot-grid',          label: 'Dot Grid'          },
  { value: 'isoline',           label: 'Isoline'           },
  { value: 'voronoi',           label: 'Voronoi'           },
  { value: 'strange-attractor', label: 'Strange Attractor' },
];

const COMPOSITIONS: { value: Composition; label: string }[] = [
  { value: 'left',     label: 'Left'   },
  { value: 'centered', label: 'Center' },
  { value: 'offset',   label: 'Offset' },
];

const COLORS: { value: LayerColor; label: string }[] = [
  { value: 'copper', label: 'Copper'  },
  { value: 'light',  label: 'White'   },
  { value: 'sage',   label: 'Sage'    },
  { value: 'muted',  label: 'Stone'   },
  { value: 'bronze', label: 'Bronze'  },
  { value: 'dark',   label: 'Dark'    },
];

const TEXT_FONTS: { value: TextFont; label: string }[] = [
  { value: 'sans',  label: 'Sans'  },
  { value: 'mono',  label: 'Mono'  },
  { value: 'pixel', label: 'Pixel' },
];

const MOTION_MODES: { value: MotionMode; label: string }[] = [
  { value: 'static',  label: 'Off'     },
  { value: 'reveal',  label: 'Reveal'  },
  { value: 'ambient', label: 'Ambient' },
];

const SCROLL_THUMB_INSET = 8;

// ── Helpers ───────────────────────────────────────────────────────────────────

function toSlug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function ri(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rf(min: number, max: number, dec = 1): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(dec));
}

function defaultState(): AppState {
  const t = themes.ai;
  return {
    bgColor: t.defaultBgColor,
    generator: { ...t.defaultGenerator },
    texture: t.defaultTexture,
    grain: 24,
    showCaption: false,
    showText: false,
    title: '',
    slug: '',
    slugEdited: false,
    composition: t.defaultComposition,
    textFont: 'sans',
    motion: { ...staticMotion },
  };
}

function defaultFilename(generator: GeneratorConfig): string {
  return `${generator.type}-${generator.seed}`;
}

function bgColorFromParam(value: string | null, fallback: string): string {
  if (value === 'paper') return brand.paper;
  if (value === 'off-white') return brand.offWhite;
  if (value === 'warm-dark-gray' || value === 'dark') return brand.warmDarkGray;
  if (value && /^#[0-9a-f]{6}$/i.test(value)) return value;
  return fallback;
}

function numberParam(params: URLSearchParams, key: string, fallback: number): number {
  if (!params.has(key)) return fallback;
  const value = Number(params.get(key));
  return Number.isFinite(value) ? value : fallback;
}

function colorParam(value: string | null, fallback: LayerColor): LayerColor {
  return COLORS.some((color) => color.value === value) ? value as LayerColor : fallback;
}

function motionModeParam(value: string | null, fallback: MotionMode): MotionMode {
  return MOTION_MODES.some((mode) => mode.value === value) ? value as MotionMode : fallback;
}

function parseMotion(params: URLSearchParams, fallback: MotionConfig): MotionConfig {
  return {
    mode: motionModeParam(params.get('motion'), fallback.mode),
    speed: Math.max(0, Math.min(100, numberParam(params, 'motionSpeed', fallback.speed))),
    intensity: Math.max(0, Math.min(100, numberParam(params, 'motionIntensity', fallback.intensity))),
  };
}

function motionWithObviousDefaults(current: MotionConfig, mode: MotionMode): MotionConfig {
  if (mode !== 'ambient') return { ...current, mode };
  return {
    mode,
    speed: Math.max(current.speed, 72),
    intensity: Math.max(current.intensity, 58),
  };
}

function parseGenerator(params: URLSearchParams, fallback: GeneratorConfig): GeneratorConfig {
  const typeParam = params.get('generator') ?? params.get('type');
  const type = GENERATOR_TYPES.some((item) => item.value === typeParam)
    ? typeParam as GeneratorType
    : fallback.type;
  const base = switchGeneratorType(fallback, type);
  const shared = {
    seed: numberParam(params, 'seed', base.seed),
    opacity: numberParam(params, 'opacity', base.opacity),
    color: colorParam(params.get('color'), base.color),
  };

  if (base.type === 'flow-field') {
    return {
      ...base,
      ...shared,
      density: numberParam(params, 'density', base.density),
      steps: numberParam(params, 'steps', base.steps),
      scale: numberParam(params, 'scale', base.scale),
      curl: numberParam(params, 'curl', base.curl),
      strokeWidth: numberParam(params, 'strokeWidth', base.strokeWidth),
    };
  }
  if (base.type === 'dot-grid') {
    return {
      ...base,
      ...shared,
      spacing: numberParam(params, 'spacing', base.spacing),
      scale: numberParam(params, 'scale', base.scale),
      dotSize: numberParam(params, 'dotSize', base.dotSize),
    };
  }
  if (base.type === 'isoline') {
    return {
      ...base,
      ...shared,
      levels: numberParam(params, 'levels', base.levels),
      scale: numberParam(params, 'scale', base.scale),
      strokeWidth: numberParam(params, 'strokeWidth', base.strokeWidth),
    };
  }
  if (base.type === 'voronoi') {
    return {
      ...base,
      ...shared,
      count: numberParam(params, 'count', base.count),
      jitter: numberParam(params, 'jitter', base.jitter),
      strokeWidth: numberParam(params, 'strokeWidth', base.strokeWidth),
    };
  }
  return { ...base, ...shared };
}

function initialStateFromUrl(): AppState {
  if (typeof window === 'undefined') return defaultState();
  const params = new URLSearchParams(window.location.search);
  const state = defaultState();
  if (!window.location.search) return state;
  const generator = parseGenerator(params, state.generator);

  return {
    ...state,
    bgColor: bgColorFromParam(params.get('bg'), state.bgColor),
    generator,
    texture: numberParam(params, 'texture', state.texture),
    grain: numberParam(params, 'grain', state.grain),
    motion: parseMotion(params, state.motion),
  };
}

// Switch foundation type while preserving shared params (seed, scale, color, opacity)
function switchGeneratorType(current: GeneratorConfig, toType: GeneratorType): GeneratorConfig {
  if (toType === current.type) return current;
  // Safely read scale from configs that have it; fall back to sensible defaults.
  const currentScale = 'scale' in current ? (current as { scale: number }).scale : 300;
  const currentStrokeWidth = 'strokeWidth' in current ? (current as { strokeWidth: number }).strokeWidth : 0.7;
  const visibleOpacity = Math.max(current.opacity, 92);
  const visibleStrokeWidth = Math.max(currentStrokeWidth, 1.1);

  if (toType === 'dot-grid') {
    return {
      type: 'dot-grid',
      seed:    current.seed,
      spacing: 18,
      scale:   Math.max(100, Math.min(420, currentScale)),
      dotSize: 92,
      opacity: visibleOpacity,
      color:   current.color,
    } satisfies DotGridConfig;
  }
  if (toType === 'isoline') {
    return {
      type:        'isoline',
      seed:        current.seed,
      levels:      14,
      scale:       Math.max(100, Math.min(420, currentScale)),
      strokeWidth: visibleStrokeWidth,
      opacity:     visibleOpacity,
      color:       current.color,
    } satisfies IsolineConfig;
  }
  if (toType === 'voronoi') {
    return {
      type:        'voronoi',
      seed:        current.seed,
      count:       100,
      jitter:      78,
      strokeWidth: visibleStrokeWidth,
      opacity:     visibleOpacity,
      color:       current.color,
    } satisfies VoronoiConfig;
  }
  if (toType === 'strange-attractor') {
    return {
      type:    'strange-attractor',
      seed:    current.seed,
      opacity: visibleOpacity,
      color:   current.color,
    } satisfies StrangeAttractorConfig;
  }
  return {
    type:        'flow-field',
    seed:        current.seed,
    density:     260,
    steps:       130,
    scale:       Math.max(80, Math.min(420, currentScale)),
    curl:        28,
    strokeWidth: visibleStrokeWidth,
    opacity:     visibleOpacity,
    color:       current.color,
  } satisfies FlowFieldConfig;
}

function randomFlowField(): FlowFieldConfig {
  return {
    type:        'flow-field',
    seed:        ri(1, 999),
    density:     ri(60, 350),
    steps:       ri(40, 160),
    scale:       ri(100, 500),
    curl:        ri(-60, 60),
    strokeWidth: rf(0.9, 1.8),
    opacity:     ri(72, 100),
    color:       pick(COLORS).value,
  };
}

function randomDotGrid(): DotGridConfig {
  return {
    type:    'dot-grid',
    seed:    ri(1, 999),
    spacing: ri(12, 36),
    scale:   ri(150, 500),
    dotSize: ri(72, 100),
    opacity: ri(72, 100),
    color:   pick(COLORS).value,
  };
}

function randomIsoline(): IsolineConfig {
  return {
    type:        'isoline',
    seed:        ri(1, 999),
    levels:      ri(5, 18),
    scale:       ri(150, 500),
    strokeWidth: rf(0.9, 1.9),
    opacity:     ri(72, 100),
    color:       pick(COLORS).value,
  };
}

function randomVoronoi(): VoronoiConfig {
  return {
    type:        'voronoi',
    seed:        ri(1, 999),
    count:       ri(40, 160),
    jitter:      ri(50, 100),
    strokeWidth: rf(0.8, 1.7),
    opacity:     ri(70, 100),
    color:       pick(COLORS).value,
  };
}

function randomStrangeAttractor(): StrangeAttractorConfig {
  return {
    type:    'strange-attractor',
    seed:    ri(1, 999),
    opacity: ri(76, 100),
    color:   pick(COLORS).value,
  };
}

function randomGenerator(type: GeneratorType): GeneratorConfig {
  if (type === 'flow-field')        return randomFlowField();
  if (type === 'dot-grid')          return randomDotGrid();
  if (type === 'isoline')           return randomIsoline();
  if (type === 'strange-attractor') return randomStrangeAttractor();
  return randomVoronoi();
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PanelSection({
  title, action, compact = false, children,
}: {
  title: string;
  action?: React.ReactNode;
  compact?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={['border-b border-border px-6', compact ? 'py-3.5' : 'py-6'].join(' ')}>
      <div className={[compact ? 'mb-0' : 'mb-3', 'flex items-center justify-between gap-3'].join(' ')}>
        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-wide text-foreground">{title}</h2>
        {action}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function SegmentedControl<T extends string>({
  value, options, onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex rounded-md bg-muted p-0.5">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={[
            'flex-1 cursor-pointer rounded-[5px] border border-transparent py-1.5 font-mono text-[11px] transition-colors',
            value === option.value
              ? 'border-border bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          ].join(' ')}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function SliderRow({
  label, value, min, max, step = 1, onChange, format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className={`${CONTROL_LABEL_W} shrink-0 font-mono text-[11px] text-muted-foreground`}>{label}</span>
      <div className="flex flex-1 items-center gap-2 rounded-md bg-muted px-2 py-2">
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-0.5 flex-1 cursor-ew-resize appearance-none rounded-full bg-border
            [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:w-2.5
            [&::-webkit-slider-thumb]:cursor-ew-resize [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-foreground"
        />
        <span className="w-10 shrink-0 text-right font-mono text-[11px] text-muted-foreground">
          {format ? format(value) : value}
        </span>
      </div>
    </div>
  );
}

function ColorDots({
  value, onChange,
}: { value: LayerColor; onChange: (v: LayerColor) => void; bgColor: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`${CONTROL_LABEL_W} shrink-0 font-mono text-[11px] text-muted-foreground`}>Color</span>
      <div className="flex flex-1 items-center gap-3 rounded-md bg-muted px-2 py-2">
        {COLORS.map((c) => {
          const hex = resolveLayerColor(c.value);
          const active = value === c.value;
          return (
            <button
              key={c.value}
              type="button"
              title={c.label}
              onClick={() => onChange(c.value)}
              style={{
                backgroundColor: hex,
                boxShadow: active
                  ? `0 0 0 2px ${brandAccent}`
                  : '0 0 0 1px rgba(0,0,0,0.18)',
              }}
              className="h-5 w-5 shrink-0 cursor-pointer rounded-full transition-all"
            />
          );
        })}
      </div>
    </div>
  );
}

function SettingsRow({
  label, children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className={`${CONTROL_LABEL_W} shrink-0 font-mono text-[11px] text-muted-foreground`}>{label}</span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function EditorialArtTool() {
  const canvasRef    = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const generatorMenuRef = useRef<HTMLDivElement>(null);
  const panelScrollRef = useRef<HTMLDivElement>(null);
  const panelContentRef = useRef<HTMLDivElement>(null);
  const panelScrollIdleRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);
  const [scale, setScale]             = useState(0.6);
  const [canvasReady, setCanvasReady] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [exportingStill, setExportingStill] = useState(false);
  const [motionReplayKey, setMotionReplayKey] = useState(0);
  const [generatorMenuOpen, setGeneratorMenuOpen] = useState(false);
  const [mobileControlsOpen, setMobileControlsOpen] = useState(false);
  const [panelScrolling, setPanelScrolling] = useState(false);
  const [panelScrollThumb, setPanelScrollThumb] = useState({ height: 0, top: 0, visible: false });
  const [state, setState]             = useState<AppState>(initialStateFromUrl);

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      setScale(Math.min((width - 48) / CANVAS_W, (height - 48) / CANVAS_H, 1));
    };
    update();
    setCanvasReady(true);
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const set = useCallback((patch: Partial<AppState>) => {
    setState((prev) => {
      return { ...prev, ...patch };
    });
  }, []);

  const patchGenerator = useCallback((patch: Record<string, unknown>) => {
    setState((prev) => ({
      ...prev,
      generator: { ...prev.generator, ...patch } as GeneratorConfig,
    }));
  }, []);

  const updatePanelScrollThumb = useCallback(() => {
    const scrollEl = panelScrollRef.current;
    if (!scrollEl) return;

    const { clientHeight, scrollHeight, scrollTop } = scrollEl;
    const visible = scrollHeight > clientHeight + 1;

    if (!visible) {
      setPanelScrollThumb({ height: 0, top: 0, visible: false });
      return;
    }

    const trackHeight = Math.max(0, clientHeight - SCROLL_THUMB_INSET * 2);
    const height = Math.max(28, (clientHeight / scrollHeight) * trackHeight);
    const maxScrollTop = scrollHeight - clientHeight;
    const maxThumbTop = trackHeight - height;
    const top = SCROLL_THUMB_INSET + (maxScrollTop > 0 ? (scrollTop / maxScrollTop) * maxThumbTop : 0);

    setPanelScrollThumb({
      height,
      top,
      visible,
    });
  }, []);

  const handlePanelScroll = useCallback(() => {
    updatePanelScrollThumb();
    setPanelScrolling(true);

    if (panelScrollIdleRef.current) {
      window.clearTimeout(panelScrollIdleRef.current);
    }

    panelScrollIdleRef.current = window.setTimeout(() => {
      setPanelScrolling(false);
      panelScrollIdleRef.current = null;
    }, 700);
  }, [updatePanelScrollThumb]);

  useEffect(() => {
    updatePanelScrollThumb();

    const scrollEl = panelScrollRef.current;
    if (!scrollEl) return;

    const ro = new ResizeObserver(updatePanelScrollThumb);
    ro.observe(scrollEl);
    if (panelContentRef.current) ro.observe(panelContentRef.current);
    window.addEventListener('resize', updatePanelScrollThumb);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updatePanelScrollThumb);
      if (panelScrollIdleRef.current) {
        window.clearTimeout(panelScrollIdleRef.current);
      }
    };
  }, [updatePanelScrollThumb]);

  useEffect(() => {
    if (!generatorMenuOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!generatorMenuRef.current?.contains(event.target as Node)) {
        setGeneratorMenuOpen(false);
      }
    };
    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [generatorMenuOpen]);

  const handleRandomize = useCallback(() => {
    setState((prev) => ({
      ...prev,
      bgColor: pick(bgPalette).value,
      generator: randomGenerator(prev.generator.type),
    }));
  }, []);

  const handleDownload = useCallback(async () => {
    if (!canvasRef.current) return;
    setDownloading(true);
    setExportingStill(true);
    try {
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
      await document.fonts.ready;
      const dataUrl = await toPng(canvasRef.current, { pixelRatio: 2 });
      const a = document.createElement('a');
      a.download = `${state.slug || defaultFilename(state.generator)}.png`;
      a.href = dataUrl;
      a.click();
    } finally {
      setExportingStill(false);
      setDownloading(false);
    }
  }, [state.generator, state.slug]);

  const { generator, bgColor } = state;

  return (
    <div data-editorial-art-tool className="relative flex h-[var(--pattern-engine-height,calc(100dvh-3.5rem))] overflow-hidden">

      {mobileControlsOpen && (
        <button
          type="button"
          aria-label="Close controls"
          onClick={() => setMobileControlsOpen(false)}
          className="fixed inset-0 z-40 cursor-default bg-background/70 backdrop-blur-sm md:hidden"
        />
      )}

      {/* ── Left control panel ──────────────────────────────────────────────── */}
      <div
        className={[
          'fixed inset-x-3 bottom-0 top-20 z-50 flex min-h-0 flex-col rounded-t-xl border border-b-0 border-border bg-background shadow-2xl transition-transform duration-200 md:static md:z-auto md:h-auto md:w-[340px] md:min-w-[340px] md:translate-y-0 md:rounded-none md:border-r md:border-t-0 md:border-l-0 md:shadow-none',
          mobileControlsOpen ? 'translate-y-0' : 'translate-y-full',
        ].join(' ')}
      >
        {/* Tool identity — pinned to top */}
        <div className="shrink-0 border-b border-border px-5 py-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-base font-medium text-foreground leading-tight">Pattern Engine</p>
              <p className="mt-1 text-xs text-muted-foreground leading-snug">Patterns for publishing assets.</p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={handleRandomize}
                title="Randomize everything"
                className="mt-0.5 rounded border border-border p-1.5 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                <RefreshCw className="size-3.5" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => setMobileControlsOpen(false)}
                title="Close controls"
                className="mt-0.5 rounded border border-border p-1.5 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground md:hidden"
              >
                <X className="size-3.5" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable controls */}
        <div className="relative flex-1 overflow-hidden">
          <div
            ref={panelScrollRef}
            onScroll={handlePanelScroll}
            className="h-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div ref={panelContentRef}>
              <PanelSection title="Generator">
            {/* Foundation type picker */}
            <div ref={generatorMenuRef} className="relative">
              <button
                type="button"
                aria-label="Generator selector"
                aria-haspopup="listbox"
                aria-expanded={generatorMenuOpen}
                onClick={() => setGeneratorMenuOpen((open) => !open)}
                className="flex h-9 w-full cursor-pointer items-center justify-between rounded-md border border-transparent bg-muted px-3 font-mono text-[12px] text-foreground focus:border-border focus:bg-background focus:outline-none"
              >
                <span>{GENERATOR_TYPES.find((f) => f.value === generator.type)?.label}</span>
                <ChevronDown className="size-4 text-foreground" strokeWidth={2} />
              </button>

              {generatorMenuOpen && (
                <div
                  role="listbox"
                  className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 rounded-md border border-border bg-background p-1 shadow-lg"
                >
                  {GENERATOR_TYPES.map((f) => {
                    const active = f.value === generator.type;
                    return (
                      <button
                        key={f.value}
                        type="button"
                        role="option"
                        aria-selected={active}
                        onClick={() => {
                          setState((prev) => ({
                            ...prev,
                            generator: switchGeneratorType(prev.generator, f.value),
                          }));
                          setGeneratorMenuOpen(false);
                        }}
                        className={[
                          'flex w-full cursor-pointer items-center rounded-[5px] px-2.5 py-2 text-left font-mono text-[12px] transition-colors',
                          active
                            ? 'bg-foreground text-background'
                            : 'text-foreground hover:bg-muted',
                        ].join(' ')}
                      >
                        {f.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Seed — shared by all foundation types */}
            <div className="flex items-center gap-2">
              <span className={`${CONTROL_LABEL_W} shrink-0 font-mono text-[11px] text-muted-foreground`}>Seed</span>
              <div className="flex flex-1 gap-1">
                <input
                  type="number" min={1} max={999} value={generator.seed}
                  onChange={(e) => patchGenerator({ seed: Math.max(1, Math.min(999, Number(e.target.value))) })}
                  className="h-9 min-w-0 flex-1 cursor-text rounded-md border border-transparent bg-muted px-3 py-0 font-mono text-[12px] leading-9 text-foreground focus:border-border focus:bg-background focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => patchGenerator({ seed: ri(1, 999) })}
                  title="New seed"
                  className="h-9 w-9 shrink-0 cursor-pointer rounded-md bg-muted text-muted-foreground transition-colors hover:text-foreground flex items-center justify-center"
                >
                  <RefreshCw className="size-3.5" strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Flow Field — specific controls */}
            {generator.type === 'flow-field' && (<>
              <SliderRow label="Density" value={generator.density}     min={30}   max={600} onChange={(v) => patchGenerator({ density: v })} />
              <SliderRow label="Steps"   value={generator.steps}       min={20}   max={200} onChange={(v) => patchGenerator({ steps: v })} />
            </>)}

            {/* Dot Grid — specific controls */}
            {generator.type === 'dot-grid' && (<>
              <SliderRow label="Spacing"  value={generator.spacing} min={12} max={48}  onChange={(v) => patchGenerator({ spacing: v })} />
              <SliderRow label="Dot Size" value={generator.dotSize} min={10} max={100} onChange={(v) => patchGenerator({ dotSize: v })} />
            </>)}

            {/* Isoline — specific controls */}
            {generator.type === 'isoline' && (
              <SliderRow label="Levels" value={generator.levels} min={3} max={20} onChange={(v) => patchGenerator({ levels: v })} />
            )}

            {/* Voronoi — specific controls */}
            {generator.type === 'voronoi' && (<>
              <SliderRow label="Cells"  value={generator.count}  min={20} max={200} onChange={(v) => patchGenerator({ count: v })} />
              <SliderRow label="Jitter" value={generator.jitter} min={0}  max={100} onChange={(v) => patchGenerator({ jitter: v })} />
            </>)}

            {/* Scale — shared by flow-field, dot-grid, isoline (not voronoi/strange-attractor) */}
            {'scale' in generator && (
              <SliderRow label="Scale" value={(generator as { scale: number }).scale} min={generator.type === 'flow-field' ? 80 : 100} max={600} onChange={(v) => patchGenerator({ scale: v })} />
            )}

            {/* Flow Field — curl + weight */}
            {generator.type === 'flow-field' && (<>
              <SliderRow label="Curl"   value={generator.curl}        min={-180} max={180} onChange={(v) => patchGenerator({ curl: v })} format={(v) => `${v}°`} />
              <SliderRow label="Weight" value={generator.strokeWidth} min={0.3}  max={2.0} step={0.1} onChange={(v) => patchGenerator({ strokeWidth: v })} />
            </>)}

            {/* Weight — flow field, isoline, voronoi all have strokeWidth */}
            {(generator.type === 'isoline' || generator.type === 'voronoi') && (
              <SliderRow label="Weight" value={generator.strokeWidth} min={0.3} max={2.0} step={0.1} onChange={(v) => patchGenerator({ strokeWidth: v })} />
            )}

              </PanelSection>

              <PanelSection title="Motion">
            <SettingsRow label="Mode">
              <SegmentedControl
                value={state.motion.mode}
                options={MOTION_MODES}
                onChange={(mode) => {
                  if (mode === 'reveal' && state.motion.mode === 'reveal') {
                    setMotionReplayKey((key) => key + 1);
                    return;
                  }
                  set({ motion: motionWithObviousDefaults(state.motion, mode) });
                }}
              />
            </SettingsRow>
            {state.motion.mode === 'ambient' && (
              <>
                <SliderRow
                  label="Speed"
                  value={state.motion.speed}
                  min={0}
                  max={100}
                  onChange={(speed) => set({ motion: { ...state.motion, speed } })}
                />
                <SliderRow
                  label="Intensity"
                  value={state.motion.intensity}
                  min={0}
                  max={100}
                  onChange={(intensity) => set({ motion: { ...state.motion, intensity } })}
                />
              </>
            )}
              </PanelSection>

              <PanelSection title="Appearance">
            <SettingsRow label="Tone">
              <SegmentedControl
                value={isColorDark(state.bgColor) ? 'dark' : 'light'}
                options={[
                  { value: 'dark',  label: 'Dark'  },
                  { value: 'light', label: 'Light' },
                ]}
                onChange={(tone) => {
                  setState((prev) => ({
                    ...prev,
                    bgColor: tone === 'dark' ? brand.warmDarkGray : brand.paper,
                    generator: {
                      ...prev.generator,
                      color: tone === 'dark' ? 'copper' : 'bronze',
                    } as GeneratorConfig,
                  }));
                }}
              />
            </SettingsRow>
            <SettingsRow label="Surface">
              <div className="flex items-center gap-3 rounded-md bg-muted px-2 py-2">
                {bgPalette.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    title={s.name}
                    onClick={() => set({ bgColor: s.value })}
                    style={{
                      backgroundColor: s.value,
                      boxShadow: bgColor === s.value
                        ? `0 0 0 2px ${brandAccent}`
                        : '0 0 0 1px rgba(0,0,0,0.12)',
                    }}
                    className="h-5 w-5 cursor-pointer rounded-full transition-all"
                  />
                ))}
              </div>
            </SettingsRow>
            <ColorDots value={generator.color} onChange={(v) => patchGenerator({ color: v })} bgColor={bgColor} />
            <SliderRow label="Opacity" value={generator.opacity} min={0} max={100} onChange={(v) => patchGenerator({ opacity: v })} />
            <SliderRow label="Texture" value={state.texture} min={0} max={100} onChange={(v) => set({ texture: v })} />
            <SliderRow label="Grain" value={state.grain} min={0} max={100} onChange={(v) => set({ grain: v })} />
              </PanelSection>

              <PanelSection
            title="Text"
            compact={!state.showText}
            action={
              <button
                type="button"
                aria-label={state.showText ? 'Hide text' : 'Show text'}
                onClick={() => set({ showText: !state.showText })}
                className={[
                  'cursor-pointer rounded-md px-2.5 py-1 font-mono text-[11px] transition-colors',
                  state.showText
                    ? 'bg-foreground text-background'
                    : 'bg-muted text-muted-foreground hover:text-foreground',
                ].join(' ')}
              >
                {state.showText ? 'On' : 'Off'}
              </button>
            }
          >
            {state.showText && (
              <>
                <input
                  type="text"
                  value={state.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    set({ title, slug: state.slugEdited ? state.slug : toSlug(title) });
                  }}
                  placeholder="Article title…"
                  className="w-full cursor-text rounded-md border border-transparent bg-muted px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-border focus:bg-background focus:outline-none"
                />
                <SegmentedControl
                  value={state.textFont}
                  options={TEXT_FONTS}
                  onChange={(textFont) => set({ textFont })}
                />
                <SegmentedControl
                  value={state.composition}
                  options={COMPOSITIONS}
                  onChange={(composition) => set({ composition })}
                />
                <SettingsRow label="Caption">
                  <SegmentedControl
                    value={state.showCaption ? 'on' : 'off'}
                    options={[
                      { value: 'off', label: 'Off' },
                      { value: 'on', label: 'On' },
                    ]}
                    onChange={(value) => set({ showCaption: value === 'on' })}
                  />
                </SettingsRow>
              </>
            )}
              </PanelSection>

              <div className="hidden md:block">
                <PanelSection title="Export">
                  <input
                    type="text"
                    value={state.slugEdited ? state.slug : defaultFilename(generator)}
                    onChange={(e) => setState((p) => ({ ...p, slug: e.target.value, slugEdited: true }))}
                    placeholder={defaultFilename(generator)}
                    className="w-full cursor-text rounded-md border border-transparent bg-muted px-3 py-2 font-mono text-[12px] text-foreground placeholder:text-muted-foreground/35 focus:border-border focus:bg-background focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={downloading}
                    className="w-full cursor-pointer rounded-md bg-foreground py-2 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {downloading ? 'Generating…' : 'Download PNG'}
                  </button>
                  <p className="font-mono text-[10px] text-muted-foreground/60">
                    1200 × 630 PNG
                  </p>
                </PanelSection>
              </div>
            </div>
          </div>

          {panelScrollThumb.visible && (
            <div
              aria-hidden="true"
              className={[
                'pointer-events-none absolute right-1.5 top-0 z-30 w-1.5 rounded-full bg-muted-foreground/20 transition-opacity duration-200',
                panelScrolling ? 'opacity-100' : 'opacity-0',
              ].join(' ')}
              style={{
                height: panelScrollThumb.height,
                transform: `translateY(${panelScrollThumb.top}px)`,
              }}
            />
          )}
        </div>
      </div>

      {/* ── Canvas ──────────────────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="flex flex-1 items-center justify-center overflow-hidden bg-card px-4 pb-20 pt-4 md:p-0"
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            width: CANVAS_W,
            height: CANVAS_H,
            flexShrink: 0,
            boxShadow: '0 2px 24px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)',
            borderRadius: 2,
            opacity: canvasReady ? 1 : 0,
            transition: 'opacity 0.4s ease-out',
          }}
        >
          <ArtCanvas
            ref={canvasRef}
            title={state.title}
            bgColor={bgColor}
            generator={generator}
            texture={state.texture}
            grain={state.grain}
            showCaption={state.showCaption}
            showText={state.showText}
            composition={state.composition}
            textFont={state.textFont}
            motion={exportingStill ? staticMotion : state.motion}
            motionReplayKey={motionReplayKey}
          />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-6 py-2 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur md:hidden">
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
              {GENERATOR_TYPES.find((f) => f.value === generator.type)?.label} · seed {generator.seed}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMobileControlsOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-muted px-3 font-mono text-[11px] text-foreground"
          >
            <SlidersHorizontal className="size-3.5" strokeWidth={2} />
            Controls
          </button>
        </div>
      </div>
    </div>
  );
}
