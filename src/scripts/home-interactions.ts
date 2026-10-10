import { enablePixelHover } from "./pixel-wave";

// Headlines render in their final state. Pixel effects respond only to interaction.
function initHomeInteractions() {
  document.querySelectorAll<HTMLElement>(
    '.hero-mobile [data-pixel-wave], .hero-desktop [data-pixel-wave], [data-pixel-wave="cta"]'
  ).forEach(enablePixelHover);
}

initHomeInteractions();
document.addEventListener("astro:after-swap", initHomeInteractions);
