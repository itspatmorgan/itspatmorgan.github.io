/** Trial content-image optimization. Dry run unless --write is supplied.
 * Preserves dimensions, JPEG URLs and animated GIFs. Reports and originals
 * stay outside public/ so QA artifacts never inflate the deployment.
 */
import { mkdir, readdir, readFile, writeFile, unlink, stat } from 'node:fs/promises';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const write = args.includes('--write');
const reportArg = args.indexOf('--report-dir');
if (reportArg < 0 || !args[reportArg + 1]) {
  throw new Error('Usage: node scripts/optimize-content-images.mjs [--write] --report-dir /absolute/path/outside/repository');
}
const reportDir = resolve(args[reportArg + 1]);
if (reportDir === root || reportDir.startsWith(`${root}/`)) {
  throw new Error('Keep reports and original images outside the repository.');
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(entry => entry.isDirectory()
    ? walk(join(dir, entry.name)) : [join(dir, entry.name)]));
  return files.flat().sort();
}
const files = (await Promise.all(['projects', 'writing'].map(area => walk(join(root, 'public/images', area))))).flat();
const rows = [];
const replacements = [];
const writes = [];
await mkdir(reportDir, { recursive: true });
for (const file of files) {
  const extension = extname(file).toLowerCase();
  if (!['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.svg'].includes(extension)) continue;
  const relative = file.slice(root.length + 1);
  const original = await readFile(file);
  const row = { original: relative, optimized: relative, before: original.length, after: original.length, status: 'preserved' };
  if (!['.png', '.jpg', '.jpeg'].includes(extension)) {
    row.reason = 'Keep animation, vector or existing modern format.';
    rows.push(row);
    continue;
  }
  const metadata = await sharp(original).metadata();
  if ((metadata.pages ?? 1) > 1 || (metadata.orientation ?? 1) !== 1) {
    row.reason = 'Animation or EXIF orientation needs a separate review.';
    rows.push(row);
    continue;
  }
  const isPng = extension === '.png';
  const isWorkshopPhoto = /\/vision\/vision-(notes|synthesis|team|whiteboard|facilitate)\.png$/.test(relative);
  const quality = isPng && !isWorkshopPhoto ? 90 : 85;
  const encoded = isPng
    ? await sharp(original).webp({ quality }).toBuffer()
    : await sharp(original).jpeg({ quality, mozjpeg: true, progressive: true }).toBuffer();
  const candidate = await sharp(encoded).metadata();
  const lostTransparency = metadata.hasAlpha && !candidate.hasAlpha && !(await sharp(original).stats()).isOpaque;
  if (candidate.width !== metadata.width || candidate.height !== metadata.height || lostTransparency) {
    throw new Error(`Dimensions or transparency changed: ${relative}`);
  }
  row.width = metadata.width;
  row.height = metadata.height;
  row.quality = quality;
  if (encoded.length > original.length * 0.95) {
    row.reason = 'Less than 5% savings; avoid unnecessary lossy recompression.';
    rows.push(row);
    continue;
  }
  const target = isPng ? file.replace(/\.png$/i, '.webp') : file;
  if (target !== file) {
    try { await stat(target); throw new Error(`Output already exists: ${target}`); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  row.optimized = target.slice(root.length + 1);
  row.after = encoded.length;
  row.status = write ? 'optimized' : 'candidate';
  row.originalPreview = `original/${relative}`;
  row.optimizedPreview = `optimized/${row.optimized}`;
  for (const [preview, buffer] of [[row.originalPreview, original], [row.optimizedPreview, encoded]]) {
    await mkdir(dirname(join(reportDir, preview)), { recursive: true });
    await writeFile(join(reportDir, preview), buffer);
  }
  writes.push({ file, target, encoded });
  if (isPng) replacements.push([`/${relative.slice('public/'.length)}`, `/${row.optimized.slice('public/'.length)}`]);
  rows.push(row);
}

const updatedReferences = [];
if (write) {
  // Validate every candidate before modifying any source assets.
  for (const { file, target, encoded } of writes) {
    await writeFile(target, encoded);
    if (target !== file) await unlink(file);
  }
  for (const file of await walk(join(root, 'src'))) {
    if (!/\.(astro|mdx?|tsx?|jsx?|css|json)$/.test(file)) continue;
    const original = await readFile(file, 'utf8');
    let updated = original;
    for (const [from, to] of replacements) updated = updated.split(from).join(to);
    if (updated !== original) {
      await writeFile(file, updated);
      updatedReferences.push(file.slice(root.length + 1));
    }
  }
}
const summary = {
  mode: write ? 'write' : 'dry-run',
  files: rows.length,
  changed: rows.filter(row => row.status !== 'preserved').length,
  before: rows.reduce((sum, row) => sum + row.before, 0),
  after: rows.reduce((sum, row) => sum + row.after, 0),
  updatedReferences,
};
await writeFile(join(reportDir, 'report.json'), JSON.stringify({ summary, images: rows }, null, 2));
const escape = text => String(text).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const changed = rows.filter(row => row.status !== 'preserved').sort((a, b) => (b.before - b.after) - (a.before - a.after));
const cards = changed.map((row, index) => `<article id="image-${index + 1}"><h2>${index + 1}. ${escape(row.original)}</h2><p>${row.width} × ${row.height}; ${(row.before / 1000).toFixed(1)} KB → ${(row.after / 1000).toFixed(1)} KB (${Math.round((1 - row.after / row.before) * 100)}% smaller). Dimensions unchanged.</p><div class="pair"><figure><figcaption>Original</figcaption><a href="${escape(row.originalPreview)}" target="_blank"><img width="${row.width}" height="${row.height}" loading="lazy" src="${escape(row.originalPreview)}" alt="Original ${escape(row.original)}"></a></figure><figure><figcaption>Optimized</figcaption><a href="${escape(row.optimizedPreview)}" target="_blank"><img width="${row.width}" height="${row.height}" loading="lazy" src="${escape(row.optimizedPreview)}" alt="Optimized ${escape(row.original)}"></a></figure></div></article>`).join('\n');
await writeFile(join(reportDir, 'index.html'), `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Work and Writing image QA</title><style>body{font:16px/1.5 system-ui;background:#f7f5f1;color:#222;margin:0;padding:32px}main{max-width:1400px;margin:auto}h2{font-size:16px;overflow-wrap:anywhere}article{border-top:1px solid #ccc;padding:24px 0}.pair{display:grid;grid-template-columns:1fr 1fr;gap:24px}figure{margin:0}img{width:100%;height:auto;background:repeating-conic-gradient(#eee 0% 25%,#fff 0% 50%) 0/16px 16px}figcaption{margin-bottom:8px}@media(max-width:700px){.pair{grid-template-columns:1fr}}</style><main><h1>Work and Writing image QA</h1><p>${summary.changed} changed images. Click either image to inspect it at full resolution. Compare text readability, fine lines, gradients, grain, skin tones and transparency. This gallery includes unpublished assets; inspect those here rather than expecting a public route.</p><p>Total scoped assets: ${(summary.before / 1e6).toFixed(2)} MB → ${(summary.after / 1e6).toFixed(2)} MB. JPEG URLs, geometry and GIFs are preserved.</p>${cards}</main></html>`);
console.log(JSON.stringify(summary, null, 2));
console.log(`Comparison gallery: ${join(reportDir, 'index.html')}`);
