import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react'], // React is a peer dependency, don't bundle it
  treeshake: true,
  minify: false, // Keep readable for debugging, users can minify if needed
});

