# Fix feature/thumbnail image naming convention

**Issue:** [#17](https://github.com/itspatmorgan/itspatmorgan.github.io/issues/17)

## Context

The `feature-*` and `thumbnail.*` image naming conventions are swapped from what's intuitive:
- `feature-*` (2400×2400 square) → used for home page card previews (should be called `thumbnail-*`)
- `thumbnail.*` (1920×1080 16:9) → used for detail page heroes (should be called `feature-*`)

"Thumbnail" intuitively means a small preview image (card), while "feature" intuitively means a prominent display image (hero). The fix swaps the file naming to match intuition.

## Approach

Rename all image files and update every reference. No schema or component field changes needed — the `thumbnail` frontmatter field and `heroImage` field keep their names, only the files they point to change.

## Steps

### 1. Rename image files (10 files)

`feature-*` → `thumbnail-*` (square card images):

| Old path | New path |
|----------|----------|
| `public/images/projects/query/feature-query-mono.png` | `public/images/projects/query/thumbnail-query-mono.png` |
| `public/images/projects/expansion/feature-expansion.png` | `public/images/projects/expansion/thumbnail-expansion.png` |
| `public/images/projects/vision/feature-vision.png` | `public/images/projects/vision/thumbnail-vision.png` |
| `public/images/projects/characters/feature-characters-ui.png` | `public/images/projects/characters/thumbnail-characters-ui.png` |
| `public/images/projects/gpts/feature-gpt-guides.png` | `public/images/projects/gpts/thumbnail-gpt-guides.png` |

`thumbnail.*` → `feature-*` (16:9 hero images):

| Old path | New path |
|----------|----------|
| `public/images/projects/query/thumbnail.jpg` | `public/images/projects/query/feature-query.jpg` |
| `public/images/projects/expansion/thumbnail.jpg` | `public/images/projects/expansion/feature-expansion.jpg` |
| `public/images/projects/characters/thumbnail.jpg` | `public/images/projects/characters/feature-characters.jpg` |
| `public/images/projects/gpts/thumbnail.jpg` | `public/images/projects/gpts/feature-gpts.jpg` |

Note: Vision project has no `thumbnail.jpg` — it already uses `vision-hero.png` for `heroImage`.

### 2. Update project frontmatter (5 files)

Update `thumbnail` field values in each project to point to renamed files:

| File | Old value | New value |
|------|-----------|-----------|
| `src/content/projects/query-language.mdx` | `feature-query-mono.png` | `thumbnail-query-mono.png` |
| `src/content/projects/expansion.mdx` | `feature-expansion.png` | `thumbnail-expansion.png` |
| `src/content/projects/vision.md` | `feature-vision.png` | `thumbnail-vision.png` |
| `src/content/projects/characters.mdx` | `feature-characters-ui.png` | `thumbnail-characters-ui.png` |
| `src/content/projects/gpts.mdx` | `feature-gpt-guides.png` | `thumbnail-gpt-guides.png` |

### 3. Update style guide reference

`src/pages/style-guide.astro` line 51: change `/images/projects/query/thumbnail.jpg` → `/images/projects/query/feature-query.jpg`

### 4. Update documentation (2 files)

**CLAUDE.md** — Update image conventions table:
- `thumbnail-*` | 2400×2400 (square) | Home page project cards
- `feature-*` | 1920×1080 (16:9) | Project detail page hero via `heroImage` field

**README.md** — Update frontmatter example and image conventions table:
- `thumbnail: "/images/projects/slug/thumbnail-image.jpg"` (square)
- `heroImage: "/images/projects/slug/feature-image.jpg"` (16:9, optional)
- Swap rows in the image conventions table

## Files to modify

| File | Change |
|------|--------|
| 9 image files in `public/images/projects/` | Rename |
| 5 project content files in `src/content/projects/` | Update `thumbnail` field path |
| `src/pages/style-guide.astro` | Update image src |
| `CLAUDE.md` | Update image conventions table |
| `README.md` | Update frontmatter example + conventions table |

## Verification

1. `pnpm build` succeeds with no broken image references
2. Dev server: home page cards display correct square images
3. Dev server: project detail pages still work (only vision has heroImage)
4. Style guide page image loads correctly
