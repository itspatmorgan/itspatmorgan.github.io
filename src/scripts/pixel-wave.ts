/**
 * Pixel Wave — per-character cross-dissolve animations for text
 * that transitions between Geist Pixel Square and Geist Sans.
 *
 * Expects markup where each character is wrapped in:
 *   <span class="relative inline-block">
 *     <span class="invisible">P</span>              ← spacer (defines layout)
 *     <span data-pw-pixel class="... font-pixel">P</span>  ← pixel layer
 *     <span data-pw-sans style="opacity:0">P</span>        ← sans layer
 *   </span>
 *
 * The container element should have data-pixel-wave="<name>".
 */

import { animate } from "motion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

/** Reveal the original letters with the Design Studio Pixel-to-Sans dissolve. */
export function dissolvePixelWave(container: HTMLElement, lineIndex = 0) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  container.querySelectorAll<HTMLElement>("[data-pw-char]").forEach((character, i) => {
    const pixel = character.querySelector<HTMLElement>("[data-pw-pixel]");
    const sans = character.querySelector<HTMLElement>("[data-pw-sans]");
    if (!pixel || !sans) return;
    pixel.style.opacity = reducedMotion ? "0" : "1";
    sans.style.opacity = reducedMotion ? "1" : "0";
    if (reducedMotion) return;
    const delay = 0.15 + lineIndex * 0.2 + i * 0.025;
    animate(pixel, { opacity: [1, 0] }, { duration: 0.35, delay, easing: "ease-in-out" });
    animate(sans, { opacity: [0, 1] }, { duration: 0.35, delay, easing: "ease-in-out" });
  });
  if (!reducedMotion) {
    setTimeout(() => { if (container.isConnected) enablePixelHover(container); }, 1500);
  }
}

/**
 * Split-flap entrance: each character briefly cycles through a few random
 * glyphs in pixel font, then settles onto the correct letter in sans.
 * Kept subtle — only 3 flips per character at a relaxed pace.
 */
export function pixelWave(container: HTMLElement, delay: number) {
  const chars = container.querySelectorAll(
    "[data-pw-char]"
  ) as NodeListOf<HTMLElement>;

  chars.forEach((wrapper, i) => {
    const pixel = wrapper.querySelector("[data-pw-pixel]") as HTMLElement | null;
    const sans = wrapper.querySelector("[data-pw-sans]") as HTMLElement | null;
    if (!pixel || !sans) return;

    const originalChar = sans.textContent || "";

    // Skip spaces — no cycling needed
    if (originalChar.trim() === "") return;

    // Brief cycling: 3 random glyphs, then settle
    const flipCount = 3;
    const flipSpeed = 80; // ms per flip
    let flips = 0;

    const resolveDelay = delay + i * 80;
    setTimeout(() => {
      const interval = setInterval(() => {
        pixel.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        flips++;
        if (flips >= flipCount) {
          clearInterval(interval);
          pixel.textContent = originalChar;
          animate(pixel, { opacity: [1, 0] }, { duration: 0.3, easing: "ease-in-out" });
          animate(sans, { opacity: [0, 1] }, { duration: 0.3, easing: "ease-in-out" });
        }
      }, flipSpeed);
    }, resolveDelay);
  });
}

/**
 * Enable hover interaction on a pixel-wave container.
 * Characters near the cursor flip back to pixel font; characters
 * further away stay in (or return to) sans. Uses a wide radius so
 * whole word segments are visibly affected.
 *
 * Attach to text rendered in its final sans state, or after a demo wave completes.
 */
export function enablePixelHover(container: HTMLElement) {
  if (container.dataset.pixelHoverReady === "true") return;
  container.dataset.pixelHoverReady = "true";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const chars = Array.from(
    container.querySelectorAll("[data-pw-char]") as NodeListOf<HTMLElement>
  );

  // Pre-compute pixel/sans refs and add CSS transitions for smooth GPU animation
  const layers = chars.map((wrapper) => {
    const pixel = wrapper.querySelector("[data-pw-pixel]") as HTMLElement;
    const sans = wrapper.querySelector("[data-pw-sans]") as HTMLElement;
    pixel.style.transition = "opacity 0.25s ease-out";
    sans.style.transition = "opacity 0.25s ease-out";
    return { wrapper, pixel, sans };
  });

  const RADIUS = 120; // wide enough to affect 4-5 characters at once

  function handleMove(e: MouseEvent) {
    if (reduced.matches) return;
    const cursorX = e.clientX;
    const cursorY = e.clientY;

    for (const { wrapper, pixel, sans } of layers) {
      const rect = wrapper.getBoundingClientRect();
      const charCenterX = rect.left + rect.width / 2;
      const charCenterY = rect.top + rect.height / 2;
      const dist = Math.hypot(cursorX - charCenterX, cursorY - charCenterY);

      if (dist < RADIUS) {
        // Near cursor: show pixel, hide sans (smooth falloff)
        const intensity = 1 - dist / RADIUS;
        pixel.style.opacity = String(intensity);
        sans.style.opacity = String(1 - intensity);
      } else {
        pixel.style.opacity = "0";
        sans.style.opacity = "1";
      }
    }
  }

  function handleLeave() {
    for (const { pixel, sans } of layers) {
      pixel.style.opacity = "0";
      sans.style.opacity = "1";
    }
  }

  reduced.addEventListener("change", handleLeave);
  document.addEventListener("astro:before-swap", () => reduced.removeEventListener("change", handleLeave), { once: true });
  container.addEventListener("mousemove", handleMove);
  container.addEventListener("mouseleave", handleLeave);
}
