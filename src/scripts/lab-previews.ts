import { pixelWave } from "./pixel-wave";

// ── Pixel Wave preview ─────────────────────────────────────

function resetWave(container: HTMLElement) {
  container.querySelectorAll<HTMLElement>("[data-pw-char]").forEach((wrapper) => {
    const pixel = wrapper.querySelector<HTMLElement>("[data-pw-pixel]");
    const sans = wrapper.querySelector<HTMLElement>("[data-pw-sans]");
    if (!pixel || !sans) return;
    sans.style.opacity = "0";
    pixel.style.opacity = "1";
    pixel.textContent = sans.textContent;
  });
}

function resolveWave(container: HTMLElement) {
  container.querySelectorAll<HTMLElement>("[data-pw-pixel]").forEach((el) => {
    el.style.opacity = "0";
  });
  container.querySelectorAll<HTMLElement>("[data-pw-sans]").forEach((el) => {
    el.style.opacity = "1";
  });
}

function initPixelWavePreviews() {
  const previewWaves = document.querySelectorAll<HTMLElement>('[data-pixel-wave="preview-pixel-wave"]');
  previewWaves.forEach((container) => {
    if (container.dataset.previewReady === "true") return;
    container.dataset.previewReady = "true";
    resolveWave(container);

    container.closest("a")?.addEventListener("pointerenter", () => {
      if (container.dataset.animating === "true") return;
      container.dataset.animating = "true";
      resetWave(container);
      pixelWave(container, 0);

      const charCount = container.querySelectorAll("[data-pw-char]").length;
      const duration = charCount * 80 + 700;
      window.setTimeout(() => {
        container.dataset.animating = "false";
      }, duration);
    });
  });
}

// ── Init ───────────────────────────────────────────────────

function initLabPreviews() {
  initPixelWavePreviews();
}

initLabPreviews();
document.addEventListener("astro:after-swap", initLabPreviews);
