"use client";

import { useEffect, useRef } from "react";

/**
 * The black hole for machines that cannot run the vgpu one.
 *
 * WebGL 1 and a single fragment shader: a tilted accretion disk with noise
 * flowing around it, Doppler beaming so one side burns brighter, the shadow
 * in the middle, a thin photon ring on its edge, and the lensed image of the
 * far side of the disk arcing over the top. Monochrome, like the real one.
 * Runs on nearly anything with a GPU driver. Renders a single still frame
 * under prefers-reduced-motion.
 */

const VERT = `
attribute vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_t;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

/* pow() with a negative base is undefined in GLSL and comes back NaN on
   most GPUs, which paints the whole screen white. Square by hand. */
float sq(float x) { return x * x; }

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    v += amp * noise(p);
    p = p * 2.03 + vec2(17.0, 9.0);
    amp *= 0.5;
  }
  return v;
}

void main() {
  /* Centre sits where the vgpu render puts it: upper right. */
  vec2 uv = (gl_FragCoord.xy - u_res * vec2(0.72, 0.62)) / u_res.y;
  float R = 0.27;
  float t = u_t;

  /* Stars, drifting very slowly. */
  float ca = cos(t * 0.004), sa = sin(t * 0.004);
  vec2 suv = mat2(ca, -sa, sa, ca) * uv * 60.0;
  vec2 cell = floor(suv);
  float sh = hash(cell);
  vec2 sp = fract(suv) - 0.5 - (vec2(hash(cell + 1.7), hash(cell + 3.1)) - 0.5) * 0.8;
  float star = smoothstep(0.08, 0.0, length(sp)) * step(0.965, sh) * (0.35 + 0.65 * hash(cell + 9.2));
  star *= 0.7 + 0.3 * sin(t * (1.0 + sh * 3.0) + sh * 40.0);

  /* Disk plane: tilted, and squashed to fake inclination. */
  float a = -0.42;
  vec2 p = mat2(cos(a), -sin(a), sin(a), cos(a)) * uv;
  vec2 d = vec2(p.x, p.y / 0.30);
  float r = length(d);
  float ang = atan(d.y, d.x);

  float flow = fbm(vec2(ang * 3.0 - t * 0.35 - r * 5.0, r * 9.0 + t * 0.05));
  float fine = noise(vec2(ang * 24.0 - t * 1.2 - r * 20.0, r * 40.0));
  float mask = smoothstep(R * 1.02, R * 1.12, r) * (1.0 - smoothstep(R * 1.9, R * 2.7, r));
  float radial = pow(max(0.0, 1.0 - (r - R) / (R * 1.7)), 2.2);
  float beam = 0.45 + 0.55 * cos(ang + 0.9);
  float disk = mask * radial * (0.15 + 1.2 * flow + 0.3 * fine) * beam;

  /* Far half of the disk is hidden behind the shadow; near half passes in front. */
  float ru = length(uv);
  float shadow = 1.0 - smoothstep(R * 0.985, R, ru);
  float behind = step(0.0, d.y);
  disk *= 1.0 - shadow * behind;

  /* Lensed image of the far side: a bright arc over the top of the shadow. */
  float arcR = R * 1.22;
  float arcW = 0.055 + 0.03 * smoothstep(0.0, 1.0, uv.y / R);
  float arc = exp(-sq((ru - arcR) / arcW));
  float aa = atan(uv.y, uv.x);
  float arcFlow = fbm(vec2(aa * 4.0 + t * 0.3, ru * 12.0));
  arc *= smoothstep(-0.15, 0.55, uv.y / R) * (0.45 + 0.9 * arcFlow) * (0.6 + 0.4 * cos(aa - 1.2));
  arc *= 1.0 - shadow;

  /* Photon ring: the thin hard edge of the shadow. */
  float photon = exp(-sq((ru - R * 1.01) / 0.0045)) * 1.4;

  /* Soft glow from all the light near the hole. */
  float glow = exp(-max(0.0, ru - R) * 7.0) * 0.12 * (1.0 - shadow);

  float I = disk * 0.85 + arc * 0.8 + photon + glow + star * (1.0 - shadow);

  /* Vignette so the corners fall away like the page ground. */
  vec2 q = gl_FragCoord.xy / u_res;
  float vig = smoothstep(1.35, 0.35, length((q - vec2(0.72, 0.62)) * vec2(1.0, 1.3)));
  I *= mix(0.45, 1.0, vig);

  /* Tone map to the paper white, never colour. */
  I = 1.0 - exp(-I * 1.1);
  vec3 col = vec3(0.95, 0.945, 0.935) * I;
  col += vec3(0.031, 0.035, 0.043) * (1.0 - I); /* the page's own black */
  gl_FragColor = vec4(col, 1.0);
}
`;

export default function FallbackHole() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, preserveDrawingBuffer: true });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uT = gl.getUniformLocation(prog, "u_t");

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const frame = () => {
      resize();
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uT, still ? 12.0 : (performance.now() - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      canvas.classList.add("is-drawn");
      if (!still) raf = requestAnimationFrame(frame);
    };
    frame();

    const ro = new ResizeObserver(() => still && frame());
    ro.observe(canvas);

    /* No loseContext() here: React's dev double-mount would reuse a dead
       context on the second pass. The canvas goes with the component. */
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="fallback-canvas" />;
}
