// Generates the Kotlin source files for the Android library from the
// normalized tokens, plus copies the XML resources Style Dictionary already
// emits under build/android/res/. Outputs:
//
//   android/library/src/main/kotlin/ge/silknet/ds/SilknetColors.kt
//   android/library/src/main/kotlin/ge/silknet/ds/SilknetDimensions.kt
//   android/library/src/main/kotlin/ge/silknet/ds/SilknetTypography.kt
//   android/library/src/main/kotlin/ge/silknet/ds/SilknetTheme.kt
//   android/library/src/main/res/...                                    (copied)
//
// Like Sources/SilknetDS/ for iOS, these files are committed (Gradle/JitPack
// pulls the source from git). Re-run `npm run build:android` after token
// changes — `npm run sync` chains it automatically.

import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const TOKENS_DIR = resolve(ROOT, 'tokens');
const RES_SRC = resolve(ROOT, 'build', 'android', 'res');
const KOTLIN_OUT = resolve(ROOT, 'android', 'library', 'src', 'main', 'kotlin', 'ge', 'silknet', 'ds');
const RES_OUT = resolve(ROOT, 'android', 'library', 'src', 'main', 'res');

if (!existsSync(RES_SRC)) {
  console.error(`✗ build/android/res not found. Run \`npm run build\` first.`);
  process.exit(1);
}

const primitives = JSON.parse(readFileSync(`${TOKENS_DIR}/primitives.json`, 'utf8'));
const semLight = JSON.parse(readFileSync(`${TOKENS_DIR}/semantic.light.json`, 'utf8'));
const semDark = JSON.parse(readFileSync(`${TOKENS_DIR}/semantic.dark.json`, 'utf8'));
const typography = JSON.parse(readFileSync(`${TOKENS_DIR}/typography.json`, 'utf8'));
const textStyles = JSON.parse(readFileSync(`${TOKENS_DIR}/text-styles.json`, 'utf8'));

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

// Same camelCase convention as Swift (and matches the existing build/android
// Compose output) so devs see the same property names across platforms.
function camelName(path) {
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
}

const stripPx = (v) => parseFloat(String(v).replace(/px$/i, ''));

// hex → Compose Color literal (0xAARRGGBB)
function hexToComposeColor(hex) {
  const h = hex.replace('#', '').padEnd(8, 'f');
  // hex order from import-figma is #RRGGBBAA; Compose wants 0xAARRGGBB
  const rr = h.slice(0, 2);
  const gg = h.slice(2, 4);
  const bb = h.slice(4, 6);
  const aa = h.length >= 8 ? h.slice(6, 8) : 'ff';
  return `Color(0x${aa}${rr}${gg}${bb})`;
}

const HEADER = `// Auto-generated from silknet-ds tokens. Do not edit by hand.
// Re-run \`npm run build:android\` (or \`npm run sync\`) after token changes.
`;

mkdirSync(KOTLIN_OUT, { recursive: true });

// ─── SilknetColors.kt ────────────────────────────────────────────────────────
// Semantic colors → data class fields with Light + Dark instances.
// Primitive colors → object with static vals (no theme variation).

const lightColors = flatten(semLight).filter((t) => t.type === 'color');
const darkByPath = new Map(
  flatten(semDark).filter((t) => t.type === 'color').map((t) => [t.path.join('/'), t.value]),
);
const primitiveColors = flatten(primitives).filter((t) => t.type === 'color');

const semanticFieldDecls = lightColors
  .map((t) => `    val ${camelName(t.path)}: Color`)
  .join(',\n');

const semanticLightInit = lightColors
  .map((t) => `    ${camelName(t.path)} = ${hexToComposeColor(t.value)}`)
  .join(',\n');

const semanticDarkInit = lightColors
  .map((t) => {
    const dark = darkByPath.get(t.path.join('/')) ?? t.value;
    return `    ${camelName(t.path)} = ${hexToComposeColor(dark)}`;
  })
  .join(',\n');

const primitiveDecls = primitiveColors
  .map((t) => `    val ${camelName(t.path)} = ${hexToComposeColor(t.value)}`)
  .join('\n');

const colorsKt = `${HEADER}
package ge.silknet.ds

import androidx.compose.ui.graphics.Color

/**
 * Silknet semantic color palette. Two instances are provided
 * ([SilknetColorsLight] and [SilknetColorsDark]); [SilknetTheme] picks the
 * right one based on system appearance.
 */
data class SilknetColors(
${semanticFieldDecls}
)

val SilknetColorsLight = SilknetColors(
${semanticLightInit}
)

val SilknetColorsDark = SilknetColors(
${semanticDarkInit}
)

/**
 * Primitive palette — static raw colors (Primary 100..950, Grey, etc.).
 * Same value across light/dark themes; use semantic colors above for
 * theme-aware UI.
 */
object SilknetPalette {
${primitiveDecls}
}
`;

writeFileSync(`${KOTLIN_OUT}/SilknetColors.kt`, colorsKt);

// ─── SilknetDimensions.kt ────────────────────────────────────────────────────

const dimensionTokens = [...flatten(primitives), ...flatten(semLight)].filter(
  (t) => t.type === 'dimension',
);
const seenDimNames = new Set();
const dimDecls = dimensionTokens
  .map((t) => ({ name: camelName(t.path), px: stripPx(t.value) }))
  .filter(({ name }) => {
    if (seenDimNames.has(name)) return false;
    seenDimNames.add(name);
    return true;
  })
  .map(({ name, px }) => `    val ${name} = ${px}.dp`)
  .join('\n');

const dimensionsKt = `${HEADER}
package ge.silknet.ds

import androidx.compose.ui.unit.dp

/**
 * Spacing, radius, and other dimension tokens as Compose Dp.
 *
 *     Box(Modifier.padding(SilknetDimensions.digitsSpacing4))
 */
object SilknetDimensions {
${dimDecls}
}
`;

writeFileSync(`${KOTLIN_OUT}/SilknetDimensions.kt`, dimensionsKt);

// ─── SilknetTypography.kt ────────────────────────────────────────────────────

const weightMap = {
  regular: 'FontWeight.Normal',
  medium: 'FontWeight.Medium',
  semibold: 'FontWeight.SemiBold',
  bold: 'FontWeight.Bold',
};

function flattenTextStyles(node, path = []) {
  if (isLeaf(node) && node.$type === 'typography') return [{ path, value: node.$value }];
  if (!node || typeof node !== 'object') return [];
  return Object.entries(node)
    .filter(([k]) => !k.startsWith('$') && !k.startsWith('_'))
    .flatMap(([k, v]) => flattenTextStyles(v, [...path, k]));
}

const composites = flattenTextStyles(textStyles);
const numericWeightMap = {
  400: 'FontWeight.Normal',
  500: 'FontWeight.Medium',
  600: 'FontWeight.SemiBold',
  700: 'FontWeight.Bold',
};

const textStyleDecls = composites
  .map((t) => {
    const name = camelName(t.path);
    const v = t.value;
    const size = stripPx(v.fontSize);
    const lineHeight = stripPx(v.lineHeight);
    const ls = stripPx(v.letterSpacing);
    const w = numericWeightMap[v.fontWeight] ?? 'FontWeight.Normal';
    return `    val ${name} = TextStyle(
        fontFamily = SilknetFontFamily,
        fontWeight = ${w},
        fontSize = ${size}.sp,
        lineHeight = ${lineHeight}.sp,
        letterSpacing = ${ls}.sp,
    )`;
  })
  .join('\n')
  .trimEnd();

const family = flatten(typography).find((t) => t.type === 'fontFamily')?.value ?? 'sans-serif';

const typographyKt = `${HEADER}
package ge.silknet.ds

import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

/**
 * Font family used by the Silknet text styles below. Falls back to the
 * platform default sans-serif if "${family}" is not bundled with the host
 * app — the consumer should ship the font as an asset to get pixel-perfect
 * Figma parity.
 */
val SilknetFontFamily: FontFamily = FontFamily.SansSerif // see KDoc above

/**
 * Composite text styles matching Figma's Local Styles. Each combines family +
 * weight + size + line-height + letter-spacing into a single [TextStyle].
 *
 *     Text("Title", style = SilknetTypography.headingHeading1)
 */
object SilknetTypography {
${textStyleDecls}
}
`;

writeFileSync(`${KOTLIN_OUT}/SilknetTypography.kt`, typographyKt);

// ─── SilknetTheme.kt ─────────────────────────────────────────────────────────

const themeKt = `${HEADER}
package ge.silknet.ds

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.staticCompositionLocalOf

private val LocalSilknetColors = staticCompositionLocalOf<SilknetColors> {
    error("SilknetTheme not provided. Wrap your composable in SilknetTheme { ... }.")
}

/**
 * Wrap your app (or a subtree) in [SilknetTheme] to expose theme-aware tokens
 * via [Silknet]:
 *
 *     SilknetTheme {
 *         Text("Hello", color = Silknet.colors.textDefault)
 *     }
 *
 * Defaults to system appearance via [isSystemInDarkTheme]; pass an explicit
 * [isDark] to force a theme.
 */
@Composable
fun SilknetTheme(
    isDark: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit,
) {
    val colors = if (isDark) SilknetColorsDark else SilknetColorsLight
    CompositionLocalProvider(
        LocalSilknetColors provides colors,
        content = content,
    )
}

/**
 * Top-level access to Silknet design tokens inside a [SilknetTheme] subtree.
 *
 *     Silknet.colors.backgroundPrimaryAccent   // theme-aware
 *     Silknet.dimens.digitsSpacing4            // 16.dp
 *     Silknet.typography.headingHeading1       // TextStyle
 *     Silknet.palette.primary500               // raw color (no theme switch)
 */
object Silknet {
    val colors: SilknetColors
        @Composable get() = LocalSilknetColors.current
    val dimens: SilknetDimensions get() = SilknetDimensions
    val typography: SilknetTypography get() = SilknetTypography
    val palette: SilknetPalette get() = SilknetPalette
}
`;

writeFileSync(`${KOTLIN_OUT}/SilknetTheme.kt`, themeKt);

// ─── Copy XML resources ─────────────────────────────────────────────────────

if (existsSync(RES_OUT)) rmSync(RES_OUT, { recursive: true });
cpSync(RES_SRC, RES_OUT, { recursive: true });

console.log(`✔ Generated Android sources to android/library/src/main/`);
console.log(`  Kotlin (in ${KOTLIN_OUT.replace(ROOT + '/', '')}):`);
console.log(`    - SilknetColors.kt     (${lightColors.length} semantic + ${primitiveColors.length} palette)`);
console.log(`    - SilknetDimensions.kt (${seenDimNames.size} dimensions)`);
console.log(`    - SilknetTypography.kt (${composites.length} composite TextStyles)`);
console.log(`    - SilknetTheme.kt      (composable + CompositionLocal)`);
console.log(`  XML resources copied from build/android/res/`);
