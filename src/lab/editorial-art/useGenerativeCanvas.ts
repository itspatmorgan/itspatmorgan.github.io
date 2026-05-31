import { useRef, useEffect, useMemo, useCallback, type RefObject } from 'react';
import { staticMotion, type GeneratorConfig, type MotionConfig, type RenderContext, resolveLayerColor } from './themes';
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
  render: RenderContext,
): void {
  const color = resolveLayerColor(config.color);
  if (config.type === 'flow-field' && generated.type === 'flow-field') {
    drawFlowField(ctx, generated.data, color, config.opacity, config.strokeWidth, w, h, render);
  } else if (config.type === 'dot-grid' && generated.type === 'dot-grid') {
    drawDotGrid(ctx, generated.data, color, config.opacity, w, h, render);
  } else if (config.type === 'isoline' && generated.type === 'isoline') {
    drawIsolines(ctx, generated.data, color, config.opacity, config.strokeWidth, w, h, render);
  } else if (config.type === 'voronoi' && generated.type === 'voronoi') {
    drawVoronoi(ctx, generated.data, color, config.opacity, config.strokeWidth, w, h, render);
  } else if (config.type === 'strange-attractor' && generated.type === 'strange-attractor') {
    drawAttractor(ctx, generated.data, color, config.opacity, w, h, render);
  }
}

export interface UseGenerativeCanvasOptions {
  motion?: MotionConfig;
  duration?: number;   // animation duration in ms (default 2500)
  transparentBackground?: boolean;
  width?: number;
  height?: number;
}

export function useGenerativeCanvas(
  config: GeneratorConfig,
  bgColor: string,
  opts?: UseGenerativeCanvasOptions,
): { canvasRef: RefObject<HTMLCanvasElement | null> } {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const motion = opts?.motion ?? staticMotion;
  const duration = opts?.duration ?? 2500;
  const transparentBackground = opts?.transparentBackground ?? false;
  const explicitWidth = opts?.width;
  const explicitHeight = opts?.height;

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
  const transparentBackgroundRef = useRef(transparentBackground);
  transparentBackgroundRef.current = transparentBackground;
  const motionRef = useRef(motion);
  motionRef.current = motion;
  const renderRef = useRef<RenderContext>({
    progress: motion.mode === 'reveal' ? 0 : 1,
    time: 0,
    motion,
  });

  // Stable redraw — always reads from refs, safe to use inside ResizeObserver/RAF
  const redraw = useCallback((render: RenderContext) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    if (w === 0 || h === 0) return;

    renderRef.current = render;
    ctx.clearRect(0, 0, w, h);
    if (!transparentBackgroundRef.current) {
      ctx.fillStyle = bgColorRef.current;
      ctx.fillRect(0, 0, w, h);
    }
    renderData(ctx, generatedRef.current, configRef.current, w, h, render);
  }, []);

  // Draw/animate effect: restarts when generated data changes (seed or structural params)
  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const activeMotion = motionRef.current;

    if (prefersReduced || activeMotion.mode === 'static') {
      redraw({ progress: 1, time: 0, motion: activeMotion });
      return;
    }

    let rafId: number;
    let startTime: number | null = null;

    if (activeMotion.mode === 'ambient') {
      const tick = (ts: number) => {
        if (!startTime) startTime = ts;
        redraw({ progress: 1, time: ts - startTime, motion: motionRef.current });
        rafId = requestAnimationFrame(tick);
      };

      rafId = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(rafId);
    }

    function tick(ts: number) {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      redraw({ progress: p, time: 0, motion: motionRef.current });
      if (p < 1) rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [generated, motion.mode, duration, redraw]);

  // Re-render at current progress when visual style (color/opacity/strokeWidth/bg) changes
  // without restarting animation
  useEffect(() => {
    redraw({ ...renderRef.current, motion });
  }, [config, bgColor, transparentBackground, motion, redraw]);

  // Resize canvas to match container in device pixels, then redraw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = (width: number, height: number) => {
      if (width === 0 || height === 0) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      redraw(renderRef.current);
    };

    if (explicitWidth && explicitHeight) {
      canvas.width = explicitWidth;
      canvas.height = explicitHeight;
      redraw(renderRef.current);
      return;
    }

    const rect = canvas.getBoundingClientRect();
    resizeCanvas(rect.width, rect.height);

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        resizeCanvas(width, height);
      }
    });

    ro.observe(canvas);
    return () => ro.disconnect();
  }, [explicitHeight, explicitWidth, redraw]);

  return { canvasRef };
}
