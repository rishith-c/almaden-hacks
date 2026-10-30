"use client";

import GpuScene from "./GpuScene";
import FallbackHole from "./FallbackHole";

// Keep the loader stable so parent renders do not restart the renderer.
const loadRenderer = () => import("./blackhole/renderer");

export default function BlackHole() {
  return (
    <GpuScene
      load={loadRenderer}
      className="void-gpu"
      fallbackClassName="void-fallback"
      fallback={<FallbackHole />}
    />
  );
}

