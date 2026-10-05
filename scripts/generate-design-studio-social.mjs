import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const root = new URL('../', import.meta.url);
const component = await readFile(new URL('src/components/design-studio/StudioAtmosphere.astro', root), 'utf8');
const art = component.match(/<svg[^>]*>([\s\S]*?)<\/svg>/)[1]
  .replaceAll('currentColor', '#161410')
  .replaceAll('var(--accent)', '#c99a52')
  .replaceAll('var(--card)', '#f3f1ed')
  .replaceAll('var(--background)', '#faf9f6')
  .replaceAll('var(--foreground)', '#161410');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" fill="#161410">
<style>
text { font-family: Helvetica, Arial, sans-serif; }
.file-label, .cursor-label { font-family: monospace; font-size: 12px; }
.file-label { fill: #161410; opacity: .8; }
.artifact-title { fill: #161410; font-size: 13px; font-weight: 500; }
.tiny-label { fill: #161410; font-size: 9px; opacity: .75; }
</style>
<rect width="1200" height="630" fill="#faf9f6"/>
<g transform="translate(64 60)" fill="#161410"><path d="M0 0h11v32H0zM15 0h3a16 16 0 0 1 0 32h-3z"/></g>
<text x="116" y="85" font-size="28">Design Studio</text>
<text x="64" y="274" font-size="58" font-weight="500" letter-spacing="-2.7">Design with intent.</text>
<text x="64" y="346" font-size="58" font-weight="500" letter-spacing="-2.7">Build with an agent.</text>
<text x="64" y="451" font-size="24" fill="#625e58">An open platform for designers</text>
<text x="64" y="485" font-size="24" fill="#625e58">and product managers who build.</text>
<svg x="652" y="130" width="500" height="430" viewBox="0 0 560 480" fill="none">${art}</svg>
<text x="64" y="582" font-family="monospace" font-size="17" fill="#625e58">itspatmorgan.com/design-studio</text>
</svg>`;
await writeFile(new URL('public/images/design-studio/social-design-with-intent.svg', root), svg);
await sharp(Buffer.from(svg)).jpeg({ quality: 92, mozjpeg: true })
  .toFile(new URL('public/images/design-studio/social-design-with-intent.jpg', root).pathname);
