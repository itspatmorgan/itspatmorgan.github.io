import { useEffect, useMemo, useRef, useState } from 'react';
import { GenerativeCanvas } from './GenerativeCanvas';
import { brand, revealMotion, type GeneratorConfig, type MotionConfig } from './themes';

interface Props {
  name: string;
  config: GeneratorConfig;
  lightConfig?: GeneratorConfig;
  darkConfig?: GeneratorConfig;
  className?: string;
  duration?: number;
  interactive?: boolean;
  motion?: MotionConfig;
}

function readIsDark(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
}

function readReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function defaultLightConfig(config: GeneratorConfig): GeneratorConfig {
  return {
    ...config,
    color: config.color === 'copper' ? 'bronze' : config.color,
    opacity: Math.min(100, Math.max(config.opacity, 82)),
    ...('strokeWidth' in config ? { strokeWidth: Math.min(2.4, config.strokeWidth * 1.35) } : {}),
  } as GeneratorConfig;
}

export function GenerativePatternSurface({
  name,
  config,
  lightConfig,
  darkConfig,
  className,
  duration = 2600,
  interactive = false,
  motion = revealMotion,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(readIsDark);
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    const observer = new MutationObserver(() => setIsDark(readIsDark()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!interactive) return;
    const root = rootRef.current;
    const trigger = root?.parentElement?.closest('[data-generative-pattern-trigger]');
    if (!trigger) return;

    const replay = () => {
      if (!readReducedMotion()) setReplayKey((key) => key + 1);
    };

    trigger.addEventListener('mouseenter', replay);
    trigger.addEventListener('focusin', replay);
    return () => {
      trigger.removeEventListener('mouseenter', replay);
      trigger.removeEventListener('focusin', replay);
    };
  }, [interactive]);

  const resolvedConfig = useMemo(() => {
    if (isDark) return darkConfig ?? config;
    return lightConfig ?? defaultLightConfig(config);
  }, [config, darkConfig, isDark, lightConfig]);

  const bgColor = isDark ? brand.warmDarkGray : brand.paper;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={className}
      data-generative-pattern-surface={name}
      style={{ pointerEvents: 'none' }}
    >
      <GenerativeCanvas
        key={`${name}-${isDark ? 'dark' : 'light'}-${replayKey}`}
        config={resolvedConfig}
        bgColor={bgColor}
        motion={motion}
        duration={duration}
        transparentBackground
      />
    </div>
  );
}
