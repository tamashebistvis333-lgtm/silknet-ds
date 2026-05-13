// Generates apps/playground/src/_data/tokens.ts — a single TS module that
// the Ladle stories import to render the Colors + Typography reference
// pages. Each token gets the platform reference snippets pre-formatted
// (iOS / Android / React) so the stories themselves stay simple.
//
// Re-run via `npm run build:playground-data` (also chained from `npm run sync`).
// CI verifies the generated file matches token sources.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const TOKENS_DIR = resolve(ROOT, 'tokens');
const OUT = resolve(ROOT, 'apps', 'playground', 'src', '_data', 'tokens.ts');

// ─── Read tokens ─────────────────────────────────────────────────────────────
const primitives = JSON.parse(readFileSync(`${TOKENS_DIR}/primitives.json`, 'utf8'));
const semLight = JSON.parse(readFileSync(`${TOKENS_DIR}/semantic.light.json`, 'utf8'));
const semDark = JSON.parse(readFileSync(`${TOKENS_DIR}/semantic.dark.json`, 'utf8'));
const typography = JSON.parse(readFileSync(`${TOKENS_DIR}/typography.json`, 'utf8'));
const textStyles = JSON.parse(readFileSync(`${TOKENS_DIR}/text-styles.json`, 'utf8'));

// ─── Helpers (mirroring naming conventions used by other generators) ────────
const isLeaf = (n) => n && typeof n === 'object' && '$value' in n;

function flatten(node, path = []) {
  if (!isLeaf(node)) {
    if (!node || typeof node !== 'object') return [];
    return Object.entries(node)
      .filter(([k]) => !k.startsWith('$') && !k.startsWith('_'))
      .flatMap(([k, v]) => flatten(v, [...path, k]));
  }
  return [{ path, type: node.$type, value: node.$value }];
}

const slug = (s) =>
  String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const camelName = (path) => {
  const parts = path
    .map((p) => String(p).replace(/%/g, ''))
    .flatMap((p) => p.split(/[\s/-]+/))
    .filter(Boolean);
  return (
    parts[0].toLowerCase().replace(/[^a-z0-9_]/g, '') +
    parts
      .slice(1)
      .map((p) => p[0].toUpperCase() + p.slice(1).toLowerCase().replace(/[^a-z0-9_]/g, ''))
      .join('')
  );
};

const kebabName = (path) =>
  path.map((p) => slug(p)).filter(Boolean).join('-');

const stripPx = (v) => parseFloat(String(v).replace(/px$/i, ''));

// ─── Build color records ────────────────────────────────────────────────────

const lightColors = flatten(semLight).filter((t) => t.type === 'color');
const darkByPath = new Map(
  flatten(semDark).filter((t) => t.type === 'color').map((t) => [t.path.join('/'), t.value]),
);
const primitiveColors = flatten(primitives).filter((t) => t.type === 'color');

function colorRecord(t, isSemantic) {
  const name = camelName(t.path);
  const cssName = '--' + kebabName(t.path);
  return {
    path: t.path.join('/'),
    name,
    category: t.path[0],
    hex: t.value,
    ...(isSemantic
      ? { hexDark: darkByPath.get(t.path.join('/')) ?? t.value }
      : {}),
    ios: `Color.silknet.${name}`,
    androidCompose: isSemantic
      ? `Silknet.colors.${name}`
      : `SilknetPalette.${name}`,
    reactCss: `var(${cssName})`,
  };
}

const semanticColorRecords = lightColors.map((t) => colorRecord(t, true));
const paletteColorRecords = primitiveColors.map((t) => colorRecord(t, false));

// ─── Build typography records ───────────────────────────────────────────────

const fontFamily =
  flatten(typography).find((t) => t.type === 'fontFamily')?.value ?? 'sans-serif';

const fontWeights = flatten(typography)
  .filter((t) => t.type === 'fontWeight')
  .map((t) => ({
    name: t.path.slice(-1)[0],
    value: t.value,
    cssWeight:
      ({ regular: 400, medium: 500, semibold: 600, bold: 700 })[t.value] ?? 400,
  }));

function flattenTextStyles(node, path = []) {
  if (isLeaf(node) && node.$type === 'typography') return [{ path, value: node.$value }];
  if (!node || typeof node !== 'object') return [];
  return Object.entries(node)
    .filter(([k]) => !k.startsWith('$') && !k.startsWith('_'))
    .flatMap(([k, v]) => flattenTextStyles(v, [...path, k]));
}

const textStyleRecords = flattenTextStyles(textStyles).map((t) => {
  const name = camelName(t.path);
  const v = t.value;
  return {
    path: t.path.join('/'),
    category: t.path[0],
    name,
    fontFamily: v.fontFamily,
    fontWeight: v.fontWeight,
    fontSize: v.fontSize,
    lineHeight: v.lineHeight,
    letterSpacing: v.letterSpacing,
    ios: `Font.silknet.${name}`,
    androidCompose: `Silknet.typography.${name}`,
    // For React there's no single composite CSS variable — stories show the
    // resolved CSS rules as a multi-line snippet. We still expose the per-
    // property tokens for that.
    reactCssBlock: [
      `font-family: '${v.fontFamily}', system-ui, sans-serif;`,
      `font-weight: ${v.fontWeight};`,
      `font-size: ${v.fontSize};`,
      `line-height: ${v.lineHeight};`,
      `letter-spacing: ${v.letterSpacing};`,
    ].join('\n'),
  };
});

// ─── Write file ──────────────────────────────────────────────────────────────

const HEADER = `// Auto-generated from silknet-ds tokens. Do not edit by hand.
// Re-run \`npm run build:playground-data\` (or \`npm run sync\`) after token
// changes. CI verifies this file is up to date.
`;

const file = `${HEADER}
export interface ColorToken {
  path: string;
  name: string;
  category: string;
  hex: string;
  hexDark?: string;
  ios: string;
  androidCompose: string;
  reactCss: string;
}

export interface FontWeight {
  name: string;
  value: string;
  cssWeight: number;
}

export interface TextStyleToken {
  path: string;
  category: string;
  name: string;
  fontFamily: string;
  fontWeight: number;
  fontSize: string;
  lineHeight: string;
  letterSpacing: string;
  ios: string;
  androidCompose: string;
  reactCssBlock: string;
}

export const fontFamily: string = ${JSON.stringify(fontFamily)};

export const fontWeights: FontWeight[] = ${JSON.stringify(fontWeights, null, 2)};

export const semanticColors: ColorToken[] = ${JSON.stringify(semanticColorRecords, null, 2)};

export const paletteColors: ColorToken[] = ${JSON.stringify(paletteColorRecords, null, 2)};

export const textStyles: TextStyleToken[] = ${JSON.stringify(textStyleRecords, null, 2)};
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, file);
console.log(`✔ Wrote ${OUT.replace(ROOT + '/', '')}`);
console.log(`  - ${semanticColorRecords.length} semantic colors`);
console.log(`  - ${paletteColorRecords.length} palette colors`);
console.log(`  - ${textStyleRecords.length} composite text styles`);
console.log(`  - ${fontWeights.length} font weights`);
