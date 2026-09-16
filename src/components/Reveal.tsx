"use client";

import { useEffect } from "react";

/**
 * Scroll reveal. Anything marked [data-reveal] gets `is-in` when it enters
 * view; [data-reveal="stagger"] cascades its children. Everything reveals
 * immediately under prefers-reduced-motion, since the motion is decorative
 * and the content is not.
 */
export default function Reveal() {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
    );

    /**
     * Anything already on screen at mount is revealed directly rather than
     * handed to the observer. The hero headline sits above the fold, so making
     * it wait on an intersection callback means a missed callback leaves it
     * parked below its mask and invisible. It still animates: the class lands
     * after first paint, so the transition runs from the CSS start state.
     */
    const onScreen = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    };

    targets.forEach((el) => {
      if (el.dataset.reveal === "stagger" || el.dataset.reveal === "lines") {
        Array.from(el.children).forEach((c, i) =>
          (c as HTMLElement).style.setProperty("--i", String(i)),
        );
      }
      if (onScreen(el)) {
        // Added directly, not inside requestAnimationFrame: rAF never fires in
        // a tab the browser is not painting, which leaves the headline parked
        // below its mask. useEffect already runs after paint, so the start
        // state has been rendered and the transition still plays.
        el.classList.add("is-in");
        return;
      }
      io.observe(el);
    });

    return () => io.disconnect();
  }, []);

  return null;
}
