# Content Conventions

## Public Terminology

- Use "Work", not "Projects" or "Experience", for the public portfolio/career section.
- Use "Writing", not "Blog".
- Use "Lab", not "Tools", for hosted experiments, utilities, and interaction showcases.
- Use "Kind Words", not "Commendations" or "Testimonials".

The internal content collection for Work is still named `projects`; do not
rename it casually.

## Work

Work entries live in `src/content/projects/*.{md,mdx}` and render publicly under
`/work/<slug>`.

Common frontmatter:

```yaml
title: "Project Title"
type: "professional"
description: "Short description"
skills: ["Skill 1", "Skill 2"]
thumbnail: "/images/projects/slug/thumbnail-image.jpg"
thumbnailDark: "/images/projects/slug/thumbnail-image-dark.jpg"
thumbnailWide: "/images/projects/slug/thumbnail-wide.jpg"
thumbnailWideDark: "/images/projects/slug/thumbnail-wide-dark.jpg"
heroImage: "/images/projects/slug/feature-image.jpg"
sortOrder: 1
draft: false
```

Dark, wide, and hero images are optional. Work entries that need embeds can use
MDX.

## Writing

Writing lives in `src/content/writing/*.md`.

Common frontmatter:

```yaml
title: "Article Title"
description: "Short description"
publishedDate: 2026-02-22
categories: ["Category"]
theme: "AI"
tags: ["tag1", "tag2"]
image: "/images/writing/article-slug/feature.jpg"
canonicalUrl: "https://www.unknownarts.co/p/article-slug"
draft: false
```

Writing can be synced from the local Obsidian vault with `pnpm sync-writing`.
The website owns `theme`, `visual`, and generated `image` frontmatter for
writing. Obsidian sync preserves those fields.

Use `theme` for broad reader-facing grouping, such as `AI`, `Design`, `Systems
Thinking`, or `Creative Practice`. Use `tags` for lower-level metadata.

## Lab

Lab entries live in `src/content/lab/*.mdx` and are hosted under `/lab/<slug>`.

Common frontmatter:

```yaml
title: "Lab Item"
description: "Short description"
slug: "lab-item"
preview: "lab-item"
experience: "demo"
draft: false
```

Use `experience: "app"` for immersive tools and `experience: "demo"` for
focused interaction showcases. Put implementation code under `src/lab/<slug>/`
when an item needs dedicated components, React islands, or supporting logic.

