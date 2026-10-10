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
- Render primary content in its final visible position. Top-level pages share a
  160ms native document crossfade, opted in by `BaseLayout.astro` and styled in
  `global.css`. Do not layer page or scroll entrance animations onto it. Browsers
  without transition support use ordinary document navigation; reduced motion
  disables the route transition.
- Keep automatic load effects off the navigation logo. Preserve intentional
  hover, click, tabs, and demo effects. Home pixel hover setup lives in
  `src/scripts/home-interactions.ts`.
- Navigation remains document-based; there is no Astro ClientRouter. If one is
  introduced later, review script initialization and timer/observer cleanup
  before relying on `astro:*` lifecycle listeners.

## Related Files

- `src/styles/global.css`
- `src/components/`
- `src/layouts/`
- `src/pages/`
