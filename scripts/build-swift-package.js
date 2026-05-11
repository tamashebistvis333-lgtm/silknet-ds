// Generates the Swift source files consumed by Swift Package Manager from
// the normalized tokens. Outputs:
//
//   Sources/SilknetDS/SilknetColors.swift      — palette + semantic (dynamic light/dark)
//   Sources/SilknetDS/SilknetDimensions.swift  — spacing & radius CGFloats
//   Sources/SilknetDS/SilknetTypography.swift  — font primitives + composite styles
//
// These files are committed to git (unlike build/ artifacts) because Swift
// Package Manager pulls source directly from the repo. Re-run after any
// token change: `npm run build:swift`. CI also runs this and fails if the
// committed Swift files don't match the latest token output.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const TOKENS_DIR = resolve(ROOT, 'tokens');
const OUT_DIR = resolve(ROOT, 'Sources', 'SilknetDS');

// ─── Read tokens ─────────────────────────────────────────────────────────────

const primitives = JSON.parse(readFileSync(`${TOKENS_DIR}/primitives.json`, 'utf8'));
const semLight = JSON.parse(readFileSync(`${TOKENS_DIR}/semantic.light.json`, 'utf8'));
const semDark = JSON.parse(readFileSync(`${TOKENS_DIR}/semantic.dark.json`, 'utf8'));
const typography = JSON.parse(readFileSync(`${TOKENS_DIR}/typography.json`, 'utf8'));
const textStyles = JSON.parse(readFileSync(`${TOKENS_DIR}/text-styles.json`, 'utf8'));

// ─── Generic helpers ─────────────────────────────────────────────────────────

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

// "Background/primary-accent" → "backgroundPrimaryAccent"
// "Digits/spacing/3_1" → "digitsSpacing3_1" (we keep underscores for numeric keys)
// "Primary/4%" → "primary4" (matches the CSS naming where `%` is stripped)
function camelName(path) {
  const parts = path
    .map((p) => String(p).replace(/%/g, ''))
    .flatMap((p) => p.split(/[\s/-]+/))
    .filter(Boolean);
  return (
    parts[0].toLowerCase().replace(/[^a-z0-9_]/g, '') +
    parts
      .slice(1)
      .map(
        (p) =>
          p[0].toUpperCase() + p.slice(1).toLowerCase().replace(/[^a-z0-9_]/g, ''),
      )
      .join('')
  );
}

const fmt = (n) => Number(n.toFixed(3));

function hexToRGBA(hex) {
  const h = hex.replace('#', '').padEnd(8, 'f').slice(0, 8);
  return {
    r: fmt(parseInt(h.slice(0, 2), 16) / 255),
    g: fmt(parseInt(h.slice(2, 4), 16) / 255),
    b: fmt(parseInt(h.slice(4, 6), 16) / 255),
    a: fmt(parseInt(h.slice(6, 8), 16) / 255),
  };
}

const uiColorLiteral = (hex) => {
  const c = hexToRGBA(hex);
  return `UIColor(red: ${c.r}, green: ${c.g}, blue: ${c.b}, alpha: ${c.a})`;
};

const stripPx = (v) => parseFloat(String(v).replace(/px$/i, ''));

const HEADER = `// Auto-generated from silknet-ds tokens. Do not edit by hand.
// Source: tokens/*.json. Re-run \`npm run build:swift\` after token changes.
`;

mkdirSync(OUT_DIR, { recursive: true });

// ─── SilknetColors.swift ─────────────────────────────────────────────────────
// Semantic colors are dynamic (UIColor provider switches on userInterfaceStyle).
// Primitive palette colors don't change per theme — emit static UIColor.

const lightColors = flatten(semLight).filter((t) => t.type === 'color');
const darkByPath = new Map(
  flatten(semDark).filter((t) => t.type === 'color').map((t) => [t.path.join('/'), t.value]),
);
const primitiveColors = flatten(primitives).filter((t) => t.type === 'color');

const semanticDecls = lightColors
  .map((t) => {
    const name = camelName(t.path);
    const lightLit = uiColorLiteral(t.value);
    const darkLit = uiColorLiteral(darkByPath.get(t.path.join('/')) ?? t.value);
    return `    public let ${name}: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? ${darkLit} : ${lightLit}
    })`;
  })
  .join('\n\n');

const primitiveDecls = primitiveColors
  .map((t) => {
    const name = camelName(t.path);
    return `    public let ${name}: Color = Color(uiColor: ${uiColorLiteral(t.value)})`;
  })
  .join('\n');

const colorsSwift = `${HEADER}
import SwiftUI
import UIKit

/// Silknet color palette. Use via the \`Color.silknet\` static accessor:
///
///     Text("Hello").foregroundColor(Color.silknet.textDefault)
///
/// Semantic colors automatically switch between light and dark when the user
/// changes the system appearance — no manual theme code required.
public extension Color {
    static let silknet = SilknetColorPalette()
}

public struct SilknetColorPalette {
    // ── Semantic colors (auto-switch light/dark) ────────────────────────────
${semanticDecls}

    // ── Primitive palette (static; same value across themes) ────────────────
${primitiveDecls}
}
`;

writeFileSync(`${OUT_DIR}/SilknetColors.swift`, colorsSwift);

// ─── SilknetDimensions.swift ─────────────────────────────────────────────────
// All dimension tokens collapse to plain CGFloat — they don't change per theme.
// Includes both primitive Digits (digits0..56) and semantic spacing/radius.

const dimensionTokens = [...flatten(primitives), ...flatten(semLight)]
  .filter((t) => t.type === 'dimension');

// Dedupe by name (some path collisions can occur if not careful)
const seenDimNames = new Set();
const dimDecls = dimensionTokens
  .map((t) => ({ name: camelName(t.path), px: stripPx(t.value) }))
  .filter(({ name }) => {
    if (seenDimNames.has(name)) return false;
    seenDimNames.add(name);
    return true;
  })
  .map(({ name, px }) => `    public let ${name}: CGFloat = ${px}`)
  .join('\n');

const dimensionsSwift = `${HEADER}
import CoreGraphics

/// Spacing, radius, and other dimension tokens. Use via \`CGFloat.silknet\`:
///
///     view.padding(CGFloat.silknet.digitsSpacing4)              // 16
///     RoundedRectangle(cornerRadius: .silknet.digitsRadiusS)    // 12
public extension CGFloat {
    static let silknet = SilknetDimensions()
}

public struct SilknetDimensions {
${dimDecls}
}
`;

writeFileSync(`${OUT_DIR}/SilknetDimensions.swift`, dimensionsSwift);

// ─── SilknetTypography.swift ─────────────────────────────────────────────────
// Two layers: (1) primitives — family, weights, raw sizes/heights as constants;
// (2) composite text styles from text-styles.json — ready-to-use Font instances.

const family =
  flatten(typography).find((t) => t.type === 'fontFamily')?.value ?? 'System';

const weightMap = { regular: '.regular', medium: '.medium', semibold: '.semibold', bold: '.bold' };
const weightTokens = flatten(typography).filter((t) => t.type === 'fontWeight');
const weightDecls = weightTokens
  .map((t) => {
    const name = camelName(t.path);
    const swiftWeight = weightMap[t.value] ?? '.regular';
    return `    public let ${name}: Font.Weight = ${swiftWeight}`;
  })
  .join('\n');

const fontSizeTokens = flatten(typography).filter(
  (t) => t.type === 'dimension' && t.path[1] === 'size',
);
const sizeDecls = fontSizeTokens
  .map((t) => `    public let ${camelName(t.path)}: CGFloat = ${stripPx(t.value)}`)
  .join('\n');

const lineHeightTokens = flatten(typography).filter(
  (t) => t.type === 'dimension' && t.path[1] === 'Height',
);
const lineHeightDecls = lineHeightTokens
  .map((t) => `    public let ${camelName(t.path)}: CGFloat = ${stripPx(t.value)}`)
  .join('\n');

// Composite styles → Font instances. Values are pre-resolved in text-styles.json.
function flattenTextStyles(node, path = []) {
  if (isLeaf(node) && node.$type === 'typography') return [{ path, value: node.$value }];
  if (!node || typeof node !== 'object') return [];
  return Object.entries(node)
    .filter(([k]) => !k.startsWith('$') && !k.startsWith('_'))
    .flatMap(([k, v]) => flattenTextStyles(v, [...path, k]));
}

const composites = flattenTextStyles(textStyles);
const fontDecls = composites
  .map((t) => {
    const name = camelName(t.path);
    const v = t.value;
    const size = stripPx(v.fontSize);
    const swiftWeight = ({ 400: '.regular', 500: '.medium', 600: '.semibold', 700: '.bold' })[v.fontWeight] ?? '.regular';
    return `    public let ${name}: Font = .custom("${v.fontFamily}", size: ${size}).weight(${swiftWeight})`;
  })
  .join('\n');

const typographySwift = `${HEADER}
import SwiftUI
import CoreGraphics

/// Font family, weights, sizes, and line heights — primitive typography.
/// For ready-to-use Font instances see \`Font.silknet\` below.
public enum SilknetTypography {
    public static let fontFamily: String = "${family}"
}

public struct SilknetFontWeights {
${weightDecls}
}
public extension SilknetTypography {
    static let weight = SilknetFontWeights()
}

public struct SilknetFontSizes {
${sizeDecls}
}
public extension SilknetTypography {
    static let size = SilknetFontSizes()
}

public struct SilknetLineHeights {
${lineHeightDecls}
}
public extension SilknetTypography {
    static let lineHeight = SilknetLineHeights()
}

/// Composite text styles. Use via \`Font.silknet\`:
///
///     Text("Title").font(.silknet.headingHeading1)
///
/// Each composite resolves family + weight + size into a single Font.
/// Line height and letter spacing must currently be applied separately
/// (e.g. via \`.lineSpacing()\`) — SwiftUI's Font doesn't carry those.
public extension Font {
    static let silknet = SilknetFonts()
}

public struct SilknetFonts {
${fontDecls}
}
`;

writeFileSync(`${OUT_DIR}/SilknetTypography.swift`, typographySwift);

console.log(`✔ Generated Swift sources to ${OUT_DIR}`);
console.log(`  - SilknetColors.swift     (${lightColors.length} semantic + ${primitiveColors.length} primitive)`);
console.log(`  - SilknetDimensions.swift (${seenDimNames.size} dimensions)`);
console.log(`  - SilknetTypography.swift (${weightTokens.length} weights, ${fontSizeTokens.length} sizes, ${composites.length} composite Fonts)`);
