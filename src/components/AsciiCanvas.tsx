"use client";

import { useEffect, useRef } from "react";

/**
 * One layer of an ASCII scene. `draw` paints dark shapes onto a white sample
 * canvas (multiply mode, CSS pixel coordinates); every cell it darkens becomes
 * a glyph in `color`. Later layers occlude earlier ones, so list them back to
 * front.
 */
export type AsciiLayer = {
  color: string;
  alpha?: number;
  draw: (s: CanvasRenderingContext2D, w: number, h: number) => void;
};

type Props = {
  label: string;
  className?: string;
  /** Scene at time t (seconds since first paint; a fixed `still` under reduced motion). */
  layers: (t: number, w: number, h: number) => AsciiLayer[];
  /** Cell width in CSS px for a canvas of width w. */
  cell?: (w: number) => number;
  fps?: number;
  /** Pointer lens: brightens glyphs and reveals the grid near the cursor. */
  lens?: { radius: number; color: string } | false;
  /** Left-to-right scan on first paint. */
  reveal?: boolean;
  still?: number;
};

const RAMP = " .:-=+*xX#%@";
const NOISE = ".:+*/\\<>=~";

const hash = (x: number, y: number, z: number) => {
  const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return n - Math.floor(n);
};

export default function AsciiCanvas({ label, className = "", layers, cell = w => (w < 600 ? 4 : 5), fps = 20, lens = false, reveal = false, still = 3 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const scene = useRef(layers);
  scene.current = layers;
  const cellOf = useRef(cell);
  cellOf.current = cell;
  const lensRef = useRef(lens);
  lensRef.current = lens;

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    const sample = document.createElement("canvas");
    const s = sample.getContext("2d", { willReadFrequently: true });
    if (!canvas || !ctx || !s) return;
    const motion = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mono = getComputedStyle(document.body).getPropertyValue("--font-mono").trim() || "monospace";
    let frame = 0, started = 0, last = 0, pausedAt = 0;
    let visible = false, disposed = false;
    const pointer = { x: -1e4, y: -1e4 };
    let shown = 0;

    const draw = (now: number) => {
      frame = 0;
      if (disposed || !visible || document.hidden) return;
      if (motion) frame = requestAnimationFrame(draw);
      if (last && now - last < 1000 / fps) return;
      last = now;
      if (!started) started = now;
      const t = motion ? (now - started) / 1000 : still;
      const width = canvas.clientWidth, height = canvas.clientHeight;
      if (!width || !height) return;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
      }
      const c = cellOf.current(width), r = c * 1.6;
      const cols = Math.ceil(width / c), rows = Math.ceil(height / r);
      if (sample.width !== cols || sample.height !== rows) { sample.width = cols; sample.height = rows; }

      const scan = reveal && motion ? Math.min(1.25, t / 1.6) : 1.25;
      const box = canvas.getBoundingClientRect();
      const px = pointer.x - box.left, py = pointer.y - box.top;
      const lensOn = lensRef.current;
      const radius = lensOn ? lensOn.radius : 0;
      const tick = Math.floor(t * 10);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.font = `500 ${c * 1.42}px ${mono}`;
      ctx.textBaseline = "top";
      const hit = new Uint8Array(cols * rows);

      for (const layer of scene.current(t, width, height)) {
        s.setTransform(1, 0, 0, 1, 0, 0);
        s.globalCompositeOperation = "source-over";
        s.globalAlpha = 1;
        s.fillStyle = "#fff";
        s.fillRect(0, 0, cols, rows);
        s.setTransform(1 / c, 0, 0, 1 / r, 0, 0);
        s.globalCompositeOperation = "multiply";
        layer.draw(s, width, height);
        const px8 = s.getImageData(0, 0, cols, rows).data;
        const base = layer.alpha ?? 1;
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const i = y * cols + x;
            const raw = 1 - (px8[i * 4] * 0.2126 + px8[i * 4 + 1] * 0.7152 + px8[i * 4 + 2] * 0.0722) / 255;
            if (raw < 0.12) continue;
            // Contrast curve: highlights fall to dots, only true shadow reaches '#'.
            let ink = Math.min(1, (raw - 0.12) / 0.8);
            const edge = scan - (x / cols) * 1.1;
            if (edge < 0) continue;
            let color = layer.color;
            if (radius) {
              const d = Math.hypot(x * c + c / 2 - px, y * r + r / 2 - py);
              if (d < radius) {
                const k = 1 - d / radius;
                ink = Math.min(1, ink + k * 0.55);
                if (k > 0.35 && lensOn) color = lensOn.color;
              }
            }
            if (hit[i]) ctx.clearRect(x * c, y * r, c, r);
            hit[i] = 1;
            ctx.fillStyle = color;
            ctx.globalAlpha = base * (0.45 + ink * 0.55);
            const glyph = edge < 0.06 ? NOISE[Math.floor(hash(x, y, tick) * NOISE.length)] : RAMP[Math.min(RAMP.length - 1, 1 + Math.floor(Math.pow(ink, 0.85) * (RAMP.length - 1)))];
            ctx.fillText(glyph, x * c, y * r);
          }
        }
      }

      // The lens also uncovers the empty grid around the cursor.
      if (radius && lensOn) {
        ctx.fillStyle = lensOn.color;
        const x0 = Math.max(0, Math.floor((px - radius) / c)), x1 = Math.min(cols, Math.ceil((px + radius) / c));
        const y0 = Math.max(0, Math.floor((py - radius) / r)), y1 = Math.min(rows, Math.ceil((py + radius) / r));
        for (let y = y0; y < y1; y++) {
          for (let x = x0; x < x1; x++) {
            if (hit[y * cols + x]) continue;
            const k = 1 - Math.hypot(x * c + c / 2 - px, y * r + r / 2 - py) / radius;
            if (k <= 0) continue;
            const n = hash(x, y, Math.floor(t * 6));
            if (n > 0.2 + k * 0.6) continue;
            ctx.globalAlpha = k * 0.5;
            ctx.fillText(n < 0.08 ? NOISE[Math.floor(n * 100) % NOISE.length] : ".", x * c, y * r);
          }
        }
      }
      ctx.globalAlpha = 1;
      if (!shown) { shown = 1; canvas.classList.add("is-live"); }
    };

    const start = () => { if (!frame && visible && !document.hidden && !disposed) frame = requestAnimationFrame(draw); };
    const pause = () => { cancelAnimationFrame(frame); frame = 0; if (!pausedAt) pausedAt = performance.now(); };
    const resume = () => { if (pausedAt && started) started += performance.now() - pausedAt; pausedAt = 0; start(); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) resume(); else pause(); }, { rootMargin: "120px" });
    observer.observe(canvas);
    const onVisibility = () => (document.hidden ? pause() : resume());
    const onResize = () => { last = 0; start(); };
    const onPointer = (e: PointerEvent) => {
      pointer.x = e.clientX; pointer.y = e.clientY;
      if (!motion) { last = 0; start(); }
    };
    const onLeave = () => { pointer.x = pointer.y = -1e4; };
    window.addEventListener("resize", onResize);
    if (lensRef.current) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [fps, reveal, still]);

  return <canvas ref={ref} className={`ascii-canvas ${className}`} role="img" aria-label={label} />;
}
