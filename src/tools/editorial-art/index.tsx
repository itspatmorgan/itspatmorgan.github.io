import { useRef, useState, useEffect, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { ChevronDown, RefreshCw } from 'lucide-react';
import { ArtCanvas } from './ArtCanvas';
import {
  themes,
  brand,
  bgPalette,
  brandAccent,
  resolveLayerColor,
  isColorDark,
  type ThemeId,
  type LayerColor,
  type Composition,
  type FoundationConfig,
  type FoundationType,
  type FlowFieldConfig,
  type DotGridConfig,
  type IsolineConfig,
  type VoronoiConfig,
  type StrangeAttractorConfig,
  type TextFont,
} from './themes';

// ── Types ─────────────────────────────────────────────────────────────────────

interface AppState {
  themeId: ThemeId;
  bgColor: string;
  foundation: FoundationConfig;
  texture: number;
  grain: number;
  showCaption: boolean;
  showText: boolean;
  title: string;
  slug: string;
  slugEdited: boolean;
  composition: Composition;
  textFont: TextFont;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const CANVAS_W = 1200;
const CANVAS_H = 630;
const PANEL_W  = 340;
const CONTROL_LABEL_W = 'w-[4.75rem]';

const FOUNDATION_TYPES: { value: FoundationType; label: string }[] = [
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

const SURFACE_PRESETS = [
  { label: 'Off', value: 0 },
  { label: 'Soft', value: 35 },
  { label: 'Heavy', value: 75 },
] as const;

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

function defaultState(themeId: ThemeId): AppState {
  const t = themes[themeId];
  return {
    themeId,
    bgColor: t.defaultBgColor,
    foundation: { ...t.defaultFoundation },
    texture: t.defaultTexture,
    grain: 24,
    showCaption: false,
    showText: false,
    title: '',
    slug: '',
    slugEdited: false,
    composition: t.defaultComposition,
    textFont: 'sans',
  };
}

function themeIdFromParam(value: string | null): ThemeId {
  if (!value) return 'ai';
  const normalized = value.toLowerCase().replace(/\s+/g, '-');
  const matched = Object.values(themes).find((theme) =>
    theme.id === normalized || theme.label.toLowerCase().replace(/\s+/g, '-') === normalized
  );
  return matched?.id ?? 'ai';
}

function bgColorFromParam(value: string | null, fallback: string): string {
  if (value === 'paper') return brand.paper;
  if (value === 'off-white') return brand.offWhite;
  if (value === 'warm-dark-gray' || value === 'dark') return brand.warmDarkGray;
  if (value && /^#[0-9a-f]{6}$/i.test(value)) return value;
  return fallback;
}

function currentColorModeTone(): { bgColor: string; color: LayerColor } {
  const dark = document.documentElement.classList.contains('dark');
  return dark
    ? { bgColor: brand.warmDarkGray, color: 'copper' }
    : { bgColor: brand.paper, color: 'bronze' };
}

function numberParam(params: URLSearchParams, key: string, fallback: number): number {
  const value = Number(params.get(key));
  return Number.isFinite(value) ? value : fallback;
}

function colorParam(value: string | null, fallback: LayerColor): LayerColor {
  return COLORS.some((color) => color.value === value) ? value as LayerColor : fallback;
}

function parseFoundation(params: URLSearchParams, fallback: FoundationConfig): FoundationConfig {
  const typeParam = params.get('foundation') ?? params.get('type');
  const type = FOUNDATION_TYPES.some((item) => item.value === typeParam)
    ? typeParam as FoundationType
    : fallback.type;
  const base = switchFoundationType(fallback, type);
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
  const params = new URLSearchParams(window.location.search);
  const themeId = themeIdFromParam(params.get('theme'));
  const state = defaultState(themeId);
  if (!window.location.search) return state;
  const foundation = parseFoundation(params, state.foundation);
  const autoTone = params.get('tone') === 'auto' ? currentColorModeTone() : null;

  return {
    ...state,
    bgColor: autoTone?.bgColor ?? bgColorFromParam(params.get('bg'), state.bgColor),
    foundation: {
      ...foundation,
      ...(autoTone ? { color: autoTone.color } : {}),
    } as FoundationConfig,
    texture: numberParam(params, 'texture', state.texture),
    grain: numberParam(params, 'grain', state.grain),
  };
}

// Switch foundation type while preserving shared params (seed, scale, color, opacity)
function switchFoundationType(current: FoundationConfig, toType: FoundationType): FoundationConfig {
  if (toType === current.type) return current;
  // Safely read scale from configs that have it; fall back to sensible defaults.
  const currentScale = 'scale' in current ? (current as { scale: number }).scale : 300;
  const currentStrokeWidth = 'strokeWidth' in current ? (current as { strokeWidth: number }).strokeWidth : 0.7;

  if (toType === 'dot-grid') {
    return {
      type: 'dot-grid',
      seed:    current.seed,
      spacing: 20,
      scale:   Math.max(100, Math.min(600, currentScale)),
      dotSize: 75,
      opacity: current.opacity,
      color:   current.color,
    } satisfies DotGridConfig;
  }
  if (toType === 'isoline') {
    return {
      type:        'isoline',
      seed:        current.seed,
      levels:      10,
      scale:       Math.max(100, Math.min(600, currentScale)),
      strokeWidth: currentStrokeWidth,
      opacity:     current.opacity,
      color:       current.color,
    } satisfies IsolineConfig;
  }
  if (toType === 'voronoi') {
    return {
      type:        'voronoi',
      seed:        current.seed,
      count:       80,
      jitter:      75,
      strokeWidth: currentStrokeWidth,
      opacity:     current.opacity,
      color:       current.color,
    } satisfies VoronoiConfig;
  }
  if (toType === 'strange-attractor') {
    return {
      type:    'strange-attractor',
      seed:    current.seed,
      opacity: current.opacity,
      color:   current.color,
    } satisfies StrangeAttractorConfig;
  }
  return {
    type:        'flow-field',
    seed:        current.seed,
    density:     180,
    steps:       90,
    scale:       Math.max(80, Math.min(600, currentScale)),
    curl:        0,
    strokeWidth: currentStrokeWidth,
    opacity:     current.opacity,
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
    strokeWidth: rf(0.4, 1.4),
    opacity:     ri(25, 60),
    color:       pick(COLORS).value,
  };
}

function randomDotGrid(): DotGridConfig {
  return {
    type:    'dot-grid',
    seed:    ri(1, 999),
    spacing: ri(12, 36),
    scale:   ri(150, 500),
    dotSize: ri(50, 95),
    opacity: ri(30, 70),
    color:   pick(COLORS).value,
  };
}

function randomIsoline(): IsolineConfig {
  return {
    type:        'isoline',
    seed:        ri(1, 999),
    levels:      ri(5, 18),
    scale:       ri(150, 500),
    strokeWidth: rf(0.4, 1.5),
    opacity:     ri(30, 70),
    color:       pick(COLORS).value,
  };
}

function randomVoronoi(): VoronoiConfig {
  return {
    type:        'voronoi',
    seed:        ri(1, 999),
    count:       ri(40, 160),
    jitter:      ri(50, 100),
    strokeWidth: rf(0.3, 1.2),
    opacity:     ri(25, 65),
    color:       pick(COLORS).value,
  };
}

function randomStrangeAttractor(): StrangeAttractorConfig {
  return {
    type:    'strange-attractor',
    seed:    ri(1, 999),
    opacity: ri(40, 80),
    color:   pick(COLORS).value,
  };
}

function randomFoundation(type: FoundationType): FoundationConfig {
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

function PresetButtons({
  label, value, onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex rounded-md bg-muted p-0.5">
      {SURFACE_PRESETS.map((preset) => (
        <button
          key={preset.label}
          type="button"
          aria-label={`${label} ${preset.label}`}
          onClick={() => onChange(preset.value)}
          className={[
            'flex-1 cursor-pointer rounded-[5px] border border-transparent py-1.5 font-mono text-[11px] transition-colors',
            value === preset.value
              ? 'border-border bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          ].join(' ')}
        >
          {preset.label}
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
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const foundationMenuRef = useRef<HTMLDivElement>(null);
  const panelScrollRef = useRef<HTMLDivElement>(null);
  const panelContentRef = useRef<HTMLDivElement>(null);
  const panelScrollIdleRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);
  const [scale, setScale]             = useState(0.6);
  const [downloading, setDownloading] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [foundationMenuOpen, setFoundationMenuOpen] = useState(false);
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
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const set = useCallback((patch: Partial<AppState>) => {
    setState((prev) => {
      if (patch.themeId && patch.themeId !== prev.themeId) {
        return {
          ...defaultState(patch.themeId),
          title: prev.title, slug: prev.slug,
          slugEdited: prev.slugEdited, showText: prev.showText,
        };
      }
      return { ...prev, ...patch };
    });
  }, []);

  const patchFoundation = useCallback((patch: Record<string, unknown>) => {
    setState((prev) => ({
      ...prev,
      foundation: { ...prev.foundation, ...patch } as FoundationConfig,
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
    if (!themeMenuOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!themeMenuRef.current?.contains(event.target as Node)) {
        setThemeMenuOpen(false);
      }
    };
    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [themeMenuOpen]);

  useEffect(() => {
    if (!foundationMenuOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!foundationMenuRef.current?.contains(event.target as Node)) {
        setFoundationMenuOpen(false);
      }
    };
    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [foundationMenuOpen]);

  const handleRandomize = useCallback(() => {
    setState((prev) => ({
      ...prev,
      bgColor: pick(bgPalette).value,
      foundation: randomFoundation(prev.foundation.type),
    }));
  }, []);

  const handleDownload = useCallback(async () => {
    if (!canvasRef.current) return;
    setDownloading(true);
    try {
      await document.fonts.ready;
      const dataUrl = await toPng(canvasRef.current, { pixelRatio: 2 });
      const a = document.createElement('a');
      a.download = `${state.slug || 'feature'}-feature.png`;
      a.href = dataUrl;
      a.click();
    } finally {
      setDownloading(false);
    }
  }, [state.slug]);

  const { foundation, bgColor } = state;

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">

      {/* ── Left control panel ──────────────────────────────────────────────── */}
      <div
        style={{ width: PANEL_W, minWidth: PANEL_W }}
        className="flex flex-col border-r border-border bg-background"
      >
        {/* Tool identity — pinned to top */}
        <div className="shrink-0 border-b border-border px-5 py-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-base font-medium text-foreground leading-tight">Editorial Art Tool</p>
              <p className="mt-1 text-xs text-muted-foreground leading-snug">Generative feature images for my articles.</p>
            </div>
            <button
              type="button"
              onClick={handleRandomize}
              title="Randomize everything"
              className="mt-0.5 shrink-0 rounded border border-border p-1.5 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
            >
              <RefreshCw className="size-3.5" strokeWidth={2} />
            </button>
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
              <PanelSection title="Theme">
            <div ref={themeMenuRef} className="relative">
              <button
                type="button"
                aria-label="Theme selector"
                aria-haspopup="listbox"
                aria-expanded={themeMenuOpen}
                onClick={() => setThemeMenuOpen((open) => !open)}
                className="flex h-9 w-full cursor-pointer items-center justify-between rounded-md border border-transparent bg-muted px-3 font-mono text-[12px] text-foreground focus:border-border focus:bg-background focus:outline-none"
              >
                <span>{themes[state.themeId].label}</span>
                <ChevronDown className="size-4 text-foreground" strokeWidth={2} />
              </button>

              {themeMenuOpen && (
                <div
                  role="listbox"
                  className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 rounded-md border border-border bg-background p-1 shadow-lg"
                >
                  {Object.values(themes).map((theme) => {
                    const active = theme.id === state.themeId;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        role="option"
                        aria-selected={active}
                        onClick={() => {
                          set({ themeId: theme.id });
                          setThemeMenuOpen(false);
                        }}
                        className={[
                          'flex w-full cursor-pointer items-center rounded-[5px] px-2.5 py-2 text-left font-mono text-[12px] transition-colors',
                          active
                            ? 'bg-foreground text-background'
                            : 'text-foreground hover:bg-muted',
                        ].join(' ')}
                      >
                        {theme.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
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
                    foundation: {
                      ...prev.foundation,
                      color: tone === 'dark' ? 'copper' : 'bronze',
                    } as FoundationConfig,
                  }));
                }}
              />
              </PanelSection>

              <PanelSection title="Foundation">
            {/* Foundation type picker */}
            <div ref={foundationMenuRef} className="relative">
              <button
                type="button"
                aria-label="Foundation selector"
                aria-haspopup="listbox"
                aria-expanded={foundationMenuOpen}
                onClick={() => setFoundationMenuOpen((open) => !open)}
                className="flex h-9 w-full cursor-pointer items-center justify-between rounded-md border border-transparent bg-muted px-3 font-mono text-[12px] text-foreground focus:border-border focus:bg-background focus:outline-none"
              >
                <span>{FOUNDATION_TYPES.find((f) => f.value === foundation.type)?.label}</span>
                <ChevronDown className="size-4 text-foreground" strokeWidth={2} />
              </button>

              {foundationMenuOpen && (
                <div
                  role="listbox"
                  className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 rounded-md border border-border bg-background p-1 shadow-lg"
                >
                  {FOUNDATION_TYPES.map((f) => {
                    const active = f.value === foundation.type;
                    return (
                      <button
                        key={f.value}
                        type="button"
                        role="option"
                        aria-selected={active}
                        onClick={() => {
                          setState((prev) => ({
                            ...prev,
                            foundation: switchFoundationType(prev.foundation, f.value),
                          }));
                          setFoundationMenuOpen(false);
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
                  type="number" min={1} max={999} value={foundation.seed}
                  onChange={(e) => patchFoundation({ seed: Math.max(1, Math.min(999, Number(e.target.value))) })}
                  className="h-9 min-w-0 flex-1 cursor-text rounded-md border border-transparent bg-muted px-3 py-0 font-mono text-[12px] leading-9 text-foreground focus:border-border focus:bg-background focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => patchFoundation({ seed: ri(1, 999) })}
                  title="New seed"
                  className="h-9 w-9 shrink-0 cursor-pointer rounded-md bg-muted text-muted-foreground transition-colors hover:text-foreground flex items-center justify-center"
                >
                  <RefreshCw className="size-3.5" strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Flow Field — specific controls */}
            {foundation.type === 'flow-field' && (<>
              <SliderRow label="Density" value={foundation.density}     min={30}   max={600} onChange={(v) => patchFoundation({ density: v })} />
              <SliderRow label="Steps"   value={foundation.steps}       min={20}   max={200} onChange={(v) => patchFoundation({ steps: v })} />
            </>)}

            {/* Dot Grid — specific controls */}
            {foundation.type === 'dot-grid' && (<>
              <SliderRow label="Spacing"  value={foundation.spacing} min={12} max={48}  onChange={(v) => patchFoundation({ spacing: v })} />
              <SliderRow label="Dot Size" value={foundation.dotSize} min={10} max={100} onChange={(v) => patchFoundation({ dotSize: v })} />
            </>)}

            {/* Isoline — specific controls */}
            {foundation.type === 'isoline' && (
              <SliderRow label="Levels" value={foundation.levels} min={3} max={20} onChange={(v) => patchFoundation({ levels: v })} />
            )}

            {/* Voronoi — specific controls */}
            {foundation.type === 'voronoi' && (<>
              <SliderRow label="Cells"  value={foundation.count}  min={20} max={200} onChange={(v) => patchFoundation({ count: v })} />
              <SliderRow label="Jitter" value={foundation.jitter} min={0}  max={100} onChange={(v) => patchFoundation({ jitter: v })} />
            </>)}

            {/* Strange Attractor — seed is the creative control; no extra params needed */}
            {foundation.type === 'strange-attractor' && (
              <p className="font-mono text-[10px] text-muted-foreground/60 leading-relaxed">
                Clifford attractor. Each seed maps to a unique orbit.
              </p>
            )}

            {/* Scale — shared by flow-field, dot-grid, isoline (not voronoi/strange-attractor) */}
            {'scale' in foundation && (
              <SliderRow label="Scale" value={(foundation as { scale: number }).scale} min={foundation.type === 'flow-field' ? 80 : 100} max={600} onChange={(v) => patchFoundation({ scale: v })} />
            )}

            {/* Flow Field — curl + weight */}
            {foundation.type === 'flow-field' && (<>
              <SliderRow label="Curl"   value={foundation.curl}        min={-180} max={180} onChange={(v) => patchFoundation({ curl: v })} format={(v) => `${v}°`} />
              <SliderRow label="Weight" value={foundation.strokeWidth} min={0.3}  max={2.0} step={0.1} onChange={(v) => patchFoundation({ strokeWidth: v })} />
            </>)}

            {/* Weight — flow field, isoline, voronoi all have strokeWidth */}
            {(foundation.type === 'isoline' || foundation.type === 'voronoi') && (
              <SliderRow label="Weight" value={foundation.strokeWidth} min={0.3} max={2.0} step={0.1} onChange={(v) => patchFoundation({ strokeWidth: v })} />
            )}

            {/* Color + Opacity — shared */}
            <ColorDots value={foundation.color} onChange={(v) => patchFoundation({ color: v })} bgColor={bgColor} />
            <SliderRow label="Opacity" value={foundation.opacity} min={0} max={100} onChange={(v) => patchFoundation({ opacity: v })} />
              </PanelSection>

              <PanelSection title="Canvas Style">
            <SettingsRow label="Color">
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
            <div className="space-y-2">
              <SliderRow label="Texture" value={state.texture} min={0} max={100} onChange={(v) => set({ texture: v })} />
              <SettingsRow label="">
                <PresetButtons label="Texture" value={state.texture} onChange={(v) => set({ texture: v })} />
              </SettingsRow>
            </div>
            <div className="space-y-2">
              <SliderRow label="Grain" value={state.grain} min={0} max={100} onChange={(v) => set({ grain: v })} />
              <SettingsRow label="">
                <PresetButtons label="Grain" value={state.grain} onChange={(v) => set({ grain: v })} />
              </SettingsRow>
            </div>
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
              </>
            )}
              </PanelSection>

              <PanelSection title="Export">
            <input
              type="text"
              value={state.slug}
              onChange={(e) => setState((p) => ({ ...p, slug: e.target.value, slugEdited: true }))}
              onFocus={() => { if (!state.slug && state.title) setState((p) => ({ ...p, slug: toSlug(p.title) })); }}
              placeholder="filename-slug"
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
              1200 × 630 · 2× export = 2400 × 1260 px
            </p>
              </PanelSection>
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
        className="flex flex-1 items-center justify-center overflow-hidden bg-card"
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
          }}
        >
          <ArtCanvas
            ref={canvasRef}
            title={state.title}
            bgColor={bgColor}
            foundation={foundation}
            texture={state.texture}
            grain={state.grain}
            showCaption={state.showCaption}
            showText={state.showText}
            composition={state.composition}
            textFont={state.textFont}
          />
        </div>
      </div>
    </div>
  );
}
