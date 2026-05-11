// Reads Figma's native Variables export (DTCG-shaped, but with object color
// values and FONT_SIZE/LINE_HEIGHT typed as "number"), normalizes it for
// Style Dictionary, and writes clean DTCG into ../tokens/.
//
// Source layout (one file per Figma collection mode):
//   default.tokens.json — Primitives (palettes)
//   Light.tokens.json   — Semantic colors, Light mode
//   Dark.tokens.json    — Semantic colors, Dark mode
//   Mobile.tokens.json  — Typography (family / weight / size / line-height)

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SOURCE_DIR = '/Users/sandrotarkhnishvili/Desktop/Tokens';
const OUT_DIR = resolve(__dirname, '..', 'tokens');

const FILE_MAP = [
  { src: 'default.tokens.json', out: 'primitives.json' },
  { src: 'Light.tokens.json',   out: 'semantic.light.json' },
  { src: 'Dark.tokens.json',    out: 'semantic.dark.json' },
  { src: 'Mobile.tokens.json',  out: 'typography.json' },
];

function isTokenLeaf(node) {
  return node && typeof node === 'object' && '$value' in node && '$type' in node;
}

function normalizeToken(token, path = []) {
  const t = { ...token };
  const ext = token.$extensions ?? {};
  const scopes = ext['com.figma.scopes'] ?? [];
  // Primitive Digits.* are the raw spacing scale; Figma exports them with no
  // scope, so we use the path to identify them and force-promote to dimension.
  const isPrimitiveDigitsScale = path[0] === 'Digits' && scopes.length === 0;

  // Color: Figma exports {colorSpace, components, alpha, hex} — flatten to hex
  // string. If alpha < 1, append it as 8-digit hex so transparency survives.
  if (t.$type === 'color' && t.$value && typeof t.$value === 'object') {
    const { hex, alpha } = t.$value;
    if (alpha != null && alpha < 1) {
      const a = Math.round(alpha * 255).toString(16).padStart(2, '0');
      t.$value = `${hex}${a}`;
    } else {
      t.$value = hex;
    }
  }

  // Promote $type "number" → DTCG "dimension" when the Figma scope says the
  // value is meant for a layout / typography context. Without this, downstream
  // platform transforms emit raw integers (e.g. Compose `val foo = 8` instead
  // of `8.dp`), which won't compile as a dimension. We cover all five scopes
  // Figma uses for measurable values: typography, sizing, gaps, radii.
  const DIMENSION_SCOPES = new Set([
    'FONT_SIZE', 'LINE_HEIGHT',   // typography
    'WIDTH_HEIGHT', 'GAP',         // layout
    'CORNER_RADIUS',               // borders
  ]);
  if (
    t.$type === 'number' &&
    (scopes.some((s) => DIMENSION_SCOPES.has(s)) || isPrimitiveDigitsScale)
  ) {
    t.$type = 'dimension';
    t.$value = `${t.$value}px`;
  }

  // Font family / weight: Figma exports them as $type "string" with a scope
  // hint. Promote to the proper DTCG types so downstream tooling treats them
  // as typography rather than arbitrary strings.
  if (t.$type === 'string' && scopes.includes('FONT_FAMILY')) {
    t.$type = 'fontFamily';
  } else if (t.$type === 'string' && scopes.includes('FONT_STYLE')) {
    t.$type = 'fontWeight';
  }

  // Drop the Figma-specific extensions to keep the tokens file clean — the
  // alias data is still recoverable from the source export if ever needed.
  delete t.$extensions;
  return t;
}

function walk(node, path = []) {
  if (!node || typeof node !== 'object') return node;
  if (isTokenLeaf(node)) return normalizeToken(node, path);
  const out = {};
  for (const [k, v] of Object.entries(node)) {
    if (k === '$extensions') continue; // strip top-level/group meta
    out[k] = walk(v, [...path, k]);
  }
  return out;
}

mkdirSync(OUT_DIR, { recursive: true });

for (const { src, out } of FILE_MAP) {
  const raw = JSON.parse(readFileSync(`${SOURCE_DIR}/${src}`, 'utf8'));
  const normalized = walk(raw);
  writeFileSync(`${OUT_DIR}/${out}`, JSON.stringify(normalized, null, 2) + '\n');
  console.log(`✔︎ ${src} → tokens/${out}`);
}
