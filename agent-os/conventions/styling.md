# Styling Conventions

## Visual Direction

The site should feel warm, minimal, editorial, and professional. Favor
restrained, content-first design over decorative complexity.

## Rules

- Tailwind CSS v4 is configured through the Vite plugin, not PostCSS.
- CSS custom properties use OKLCH tokens in `src/styles/global.css`.
- Use semantic Tailwind tokens such as `text-muted-foreground`, `bg-card`,
  `border-border`, and `hover:text-accent`.
- Use Hugeicons for standard UI icons: geometry from `@hugeicons/core-free-icons`,
  `src/components/icons/Icon.astro` for static Astro surfaces, and
  `HugeiconsIcon` from `@hugeicons/react` inside React islands. Do not add a second
  icon library. Keep decorative icons hidden from assistive technology and put
  accessible names on their controls. Custom logos and illustrations remain SVGs.
- Dark mode is class-based with `.dark` on `<html>`.
- Home page sections generally use `mx-auto max-w-3xl px-6 py-16`.
- Section dividers use `border-t border-border`.
- Section labels use mono, uppercase, small text with wide tracking.
- Markdown prose uses custom `.prose` styles in `global.css`, not
  `@tailwindcss/typography`.
- Keep visual work readable and consistent with the current portfolio aesthetic.
- Home entrance timing lives in `src/scripts/home-animations.ts`. Give each
  content section a `data-home-section-header` and wrap its entrance items with
  `data-project-card-item` so new features join the shared load/scroll sequence.
  Keep entrance transforms on wrappers separate from card hover transforms.
- Render primary content visibly by default. Entrance animations should set their
  own initial keyframes; avoid hiding content in server-rendered markup until
  JavaScript reveals it, since failed scripts can leave an otherwise complete
  page blank.

## Related Files

- `src/styles/global.css`
- `src/components/`
- `src/layouts/`
- `src/pages/`
