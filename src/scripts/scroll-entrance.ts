/**
 * Scroll-triggered staggered entrance animations.
 *
 * Groups elements by their parent <section> and animates each group
 * with a spring-in when the section enters the viewport.
 */

import { animate } from "motion";

interface ScrollEntranceOptions {
  yOffset?: number;
  stagger?: number;
  threshold?: number;
}

export function observeSections(
  selector: string,
  opts: ScrollEntranceOptions = {}
) {
  const allItems = document.querySelectorAll(
    selector
  ) as NodeListOf<HTMLElement>;
  if (!allItems.length) return;
  const { yOffset = 20, stagger = 0.08, threshold = 0.15 } = opts;

  // Group items by their closest section
  const sectionMap = new Map<Element, HTMLElement[]>();
  allItems.forEach((el) => {
    const section = el.closest("section");
    if (!section) return;
    if (!sectionMap.has(section)) sectionMap.set(section, []);
    sectionMap.get(section)!.push(el);
  });

  // Create an observer per section
  sectionMap.forEach((items, section) => {
    let revealed = false;
    const obs = new IntersectionObserver(
      (entries) => {
        if (revealed) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            revealed = true;
            obs.disconnect();
            items.forEach((el, i) => {
              animate(
                el,
                { opacity: [0, 1], y: [yOffset, 0] },
                {
                  type: "spring",
                  stiffness: 140,
                  damping: 18,
                  mass: 0.8,
                  delay: i * stagger,
                }
              );
            });
            break;
          }
        }
      },
      { threshold }
    );
    obs.observe(section);
  });
}
