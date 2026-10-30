"use client";

import { useEffect, useState } from "react";
import AsciiCanvas, { type AsciiLayer } from "./AsciiCanvas";

/** A depth plane of the herd: size and height are fractions of the canvas height, speed is px/s. */
type Plane = { color: string; alpha: number; size: number; y: number; speed: number; gait: number; count: number; offset: number };

const HERDS: Record<"hero" | "closing", Plane[]> = {
  hero: [
    { color: "#9db1c2", alpha: 0.8, size: 0.56, y: 0.36, speed: 22, gait: 9, count: 3, offset: 0.12 },
    { color: "#56789a", alpha: 0.95, size: 0.82, y: 0.49, speed: 38, gait: 10.5, count: 2, offset: 0.58 },
    { color: "#1f418a", alpha: 1, size: 1.16, y: 0.6, speed: 56, gait: 12, count: 2, offset: 0.06 },
  ],
  closing: [
    { color: "#8fa8b5", alpha: 0.8, size: 0.62, y: 0.44, speed: 30, gait: 9.5, count: 3, offset: 0.3 },
    { color: "#2f557a", alpha: 1, size: 0.95, y: 0.54, speed: 52, gait: 12, count: 2, offset: 0.7 },
  ],
};

let sprite: Promise<HTMLImageElement> | null = null;
const loadSprite = () => (sprite ??= new Promise(resolve => {
  const image = new Image();
  image.onload = () => resolve(image);
  image.src = "/gallop.jpg";
}));

export default function Horses({ herd = "hero" }: { herd?: "hero" | "closing" }) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  useEffect(() => { loadSprite().then(setImage); }, []);
  const planes = HERDS[herd];

  if (!image) return <div className={`horse-art horse-art-${herd}`} />;

  const layers = (t: number, w: number, h: number): AsciiLayer[] => planes.map((plane, p) => ({
    color: plane.color,
    alpha: plane.alpha,
    draw: s => {
      const fw = image.width / 4, fh = image.height / 2;
      const size = Math.min(h * plane.size, w * 0.6);
      const loop = w + size;
      for (let n = 0; n < plane.count; n++) {
        const phase = p * 3 + n * 5;
        const step = Math.floor(t * plane.gait + phase) % 8;
        const x = ((plane.offset + n / plane.count) * loop + t * plane.speed) % loop - size;
        const bob = Math.sin(((t * plane.gait + phase) / 8) * Math.PI * 2) * size * 0.012;
        s.drawImage(image, (step % 4) * fw, Math.floor(step / 4) * fh, fw, fh, x, h * plane.y - size / 2 + bob, size, size);
      }
    },
  }));

  return <div className={`horse-art horse-art-${herd}`}>
    <AsciiCanvas
      label={herd === "hero" ? "A herd of seven horses galloping across the foothills in animated blue ASCII" : "Horses galloping toward the finish in ASCII"}
      layers={layers}
      cell={w => (w < 600 ? 3 : w > 1900 ? 5 : 4)}
      fps={18}
      lens={{ radius: herd === "hero" ? 150 : 120, color: "#c4622d" }}
      reveal={herd === "hero"}
    />
  </div>;
}
