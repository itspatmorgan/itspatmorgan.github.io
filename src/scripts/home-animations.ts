import { animate } from "motion";
import { pixelWave, dissolvePixelWave, enablePixelHover } from "./pixel-wave";

const SESSION_KEY = "pixelWaveSeen";
const spring = { type: "spring" as const, stiffness: 160, damping: 20, mass: 0.8 };

function springIn(el: HTMLElement, delay: number) {
  animate(el, { opacity: [0, 1], y: [16, 0] }, { ...spring, delay: delay / 1000 });
}

function softIn(el: HTMLElement, delay: number) {
  animate(
    el,
    { opacity: [0, 1], y: [10, 0] },
    { duration: 0.45, easing: "ease-out", delay: delay / 1000 }
  );
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
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const seen = sessionStorage.getItem(SESSION_KEY);
  const isMd = window.matchMedia("(min-width: 768px)").matches;
  const activeHero = document.querySelector<HTMLElement>(isMd ? ".hero-desktop" : ".hero-mobile");
  const photo = activeHero?.querySelector<HTMLElement>("[data-hero-photo]");
  const desc = activeHero?.querySelector<HTMLElement>("[data-hero-desc]");
  const heroWave = activeHero?.querySelector<HTMLElement>("[data-pixel-wave]");
  const inactiveWave = document.querySelector<HTMLElement>(
    isMd ? '[data-pixel-wave="hero"]' : '[data-pixel-wave="headline"]'
  );
  if (inactiveWave) resolvePixelWave(inactiveWave);

  if (reducedMotion) {
    document.querySelectorAll<HTMLElement>("[data-pixel-wave]").forEach(resolvePixelWave);
    return;
  }

  sessionStorage.setItem(SESSION_KEY, "1");
  if (heroWave) {
    if (seen) {
      resolvePixelWave(heroWave);
      enablePixelHover(heroWave);
    } else {
      dissolvePixelWave(heroWave);
    }
    springIn(heroWave, 0);
  }
  if (photo) springIn(photo, 60);
  if (desc) springIn(desc, seen ? 80 : 180);

  // Schedule visible sections on the opening timeline. Sections below the fold
  // use the same rhythm on scroll, without a delayed second reveal.
  const observers: IntersectionObserver[] = [];
  let visibleSectionIndex = 0;
  document.querySelectorAll<HTMLElement>("[data-home-section-header]").forEach((header) => {
    const section = header.closest("section");
    if (!section) return;
    const items = Array.from(section.querySelectorAll<HTMLElement>("[data-project-card-item]"));
    const reveal = (delay: number) => {
      softIn(header, delay);
      items.forEach((item, index) => springIn(item, delay + 80 + index * 70));
    };
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      reveal((seen ? 180 : 320) + visibleSectionIndex * 140);
      visibleSectionIndex++;
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      reveal(0);
    }, { threshold: 0, rootMargin: "0px 0px -32px 0px" });
    observers.push(observer);
    observer.observe(section);
  });
  document.addEventListener("astro:before-swap", () => {
    observers.forEach((observer) => observer.disconnect());
  }, { once: true });

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
    document.addEventListener("astro:before-swap", () => ctaObs.disconnect(), { once: true });
  }
}

init();
document.addEventListener("astro:after-swap", init);
