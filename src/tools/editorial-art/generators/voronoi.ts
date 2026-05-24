import { CANVAS_W, CANVAS_H, type VoronoiConfig } from '../themes';
import { makeRng } from './noise';

const W = CANVAS_W;
const H = CANVAS_H;
const CLIP = 400;

type Point = [number, number];
interface Tri  { a: number; b: number; c: number }
interface Circle { cx: number; cy: number; r2: number }

export type VoronoiEdge = [number, number, number, number]; // x1,y1,x2,y2

function circumcircle(pa: Point, pb: Point, pc: Point): Circle {
  const [ax, ay] = pa, [bx, by] = pb, [cx, cy] = pc;
  const D = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
  if (Math.abs(D) < 1e-10) return { cx: 0, cy: 0, r2: Infinity };
  const a2 = ax*ax+ay*ay, b2 = bx*bx+by*by, c2 = cx*cx+cy*cy;
  const ux = (a2*(by-cy) + b2*(cy-ay) + c2*(ay-by)) / D;
  const uy = (a2*(cx-bx) + b2*(ax-cx) + c2*(bx-ax)) / D;
  return { cx: ux, cy: uy, r2: (ax-ux)**2 + (ay-uy)**2 };
}

function generatePoints(count: number, jitter: number, rng: () => number): Point[] {
  const jFrac = jitter / 100;
  const cols = Math.max(2, Math.round(Math.sqrt(count * (W / H))));
  const rows = Math.max(2, Math.round(count / cols));
  const cw = W / cols, ch = H / rows;
  const pts: Point[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      pts.push([
        Math.max(1, Math.min(W-1, (c+0.5)*cw + (rng()-0.5)*cw*jFrac)),
        Math.max(1, Math.min(H-1, (r+0.5)*ch + (rng()-0.5)*ch*jFrac)),
      ]);
    }
  }
  return pts;
}

function bowyerWatson(pts: Point[]): { tris: Tri[]; allPts: Point[] } {
  const n = pts.length;
  const m = Math.max(W, H) * 10;
  const superPts: Point[] = [[W/2, -m], [W/2+m, H+m], [W/2-m, H+m]];
  const allPts = [...pts, ...superPts];
  const si = n;
  let tris: Tri[] = [{ a: si, b: si+1, c: si+2 }];

  for (let pi = 0; pi < n; pi++) {
    const [px, py] = allPts[pi];
    const bad = tris.map(t => {
      const cc = circumcircle(allPts[t.a], allPts[t.b], allPts[t.c]);
      return (px-cc.cx)**2 + (py-cc.cy)**2 < cc.r2;
    });
    const edgeCount = new Map<string, number>();
    tris.forEach((t, ti) => {
      if (!bad[ti]) return;
      for (const [ea, eb] of [[t.a,t.b],[t.b,t.c],[t.c,t.a]] as [number,number][]) {
        const key = ea < eb ? `${ea},${eb}` : `${eb},${ea}`;
        edgeCount.set(key, (edgeCount.get(key) ?? 0) + 1);
      }
    });
    tris = tris.filter((_, ti) => !bad[ti]);
    for (const [key, cnt] of edgeCount) {
      if (cnt === 1) {
        const [ea, eb] = key.split(',').map(Number);
        tris.push({ a: ea, b: eb, c: pi });
      }
    }
  }
  return { tris: tris.filter(t => t.a < n && t.b < n && t.c < n), allPts };
}

export function generateVoronoi(cfg: VoronoiConfig): VoronoiEdge[] {
  const rng = makeRng(cfg.seed);
  const pts = generatePoints(cfg.count, cfg.jitter, rng);
  const { tris, allPts } = bowyerWatson(pts);
  const cc = tris.map(t => circumcircle(allPts[t.a], allPts[t.b], allPts[t.c]));

  const edgeToTris = new Map<string, number[]>();
  tris.forEach((t, ti) => {
    for (const [ea, eb] of [[t.a,t.b],[t.b,t.c],[t.c,t.a]] as [number,number][]) {
      const key = ea < eb ? `${ea},${eb}` : `${eb},${ea}`;
      const arr = edgeToTris.get(key) ?? [];
      arr.push(ti);
      edgeToTris.set(key, arr);
    }
  });

  const edges: VoronoiEdge[] = [];
  for (const triIdx of edgeToTris.values()) {
    if (triIdx.length !== 2) continue;
    const c1 = cc[triIdx[0]], c2 = cc[triIdx[1]];
    const in1 = c1.cx > -CLIP && c1.cx < W+CLIP && c1.cy > -CLIP && c1.cy < H+CLIP;
    const in2 = c2.cx > -CLIP && c2.cx < W+CLIP && c2.cy > -CLIP && c2.cy < H+CLIP;
    if (!in1 && !in2) continue;
    edges.push([c1.cx, c1.cy, c2.cx, c2.cy]);
  }
  return edges;
}

// progress 0→1: edges appear one by one
export function drawVoronoi(
  ctx: CanvasRenderingContext2D,
  edges: VoronoiEdge[],
  color: string,
  opacity: number,
  strokeWidth: number,
  w: number,
  h: number,
  progress = 1,
): void {
  const scaleX = w / W;
  const scaleY = h / H;
  const end = Math.floor(edges.length * progress);

  ctx.save();
  ctx.globalAlpha = (opacity / 100) * 0.75;
  ctx.strokeStyle = color;
  ctx.lineWidth = strokeWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  for (let i = 0; i < end; i++) {
    const [x1, y1, x2, y2] = edges[i];
    ctx.moveTo(x1 * scaleX, y1 * scaleY);
    ctx.lineTo(x2 * scaleX, y2 * scaleY);
  }
  ctx.stroke();

  ctx.restore();
}
