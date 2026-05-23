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

const writing = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/writing" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedDate: z.coerce.date(),
    categories: z.array(z.string()).default([]),
    theme: z.string().optional(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    canonicalUrl: z.string().url().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, writing };
