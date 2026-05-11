import StyleDictionary from 'style-dictionary';

// ─────────────────────────────────────────────────────────────────────────────
// Custom transforms
// ─────────────────────────────────────────────────────────────────────────────
//
// DTCG dimensions are authored in CSS px. We map them 1:1 to platform-native
// units. Font-related dimensions (sizes, line-heights) need scale-aware units
// on Android — `.sp` so user accessibility scaling applies — while layout
// dimensions stay in `.dp`. We detect "is font" by checking whether the token
// path begins with "Font" (the Figma collection name).

const isFontDimension = (token) =>
  token.path?.[0]?.toLowerCase() === 'font';

const stripPx = (v) => parseFloat(String(v).replace(/px$/i, ''));

StyleDictionary.registerTransform({
  name: 'silk/dimension/swiftPt',
  type: 'value',
  filter: (token) => token.$type === 'dimension',
  transform: (token) => `CGFloat(${stripPx(token.$value)})`,
});

StyleDictionary.registerTransform({
  name: 'silk/dimension/composeUnit',
  type: 'value',
  filter: (token) => token.$type === 'dimension',
  transform: (token) =>
    `${stripPx(token.$value)}.${isFontDimension(token) ? 'sp' : 'dp'}`,
});

StyleDictionary.registerTransform({
  name: 'silk/dimension/androidXmlUnit',
  type: 'value',
  filter: (token) => token.$type === 'dimension',
  transform: (token) =>
    `${stripPx(token.$value)}${isFontDimension(token) ? 'sp' : 'dp'}`,
});

// Wrap string-typed tokens (font family, weight) in code-literal quotes so
// they emit as valid Swift/Kotlin string expressions. Safe because these
// values come from controlled token sources, not arbitrary user input.
const QUOTE_TYPES = new Set(['fontFamily', 'fontWeight', 'string']);
StyleDictionary.registerTransform({
  name: 'silk/string/quote',
  type: 'value',
  filter: (token) => QUOTE_TYPES.has(token.$type),
  transform: (token) => `"${String(token.$value).replace(/"/g, '\\"')}"`,
});

// ─────────────────────────────────────────────────────────────────────────────
// Theme-aware build
// ─────────────────────────────────────────────────────────────────────────────
//
// Two themes (light, dark). Each build merges primitives + typography +
// semantic.{theme} so semantic tokens resolve to theme-specific values while
// keeping a stable name across themes — exactly what platform theming needs:
//   • iOS:     two Swift files; consumer wires them with UIColor(dynamicProvider:).
//   • Android: light → res/values/colors.xml, dark → res/values-night/colors.xml,
//              auto-switched by system theme.
//   • Compose: two color objects (LightColors, DarkColors).
//   • CSS:     two stylesheets; consumer can include both behind a media query.

const THEMES = ['light', 'dark'];

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function buildConfigForTheme(theme) {
  // Android resource folder: light is the default, dark goes to -night.
  const androidValuesDir = theme === 'light' ? 'values' : 'values-night';

  return {
    source: [
      'tokens/primitives.json',
      'tokens/typography.json',
      `tokens/semantic.${theme}.json`,
    ],
    usesDtcg: true,
    log: { verbosity: 'verbose' },
    platforms: {
      ios: {
        transforms: [
          'attribute/cti',
          'name/camel',
          'color/UIColorSwift',
          'content/swift/literal',
          'asset/swift/literal',
          'silk/dimension/swiftPt',
          'silk/string/quote',
        ],
        buildPath: 'build/ios/',
        files: [
          {
            destination: `DesignTokens${cap(theme)}.swift`,
            format: 'ios-swift/class.swift',
            options: { className: `DesignTokens${cap(theme)}` },
          },
        ],
      },
      'android-compose': {
        transforms: [
          'attribute/cti',
          'name/camel',
          'color/composeColor',
          'silk/dimension/composeUnit',
          'silk/string/quote',
        ],
        buildPath: 'build/android/',
        files: [
          {
            destination: `DesignTokens${cap(theme)}.kt`,
            format: 'compose/object',
            options: {
              className: `DesignTokens${cap(theme)}`,
              packageName: 'ge.silknet.ds',
            },
          },
        ],
      },
      'android-xml': {
        transforms: [
          'attribute/cti',
          'name/snake',
          'color/hex8android',
          'silk/dimension/androidXmlUnit',
        ],
        buildPath: `build/android/res/${androidValuesDir}/`,
        files: [
          {
            destination: 'colors.xml',
            format: 'android/resources',
            filter: (token) => token.$type === 'color',
          },
          // Dimensions don't change across themes, so only emit them in the
          // light (= default) build to avoid duplicate resource entries.
          ...(theme === 'light'
            ? [
                {
                  destination: 'dimens.xml',
                  format: 'android/resources',
                  filter: (token) => token.$type === 'dimension',
                },
                {
                  destination: 'font.xml',
                  format: 'android/resources',
                  filter: (token) =>
                    token.$type === 'fontFamily' || token.$type === 'string',
                },
              ]
            : []),
        ],
      },
      css: {
        transformGroup: 'css',
        buildPath: 'build/css/',
        files: [
          {
            destination: `tokens.${theme}.css`,
            format: 'css/variables',
            options: {
              outputReferences: true,
              selector: theme === 'light' ? ':root' : ':root[data-theme="dark"]',
            },
          },
        ],
      },
    },
  };
}

for (const theme of THEMES) {
  const sd = new StyleDictionary(buildConfigForTheme(theme));
  await sd.cleanAllPlatforms();
  await sd.buildAllPlatforms();
}
