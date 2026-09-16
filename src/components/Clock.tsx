"use client";

import { useEffect, useState } from "react";

/**
 * The one moving thing on the opening screen: a hackathon clock. Eight hours,
 * counting down in real seconds from the moment the page loads. It is not
 * decoration; it is the format. Held still under prefers-reduced-motion.
 */

const EIGHT_HOURS = 8 * 60 * 60;

function fmt(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map((n) => String(n).padStart(2, "0")).join(":");
}

export default function Clock() {
  const [left, setLeft] = useState(EIGHT_HOURS);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = Date.now();
    const id = window.setInterval(() => {
      const gone = Math.floor((Date.now() - start) / 1000);
      setLeft(Math.max(0, EIGHT_HOURS - gone));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="clock" aria-label="Eight hour hackathon clock, counting down">
      <span className="clock-label">Time to build</span>
      <span className="clock-face">{fmt(left)}</span>
    </div>
  );
}
