# Resume Page (formerly "Experience")

## Context

The last major page needed. The nav currently links to `/experience` but the page doesn't exist. User wants this called **"Resume"** instead of "Experience" for the new site. The reference screenshot (`.reference/references/screenshot-experience-page.png`) shows a detailed career timeline with sections for bullet point highlights, product design roles, writing & community, and brand work. No resume PDF download for now.

## Step 1: Create career data file

**New file: `src/data/experience.ts`**

Structured data with:
- `bulletPoints` array — career narrative highlights (title + description)
- `roles` array — career entries grouped by section, each with: `section`, `company`, `logo`, `role`, `dateRange`, `descriptions[]`

Sections from the screenshot (in order):
1. **Product Design** — Sublime Security (Current), JupiterOne (2022–2023), Signal Sciences (2019–2021), Tenable (2017–2018)
2. **Writing & Community** — Unknown Arts (2022–Present)
3. **Brand** — Leo Burnett (2012–2013), American Express (2013–2016)

Pull descriptions from the screenshot as best I can; user will correct later.

## Step 1.5: Rename "Experience" → "Resume" in nav

- **`src/data/site-config.ts`** — Change `{ label: "Experience", href: "/experience" }` → `{ label: "Resume", href: "/resume" }`
- **`src/components/layout/Footer.astro`** — Update footer link from `/experience` to `/resume`

## Step 2: Create the resume page

**New file: `src/pages/resume.astro`**

Uses `PageLayout`. Structure (matching reference screenshot):

1. **Hero** — `<h1>Resume</h1>` + subtitle about 12+ years. No resume PDF button for now.
2. **Logo bar** — Static row of career company logos in pills (reuse the logo pill styling from LogoCarousel but without animation)
3. **"The Bullet Points" section** — mono uppercase label, then a list of career narrative highlights (title + description pairs)
4. **Career sections** — For each section (Product Design, Writing & Community, Brand):
   - Section heading (mono uppercase label)
   - Timeline entries: date range on left, company logo + role + descriptions on right

All within `mx-auto max-w-3xl px-6` to match site-wide width.

## Step 3: Update docs

- Update `CLAUDE.md` to note the Experience page is built

## Files to create/modify

| File | Action |
|---|---|
| `src/data/experience.ts` | Create — career data |
| `src/data/site-config.ts` | Update — nav label "Experience" → "Resume", href `/experience` → `/resume` |
| `src/components/layout/Footer.astro` | Update — footer link `/experience` → `/resume` |
| `src/pages/resume.astro` | Create — resume page |
| `CLAUDE.md` | Update — migration status |

## Verification

1. Dev server starts without errors
2. Nav "Resume" link goes to `/resume`
3. Page renders with hero, logo bar, bullet points, and career timeline sections
4. Company logos display correctly (inverted in light mode via `.logo-adaptive`)
5. Layout matches `max-w-3xl` site-wide width convention
6. Light and dark mode both look correct
