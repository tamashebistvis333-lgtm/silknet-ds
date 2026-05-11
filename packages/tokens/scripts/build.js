// Copies the generated CSS tokens from the root build pipeline into this
// package's dist/. Run after `npm run sync` (or as part of `build:packages`).
//
// Outputs:
//   dist/tokens.light.css  — :root selector, light theme
//   dist/tokens.dark.css   — :root[data-theme="dark"], dark theme
//   dist/tokens.css        — both files concatenated for one-line consumers

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_DIR = resolve(__dirname, '..');
const ROOT_DIR = resolve(PKG_DIR, '..', '..');
const SRC_DIR = resolve(ROOT_DIR, 'build', 'css');
const OUT_DIR = resolve(PKG_DIR, 'dist');

const LIGHT_SRC = resolve(SRC_DIR, 'tokens.light.css');
const DARK_SRC = resolve(SRC_DIR, 'tokens.dark.css');

if (!existsSync(LIGHT_SRC) || !existsSync(DARK_SRC)) {
  console.error(`✗ Missing generated CSS at ${SRC_DIR}.`);
  console.error(`  Run \`npm run sync\` from the repo root first.`);
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });

const light = readFileSync(LIGHT_SRC, 'utf8');
const dark = readFileSync(DARK_SRC, 'utf8');

writeFileSync(resolve(OUT_DIR, 'tokens.light.css'), light);
writeFileSync(resolve(OUT_DIR, 'tokens.dark.css'), dark);

const combined = [
  '/* @silknet-ds/tokens — light + dark theme variables. */',
  '/* Light theme applies on :root by default. */',
  '/* Dark theme applies on :root[data-theme="dark"] (or via prefers-color-scheme media query if you wire it). */',
  '',
  light,
  '',
  dark,
].join('\n');
writeFileSync(resolve(OUT_DIR, 'tokens.css'), combined);

console.log(`✔ Wrote tokens to ${OUT_DIR}`);
console.log(`  - tokens.light.css (${light.length} bytes)`);
console.log(`  - tokens.dark.css  (${dark.length} bytes)`);
console.log(`  - tokens.css       (${combined.length} bytes, combined)`);
