import { useRef, useEffect, useMemo, useCallback } from 'react';
import type { RefObject } from 'react';
import { type GeneratorConfig, resolveLayerColor } from './themes';
import { generateFlowField, drawFlowField, type FlowPath } from './generators/flowField';
import { generateDotGrid, drawDotGrid, type Dot } from './generators/dotGrid';
import { generateIsolines, drawIsolines, type IsolineLevel } from './generators/isoline';
import { generateVoronoi, drawVoronoi, type VoronoiEdge } from './generators/voronoi';
import { generateAttractor, drawAttractor, type AttractorData } from './generators/attractor';

type GeneratedData =
  | { type: 'flow-field';        data: FlowPath[] }
  | { type: 'dot-grid';          data: Dot[] }
  | { type: 'isoline';           data: IsolineLevel[] }
  | { type: 'voronoi';           data: VoronoiEdge[] }
  | { type: 'strange-attractor'; data: AttractorData };

// Key covering only the params that require regeneration (not color/opacity/strokeWidth)
function shapeKey(config: GeneratorConfig): string {
  switch (config.type) {
    case 'flow-field':        return `ff-${config.seed}-${config.density}-${config.steps}-${config.scale}-${config.curl}`;
    case 'dot-grid':          return `dg-${config.seed}-${config.spacing}-${config.scale}-${config.dotSize}`;
    case 'isoline':           return `il-${config.seed}-${config.levels}-${config.scale}`;
    case 'voronoi':           return `vo-${config.seed}-${config.count}-${config.jitter}`;
    case 'strange-attractor': return `sa-${config.seed}`;
  }
}

function generateData(config: GeneratorConfig): GeneratedData {
  switch (config.type) {
    case 'flow-field':        return { type: 'flow-field',        data: generateFlowField(config) };
    case 'dot-grid':          return { type: 'dot-grid',          data: generateDotGrid(config) };
    case 'isoline':           return { type: 'isoline',           data: generateIsolines(config) };
    case 'voronoi':           return { type: 'voronoi',           data: generateVoronoi(config) };
    case 'strange-attractor': return { type: 'strange-attractor', data: generateAttractor(config) };
  }
}

function renderData(
  ctx: CanvasRenderingContext2D,
  generated: GeneratedData,
  config: GeneratorConfig,
  w: number,
  h: number,
  progress: number,
): void {
  const color = resolveLayerColor(config.color);
  if (config.type === 'flow-field' && generated.type === 'flow-field') {
    drawFlowField(ctx, generated.data, color, config.opacity, config.strokeWidth, w, h, progress);
  } else if (config.type === 'dot-grid' && generated.type === 'dot-grid') {
    drawDotGrid(ctx, generated.data, color, config.opacity, w, h, progress);
  } else if (config.type === 'isoline' && generated.type === 'isoline') {
    drawIsolines(ctx, generated.data, color, config.opacity, config.strokeWidth, w, h, progress);
  } else if (config.type === 'voronoi' && generated.type === 'voronoi') {
    drawVoronoi(ctx, generated.data, color, config.opacity, config.strokeWidth, w, h, progress);
  } else if (config.type === 'strange-attractor' && generated.type === 'strange-attractor') {
    drawAttractor(ctx, generated.data, color, config.opacity, w, h, progress);
  }
}

export interface UseGenerativeCanvasOptions {
  animate?: boolean;   // play draw-in animation on mount/data change
  duration?: number;   // animation duration in ms (default 2500)
}

export function useGenerativeCanvas(
  config: GeneratorConfig,
  bgColor: string,
  opts?: UseGenerativeCanvasOptions,
): { canvasRef: RefObject<HTMLCanvasElement> } {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animate = opts?.animate ?? false;
  const duration = opts?.duration ?? 2500;

  // Regenerate data only when structural params change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const generated = useMemo(() => generateData(config), [shapeKey(config)]);

  // Always-current refs so stable callbacks can read latest values
  const generatedRef = useRef(generated);
  generatedRef.current = generated;
  const configRef = useRef(config);
  configRef.current = config;
  const bgColorRef = useRef(bgColor);
  bgColorRef.current = bgColor;
  // Tracks the last rendered progress so ResizeObserver and color changes redraw correctly
  const progressRef = useRef(animate ? 0 : 1);

  // Stable redraw — always reads from refs, safe to use inside ResizeObserver/RAF
  const redraw = useCallback((p: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    if (w === 0 || h === 0) return;

    progressRef.current = p;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = bgColorRef.current;
    ctx.fillRect(0, 0, w, h);
    renderData(ctx, generatedRef.current, configRef.current, w, h, p);
  }, []);

  // Draw/animate effect: restarts when generated data changes (seed or structural params)
  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!animate || prefersReduced) {
      redraw(1);
      return;
    }

    let rafId: number;
    let startTime: number | null = null;

    function tick(ts: number) {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      redraw(p);
      if (p < 1) rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [generated, animate, duration, redraw]);

  // Re-render at current progress when visual style (color/opacity/strokeWidth/bg) changes
  // without restarting animation
  useEffect(() => {
    redraw(progressRef.current);
  }, [config, bgColor, redraw]);

  // Resize canvas to match container in device pixels, then redraw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width === 0 || height === 0) continue;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        redraw(progressRef.current);
      }
    });

    ro.observe(canvas);
    return () => ro.disconnect();
  }, [redraw]);

  return { canvasRef };
}
