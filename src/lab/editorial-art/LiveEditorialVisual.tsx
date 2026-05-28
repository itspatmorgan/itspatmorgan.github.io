import { useEffect, useState } from 'react';
import { GenerativeCanvas } from './GenerativeCanvas';
import { brand, revealMotion, type GeneratorConfig, type LayerColor } from './themes';

interface LightModeConfig {
  color: LayerColor;
  opacity: number;
  strokeWidth?: number;
}

interface VisualConfig {
  background?: string;
  generator: GeneratorConfig;
  lightMode?: LightModeConfig;
  texture?: number;
  grain?: number;
}

interface Props {
  visual: VisualConfig;
}

function readIsDark(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
}

export function LiveEditorialVisual({ visual }: Props) {
  const [isDark, setIsDark] = useState(readIsDark);

  useEffect(() => {
    const observer = new MutationObserver(() => setIsDark(readIsDark()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const bgColor = isDark ? brand.warmDarkGray : brand.paper;

  const generator: GeneratorConfig = isDark
    ? { ...visual.generator, color: 'copper' }
    : {
        ...visual.generator,
        // Use stored lightMode config if available, otherwise fall back to a boost
        ...(visual.lightMode
          ? visual.lightMode
          : {
              color: 'bronze',
              opacity: 100,
              ...('strokeWidth' in visual.generator
                ? { strokeWidth: Math.min(3.0, (visual.generator as { strokeWidth: number }).strokeWidth * 1.5) }
                : {}),
            }),
      };

  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}
    >
      <GenerativeCanvas config={generator} bgColor={bgColor} motion={revealMotion} />
    </div>
  );
}
