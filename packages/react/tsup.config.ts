import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  // Externals: keep React and the tokens CSS package out of the bundle so
  // consumers control versions / bring their own.
  external: ['react', 'react-dom', '@silknet-ds/tokens'],
  // Brand artwork (Google Pay mark, Silk Points coin) ships as exact Figma
  // SVG exports, inlined as data URLs so consumers need no asset pipeline.
  loader: { '.svg': 'dataurl' },
  // CSS imports are extracted to a sibling .css file (dist/index.css) by
  // esbuild's default CSS handling — no extra config needed.
});
