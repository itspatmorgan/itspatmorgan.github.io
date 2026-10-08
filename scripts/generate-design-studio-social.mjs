import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { create } from 'fontkit';
import { decompress } from 'wawoff2';

const root = new URL('../', import.meta.url);
const loadFont = async path => create(Buffer.from(await decompress(await readFile(new URL(path, root)))));
const sans = await loadFont('node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2');
const mono = await loadFont('node_modules/@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2');
const component = await readFile(new URL('src/components/design-studio/StudioAtmosphere.astro', root), 'utf8');
const art = component.match(/<svg[^>]*>([\s\S]*?)<\/svg>/)[1]
  .replaceAll('currentColor', '#161410')
  .replaceAll('var(--accent)', '#c99a52')
  .replaceAll('var(--card)', '#f3f1ed')
  .replaceAll('var(--background)', '#faf9f6')
  .replaceAll('var(--foreground)', '#161410');
const source = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" fill="#161410">
<title>Design Studio: Design with intent. Build with an agent.</title>
<style>
text { font-family: Geist, sans-serif; }
.file-label, .cursor-label { font-family: monospace; font-size: 12px; }
.file-label { fill: #161410; opacity: .8; }
.artifact-title { fill: #161410; font-size: 13px; font-weight: 500; }
.tiny-label { fill: #161410; font-size: 9px; opacity: .75; }
</style>
<rect width="1200" height="630" fill="#faf9f6"/>
<g transform="translate(64 60)" fill="#161410"><path d="M0 0h11v32H0zM15 0h3a16 16 0 0 1 0 32h-3z"/></g>
<text x="116" y="85" font-size="28">Design Studio</text>
<text x="64" y="270" font-size="58" font-weight="500" letter-spacing="-1.45">Design with intent.</text>
<text x="64" y="334" font-size="58" font-weight="500" letter-spacing="-1.45">Build with an agent.</text>
<text x="64" y="428" font-size="24" fill="#625e58">A prototype sandbox for designers</text>
<text x="64" y="460" font-size="24" fill="#625e58">and product managers who build.</text>
<svg x="652" y="130" width="500" height="430" viewBox="0 0 560 480" fill="none">${art}</svg>
<text x="64" y="582" font-family="monospace" font-size="17" fill="#625e58">itspatmorgan.com/design-studio</text>
</svg>`;
// Outline the actual site fonts: SVG rasterizers do not reliably load web fonts.
// Fontkit preserves the selected variable weight and OpenType kerning.
const svg = source.replace(/<text\b([^>]*)>([^<]*)<\/text>/g, (_, attributes, text) => {
  const attr = name => attributes.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
  const className = attr('class') ?? '';
  const isMono = /file-label|cursor-label/.test(className) || attr('font-family') === 'monospace';
  const size = Number(attr('font-size') ?? ({ 'file-label': 12, 'cursor-label': 12, 'artifact-title': 13, 'tiny-label': 9 }[className] ?? 12));
  const weight = Number(attr('font-weight') ?? (className === 'artifact-title' ? 500 : 400));
  const font = (isMono ? mono : sans).getVariation({ wght: weight });
  const run = font.layout(text);
  const scale = size / font.unitsPerEm;
  const tracking = Number(attr('letter-spacing') ?? 0) / scale;
  let cursor = 0;
  const paths = run.glyphs.map((glyph, i) => {
    const position = run.positions[i];
    const path = `<path transform="translate(${cursor + position.xOffset} ${position.yOffset})" d="${glyph.path.toSVG()}"/>`;
    cursor += position.xAdvance + tracking;
    return path;
  }).join('');
  return `<g class="${className}" aria-label="${text}" fill="${attr('fill') ?? '#161410'}" transform="translate(${attr('x')} ${attr('y')}) scale(${scale} ${-scale})">${paths}</g>`;
});
await writeFile(new URL('public/images/design-studio/social-prototype-sandbox.svg', root), svg);
await sharp(Buffer.from(svg)).jpeg({ quality: 92, mozjpeg: true })
  .toFile(new URL('public/images/design-studio/social-prototype-sandbox.jpg', root).pathname);
