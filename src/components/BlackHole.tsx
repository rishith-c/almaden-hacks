"use client";

import GpuScene from "./GpuScene";
import FallbackHole from "./FallbackHole";

/**
 * The cold open. Everything under ./blackhole is the verified vgpu gallery
 * source byte for byte (revision 69160a12…9222a9); the example's own Tailwind
 * host is the only file not carried over, and GpuScene replaces it.
 */
export default function BlackHole() {
  return (
    <GpuScene
      load={() => import("./blackhole/renderer")}
      className="void-gpu"
      fallbackClassName="void-fallback"
      fallback={<FallbackHole />}
    />
  );
}
