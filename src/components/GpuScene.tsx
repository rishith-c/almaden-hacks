"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Shared host for a vgpu example.
 *
 * Every renderer in the gallery exposes the same two things — a `ready`
 * promise and a `dispose()` — so one component can drive all of them, and the
 * three things that have to be right about mounting a WebGPU canvas in a
 * React app live in exactly one place rather than once per scene:
 *
 * 1. The renderer module is imported dynamically. vgpu plus a compiled shader
 *    graph is not a payload to hand a visitor whose browser cannot run it.
 * 2. `ready` is caught. The gallery renderers deliberately rethrow out of it
 *    when init() finds no adapter; uncaught that is an unhandled rejection and
 *    a black rectangle. Here it resolves to `unavailable` and the CSS fallback
 *    stays up.
 * 3. `dispose()` runs on unmount, and is safe to call twice — a failure inside
 *    a renderer has already called it before the rejection reaches us.
 */
type Renderer = { ready: Promise<unknown>; dispose: () => void };

export default function GpuScene({
  load,
  className,
  fallbackClassName,
}: {
  /** Must be an inline arrow with a literal specifier so the bundler can see it. */
  load: () => Promise<{ createRenderer: (o: { canvas: HTMLCanvasElement }) => Renderer }>;
  className: string;
  fallbackClassName: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "unavailable">("loading");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    /* Respect the OS setting: these scenes all animate continuously. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
    // `load` is an inline arrow, so it is a new identity every render; the
    // scene must mount once, not on every parent update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`${className} gpu-scene is-${state}`} aria-hidden>
      <canvas ref={canvasRef} className="gpu-canvas" />
      <div className={fallbackClassName} />
    </div>
  );
}
