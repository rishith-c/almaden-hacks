"use client";

import { useEffect, useRef, useState } from "react";

/** Mount a GPU renderer, show its fallback on failure, and dispose on unmount. */
type Renderer = { ready: Promise<unknown>; dispose: () => void };

export default function GpuScene({
  load,
  className,
  fallbackClassName,
  fallback,
}: {
  /** Use a stable loader with a literal import so the bundler can resolve it. */
  load: () => Promise<{ createRenderer: (o: { canvas: HTMLCanvasElement }) => Renderer }>;
  className: string;
  fallbackClassName: string;
  /** Mounted only once the WebGPU renderer has definitively failed. */
  fallback?: React.ReactNode;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "unavailable">("loading");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    /* Respect the OS setting: these scenes all animate continuously.
       `?fallback` forces the no-WebGPU path so it can be checked anywhere. */
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      new URLSearchParams(window.location.search).has("fallback")
    ) {
      setState("unavailable");
      return;
    }

    let cancelled = false;
    let dispose: (() => void) | undefined;

    void load()
      .then(({ createRenderer }) => {
        if (cancelled) return;
        const renderer = createRenderer({ canvas });
        dispose = renderer.dispose;
        return renderer.ready.then(() => {
          if (!cancelled) setState("ready");
        });
      })
      .catch(() => {
        if (!cancelled) setState("unavailable");
      });

    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [load]);

  return (
    <div className={`${className} gpu-scene is-${state}`} aria-hidden>
      <canvas ref={canvasRef} className="gpu-canvas" />
      <div className={fallbackClassName} />
      {state === "unavailable" && fallback}
    </div>
  );
}

