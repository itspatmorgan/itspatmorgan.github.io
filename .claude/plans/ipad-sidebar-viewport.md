# iPad Sidebar Viewport Fix

## Context

The desktop sidebar appears at the `md` breakpoint, which includes iPad-sized screens. The sidebar currently uses `h-screen`, and the page shell uses `md:min-h-screen`. On iPad Safari, `100vh` can include browser chrome instead of the visible viewport, causing sticky full-height elements to extend below the usable screen and appear cut off.

## Approach

Use dynamic viewport units for the shared desktop shell and sidebar so tablet browsers size the layout to the visible viewport. Keep the sidebar sticky and fixed to the left rail behavior. Add a vertical overflow fallback on the sidebar so very short viewports can still access all controls.

## Files to Modify

- `src/layouts/PageLayout.astro`: change the desktop shell minimum height from static viewport height to dynamic viewport height.
- `src/components/layout/Sidebar.astro`: change the sidebar height from static viewport height to dynamic viewport height and adjust overflow handling.

## Steps

1. Update the page shell from `md:min-h-screen` to `md:min-h-dvh`.
2. Update the sidebar from `h-screen` to `h-dvh`.
3. Change sidebar overflow handling so vertical content remains reachable if the viewport is unusually short.
4. Verify common iPad portrait and landscape viewport measurements.
5. Run the narrowest useful build verification.

## Verification

- Use browser measurements at iPad dimensions such as `768x1024`, `1024x768`, `820x1180`, and `1180x820`.
- Confirm the sidebar display remains desktop-style at `md` and hidden below `md`.
- Run `pnpm build`, noting any unrelated pre-existing failures if encountered.
