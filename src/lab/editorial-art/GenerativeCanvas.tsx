import type { CSSProperties } from 'react';
import { type GeneratorConfig, type MotionConfig } from './themes';
import { useGenerativeCanvas } from './useGenerativeCanvas';

interface Props {
  config: GeneratorConfig;
  bgColor: string;
  motion?: MotionConfig;
  duration?: number;
  transparentBackground?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function GenerativeCanvas({ config, bgColor, motion, duration, transparentBackground, className, style }: Props) {
  const { canvasRef } = useGenerativeCanvas(config, bgColor, { motion, duration, transparentBackground });
  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%', ...style }}
    />
  );
}
