import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* vgpu ships shaders as real modules: `import bake from "./bake.wgsl"` and
     the .wgsl files import each other. The loader resolves that graph at build
     time and hands effect() one finished shader, so it has to be registered
     with whichever bundler is running. `as: "*.js"` is required — without it
     Turbopack does not treat the loader's output as a JavaScript module. */
  turbopack: {
    rules: {
      "*.wgsl": { loaders: ["@vgpu/wgsl/loader-webpack"], as: "*.js" },
    },
  },
  /* Kept alongside the Turbopack rule rather than instead of it: Next reads
     `turbopack` only under --turbopack and calls webpack() only without it, so
     the two coexist and `next build` works either way. */
  webpack(config) {
    config.module ??= {};
    config.module.rules ??= [];
    config.module.rules.push({
      test: /\.wgsl$/,
      loader: "@vgpu/wgsl/loader-webpack",
      options: { minify: true },
    });
    return config;
  },
};

export default nextConfig;
