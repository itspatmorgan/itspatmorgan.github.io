interface UAMarkProps {
  color?: string;
  height?: number;
}

// Content bounds from path data: x ≈ 30–228, y ≈ 74–192
// Aspect ratio of the crop: 198 × 118 → ~1.678:1
const CROP_X = 30;
const CROP_Y = 74;
const CROP_W = 198;
const CROP_H = 118;

export function UAMark({ color = '#f7ccab', height = 48 }: UAMarkProps) {
  const width = Math.round(height * (CROP_W / CROP_H));
  return (
    <svg
      width={width}
      height={height}
      viewBox={`${CROP_X} ${CROP_Y} ${CROP_W} ${CROP_H}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M79.2053 189.22C71.7066 189.22 64.7506 187.345 58.3373 183.596C52.0226 179.847 46.9906 174.815 43.2413 168.5C39.492 162.087 37.6173 155.131 37.6173 147.632V83.992H120.793V147.632C120.793 155.131 118.919 162.087 115.169 168.5C111.42 174.815 106.339 179.847 99.9253 183.596C93.6106 187.345 86.704 189.22 79.2053 189.22ZM225.304 187H128.216L176.76 81.772L225.304 187ZM136.8 181.524H216.72L176.76 94.796L136.8 181.524Z"
        fill={color}
      />
    </svg>
  );
}
