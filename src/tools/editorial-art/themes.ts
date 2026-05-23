export type ThemeId = 'ai' | 'design' | 'systems' | 'creative' | 'career';
export type Composition = 'centered' | 'left' | 'offset';
export type LayerColor = 'copper' | 'light' | 'dark' | 'muted';

export const CANVAS_W = 1200;
export const CANVAS_H = 630;

export const brand = {
  cream:      '#faf8f4',
  warmBlack:  '#221d19',
  copper:     '#c9956a',
  offWhite:   '#ede9e3',
  darkText:   '#241f1b',
  mutedLight: '#7a7068',
  mutedDark:  '#a09488',
} as const;

export const bgPalette = [
  { name: 'Cream',       value: '#faf8f4', dark: false },
  { name: 'Copper Pale', value: '#f0e4d8', dark: false },
  { name: 'Warm Gray',   value: '#c5b8b0', dark: false },
  { name: 'Stone',       value: '#6b5f58', dark: true  },
  { name: 'Deep',        value: '#2d2420', dark: true  },
  { name: 'Warm Black',  value: '#221d19', dark: true  },
] as const;

export function isColorDark(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 < 128;
}

export function resolveLayerColor(color: LayerColor): string {
  switch (color) {
    case 'copper': return brand.copper;
    case 'light':  return brand.offWhite;
    case 'dark':   return brand.darkText;
    case 'muted':  return brand.mutedLight;
  }
}

export function sliderToTextureOpacity(v: number): number {
  return (v / 100) * 0.50;
}

// Flow field generative system config
export interface FlowFieldConfig {
  seed: number;        // 1–999, controls noise field
  density: number;     // 50–600, particle count
  steps: number;       // 20–200, path length per particle
  scale: number;       // 80–600, noise frequency (higher = smoother, wider curves)
  curl: number;        // -180–180 degrees, rotates the field
  strokeWidth: number; // 0.3–2.0
  opacity: number;     // 0–100 slider
  color: LayerColor;
}

export interface ThemeConfig {
  id: ThemeId;
  label: string;
  defaultBgColor: string;
  defaultField: FlowFieldConfig;
  defaultTexture: number;
  defaultComposition: Composition;
}

export const themeList: ThemeConfig[] = [
  {
    id: 'ai',
    label: 'AI',
    defaultBgColor: brand.warmBlack,
    defaultField: { seed: 42,  density: 180, steps: 90,  scale: 220, curl: 0,   strokeWidth: 0.7, opacity: 50, color: 'copper' },
    defaultTexture: 20,
    defaultComposition: 'left',
  },
  {
    id: 'design',
    label: 'Design',
    defaultBgColor: brand.cream,
    defaultField: { seed: 137, density: 80,  steps: 120, scale: 400, curl: 15,  strokeWidth: 0.6, opacity: 35, color: 'muted' },
    defaultTexture: 0,
    defaultComposition: 'left',
  },
  {
    id: 'systems',
    label: 'Systems',
    defaultBgColor: '#2d2420',
    defaultField: { seed: 73,  density: 300, steps: 60,  scale: 160, curl: -20, strokeWidth: 0.5, opacity: 45, color: 'copper' },
    defaultTexture: 0,
    defaultComposition: 'left',
  },
  {
    id: 'creative',
    label: 'Creative Practice',
    defaultBgColor: '#f0e4d8',
    defaultField: { seed: 256, density: 150, steps: 100, scale: 320, curl: 30,  strokeWidth: 1.0, opacity: 40, color: 'copper' },
    defaultTexture: 55,
    defaultComposition: 'centered',
  },
  {
    id: 'career',
    label: 'Career',
    defaultBgColor: brand.cream,
    defaultField: { seed: 512, density: 100, steps: 80,  scale: 350, curl: -10, strokeWidth: 0.6, opacity: 30, color: 'dark' },
    defaultTexture: 0,
    defaultComposition: 'left',
  },
];

export const themes = Object.fromEntries(
  themeList.map((t) => [t.id, t])
) as Record<ThemeId, ThemeConfig>;
