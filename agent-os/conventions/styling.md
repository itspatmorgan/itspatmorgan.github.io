# Styling Conventions

## Visual Direction

The site should feel warm, minimal, editorial, and professional. Favor
restrained, content-first design over decorative complexity.

## Rules

- Tailwind CSS v4 is configured through the Vite plugin, not PostCSS.
- CSS custom properties use OKLCH tokens in `src/styles/global.css`.
- Use semantic Tailwind tokens such as `text-muted-foreground`, `bg-card`,
  `border-border`, and `hover:text-accent`.
- Dark mode is class-based with `.dark` on `<html>`.
- Home page sections generally use `mx-auto max-w-3xl px-6 py-16`.
- Section dividers use `border-t border-border`.
- Section labels use mono, uppercase, small text with wide tracking.
- Markdown prose uses custom `.prose` styles in `global.css`, not
  `@tailwindcss/typography`.
- Keep visual work readable and consistent with the current portfolio aesthetic.

## Related Files

- `src/styles/global.css`
- `src/components/`
- `src/layouts/`
- `src/pages/`

