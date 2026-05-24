import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    type: z.enum(["professional", "experiment"]),
    description: z.string(),
    skills: z.array(z.string()),
    thumbnail: z.string(),
    thumbnailDark: z.string().optional(),
    thumbnailWide: z.string().optional(),
    thumbnailWideDark: z.string().optional(),
    heroImage: z.string().optional(),
    sortOrder: z.number(),
    draft: z.boolean().default(false),
  }),
});

const visualGenerator = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("flow-field"),
    seed: z.number(),
    density: z.number(),
    steps: z.number(),
    scale: z.number(),
    curl: z.number(),
    strokeWidth: z.number(),
    opacity: z.number(),
    color: z.string(),
  }),
  z.object({
    type: z.literal("dot-grid"),
    seed: z.number(),
    spacing: z.number(),
    scale: z.number(),
    dotSize: z.number(),
    opacity: z.number(),
    color: z.string(),
  }),
  z.object({
    type: z.literal("isoline"),
    seed: z.number(),
    levels: z.number(),
    scale: z.number(),
    strokeWidth: z.number(),
    opacity: z.number(),
    color: z.string(),
  }),
  z.object({
    type: z.literal("voronoi"),
    seed: z.number(),
    count: z.number(),
    jitter: z.number(),
    strokeWidth: z.number(),
    opacity: z.number(),
    color: z.string(),
  }),
  z.object({
    type: z.literal("strange-attractor"),
    seed: z.number(),
    opacity: z.number(),
    color: z.string(),
  }),
]);

const writingVisual = z.object({
  version: z.literal(1),
  theme: z.string(),
  background: z.string(),
  generator: visualGenerator,
  texture: z.number(),
  grain: z.number(),
});

const writing = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/writing" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedDate: z.coerce.date(),
    categories: z.array(z.string()).default([]),
    theme: z.string().optional(),
    tags: z.array(z.string()).default([]),
    visual: writingVisual.optional(),
    image: z.string().optional(),
    canonicalUrl: z.string().url().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, writing };
