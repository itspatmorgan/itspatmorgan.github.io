import type { CSSProperties } from 'react';
import { type GeneratorConfig, type MotionConfig } from './themes';
import { useGenerativeCanvas } from './useGenerativeCanvas';

interface Props {
  config: GeneratorConfig;
  bgColor: string;
  motion?: MotionConfig;
  duration?: number;
  transparentBackground?: boolean;
  width?: number;
  height?: number;
  className?: string;
  style?: CSSProperties;
}

export function GenerativeCanvas({ config, bgColor, motion, duration, transparentBackground, width, height, className, style }: Props) {
  const { canvasRef } = useGenerativeCanvas(config, bgColor, { motion, duration, transparentBackground, width, height });
  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%', ...style }}
    />
  );
}
