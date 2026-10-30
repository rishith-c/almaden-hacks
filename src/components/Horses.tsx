"use client";

import { useEffect, useRef, useState } from "react";

export default function Horses() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [run, setRun] = useState(0);
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const ctx = element.getContext("2d");
    if (!ctx) return;
    let frame = 0;
    let disposed = false;
    const image = new Image();
    const motion = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    let started = 0;
    const draw = (now: number) => {
      if (disposed) return;
      if (!started) started = now;
      const progress = motion ? Math.min(1, (now - started) / 3000) : 1;
      const ease = 1 - Math.pow(1 - progress, 3);
      const width = element.clientWidth;
      const height = element.clientHeight;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      if (element.width !== Math.round(width * dpr) || element.height !== Math.round(height * dpr)) {
        element.width = Math.round(width * dpr);
        element.height = Math.round(height * dpr);
      }
      const cell = width < 600 ? 4 : 5;
      const row = cell * 1.6;
      const cols = Math.ceil(width / cell);
      const rows = Math.ceil(height / row);
      const sample = document.createElement("canvas");
      sample.width = cols;
      sample.height = rows;
      const s = sample.getContext("2d", { willReadFrequently: true });
      if (!s) return;
      s.fillStyle = "#fff";
      s.fillRect(0, 0, cols, rows);
      const fit = Math.min(cols / image.width, rows / image.height);
      const w = image.width * fit;
      const h = image.height * fit;
      const travel = (1 - ease) * cols * -0.16;
      const lift = Math.sin(progress * Math.PI * 10) * (1 - progress) * 1.5;
      s.drawImage(image, (cols - w) / 2 + travel, (rows - h) / 2 + lift, w, h);
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
          if (ink < 0.08 || x / cols > ease * 1.2) continue;
          ctx.fillStyle = x / cols > 0.64 ? "#294e9b" : "#436780";
          ctx.globalAlpha = (0.7 + Math.min(1, ink) * 0.3) * Math.min(1, progress * 5);
          ctx.fillText(glyphs[Math.min(glyphs.length - 1, Math.floor(Math.pow(ink, 0.55) * glyphs.length))], x * cell, y * row);
        }
      }
      ctx.globalAlpha = 1;
      if (progress < 1) frame = requestAnimationFrame(draw);
    };
    const resize = () => { cancelAnimationFrame(frame); started = motion ? performance.now() - 3000 : 0; frame = requestAnimationFrame(draw); };
    image.onload = () => { if (!disposed) frame = requestAnimationFrame(draw); };
    image.src = "/horses.jpg";
    window.addEventListener("resize", resize);
    return () => { disposed = true; cancelAnimationFrame(frame); window.removeEventListener("resize", resize); };
  }, [run]);
  return <div className="horse-art"><canvas ref={canvas} role="img" aria-label="Three racing horses, illustrated in blue ASCII characters" /><button className="replay-art" onClick={() => setRun(value => value + 1)} aria-label="Replay the three-second horse animation">↻ <span>Replay the charge</span></button></div>;
}
