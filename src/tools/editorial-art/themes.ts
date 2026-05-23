export type ThemeId = 'ai' | 'design' | 'systems' | 'creative' | 'career';
export type Composition = 'centered' | 'left' | 'offset';
export type LayerColor = 'copper' | 'light' | 'dark' | 'muted';
export type TextFont = 'sans' | 'mono' | 'pixel';

export const CANVAS_W = 1200;
export const CANVAS_H = 630;

export const brand = {
  paper:             '#faf8f4',
  champagneLight:   '#f7ccab',
  champagneBronze:  '#b38b6d',
  warmDarkGray:     '#171716',
  offWhite:         '#ede9e3',
  sageGray:         '#8b9690',
  weatheredStone:   '#6f6860',
  mutedLight:       '#6f6860',
  mutedDark:        '#a79b8f',
} as const;

export const brandAccent = brand.champagneLight;

export const bgPalette = [
  { name: 'Paper',              value: brand.paper, dark: false },
  { name: 'Champagne Light',    value: brand.champagneLight, dark: false },
  { name: 'Champagne Bronze',   value: brand.champagneBronze, dark: false },
  { name: 'Sage Gray',          value: brand.sageGray, dark: false },
  { name: 'Weathered Stone',    value: brand.weatheredStone, dark: true  },
  { name: 'Warm Dark Gray',     value: brand.warmDarkGray, dark: true  },
] as const;

export function isColorDark(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 < 128;
}

export function resolveLayerColor(color: LayerColor): string {
  switch (color) {
    case 'copper': return brand.champagneLight;
    case 'light':  return brand.paper;
    case 'dark':   return brand.warmDarkGray;
    case 'muted':  return brand.weatheredStone;
  }
}

export function sliderToTextureOpacity(v: number): number {
  return (v / 100) * 0.85;
}

export function sliderToGrainOpacity(v: number): number {
  return (v / 100) * 0.75;
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
    defaultBgColor: brand.warmDarkGray,
    defaultField: { seed: 42,  density: 180, steps: 90,  scale: 220, curl: 0,   strokeWidth: 0.7, opacity: 50, color: 'copper' },
    defaultTexture: 20,
    defaultComposition: 'left',
  },
  {
    id: 'design',
    label: 'Design',
    defaultBgColor: brand.paper,
    defaultField: { seed: 137, density: 80,  steps: 120, scale: 400, curl: 15,  strokeWidth: 0.6, opacity: 35, color: 'muted' },
    defaultTexture: 0,
    defaultComposition: 'left',
  },
  {
    id: 'systems',
    label: 'Systems',
    defaultBgColor: brand.warmDarkGray,
    defaultField: { seed: 73,  density: 300, steps: 60,  scale: 160, curl: -20, strokeWidth: 0.5, opacity: 45, color: 'copper' },
    defaultTexture: 0,
    defaultComposition: 'left',
  },
  {
    id: 'creative',
    label: 'Creative Practice',
    defaultBgColor: brand.champagneLight,
    defaultField: { seed: 256, density: 150, steps: 100, scale: 320, curl: 30,  strokeWidth: 1.0, opacity: 40, color: 'copper' },
    defaultTexture: 55,
    defaultComposition: 'centered',
  },
  {
    id: 'career',
    label: 'Career',
    defaultBgColor: brand.paper,
    defaultField: { seed: 512, density: 100, steps: 80,  scale: 350, curl: -10, strokeWidth: 0.6, opacity: 30, color: 'dark' },
    defaultTexture: 0,
    defaultComposition: 'left',
  },
];

export const themes = Object.fromEntries(
  themeList.map((t) => [t.id, t])
) as Record<ThemeId, ThemeConfig>;
