import { useEffect, useState } from 'react';
import { DotGrid } from './foundations/DotGrid';
import { FlowField } from './foundations/FlowField';
import { Isoline } from './foundations/Isoline';
import { StrangeAttractor } from './foundations/StrangeAttractor';
import { Voronoi } from './foundations/Voronoi';
import {
  brand,
  isColorDark,
  sliderToGrainOpacity,
  sliderToTextureOpacity,
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

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return reduced;
}

function FoundationLayer({ foundation }: { foundation: FoundationConfig }) {
  if (foundation.type === 'flow-field') return <FlowField {...foundation} />;
  if (foundation.type === 'dot-grid') return <DotGrid {...foundation} />;
  if (foundation.type === 'isoline') return <Isoline {...foundation} />;
  if (foundation.type === 'voronoi') return <Voronoi {...foundation} />;
  return <StrangeAttractor {...foundation} />;
}

export function LiveEditorialVisual({ visual }: Props) {
  const reducedMotion = useReducedMotion();
  const bgColor = backgroundColor(visual.background);
  const darkBg = isColorDark(bgColor);
  const texture = visual.texture ?? 0;
  const grain = visual.grain ?? 0;
  const textureOpacity = sliderToTextureOpacity(texture);
  const grainOpacity = sliderToGrainOpacity(grain);
  const textureSrc = darkBg
    ? '/images/textures/debut_dark.png'
    : '/images/textures/debut_light.png';

  if (reducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="editorial-live-visual"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        backgroundColor: bgColor,
        pointerEvents: 'none',
      }}
    >
      {textureOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${textureSrc})`,
            backgroundRepeat: 'repeat',
            backgroundSize: '120px 120px',
            opacity: textureOpacity,
            mixBlendMode: darkBg ? 'screen' : 'multiply',
          }}
        />
      )}

      <div className={`editorial-live-visual__foundation editorial-live-visual__foundation--${visual.generator.type}`}>
        <FoundationLayer foundation={visual.generator} />
      </div>

      {grainOpacity > 0 && (
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            mixBlendMode: darkBg ? 'screen' : 'multiply',
          }}
          width="1200"
          height="630"
          viewBox="0 0 1200 630"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="ea-live-grain" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.72 0.68"
                numOctaves="4"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
          </defs>
          <rect width="1200" height="630" filter="url(#ea-live-grain)" opacity={grainOpacity} />
        </svg>
      )}
    </div>
  );
}
