import { animate } from "motion";
import { observeSections } from "./scroll-entrance";
import { pixelWave, enablePixelHover } from "./pixel-wave";

const SESSION_KEY = "pixelWaveSeen";
const spring = { type: "spring" as const, stiffness: 160, damping: 20, mass: 0.8 };

function springIn(el: HTMLElement, delay: number) {
  animate(el, { opacity: [0, 1], y: [16, 0] }, { ...spring, delay: delay / 1000 });
}

// Immediately resolves pixel/sans layers without animation
function resolvePixelWave(container: HTMLElement) {
  container.querySelectorAll<HTMLElement>("[data-pw-pixel]").forEach((el) => {
    el.style.opacity = "0";
  });
  container.querySelectorAll<HTMLElement>("[data-pw-sans]").forEach((el) => {
    el.style.opacity = "1";
  });
}

function init() {
  const seen = sessionStorage.getItem(SESSION_KEY);

  const photo = document.querySelector("[data-hero-photo]") as HTMLElement | null;
  const label = document.querySelector("[data-hero-label]") as HTMLElement | null;
  const desc = document.querySelector("[data-hero-desc]") as HTMLElement | null;
  const icons = document.querySelector("[data-hero-icons]") as HTMLElement | null;

  // On desktop (md+) animate the big headline wave; on mobile animate the name wave.
  // The other wave lives in a display:none block — resolve it silently so pixel font never flashes.
  const isMd = window.matchMedia("(min-width: 768px)").matches;
  const heroWave = document.querySelector(
    `[data-pixel-wave="${isMd ? "headline" : "hero"}"]`
  ) as HTMLElement | null;
  const inactiveWave = document.querySelector(
    `[data-pixel-wave="${isMd ? "hero" : "headline"}"]`
  ) as HTMLElement | null;
  if (inactiveWave) resolvePixelWave(inactiveWave);

  function revealSections() {
    const sections = document.querySelectorAll(
      "[data-section-entrance]"
    ) as NodeListOf<HTMLElement>;
    sections.forEach((section) => {
      animate(section, { opacity: [0, 1] }, { duration: 0.3, easing: "ease-out" });
    });
    observeSections("[data-project-card-item]", { yOffset: 24, stagger: 0.1 });
    observeSections("[data-kind-words-item]", { yOffset: 10, stagger: 0.04 });
  }

  if (seen) {
    // Returning visitor: resolve layers silently, then spring everything in together
    if (heroWave) {
      resolvePixelWave(heroWave);
      springIn(heroWave, 0);
    }
    if (photo) springIn(photo, 0);
    if (label) springIn(label, 60);
    if (desc) springIn(desc, 120);
    if (icons) springIn(icons, 180);
    setTimeout(revealSections, 300);
  } else {
    // First visit: full choreographed entrance
    sessionStorage.setItem(SESSION_KEY, "1");

    if (photo) springIn(photo, 0);
    if (label) springIn(label, 120);
    if (heroWave) {
      // Make name visible immediately so pixel font shows while the wave cycles
      heroWave.style.opacity = "1";
      pixelWave(heroWave, 300);
      if (desc) springIn(desc, 1200);
      if (icons) springIn(icons, 1350);
      setTimeout(revealSections, 1500);
    } else {
      if (desc) springIn(desc, 240);
      if (icons) springIn(icons, 360);
      revealSections();
    }
  }

  // CTA — scroll-triggered; always run the pixel wave as a closing interaction.
  const ctaSection = document.querySelector("[data-cta-section]") as HTMLElement | null;
  const ctaWave = document.querySelector('[data-pixel-wave="cta"]') as HTMLElement | null;
  if (ctaSection && ctaWave) {
    ctaSection.style.opacity = "0";
    let ctaRevealed = false;
    const ctaObs = new IntersectionObserver(
      (entries) => {
        if (ctaRevealed) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            ctaRevealed = true;
            ctaObs.disconnect();
            animate(
              ctaSection,
              { opacity: [0, 1], y: [12, 0] },
              { type: "spring", stiffness: 140, damping: 18, mass: 0.8 }
            );
            pixelWave(ctaWave, 600);
            // 600ms delay + 38 chars × 80ms stagger + 3 flips × 80ms + 300ms crossfade ≈ 4200ms
            setTimeout(() => enablePixelHover(ctaWave), 4200);
            break;
          }
        }
      },
      { threshold: 0.3 }
    );
    ctaObs.observe(ctaSection);
  }
}

init();
document.addEventListener("astro:after-swap", init);
