import { forwardRef } from 'react';
import { UAMark } from './UAMark';
import { FlowField } from './patterns/FlowField';
import {
  brand,
  isColorDark,
  sliderToTextureOpacity,
  CANVAS_W,
  CANVAS_H,
  type ThemeId,
  type Composition,
  type FlowFieldConfig,
} from './themes';

export interface CanvasProps {
  title: string;
  themeId: ThemeId;
  bgColor: string;
  field: FlowFieldConfig;
  texture: number;    // 0–100 slider
  showText: boolean;
  composition: Composition;
}

function titleFontSize(title: string): number {
  const len = title.length;
  if (len <= 20) return 80;
  if (len <= 35) return 68;
  if (len <= 50) return 56;
  return 46;
}

const themeLabel: Record<ThemeId, string> = {
  ai:       'AI',
  design:   'Design',
  systems:  'Systems Thinking',
  creative: 'Creative Practice',
  career:   'Career',
};

export const ArtCanvas = forwardRef<HTMLDivElement, CanvasProps>(function ArtCanvas(
  { title, themeId, bgColor, field, texture, showText, composition },
  ref
) {
  const isDark = isColorDark(bgColor);
  const fgColor    = isDark ? brand.offWhite   : brand.darkText;
  const mutedColor = isDark ? brand.mutedDark  : brand.mutedLight;
  const textureSrc = isDark
    ? '/images/textures/debut_dark.png'
    : '/images/textures/debut_light.png';
  const textureBlend: React.CSSProperties['mixBlendMode'] = isDark ? 'screen' : 'multiply';
  const texOpacity = sliderToTextureOpacity(texture);
  const fontSize   = titleFontSize(title);

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
          backgroundRepeat: 'repeat', backgroundSize: '200px 200px',
          opacity: texOpacity, mixBlendMode: textureBlend,
        }} />
      )}

      {/* Flow field */}
      <FlowField {...field} />

      {/* Text (optional) */}
      {showText && (
        <div style={textStyle}>
          <div style={{
            fontFamily: "'Geist Mono Variable', ui-monospace, monospace",
            fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: mutedColor, marginBottom: 16,
          }}>
            {themeLabel[themeId]}
          </div>
          <div style={{
            fontSize, fontWeight: 500, lineHeight: 1.08,
            letterSpacing: '-0.02em', color: fgColor,
          }}>
            {title || 'Article Title'}
          </div>
        </div>
      )}

      {/* UA mark — bottom right */}
      <div style={{ position: 'absolute', bottom: 36, right: 48 }}>
        <UAMark color={brand.copper} size={26} />
      </div>
    </div>
  );
});
