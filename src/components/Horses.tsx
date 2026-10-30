"use client";

import { useEffect, useRef } from "react";

export default function Horses() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const ctx = element.getContext("2d");
    if (!ctx) return;
    const sample = document.createElement("canvas");
    const s = sample.getContext("2d", { willReadFrequently: true });
    if (!s) return;
    const image = new Image();
    const motion = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let disposed = false;
    let loaded = false;
    let visible = true;
    let started = 0;
    let last = 0;
    let pausedAt = 0;
    const draw = (now: number) => {
      frame = 0;
      if (disposed || !loaded || !visible || document.hidden) return;
      if (motion) frame = requestAnimationFrame(draw);
      if (now - last < 80 && last) return;
      last = now;
      if (!started) started = now;
      const seconds = motion ? (now - started) / 1000 : 3;
      const progress = Math.min(1, seconds / 3);
      const ease = 1 - Math.pow(1 - progress, 3);
      const width = element.clientWidth;
      const height = element.clientHeight;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      if (element.width !== Math.round(width * dpr) || element.height !== Math.round(height * dpr)) {
        element.width = Math.round(width * dpr);
        element.height = Math.round(height * dpr);
      }
      const cell = width < 600 ? 3 : 4;
      const row = cell * 1.6;
      const cols = Math.ceil(width / cell);
      const rows = Math.ceil(height / row);
      sample.width = cols;
      sample.height = rows;
      s.fillStyle = "#fff";
      s.fillRect(0, 0, cols, rows);
      s.save();
      s.scale(1 / cell, 1 / row);
      const frameWidth = image.width / 4;
      const frameHeight = image.height / 2;
      const horses = [
        { x: 0.49, y: 0.42, size: 0.43, depth: 1.03, phase: 3, opacity: 0.62 },
        { x: 0.16, y: 0.50, size: 0.46, depth: 1.18, phase: 6, opacity: 0.85 },
        { x: 0.83, y: 0.50, size: 0.46, depth: 1.18, phase: 0, opacity: 1 },
      ];
      s.globalCompositeOperation = "multiply";
      for (const horse of horses) {
        const step = motion ? Math.floor(seconds * 10 + horse.phase) % 8 : horse.phase;
        const size = Math.min(width * horse.size, height * horse.depth);
        const stride = motion ? Math.sin((seconds * 10 + horse.phase) / 8 * Math.PI * 2) : 0;
        const travel = (1 - ease) * width * -0.17;
        const drift = motion ? Math.sin(seconds * 0.7 + horse.phase) * width * 0.009 : 0;
        s.globalAlpha = horse.opacity;
        s.drawImage(image, (step % 4) * frameWidth, Math.floor(step / 4) * frameHeight,
          frameWidth, frameHeight, width * horse.x - size / 2 + travel + drift,
          height * horse.y - size / 2 + stride * height * 0.009, size, size);
      }
      s.restore();
      s.globalAlpha = 1;
      const pixels = s.getImageData(0, 0, cols, rows).data;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.font = `600 ${cell * 1.45}px monospace`;
      ctx.textBaseline = "top";
      const glyphs = " .,:;i+=xX#%@";
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4;
          const ink = 1 - (pixels[i] * 0.2126 + pixels[i + 1] * 0.7152 + pixels[i + 2] * 0.0722) / 255;
          if (ink < 0.07 || x / cols > ease * 1.2) continue;
          ctx.fillStyle = x / cols > 0.6 ? "#244b97" : "#3e657d";
          ctx.globalAlpha = (0.65 + ink * 0.35) * Math.min(1, progress * 5);
          ctx.fillText(glyphs[Math.min(glyphs.length - 1, Math.floor(Math.pow(ink, 0.55) * glyphs.length))], x * cell, y * row);
        }
      }
      ctx.globalAlpha = 1;
    };
    const start = () => {
      if (!frame && loaded && visible && !document.hidden && !disposed) frame = requestAnimationFrame(draw);
    };
    const pause = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (!pausedAt) pausedAt = performance.now();
    };
    const resume = () => {
      if (pausedAt && started) started += performance.now() - pausedAt;
      pausedAt = 0;
      start();
    };
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) resume(); else pause();
    });
    observer.observe(element);
    const visibility = () => { if (document.hidden) pause(); else resume(); };
    image.onload = () => { loaded = true; start(); };
    image.src = "/gallop.jpg";
    window.addEventListener("resize", start);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", start);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  return <div className="horse-art"><canvas ref={canvas} role="img" aria-label="Three realistic horses galloping in animated blue ASCII, each at a different depth" /></div>;
}
