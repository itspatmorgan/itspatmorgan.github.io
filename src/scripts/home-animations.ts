/**
 * Home page animation orchestrator.
 *
 * Wires up all entrance and interaction animations for the home page:
 *   1. Hero choreographed entrance (photo → label → pixel wave → desc → icons)
 *   2. Hero pixel wave (split-flap + cross-dissolve) + hover interaction
 *   3. Scroll-triggered section entrances (project cards, kind words)
 *   4. CTA scroll entrance + pixel wave
 */

import { animate } from "motion";
import { observeSections } from "./scroll-entrance";
import { pixelWave, enablePixelHover } from "./pixel-wave";

const spring = { type: "spring" as const, stiffness: 160, damping: 20, mass: 0.8 };

function springIn(el: HTMLElement, delay: number) {
  animate(el, { opacity: [0, 1], y: [16, 0] }, { ...spring, delay: delay / 1000 });
}

function init() {
  // --- Hero choreographed entrance ---
  // Sequence: photo → label → name (pixel wave) → description → icons
  const photo = document.querySelector("[data-hero-photo]") as HTMLElement | null;
  const label = document.querySelector("[data-hero-label]") as HTMLElement | null;
  const heroWave = document.querySelector('[data-pixel-wave="hero"]') as HTMLElement | null;
  const desc = document.querySelector("[data-hero-desc]") as HTMLElement | null;
  const icons = document.querySelector("[data-hero-icons]") as HTMLElement | null;

  //  0ms  — Photo fades in
  if (photo) springIn(photo, 0);
  // 120ms — "Software Designer" label follows
  if (label) springIn(label, 120);
  // 300ms — Name split-flap begins (pixel font cycles, then cross-dissolves to sans)
  if (heroWave) {
    pixelWave(heroWave, 300);
    // Once name is mostly resolved, everything else cascades in together
    if (desc) springIn(desc, 1200);
    if (icons) springIn(icons, 1350);
    // Below-fold sections follow right behind as one continuous motion
    setTimeout(() => {
      const sections = document.querySelectorAll(
        "[data-section-entrance]"
      ) as NodeListOf<HTMLElement>;
      sections.forEach((section) => {
        animate(section, { opacity: [0, 1] }, { duration: 0.3, easing: "ease-out" });
      });
      observeSections("[data-project-card-item]", { yOffset: 24, stagger: 0.1 });
      observeSections("[data-kind-words-item]", { yOffset: 20, stagger: 0.06 });
    }, 1500);
  } else {
    // Fallback if pixel wave markup isn't present
    if (desc) springIn(desc, 240);
    if (icons) springIn(icons, 360);
    observeSections("[data-project-card-item]", { yOffset: 24, stagger: 0.1 });
    observeSections("[data-kind-words-item]", { yOffset: 20, stagger: 0.06 });
  }

  // --- CTA scroll entrance + pixel wave ---
  const ctaSection = document.querySelector(
    "[data-cta-section]"
  ) as HTMLElement | null;
  const ctaWave = document.querySelector(
    '[data-pixel-wave="cta"]'
  ) as HTMLElement | null;
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
            // Enable hover after CTA split-flap resolves
            // 600ms + 38 chars × 80ms stagger + 3 flips × 80ms + 300ms crossfade ≈ 4140ms
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
