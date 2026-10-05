import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

// Keep every crawler/browser fallback aligned with the canonical dots mark.
const root = new URL('../public/', import.meta.url);
const source = await readFile(new URL('favicon.svg', root), 'utf8');
const svg = Buffer.from(source.replace(/<style>[\s\S]*?<\/style>/, '')
  .replaceAll('class="bg"', 'fill="#1f1c14"')
  .replaceAll('class="pixel"', 'fill="#f7f3ec"'));
const sizes = [16, 32, 48, 96];
const images = await Promise.all(sizes.map(size => sharp(svg).resize(size, size).png().toBuffer()));
await Promise.all(images.map((image, i) => writeFile(new URL(`favicon-${sizes[i]}x${sizes[i]}.png`, root), image)));
await sharp(svg).resize(180, 180).flatten({ background: '#1f1c14' }).png()
  .toFile(new URL('apple-touch-icon.png', root).pathname);

// ICO supports PNG payloads; include compact and higher-resolution variants.
const header = Buffer.alloc(6 + images.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(images.length, 4);
let offset = header.length;
images.forEach((image, i) => {
  const entry = 6 + i * 16;
  header[entry] = sizes[i];
  header[entry + 1] = sizes[i];
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(image.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += image.length;
});
await writeFile(new URL('favicon.ico', root), Buffer.concat([header, ...images]));
