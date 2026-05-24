import { useLayoutEffect, useRef, useState } from 'react';
import { ArtCanvas } from './ArtCanvas';
import {
  brand,
  CANVAS_H,
  CANVAS_W,
  type FoundationConfig,
} from './themes';

interface VisualConfig {
  background?: string;
  generator: FoundationConfig;
  texture?: number;
  grain?: number;
}

interface Props {
  visual: VisualConfig;
}

function backgroundColor(background: string | undefined): string {
  if (background === 'paper') return brand.paper;
  if (background === 'off-white') return brand.offWhite;
  return brand.warmDarkGray;
}

export function LiveEditorialVisual({ visual }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const { width } = containerRef.current.getBoundingClientRect();
      setScale(width / CANVAS_W);
    };

    update();
    const observer = new ResizeObserver(update);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: CANVAS_W,
          height: CANVAS_H,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        <ArtCanvas
          title=""
          bgColor={backgroundColor(visual.background)}
          foundation={visual.generator}
          texture={visual.texture ?? 0}
          grain={visual.grain ?? 0}
          showCaption={false}
          showText={false}
          composition="left"
          textFont="sans"
        />
      </div>
    </div>
  );
}
