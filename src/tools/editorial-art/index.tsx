import { useRef, useState, useEffect, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { ArtCanvas } from './ArtCanvas';
import {
  themes,
  bgPalette,
  brand,
  resolveLayerColor,
  isColorDark,
  type ThemeId,
  type LayerColor,
  type Composition,
  type FlowFieldConfig,
} from './themes';

// ── Types ─────────────────────────────────────────────────────────────────────

interface AppState {
  themeId: ThemeId;
  bgColor: string;
  field: FlowFieldConfig;
  texture: number;
  showText: boolean;
  title: string;
  slug: string;
  slugEdited: boolean;
  composition: Composition;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const CANVAS_W = 1200;
const CANVAS_H = 630;
const PANEL_W  = 300;

const COMPOSITIONS: { value: Composition; label: string }[] = [
  { value: 'left',     label: 'Left'   },
  { value: 'centered', label: 'Center' },
  { value: 'offset',   label: 'Offset' },
];

const COLORS: { value: LayerColor; label: string }[] = [
  { value: 'copper', label: 'Copper' },
  { value: 'light',  label: 'Light'  },
  { value: 'dark',   label: 'Dark'   },
  { value: 'muted',  label: 'Muted'  },
];

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
    field: { ...t.defaultField },
    texture: t.defaultTexture,
    showText: false,
    title: '',
    slug: '',
    slugEdited: false,
    composition: t.defaultComposition,
  };
}

function randomField(): FlowFieldConfig {
  return {
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

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground select-none">
      {children}
    </div>
  );
}

function Divider() {
  return <div className="my-4 border-t border-border" />;
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
      <span className="w-14 shrink-0 font-mono text-[10px] text-muted-foreground">{label}</span>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-0.5 flex-1 cursor-pointer appearance-none rounded-full bg-border
          [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:w-2.5
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-foreground"
      />
      <span className="w-10 shrink-0 text-right font-mono text-[10px] text-muted-foreground">
        {format ? format(value) : value}
      </span>
    </div>
  );
}

function ColorDots({
  value, onChange, bgColor,
}: { value: LayerColor; onChange: (v: LayerColor) => void; bgColor: string }) {
  const isDark = isColorDark(bgColor);
  return (
    <div className="flex items-center gap-2">
      <span className="w-14 shrink-0 font-mono text-[10px] text-muted-foreground">Color</span>
      <div className="flex gap-2">
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
                  ? `0 0 0 2px ${isDark ? brand.offWhite : brand.darkText}`
                  : `0 0 0 1px ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'}`,
              }}
              className="h-4 w-4 rounded-full transition-all"
            />
          );
        })}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function EditorialArtTool() {
  const canvasRef    = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale]             = useState(0.6);
  const [downloading, setDownloading] = useState(false);
  const [state, setState]             = useState<AppState>(() => defaultState('ai'));

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

  const setField = useCallback((patch: Partial<FlowFieldConfig>) => {
    setState((prev) => ({ ...prev, field: { ...prev.field, ...patch } }));
  }, []);

  const handleRandomize = useCallback(() => {
    setState((prev) => ({
      ...prev,
      bgColor: pick(bgPalette).value,
      field: randomField(),
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

  const { field, bgColor } = state;

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
              <p className="mt-1 text-xs text-muted-foreground leading-snug">Generative feature images for Unknown Arts articles.</p>
            </div>
            <button
              type="button"
              onClick={handleRandomize}
              title="Randomize everything"
              className="mt-0.5 shrink-0 rounded border border-border px-2 py-0.5 font-mono text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
            >
              ↻
            </button>
          </div>
        </div>

        {/* Scrollable controls */}
        <div className="flex-1 overflow-y-auto px-5 py-5">

          <SectionLabel>Theme</SectionLabel>
          <select
            value={state.themeId}
            onChange={(e) => set({ themeId: e.target.value as ThemeId })}
            className="w-full rounded border border-border bg-background pl-2 pr-7 py-1.5 font-mono text-[11px] text-foreground focus:border-foreground focus:outline-none"
          >
            {Object.values(themes).map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>

          <Divider />

          <SectionLabel>Flow Field</SectionLabel>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-14 shrink-0 font-mono text-[10px] text-muted-foreground">Seed</span>
              <input
                type="number" min={1} max={999} value={field.seed}
                onChange={(e) => setField({ seed: Math.max(1, Math.min(999, Number(e.target.value))) })}
                className="flex-1 rounded border border-border bg-background px-2 py-0.5 font-mono text-[11px] text-foreground focus:border-foreground focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setField({ seed: ri(1, 999) })}
                title="New seed"
                className="shrink-0 rounded border border-border px-2 py-0.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                ↻
              </button>
            </div>
            <SliderRow label="Density"  value={field.density}     min={30}   max={600} onChange={(v) => setField({ density: v })} />
            <SliderRow label="Steps"    value={field.steps}       min={20}   max={200} onChange={(v) => setField({ steps: v })} />
            <SliderRow label="Scale"    value={field.scale}       min={80}   max={600} onChange={(v) => setField({ scale: v })} />
            <SliderRow label="Curl"     value={field.curl}        min={-180} max={180} onChange={(v) => setField({ curl: v })} format={(v) => `${v}°`} />
            <SliderRow label="Weight"   value={field.strokeWidth} min={0.3}  max={2.0} step={0.1} onChange={(v) => setField({ strokeWidth: v })} />
          </div>

          <Divider />

          <SectionLabel>Appearance</SectionLabel>
          <div className="space-y-3">
            <ColorDots value={field.color} onChange={(v) => setField({ color: v })} bgColor={bgColor} />
            <SliderRow label="Opacity" value={field.opacity} min={0} max={100} onChange={(v) => setField({ opacity: v })} />
          </div>

          <Divider />

          <SectionLabel>Background</SectionLabel>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {bgPalette.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  title={s.name}
                  onClick={() => set({ bgColor: s.value })}
                  style={{
                    backgroundColor: s.value,
                    boxShadow: bgColor === s.value
                      ? `0 0 0 2px ${brand.copper}`
                      : '0 0 0 1px rgba(0,0,0,0.12)',
                  }}
                  className="h-6 w-6 rounded-full transition-all"
                />
              ))}
            </div>
            <SliderRow label="Grain" value={state.texture} min={0} max={100} onChange={(v) => set({ texture: v })} />
          </div>

          <Divider />

          <SectionLabel>Text</SectionLabel>
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => set({ showText: !state.showText })}
              className={[
                'rounded border px-2.5 py-1 font-mono text-[10px] transition-colors',
                state.showText
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground',
              ].join(' ')}
            >
              {state.showText ? 'On' : 'Off'}
            </button>
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
                  className="w-full rounded border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-foreground focus:outline-none"
                />
                <div className="flex gap-1">
                  {COMPOSITIONS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => set({ composition: c.value })}
                      className={[
                        'flex-1 rounded border py-1 font-mono text-[10px] transition-colors',
                        state.composition === c.value
                          ? 'border-foreground bg-foreground text-background'
                          : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground',
                      ].join(' ')}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

        </div>

        {/* Export — pinned to panel bottom */}
        <div className="shrink-0 border-t border-border px-5 py-4 space-y-2.5">
          <SectionLabel>Export</SectionLabel>
          <input
            type="text"
            value={state.slug}
            onChange={(e) => setState((p) => ({ ...p, slug: e.target.value, slugEdited: true }))}
            onFocus={() => { if (!state.slug && state.title) setState((p) => ({ ...p, slug: toSlug(p.title) })); }}
            placeholder="filename-slug"
            className="w-full rounded border border-border bg-background px-2.5 py-1.5 font-mono text-[11px] text-foreground placeholder:text-muted-foreground/35 focus:border-foreground focus:outline-none"
          />
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="w-full rounded bg-foreground py-1.5 text-xs font-medium text-background transition-opacity disabled:opacity-40 hover:opacity-80"
          >
            {downloading ? 'Generating…' : 'Download PNG'}
          </button>
          <p className="font-mono text-[9px] text-muted-foreground/40">
            1200 × 630 · 2× export = 2400 × 1260 px
          </p>
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
            themeId={state.themeId}
            bgColor={bgColor}
            field={field}
            texture={state.texture}
            showText={state.showText}
            composition={state.composition}
          />
        </div>
      </div>
    </div>
  );
}
