import { useMemo } from 'react';
import { CANVAS_W, CANVAS_H, resolveLayerColor, type VoronoiConfig } from '../themes';
import { makeRng } from './noise';

const W = CANVAS_W;
const H = CANVAS_H;

type Point = [number, number];
interface Tri  { a: number; b: number; c: number }
interface Circle { cx: number; cy: number; r2: number }

// ── Circumcircle ──────────────────────────────────────────────────────────────

function circumcircle(pa: Point, pb: Point, pc: Point): Circle {
  const [ax, ay] = pa;
  const [bx, by] = pb;
  const [cx, cy] = pc;
  const D = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
  if (Math.abs(D) < 1e-10) return { cx: 0, cy: 0, r2: Infinity };
  const a2 = ax * ax + ay * ay;
  const b2 = bx * bx + by * by;
  const c2 = cx * cx + cy * cy;
  const ux = (a2 * (by - cy) + b2 * (cy - ay) + c2 * (ay - by)) / D;
  const uy = (a2 * (cx - bx) + b2 * (ax - cx) + c2 * (bx - ax)) / D;
  return { cx: ux, cy: uy, r2: (ax - ux) ** 2 + (ay - uy) ** 2 };
}

// ── Point generation — jittered grid ─────────────────────────────────────────

function generatePoints(count: number, jitter: number, rng: () => number): Point[] {
  const jFrac = jitter / 100;
  const cols  = Math.max(2, Math.round(Math.sqrt(count * (W / H))));
  const rows  = Math.max(2, Math.round(count / cols));
  const cw    = W / cols;
  const ch    = H / rows;
  const pts: Point[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = (c + 0.5) * cw + (rng() - 0.5) * cw * jFrac;
      const y = (r + 0.5) * ch + (rng() - 0.5) * ch * jFrac;
      pts.push([
        Math.max(1, Math.min(W - 1, x)),
        Math.max(1, Math.min(H - 1, y)),
      ]);
    }
  }

  return pts;
}

// ── Bowyer-Watson Delaunay triangulation ──────────────────────────────────────

function bowyerWatson(pts: Point[]): { tris: Tri[]; allPts: Point[] } {
  const n = pts.length;
  const m = Math.max(W, H) * 10;

  // Three super-triangle vertices appended after real points
  const superPts: Point[] = [
    [W / 2,      -m],
    [W / 2 + m,  H + m],
    [W / 2 - m,  H + m],
  ];
  const allPts = [...pts, ...superPts];
  const si = n; // first super-vertex index

  let tris: Tri[] = [{ a: si, b: si + 1, c: si + 2 }];

  for (let pi = 0; pi < n; pi++) {
    const [px, py] = allPts[pi];

    // Mark bad triangles: point falls inside circumcircle
    const bad = tris.map(t => {
      const cc = circumcircle(allPts[t.a], allPts[t.b], allPts[t.c]);
      const dx = px - cc.cx, dy = py - cc.cy;
      return dx * dx + dy * dy < cc.r2;
    });

    // Collect boundary edges of the hole (appear in exactly one bad triangle)
    const edgeCount = new Map<string, number>();
    tris.forEach((t, ti) => {
      if (!bad[ti]) return;
      for (const [ea, eb] of [[t.a, t.b], [t.b, t.c], [t.c, t.a]] as [number, number][]) {
        const key = ea < eb ? `${ea},${eb}` : `${eb},${ea}`;
        edgeCount.set(key, (edgeCount.get(key) ?? 0) + 1);
      }
    });

    // Remove bad triangles, fill hole
    tris = tris.filter((_, ti) => !bad[ti]);
    for (const [key, cnt] of edgeCount) {
      if (cnt === 1) {
        const [ea, eb] = key.split(',').map(Number);
        tris.push({ a: ea, b: eb, c: pi });
      }
    }
  }

  // Strip triangles that touch super-triangle vertices
  return {
    tris: tris.filter(t => t.a < n && t.b < n && t.c < n),
    allPts,
  };
}

// ── Voronoi edges via circumcenter dual ───────────────────────────────────────
// For each Delaunay edge shared by two triangles, the corresponding
// Voronoi edge connects those two triangles' circumcenters.

const CLIP = 400; // px margin — culls edges with both endpoints far off-canvas

function generateVoronoi(cfg: VoronoiConfig): string {
  const rng  = makeRng(cfg.seed);
  const pts  = generatePoints(cfg.count, cfg.jitter, rng);
  const { tris, allPts } = bowyerWatson(pts);

  // Circumcenter for each triangle
  const cc = tris.map(t =>
    circumcircle(allPts[t.a], allPts[t.b], allPts[t.c])
  );

  // Build edge → [triangleIndex, ...] adjacency
  const edgeToTris = new Map<string, number[]>();
  tris.forEach((t, ti) => {
    for (const [ea, eb] of [[t.a, t.b], [t.b, t.c], [t.c, t.a]] as [number, number][]) {
      const key = ea < eb ? `${ea},${eb}` : `${eb},${ea}`;
      const arr = edgeToTris.get(key) ?? [];
      arr.push(ti);
      edgeToTris.set(key, arr);
    }
  });

  // Draw a Voronoi edge between circumcenters of each adjacent triangle pair
  const parts: string[] = [];
  for (const triIdx of edgeToTris.values()) {
    if (triIdx.length !== 2) continue;
    const c1 = cc[triIdx[0]];
    const c2 = cc[triIdx[1]];

    // Skip edges where both endpoints are far outside the canvas
    const in1 = c1.cx > -CLIP && c1.cx < W + CLIP && c1.cy > -CLIP && c1.cy < H + CLIP;
    const in2 = c2.cx > -CLIP && c2.cx < W + CLIP && c2.cy > -CLIP && c2.cy < H + CLIP;
    if (!in1 && !in2) continue;

    parts.push(
      `M ${c1.cx.toFixed(1)},${c1.cy.toFixed(1)} L ${c2.cx.toFixed(1)},${c2.cy.toFixed(1)}`
    );
  }

  return parts.join(' ');
}

// ── Component ─────────────────────────────────────────────────────────────────

export function Voronoi(cfg: VoronoiConfig) {
  const d = useMemo(
    () => generateVoronoi(cfg),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cfg.seed, cfg.count, cfg.jitter],
  );

  const strokeColor = resolveLayerColor(cfg.color);
  const opacity     = (cfg.opacity / 100) * 0.75;

  return (
    <svg
      style={{ position: 'absolute', inset: 0 }}
      width={W} height={H}
      viewBox={`0 0 ${W} ${H}`}
      overflow="hidden"
    >
      <g
        stroke={strokeColor}
        fill="none"
        strokeWidth={cfg.strokeWidth}
        opacity={opacity}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={d} />
      </g>
    </svg>
  );
}
