import type { CSSProperties } from 'react';
import { type GeneratorConfig } from './themes';
import { useGenerativeCanvas, type UseGenerativeCanvasOptions } from './useGenerativeCanvas';

interface Props {
  config: GeneratorConfig;
  bgColor: string;
  animate?: boolean;
  duration?: number;
  transparentBackground?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function GenerativeCanvas({ config, bgColor, animate, duration, transparentBackground, className, style }: Props) {
  const { canvasRef } = useGenerativeCanvas(config, bgColor, { animate, duration, transparentBackground });
  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%', ...style }}
    />
  );
}
