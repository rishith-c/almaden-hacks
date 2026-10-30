"use client";

import { useRef } from "react";
import AsciiCanvas from "./AsciiCanvas";
import { ridges } from "./Mountains";

const small = () => 5;
const gray = (ink: number) => `rgb(${Math.round(255 * (1 - ink))},${Math.round(255 * (1 - ink))},${Math.round(255 * (1 - ink))})`;

/** The donut.c torus, lit from the upper left. */
export function Donut() {
  return <AsciiCanvas label="A spinning ASCII torus" cell={small} lens={{ radius: 70, color: "#c4622d" }} layers={(t, w, h) => [{
    color: "#2d4faa",
    draw: s => {
      s.globalCompositeOperation = "source-over";
      const a = t * 0.9, b = t * 0.5;
      const [ca, sa, cb, sb] = [Math.cos(a), Math.sin(a), Math.cos(b), Math.sin(b)];
      const k1 = Math.min(w, h) * 0.62, dot = Math.min(w, h) / 36;
      const points: [number, number, number, number][] = [];
      for (let th = 0; th < Math.PI * 2; th += 0.22) {
        const ct = Math.cos(th), st = Math.sin(th);
        for (let ph = 0; ph < Math.PI * 2; ph += 0.07) {
          const cp = Math.cos(ph), sp = Math.sin(ph);
          const cx = 2 + ct, cy = st;
          const x = cx * (cb * cp + sa * sb * sp) - cy * ca * sb;
          const y = cx * (sb * cp - sa * cb * sp) + cy * ca * cb;
          const z = 6 + ca * cx * sp + cy * sa;
          const light = cp * ct * sb - ca * ct * sp - sa * st + cb * (ca * st - ct * sa * sp);
          points.push([w / 2 + (k1 * x) / z, h / 2 - (k1 * y) / z, z, light]);
        }
      }
      points.sort((p, q) => q[2] - p[2]);
      for (const [x, y, , light] of points) {
        s.fillStyle = gray(0.14 + Math.max(0, light) * 0.62);
        s.fillRect(x - dot / 2, y - dot / 2, dot, dot);
      }
    },
  }]} />;
}

/** Foothill ridges rolling past, nearest fastest. */
export function Ridgeline() {
  return <AsciiCanvas label="ASCII foothills rolling past" cell={small} lens={{ radius: 70, color: "#c4622d" }} layers={(t, w, h) => [0, 1, 2, 3].map(d => ({
    color: ["#a3b6c4", "#7c97aa", "#4f7387", "#2f5a5c"][d],
    draw: s => {
      const shift = t * (12 + d * 16);
      const crest = new Path2D();
      for (let x = 0; x <= w + 4; x += 4) {
        const u = (x + shift) / w;
        const y = h * (0.3 + d * 0.16) - (Math.sin(u * 5.1 + d) * 0.09 + Math.sin(u * 11.3 + d * 2) * 0.04 + Math.sin(u * 23 + d) * 0.015) * h;
        if (x) crest.lineTo(x, y); else crest.moveTo(x, y);
      }
      const body = new Path2D(crest);
      body.lineTo(w, h); body.lineTo(0, h); body.closePath();
      s.globalCompositeOperation = "source-over";
      s.fillStyle = "#fff";
      s.fill(body);
      s.fillStyle = gray(0.2 + d * 0.04);
      s.fill(body);
      s.strokeStyle = gray(0.95);
      s.lineWidth = 6;
      s.stroke(crest);
    },
  }))} />;
}

/** People drifting together; lines form between whoever is close. */
export function Constellation() {
  return <AsciiCanvas label="ASCII constellation of people connecting" cell={small} lens={{ radius: 70, color: "#c4622d" }} layers={(t, w, h) => {
    const nodes = Array.from({ length: 9 }, (_, i) => [
      w / 2 + Math.sin(t * (0.3 + i * 0.07) + i * 2.1) * w * 0.4,
      h / 2 + Math.cos(t * (0.25 + i * 0.05) + i * 1.3) * h * 0.38,
    ]);
    return [{
      color: "#8aa3b4",
      draw: s => {
        s.lineWidth = 4;
        for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i][0] - nodes[j][0], nodes[i][1] - nodes[j][1]) / Math.min(w, h);
          if (d > 0.62) continue;
          s.strokeStyle = gray(0.9 - d);
          s.beginPath(); s.moveTo(nodes[i][0], nodes[i][1]); s.lineTo(nodes[j][0], nodes[j][1]); s.stroke();
        }
      },
    }, {
      color: "#2d4faa",
      draw: s => {
        nodes.forEach(([x, y], i) => {
          s.fillStyle = "#000";
          s.beginPath(); s.arc(x, y, 12 + Math.sin(t * 2 + i) * 3, 0, Math.PI * 2); s.fill();
        });
      },
    }];
  }} />;
}

/** The day passing: a sun that crosses the sky as the section scrolls by. */
export function DaySky() {
  const wrap = useRef<HTMLDivElement>(null);
  const paths = useRef<Path2D[]>([]);
  return <div ref={wrap} className="day-sky">
    <AsciiCanvas label="An ASCII sun crossing the sky over the foothills" cell={small} fps={24} still={0} lens={{ radius: 90, color: "#f0c987" }} layers={(t, w, h) => {
      if (!paths.current.length) paths.current = ridges.slice(1).map(d => new Path2D(d));
      const box = wrap.current?.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = box ? Math.min(1, Math.max(0, (vh - box.top) / (vh + box.height))) : 0.5;
      const sx = w * (0.1 + 0.8 * p), sy = h * 0.8 - Math.sin(p * Math.PI) * h * 0.6, sr = h * 0.14;
      return [{
        color: "#7f97b3",
        draw: s => {
          for (let i = 0; i < 40; i++) {
            const n = Math.sin(i * 91.7) * 43758.5;
            const m = Math.sin(i * 12.9898 + 4.1) * 23421.6;
            const fx = n - Math.floor(n), fy = m - Math.floor(m);
            s.fillStyle = gray(0.35 + 0.35 * Math.sin(t * 2 + i));
            s.fillRect(fx * w, fy * h * 0.5, 4, 4);
          }
        },
      }, {
        color: "#f0c987",
        draw: s => {
          const glow = s.createRadialGradient(sx, sy, 0, sx, sy, sr * 2.4);
          glow.addColorStop(0, "#000"); glow.addColorStop(0.4, "#222"); glow.addColorStop(0.42, "#999"); glow.addColorStop(1, "#fff");
          s.fillStyle = glow;
          s.fillRect(sx - sr * 2.5, sy - sr * 2.5, sr * 5, sr * 5);
        },
      }, ...paths.current.map((path, i) => ({
        color: ["#5b7896", "#7f9ab0", "#b3c6d2"][i],
        draw: (s: CanvasRenderingContext2D) => {
          s.save();
          s.translate(0, h * 0.18);
          s.scale(w / 1440, (h * 0.9) / 400);
          s.fillStyle = gray(0.2 + i * 0.04);
          s.fill(path);
          s.strokeStyle = gray(0.95);
          s.lineWidth = 6 * 400 / h;
          s.stroke(path);
          s.restore();
        },
      }))];
    }} />
  </div>;
}

let serif = "";
/** Words set in the display serif and rendered in glyphs, with light sweeping across. */
export function AsciiText({ text, color, lens, fill = 0.97, sway = false }: { text: string; color: string; lens: string; fill?: number; sway?: boolean }) {
  return <AsciiCanvas label={text} cell={w => (w < 600 ? 3 : 5)} lens={{ radius: 130, color: lens }} layers={(t, w, h) => [{
    color,
    draw: s => {
      serif ||= getComputedStyle(document.body).getPropertyValue("--font-serif").trim() || "Georgia, serif";
      s.font = `400 100px ${serif}`;
      const m = s.measureText(text);
      const size = Math.min((100 * w * fill) / m.width, (100 * h * 0.8) / (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent));
      s.font = `400 ${size}px ${serif}`;
      const x0 = (((t * 0.12) % 1.8) - 0.4) * w;
      const sweep = s.createLinearGradient(x0, 0, x0 + w * 0.35, 0);
      sweep.addColorStop(0, "#111"); sweep.addColorStop(0.5, "#777"); sweep.addColorStop(1, "#111");
      s.fillStyle = sweep;
      s.textAlign = "center";
      s.textBaseline = "middle";
      s.translate(w / 2, h / 2);
      if (sway) s.rotate(Math.sin(t * 0.8) * 0.12);
      s.fillText(text, 0, 0);
      // Thicken the serif's hairlines so they survive at cell resolution.
      s.strokeStyle = sweep;
      s.lineWidth = size * 0.022;
      s.strokeText(text, 0, 0);
    },
  }]} />;
}
