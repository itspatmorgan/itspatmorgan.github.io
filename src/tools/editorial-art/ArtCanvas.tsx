import { forwardRef } from 'react';
import { UAMark } from './UAMark';
import { FlowField } from './foundations/FlowField';
import {
  brand,
  isColorDark,
  sliderToGrainOpacity,
  sliderToTextureOpacity,
  CANVAS_W,
  CANVAS_H,
  type Composition,
  type FlowFieldConfig,
  type TextFont,
} from './themes';

export interface CanvasProps {
  title: string;
  bgColor: string;
  field: FlowFieldConfig;
  texture: number;    // 0–100 slider
  grain: number;      // 0–100 slider
  showLogo: boolean;
  showText: boolean;
  composition: Composition;
  textFont: TextFont;
}

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

export const ArtCanvas = forwardRef<HTMLDivElement, CanvasProps>(function ArtCanvas(
  { title, bgColor, field, texture, grain, showLogo, showText, composition, textFont },
  ref
) {
  const isDark = isColorDark(bgColor);
  const fgColor    = isDark ? brand.offWhite   : brand.warmDarkGray;
  const textureSrc = isDark
    ? '/images/textures/debut_dark.png'
    : '/images/textures/debut_light.png';
  const textureBlend: React.CSSProperties['mixBlendMode'] = isDark ? 'screen' : 'multiply';
  const texOpacity = sliderToTextureOpacity(texture);
  const grainOpacity = sliderToGrainOpacity(grain);
  const fontSize   = titleFontSize(title);
  const logoOpacity = isDark ? 0.78 : 0.9;

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

      {/* Flow field */}
      <FlowField {...field} />

      {/* Text (optional) */}
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

      {/* UA mark — bottom right */}
      {showLogo && (
        <div style={{ position: 'absolute', bottom: 52, right: 52, opacity: logoOpacity }}>
          <UAMark color={brand.champagneLight} height={22} />
        </div>
      )}
    </div>
  );
});
