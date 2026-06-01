import { forwardRef } from 'react';
import { UAMark } from './UAMark';
import { GenerativeCanvas } from './GenerativeCanvas';
import {
  brand,
  isColorDark,
  sliderToGrainOpacity,
  sliderToTextureOpacity,
  CANVAS_W,
  CANVAS_H,
  type Composition,
  type GeneratorConfig,
  type MotionConfig,
  type TextFont,
} from './themes';

export interface CanvasProps {
  title: string;
  bgColor: string;
  generator: GeneratorConfig;
  texture: number;         // 0–100 slider
  grain: number;           // 0–100 slider
  showCaption: boolean;
  showText: boolean;
  composition: Composition;
  textFont: TextFont;
  motion: MotionConfig;
  motionReplayKey?: number;
}

// ── Caption text ──────────────────────────────────────────────────────────────

function captionText(generator: GeneratorConfig): { title: string; params: string } {
  switch (generator.type) {
    case 'flow-field':
      return {
        title: 'Flow Field',
        params: `seed ${generator.seed} · density ${generator.density} · scale ${generator.scale}`,
      };
    case 'dot-grid':
      return {
        title: 'Dot Grid',
        params: `seed ${generator.seed} · spacing ${generator.spacing}px · size ${generator.dotSize}%`,
      };
    case 'isoline':
      return {
        title: 'Isoline',
        params: `seed ${generator.seed} · levels ${generator.levels} · scale ${generator.scale}`,
      };
    case 'voronoi':
      return {
        title: 'Voronoi',
        params: `seed ${generator.seed} · cells ${generator.count} · jitter ${generator.jitter}%`,
      };
    case 'strange-attractor':
      return {
        title: 'Strange Attractor',
        params: `seed ${generator.seed}`,
      };
  }
}

// ── Font size ─────────────────────────────────────────────────────────────────

function titleFontSize(title: string): number {
  const len = title.length;
  if (len <= 20) return 80;
  if (len <= 35) return 68;
  if (len <= 50) return 56;
  return 46;
}

const titleFonts: Record<TextFont, React.CSSProperties> = {
  sans: {
    fontFamily: "'Geist Variable', ui-sans-serif, system-ui, sans-serif",
    fontWeight: 500,
    letterSpacing: '-0.02em',
  },
  mono: {
    fontFamily: "'Geist Mono Variable', ui-monospace, monospace",
    fontWeight: 500,
    letterSpacing: '0',
  },
  pixel: {
    fontFamily: "'Geist Pixel Square', ui-monospace, monospace",
    fontWeight: 400,
    letterSpacing: '0',
  },
};

// ── Canvas ────────────────────────────────────────────────────────────────────

export const ArtCanvas = forwardRef<HTMLDivElement, CanvasProps>(function ArtCanvas(
  { title, bgColor, generator, texture, grain, showCaption, showText, composition, textFont, motion, motionReplayKey = 0 },
  ref
) {
  const isDark = isColorDark(bgColor);
  const fgColor    = isDark ? brand.offWhite   : brand.warmDarkGray;
  const textureSrc = isDark
    ? '/images/textures/debut_dark.png'
    : '/images/textures/debut_light.png';
  const textureBlend: React.CSSProperties['mixBlendMode'] = isDark ? 'screen' : 'multiply';
  const texOpacity    = sliderToTextureOpacity(texture);
  const grainOpacity  = sliderToGrainOpacity(grain);
  const fontSize      = titleFontSize(title);
  const markColor     = isDark ? brand.champagneLight : brand.warmDarkGray;
  const caption       = captionText(generator);

  const monoStack = "'Geist Mono Variable', ui-monospace, monospace";

  const textStyle: React.CSSProperties =
    composition === 'centered'
      ? { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 80px' }
      : composition === 'offset'
      ? { position: 'absolute', left: 60, right: '45%', top: 60, bottom: 60,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', paddingTop: 20 }
      : { position: 'absolute', left: 60, right: '38%', bottom: 60,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' };

  return (
    <div
      ref={ref}
      style={{
        position: 'relative', width: CANVAS_W, height: CANVAS_H,
        overflow: 'hidden', backgroundColor: bgColor,
        fontFamily: "'Geist Variable', ui-sans-serif, system-ui, sans-serif",
      }}
    >
      {/* Texture overlay */}
      {texOpacity > 0 && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${textureSrc})`,
          backgroundRepeat: 'repeat', backgroundSize: '120px 120px',
          opacity: texOpacity, mixBlendMode: textureBlend,
        }} />
      )}

      {/* Grain overlay — SVG feTurbulence for real film grain noise */}
      {grainOpacity > 0 && (
        <svg
          style={{
            position: 'absolute', inset: 0,
            mixBlendMode: isDark ? 'screen' : 'multiply',
            pointerEvents: 'none',
          }}
          width={CANVAS_W} height={CANVAS_H}
          viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="ea-grain" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.72 0.68"
                numOctaves="4"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
          </defs>
          <rect
            x="0" y="0" width={CANVAS_W} height={CANVAS_H}
            filter="url(#ea-grain)"
            opacity={grainOpacity}
          />
        </svg>
      )}

      {/* Generative layer */}
      <GenerativeCanvas
        key={motionReplayKey}
        config={generator}
        bgColor={bgColor}
        motion={motion}
        width={CANVAS_W}
        height={CANVAS_H}
        style={{ position: 'absolute', inset: 0 }}
      />

      {/* Article title (optional) */}
      {showText && (
        <div style={textStyle}>
          <div style={{
            fontSize, lineHeight: 1.08, color: fgColor,
            ...titleFonts[textFont],
          }}>
            {title || 'Article Title'}
          </div>
        </div>
      )}

      {/* Caption — UA mark + generator info in one opaque badge, bottom right */}
      {showCaption && (
        <div style={{
          position: 'absolute', bottom: 48, right: 48,
          backgroundColor: bgColor,
          borderRadius: 10,
          padding: '12px 16px',
          display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 14,
        }}>
          <UAMark color={markColor} height={30} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{
              fontFamily: monoStack,
              fontSize: 15,
              fontWeight: 500,
              letterSpacing: '0.01em',
              color: fgColor,
              opacity: 0.85,
              lineHeight: 1,
            }}>
              {caption.title}
            </div>
            <div style={{
              fontFamily: monoStack,
              fontSize: 12,
              fontWeight: 400,
              letterSpacing: '0.01em',
              color: fgColor,
              opacity: 0.5,
              lineHeight: 1,
            }}>
              {caption.params} · @itspatmorgan
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
