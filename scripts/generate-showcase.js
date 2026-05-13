// Generates showcase/index.html — a static, single-file visual catalog of
// every token, that links to the generated CSS files so value updates are
// reflected just by re-running `npm run build` (no showcase regeneration
// needed for value-only changes).
//
// Re-run this script whenever the *shape* of the tokens changes (new
// category, removed group, etc.).

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOKENS_DIR = resolve(__dirname, '..', 'tokens');
const OUT_DIR = resolve(__dirname, '..', 'showcase');
const OUT_FILE = resolve(OUT_DIR, 'index.html');

// ─── Read sources ────────────────────────────────────────────────────────────
const primitives = JSON.parse(readFileSync(`${TOKENS_DIR}/primitives.json`, 'utf8'));
const light = JSON.parse(readFileSync(`${TOKENS_DIR}/semantic.light.json`, 'utf8'));
const dark = JSON.parse(readFileSync(`${TOKENS_DIR}/semantic.dark.json`, 'utf8'));
const typography = JSON.parse(readFileSync(`${TOKENS_DIR}/typography.json`, 'utf8'));
const textStyles = JSON.parse(readFileSync(`${TOKENS_DIR}/text-styles.json`, 'utf8'));

const isLeaf = (n) => n && typeof n === 'object' && '$value' in n && '$type' in n;

function flatten(node, path = []) {
  if (!isLeaf(node)) {
    if (!node || typeof node !== 'object') return [];
    return Object.entries(node).flatMap(([k, v]) => flatten(v, [...path, k]));
  }
  return [{ path, type: node.$type, value: node.$value, lightValue: node.$value }];
}

// CSS variable name from path — must match Style Dictionary's name/kebab,
// which lowercases and replaces *any* non-alphanumeric run with a hyphen
// (so "Primary/4%" becomes --primary-4, not --primary-4%).
const cssVar = (path) =>
  '--' +
  path
    .map((s) =>
      String(s)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    )
    .filter(Boolean)
    .join('-');

const escape = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Pair light/dark values for semantic tokens.
function pairThemes(lightTree, darkTree) {
  const lightFlat = flatten(lightTree);
  const darkFlat = flatten(darkTree);
  const darkByPath = new Map(darkFlat.map((t) => [t.path.join('/'), t.value]));
  return lightFlat.map((t) => ({
    ...t,
    darkValue: darkByPath.get(t.path.join('/')) ?? t.value,
  }));
}

const semanticTokens = pairThemes(light, dark);
const primitiveTokens = flatten(primitives);
const typographyTokens = flatten(typography);

// ─── Render helpers ──────────────────────────────────────────────────────────

const colorSwatch = (token) => {
  const name = token.path.slice(1).join(' / ') || token.path.join(' / ');
  const v = cssVar(token.path);
  const lightHex = token.lightValue ?? token.value;
  const darkHex = token.darkValue ?? lightHex;
  return `
    <div class="swatch" data-name="${escape(token.path.join('.'))}">
      <div class="swatch__chip" style="background: var(${v});"></div>
      <div class="swatch__meta">
        <div class="swatch__name">${escape(name)}</div>
        <code class="swatch__var">${v}</code>
        <div class="swatch__values">
          <span><span class="dot dot--light"></span>${escape(lightHex)}</span>
          ${darkHex !== lightHex ? `<span><span class="dot dot--dark"></span>${escape(darkHex)}</span>` : ''}
        </div>
      </div>
    </div>`;
};

// Group tokens by their first path segment.
function groupByTopLevel(tokens) {
  const m = new Map();
  for (const t of tokens) {
    const k = t.path[0];
    if (!m.has(k)) m.set(k, []);
    m.get(k).push(t);
  }
  return m;
}

// Group color tokens for the palette section: returns Map<group, Map<subgroup|'_', tokens[]>>
function paletteSubgroups(tokens) {
  const out = new Map();
  for (const t of tokens) {
    if (t.type !== 'color') continue;
    const [group, ...rest] = t.path;
    if (!out.has(group)) out.set(group, []);
    out.get(group).push(t);
  }
  return out;
}

// ─── Sections ────────────────────────────────────────────────────────────────

function renderSemanticColors() {
  const colors = semanticTokens.filter((t) => t.type === 'color');
  const groups = groupByTopLevel(colors);
  return Array.from(groups.entries())
    .map(
      ([group, tokens]) => `
    <div class="group">
      <h3 class="group__title">${escape(group)}</h3>
      <div class="grid grid--swatches">
        ${tokens.map(colorSwatch).join('')}
      </div>
    </div>`
    )
    .join('');
}

function renderPalette() {
  const groups = paletteSubgroups(primitiveTokens);
  return Array.from(groups.entries())
    .map(
      ([group, tokens]) => `
    <div class="group">
      <h3 class="group__title">${escape(group)}</h3>
      <div class="palette">
        ${tokens
          .map((t) => {
            const v = cssVar(t.path);
            const label = t.path.slice(1).join('/');
            // Detect transparent colors by 8-digit hex (#RRGGBBAA from import).
            const isAlpha = /^#[0-9a-f]{8}$/i.test(String(t.value));
            const cls = `palette__cell${isAlpha ? ' palette__cell--alpha' : ''}`;
            return `
              <div class="${cls}" title="${escape(t.value)}">
                <span class="palette__cell-fill" style="background: var(${v});"></span>
                <span class="palette__label">${escape(label)}</span>
              </div>`;
          })
          .join('')}
      </div>
    </div>`
    )
    .join('');
}

function renderTypography() {
  // Composite text styles from text-styles.json. Each style is the *full* spec
  // a developer would consume (family + weight + size + line-height + spacing),
  // matching what a Figma Text Style produces. We render one section per
  // category (Heading, Subtitle, Body, ...).
  const categories = Object.entries(textStyles).filter(([k]) => !k.startsWith('_'));

  const sectionsHtml = categories
    .map(([category, styles]) => {
      const rows = Object.entries(styles)
        .map(([name, token]) => {
          const v = token.$value;
          const inline =
            `font-family: '${v.fontFamily}', system-ui, sans-serif; ` +
            `font-weight: ${v.fontWeight}; ` +
            `font-size: ${v.fontSize}; ` +
            `line-height: ${v.lineHeight}; ` +
            `letter-spacing: ${v.letterSpacing};`;
          return `
            <div class="type-row">
              <div class="type-row__sample" style="${inline}">
                ქართული ტექსტი — Sample Aa 123
              </div>
              <div class="type-row__meta">
                <div class="type-row__name">${escape(name)}</div>
                <div class="type-row__specs">
                  <span>${escape(v.fontSize)} / ${escape(v.lineHeight)} · w${v.fontWeight}${v.letterSpacing !== '0px' ? ` · ls ${escape(v.letterSpacing)}` : ''}</span>
                </div>
              </div>
            </div>`;
        })
        .join('');
      return `
        <div class="group">
          <h3 class="group__title">${escape(category)}</h3>
          <div class="type-stack">${rows}</div>
        </div>`;
    })
    .join('');

  return sectionsHtml;
}

function renderFontFamilyAndWeights() {
  const fam = typographyTokens.find((t) => t.type === 'fontFamily');
  const weights = typographyTokens.filter((t) => t.type === 'fontWeight');
  return `
    <div class="group">
      <h3 class="group__title">Family</h3>
      <div class="kv">
        <div class="kv__row"><div class="kv__k">${fam ? escape(fam.path.join('.')) : '—'}</div><div class="kv__v">${fam ? escape(fam.value) : ''}</div></div>
      </div>
    </div>
    <div class="group">
      <h3 class="group__title">Weights</h3>
      <div class="grid grid--weights">
        ${weights
          .map((w) => {
            // Map design-system weight names to CSS numeric values. Figma stores
            // them as strings ("regular"/"medium"/"semibold"/"bold"), but CSS
            // only accepts `normal`, `bold`, or numbers — so without this map,
            // medium/semibold render as fallback weight (400) and look identical.
            const numeric = { regular: 400, medium: 500, semibold: 600, bold: 700 }[w.value] ?? 400;
            return `
          <div class="weight-card">
            <div class="weight-card__sample" style="font-weight: ${numeric};">Aa</div>
            <div class="weight-card__name">${escape(w.path.slice(-1)[0])} <small>(${numeric})</small></div>
            <code>${cssVar(w.path)}</code>
          </div>`;
          })
          .join('')}
      </div>
    </div>`;
}

function renderSpacingAndRadius() {
  // Semantic Digits.spacing.* and Digits.radius.* — promoted to "dimension"
  // by import-figma.js so we filter on that type and parse "Npx" → N.
  const semFlat = flatten(light);
  const spacing = semFlat.filter(
    (t) => t.path[0] === 'Digits' && t.path[1] === 'spacing' && t.type === 'dimension'
  );
  const radius = semFlat.filter(
    (t) => t.path[0] === 'Digits' && t.path[1] === 'radius' && t.type === 'dimension'
  );

  const spacingHtml = spacing
    .map((t) => {
      const px = parseFloat(t.value);
      return `
        <div class="dim-row">
          <div class="dim-row__bar" style="width: ${px}px;"></div>
          <div class="dim-row__name">${escape(t.path.slice(-1)[0])}</div>
          <div class="dim-row__val">${px}px</div>
        </div>`;
    })
    .join('');

  const radiusHtml = radius
    .map((t) => {
      const px = parseFloat(t.value);
      return `
        <div class="rad-card">
          <div class="rad-card__chip" style="border-radius: ${px}px;"></div>
          <div class="rad-card__name">${escape(t.path.slice(-1)[0])}</div>
          <div class="rad-card__val">${px}px</div>
        </div>`;
    })
    .join('');

  return `
    <div class="group">
      <h3 class="group__title">Spacing</h3>
      <div class="dim-stack">${spacingHtml || '<em>none</em>'}</div>
    </div>
    <div class="group">
      <h3 class="group__title">Radius</h3>
      <div class="grid grid--radii">${radiusHtml || '<em>none</em>'}</div>
    </div>`;
}

// ─── Button component ────────────────────────────────────────────────────────
//
// 10 color variants × 4 sizes × 4 states. Renders a matrix per variant so the
// designer can compare states/sizes side-by-side. Variant names match Figma.

const BUTTON_VARIANTS = [
  'primary', 'primary-soft', 'secondary', 'ghost',
  'success', 'warning', 'error', 'info', 'silkfest',
];
const BUTTON_SIZES = ['xs', 'sm', 'md', 'lg'];

function renderButtonComponent() {
  const cards = BUTTON_VARIANTS.map((v) => `
    <div class="comp-card">
      <span class="comp-card__name">${escape(v)}</span>
      <button class="btn btn--${v} btn--md" data-btn>Button</button>
    </div>`).join('');

  // Link variant — Figma authors it only at x-small, so we render it locked
  // to xs even when the global size picker changes.
  const linkCard = `
    <div class="comp-card">
      <span class="comp-card__name">link <small style="opacity:.5">— xs locked</small></span>
      <button class="btn btn--link btn--xs">Button</button>
    </div>`;

  return `
    <div class="comp-toolbar">
      <div class="comp-toolbar__group">
        <span class="comp-toolbar__label">Size</span>
        <div class="seg" role="group" aria-label="Button size">
          ${BUTTON_SIZES.map((s) => `
            <button class="seg__btn${s === 'md' ? ' seg__btn--active' : ''}" data-size="${s}">${s.toUpperCase()}</button>
          `).join('')}
        </div>
      </div>
      <label class="comp-toolbar__check">
        <input type="checkbox" data-disabled-toggle>
        <span>Disabled</span>
      </label>
      <span class="comp-toolbar__hint">↳ hover & click any button to see real states</span>
    </div>

    <div class="comp-grid" data-component-grid>
      ${cards}
      ${linkCard}
    </div>`;
}

// Inline SVG icons used in component samples. `currentColor` so they inherit
// the surrounding component's text color (matches Figma's icon→text convention).
const ICON_PLUS  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
const ICON_USER  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
const ICON_EYE   = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
const ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
const ICON_INFO  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
const ICON_WARN  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
const ICON_ERROR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';

// ─── Icon Button ─────────────────────────────────────────────────────────────
// Same variant set as text Button minus link/color variants — Figma exposes
// only primary, primary-soft, secondary, ghost. Icon size scales with button:
// xs/sm → 16px, md/lg → 20px (per the button spec).

const ICON_BTN_VARIANTS = ['primary', 'primary-soft', 'secondary', 'ghost'];

function renderIconButtonComponent() {
  const cards = ICON_BTN_VARIANTS.map((v) => `
    <div class="comp-card">
      <span class="comp-card__name">${escape(v)}</span>
      <button class="btn btn--icon btn--${v} btn--md" data-icon-btn aria-label="${escape(v)} icon button">
        ${ICON_PLUS}
      </button>
    </div>`).join('');

  return `
    <div class="comp-toolbar">
      <div class="comp-toolbar__group">
        <span class="comp-toolbar__label">Size</span>
        <div class="seg" role="group" aria-label="Icon button size">
          ${BUTTON_SIZES.map((s) => `
            <button class="seg__btn${s === 'md' ? ' seg__btn--active' : ''}" data-icon-size="${s}">${s.toUpperCase()}</button>
          `).join('')}
        </div>
      </div>
      <label class="comp-toolbar__check">
        <input type="checkbox" data-icon-disabled-toggle>
        <span>Disabled</span>
      </label>
    </div>

    <div class="comp-grid" data-icon-grid>${cards}</div>`;
}

// ─── Input ───────────────────────────────────────────────────────────────────
// Floating-label pattern matching Figma exactly:
//   • Default/Hover/Pressed: label sits centered as a placeholder (Body accent,
//     16/24, regular, additional). Bg is the input/default tint, border subtle.
//   • Active (focused): white bg, primary border, 4px primary-16 focus glow.
//     Label shrinks to top (Subtitle 3, 12/16, medium); cursor visible below.
//   • Filled (has value, not focused): same border as Default but label
//     stays floated and value renders below in Body default (14/20, regular).
//   • Error: pink bg + pink border + label centered (placeholder).
//   • Active-Error: focused with error → red border + red glow.
//   • Disabled: entire container at opacity 0.5.
//
// Helper text is part of the same group — error state colors it red and
// shows the error icon (toggled via the helper--error class).
//
// Implementation note: <input placeholder=" "> + :placeholder-shown lets CSS
// distinguish empty from filled without any JS, so the floating label is
// purely declarative.

function renderInputField(name, leftIcon, rightIcon) {
  const left = leftIcon ? `<span class="input__icon">${leftIcon}</span>` : '';
  const right = rightIcon ? `<span class="input__icon">${rightIcon}</span>` : '';
  return `
    <div class="input-group" data-input-group>
      <span class="comp-card__name">${escape(name)}</span>
      <label class="input" data-input-wrap>
        ${left}
        <span class="input__inner">
          <span class="input__label">სახელი</span>
          <input class="input__field" type="text" placeholder=" " data-input>
        </span>
        ${right}
      </label>
      <p class="helper helper--default" data-input-helper>
        <span class="helper__icon">${ICON_ERROR}</span>
        <span>დამხმარე ტექსტი</span>
      </p>
    </div>`;
}

function renderInputComponent() {
  return `
    <div class="comp-toolbar">
      <label class="comp-toolbar__check">
        <input type="checkbox" data-input-error>
        <span>Error</span>
      </label>
      <label class="comp-toolbar__check">
        <input type="checkbox" data-input-disabled>
        <span>Disabled</span>
      </label>
      <span class="comp-toolbar__hint">↳ click to focus → label floats up; type to fill</span>
    </div>

    <div class="comp-grid comp-grid--input">
      ${renderInputField('Plain', null, null)}
      ${renderInputField('With left icon', ICON_USER, null)}
      ${renderInputField('With both icons', ICON_USER, ICON_EYE)}
    </div>`;
}

// ─── Text Area ───────────────────────────────────────────────────────────────

function renderTextAreaComponent() {
  return `
    <div class="comp-toolbar">
      <label class="comp-toolbar__check">
        <input type="checkbox" data-textarea-error>
        <span>Error</span>
      </label>
      <label class="comp-toolbar__check">
        <input type="checkbox" data-textarea-disabled>
        <span>Disabled</span>
      </label>
      <span class="comp-toolbar__hint">↳ click to focus → label floats up; type to fill</span>
    </div>

    <div class="comp-grid comp-grid--input">
      <div class="input-group" data-textarea-group>
        <span class="comp-card__name">Default</span>
        <label class="textarea" data-textarea-wrap>
          <span class="textarea__inner">
            <span class="textarea__label">ტექსტ არეა</span>
            <textarea class="textarea__field" placeholder=" " data-textarea></textarea>
          </span>
        </label>
        <p class="helper helper--default" data-textarea-helper>
          <span class="helper__icon">${ICON_ERROR}</span>
          <span>დამხმარე ტექსტი</span>
        </p>
      </div>
    </div>`;
}

// ─── Helper Text ─────────────────────────────────────────────────────────────
// Five states. Default is bare text; semantic states (success/info/warning/
// error) prepend a 16px icon and switch text color.
//
// Note: Figma's source uses `--text-warrning` (typo, double r). We honor it
// 1:1 — when the source is corrected, the showcase auto-updates.

const HELPER_STATES = [
  { name: 'default', icon: null,        textVar: '--text-additional' },
  { name: 'success', icon: ICON_CHECK,  textVar: '--text-success' },
  { name: 'info',    icon: ICON_INFO,   textVar: '--text-info' },
  { name: 'warning', icon: ICON_WARN,   textVar: '--text-warrning' },
  { name: 'error',   icon: ICON_ERROR,  textVar: '--text-error' },
];

function renderHelperTextComponent() {
  const items = HELPER_STATES.map((s) => `
    <div class="helper-row">
      <div class="helper-row__label">${escape(s.name)}</div>
      <p class="helper helper--${s.name}">
        ${s.icon ? `<span class="helper__icon">${s.icon}</span>` : ''}
        <span>დამხმარე ტექსტი — helper text sample</span>
      </p>
      <code class="helper-row__var">${s.textVar}</code>
    </div>`).join('');
  return `<div class="helper-stack">${items}</div>`;
}

// ─── Page ────────────────────────────────────────────────────────────────────

const html = `<!doctype html>
<html lang="ka">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Silknet DS — Showcase</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../build/css/tokens.light.css">
  <link rel="stylesheet" href="../build/css/tokens.dark.css">
  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      font-family: 'Noto Sans Georgian', system-ui, -apple-system, sans-serif;
      background: var(--background-layer, #fff);
      color: var(--text-default, #111);
      transition: background .18s ease, color .18s ease;
    }
    .header {
      position: sticky; top: 0; z-index: 10;
      backdrop-filter: blur(12px);
      background: color-mix(in srgb, var(--background-layer, #fff) 82%, transparent);
      border-bottom: 1px solid var(--border-default, rgba(0,0,0,.08));
      padding: 14px 32px; display: flex; align-items: center; justify-content: space-between; gap: 24px;
    }
    .header__title { font-size: 18px; font-weight: 600; letter-spacing: -.01em; }
    .header__title small { font-weight: 400; opacity: .6; margin-left: 8px; }
    .toggles { display: flex; gap: 4px; padding: 4px; border-radius: 999px;
      background: var(--background-surface, rgba(0,0,0,.04));
      border: 1px solid var(--border-default, rgba(0,0,0,.08)); }
    .toggle { font: inherit; font-size: 13px; padding: 6px 12px; border-radius: 999px;
      border: 0; background: transparent; cursor: pointer;
      color: var(--text-secondary, #555); }
    .toggle[aria-pressed="true"] { background: var(--background-layer, #fff);
      color: var(--text-default, #111); box-shadow: 0 1px 2px rgba(0,0,0,.06); }

    main { padding: 32px; max-width: 1280px; margin: 0 auto; }
    section { margin-bottom: 64px; }
    .section__head { display: flex; align-items: baseline; gap: 12px; margin-bottom: 20px; }
    .section__title { font-size: 22px; font-weight: 600; margin: 0; letter-spacing: -.01em; }
    .section__sub { font-size: 13px; opacity: .55; }
    .group { margin-bottom: 32px; }
    .group__title { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em;
      opacity: .55; margin: 0 0 12px; }

    /* Swatches (semantic colors) */
    .grid { display: grid; gap: 14px; }
    .grid--swatches { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
    .swatch { display: flex; gap: 14px; align-items: center;
      padding: 12px; border-radius: 12px;
      background: var(--background-surface, rgba(0,0,0,.02));
      border: 1px solid var(--border-default, rgba(0,0,0,.06)); }
    .swatch__chip { width: 56px; height: 56px; border-radius: 10px; flex: none;
      box-shadow: inset 0 0 0 1px rgba(0,0,0,.08); }
    .swatch__meta { min-width: 0; flex: 1; }
    .swatch__name { font-size: 13px; font-weight: 500; }
    .swatch__var { display: block; font-size: 11px; opacity: .55; margin-top: 2px;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
    .swatch__values { font-size: 11px; opacity: .7; margin-top: 4px; display: flex; gap: 10px; flex-wrap: wrap;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
    .dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 4px;
      vertical-align: middle; box-shadow: inset 0 0 0 1px rgba(0,0,0,.2); }
    .dot--light { background: #fff; }
    .dot--dark { background: #1a1a1a; }

    /* Palettes */
    .palette { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr;
      border-radius: 10px; overflow: hidden; min-height: 64px;
      box-shadow: inset 0 0 0 1px rgba(0,0,0,.08); }
    .palette__cell { position: relative; display: flex; align-items: flex-end; justify-content: center;
      padding: 6px 4px; font-size: 10px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
    /* Fill sits on top of the cell background (white or checker for alpha)
       so transparent values composite over it as the user would see in app. */
    .palette__cell-fill { position: absolute; inset: 0; pointer-events: none; }
    .palette__label { position: relative; z-index: 1; mix-blend-mode: difference; color: #fff; opacity: .9; }
    /* Transparent colors: render over a checkered backdrop so alpha is visible. */
    .palette__cell--alpha {
      background-color: #fff;
      background-image:
        linear-gradient(45deg, #d6d6d6 25%, transparent 25%),
        linear-gradient(-45deg, #d6d6d6 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #d6d6d6 75%),
        linear-gradient(-45deg, transparent 75%, #d6d6d6 75%);
      background-size: 12px 12px;
      background-position: 0 0, 0 6px, 6px -6px, -6px 0;
    }
    [data-theme="dark"] .palette__cell--alpha {
      background-color: #1a1a1a;
      background-image:
        linear-gradient(45deg, #2e2e2e 25%, transparent 25%),
        linear-gradient(-45deg, #2e2e2e 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #2e2e2e 75%),
        linear-gradient(-45deg, transparent 75%, #2e2e2e 75%);
    }

    /* Typography */
    .type-stack { display: flex; flex-direction: column; gap: 20px; }
    .type-row { display: grid; grid-template-columns: 1fr 220px; gap: 24px; align-items: end;
      padding: 16px 0; border-bottom: 1px dashed var(--border-default, rgba(0,0,0,.1)); }
    .type-row__sample { line-height: 1.1; font-weight: 500; }
    .type-row__meta { text-align: right; }
    .type-row__name { font-size: 12px; font-weight: 600; opacity: .8; }
    .type-row__specs { font-size: 11px; opacity: .55; margin-top: 4px;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
    .type-row__specs code { display: block; }

    /* Family & weights */
    .kv__row { display: flex; gap: 16px; padding: 8px 0; }
    .kv__k { opacity: .6; font-size: 13px; font-family: ui-monospace, monospace; }
    .kv__v { font-size: 16px; font-weight: 500; }
    .grid--weights { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); }
    .weight-card { padding: 16px; border-radius: 12px; text-align: center;
      background: var(--background-surface, rgba(0,0,0,.02));
      border: 1px solid var(--border-default, rgba(0,0,0,.06)); }
    .weight-card__sample { font-size: 36px; line-height: 1; }
    .weight-card__name { font-size: 12px; opacity: .7; margin-top: 8px; text-transform: capitalize; }
    .weight-card code { display: block; font-size: 10px; opacity: .5; margin-top: 4px;
      font-family: ui-monospace, monospace; }

    /* Dimensions */
    .dim-stack { display: flex; flex-direction: column; gap: 8px; }
    .dim-row { display: grid; grid-template-columns: 1fr 80px 60px; gap: 12px; align-items: center;
      padding: 6px 0; }
    .dim-row__bar { height: 14px; border-radius: 4px; background: var(--text-default, #333); opacity: .8; max-width: 100%; }
    .dim-row__name { font-size: 13px; font-weight: 500; }
    .dim-row__val { font-size: 11px; opacity: .55; text-align: right;
      font-family: ui-monospace, monospace; }

    .grid--radii { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); }
    .rad-card { text-align: center; padding: 16px;
      background: var(--background-surface, rgba(0,0,0,.02));
      border: 1px solid var(--border-default, rgba(0,0,0,.06));
      border-radius: 12px; }
    .rad-card__chip { width: 64px; height: 64px; margin: 0 auto;
      background: var(--text-default, #333); opacity: .8;
      box-shadow: inset 0 0 0 1px rgba(0,0,0,.1); }
    .rad-card__name { font-size: 12px; font-weight: 600; margin-top: 10px; }
    .rad-card__val { font-size: 11px; opacity: .55; font-family: ui-monospace, monospace; }

    /* ─── Button component ─────────────────────────────────────────────── */
    /* Base — defaults match medium size. Modifiers override per size.      */
    .btn {
      display: inline-flex; align-items: center; justify-content: center;
      border: 0; cursor: pointer; user-select: none; white-space: nowrap;
      font-family: 'Noto Sans Georgian', system-ui, sans-serif;
      font-weight: 500; letter-spacing: 0.2px;
      padding: var(--digits-spacing-3) var(--digits-spacing-4);
      gap: var(--digits-spacing-3);
      font-size: var(--font-size-button-button-default);
      line-height: var(--font-height-button-button-default);
      border-radius: var(--digits-radius-s);
      transition: filter .12s ease;
      background-clip: padding-box;
    }
    .btn:focus-visible { outline: 2px solid var(--background-primary-accent); outline-offset: 2px; }

    /* Sizes */
    .btn--xs {
      padding: var(--digits-spacing-1) var(--digits-spacing-2);
      gap: var(--digits-spacing-2);
      font-size: var(--font-size-button-button-additional);
      line-height: var(--font-height-button-button-additional);
      border-radius: var(--digits-radius-xs);
    }
    .btn--sm {
      padding: var(--digits-spacing-2) var(--digits-spacing-3);
      gap: var(--digits-spacing-2);
      font-size: var(--font-size-button-button-additional);
      line-height: var(--font-height-button-button-additional);
      border-radius: var(--digits-radius-xs);
    }
    .btn--md { /* default */ }
    .btn--lg {
      padding: var(--digits-spacing-4) var(--digits-spacing-5);
    }

    /* Variants — default state */
    .btn--primary      { background: var(--background-primary-accent);  color: var(--text-contrast); }
    .btn--primary-soft { background: var(--background-primary-soft);    color: var(--text-primary); }
    .btn--secondary    { background: var(--background-layer);           color: var(--text-secondary); border: 1px solid var(--border-default); }
    .btn--ghost        { background: transparent;                       color: var(--text-secondary); }
    .btn--link         { background: transparent;                       color: var(--background-primary-accent); padding: 0; gap: var(--digits-spacing-1); border-radius: var(--digits-radius-xs); /* no underline at rest — appears on hover/pressed per Figma */ }
    .btn--success      { background: var(--background-success-accent);  color: var(--text-contrast); }
    .btn--warning      { background: var(--background-warning-accent);  color: var(--text-contrast); }
    .btn--error        { background: var(--background-error-accent);    color: var(--text-contrast); }
    .btn--info         { background: var(--background-info-accent);     color: var(--text-contrast); }
    .btn--silkfest     { background: var(--background-silkfest-accent); color: var(--text-contrast); }

    /* Real interaction states — Figma applies the alpha-black overlay
       (Background/layer-hover = 8%, layer-pressed = 16%) across EVERY
       variant including secondary (white) and ghost (transparent).
       Verified via Figma MCP. Link is the only exception (no bg). */
    .btn:hover:not(:disabled):not(.btn--link) {
      background-image: linear-gradient(rgba(0,0,0,.08), rgba(0,0,0,.08));
    }
    .btn:active:not(:disabled):not(.btn--link) {
      background-image: linear-gradient(rgba(0,0,0,.16), rgba(0,0,0,.16));
    }
    /* Link interactions: Figma layers Background/primary-accent with the
       universal Background/layer-hover (rgba(0,0,0,.08)) and Background/
       layer-pressed (rgba(0,0,0,.16)) overlays — same alpha-black overlay
       pattern used across all filled buttons. We reproduce the result for
       the text color via color-mix (you cannot literally overlay on a text
       fill, but the math matches: primary + 8% black = #007ed8, primary +
       16% black = #0073c5). Change the primary token and link follows. */
    .btn--link:hover:not(:disabled) {
      color: color-mix(in srgb, var(--background-primary-accent) 92%, black);
      text-decoration: underline; text-underline-offset: 2px;
    }
    .btn--link:active:not(:disabled) {
      color: color-mix(in srgb, var(--background-primary-accent) 84%, black);
      text-decoration: underline; text-underline-offset: 2px;
    }

    /* Disabled — three distinct treatments per Figma. Verified against
       nodes 27:373 (primary), 27:624 (secondary), 27:895 (ghost),
       2030:1890 (link). Do NOT collapse into one rule. */
    .btn:disabled {
      /* Filled variants: grey fill + WHITE text — the white-on-light-grey
         look is the intentional muted/ghosted state. */
      background: var(--background-disabled) !important;
      background-image: none !important;
      color: var(--text-contrast) !important;
      border-color: transparent !important;
      cursor: not-allowed;
    }
    .btn--secondary:disabled {
      background: transparent !important;
      background-image: none !important;
      color: var(--text-disabled) !important;
      border-color: var(--background-disabled) !important;
    }
    .btn--ghost:disabled {
      background: transparent !important;
      background-image: none !important;
      color: var(--text-disabled) !important;
      border-color: transparent !important;
    }
    .btn--link:disabled {
      background: transparent !important;
      color: var(--text-disabled) !important;
      text-decoration: none !important;
    }

    /* Component playground toolbar */
    .comp-toolbar {
      display: flex; gap: 24px; align-items: center; flex-wrap: wrap;
      padding: 12px 16px; margin-bottom: 16px;
      background: var(--background-surface);
      border: 1px solid var(--border-default);
      border-radius: 10px;
    }
    .comp-toolbar__group { display: flex; gap: 10px; align-items: center; }
    .comp-toolbar__label { font-size: 11px; opacity: .6; text-transform: uppercase; letter-spacing: .06em; font-weight: 600; }
    .comp-toolbar__check { display: inline-flex; gap: 6px; align-items: center; font-size: 13px; cursor: pointer; }
    .comp-toolbar__hint { margin-left: auto; font-size: 12px; opacity: .5; }

    /* Segmented size picker */
    .seg { display: inline-flex; padding: 3px;
      background: var(--background-layer-hover);
      border-radius: 8px; }
    .seg__btn { font: inherit; font-size: 12px; font-weight: 500;
      padding: 6px 12px; border: 0; border-radius: 6px;
      background: transparent; color: var(--text-secondary); cursor: pointer;
      letter-spacing: .04em; }
    .seg__btn--active { background: var(--background-layer);
      color: var(--text-default); box-shadow: 0 1px 2px rgba(0,0,0,.06); }

    /* Component cards grid */
    .comp-grid { display: grid; gap: 12px;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }
    .comp-card { display: flex; flex-direction: column; gap: 14px;
      padding: 16px 16px 24px; min-height: 110px;
      background: var(--background-surface);
      border: 1px solid var(--border-default);
      border-radius: 12px; }
    .comp-card__name { font-size: 11px; font-family: ui-monospace, monospace;
      opacity: .55; text-transform: capitalize; }
    .comp-card > .btn { align-self: center; margin-top: auto; }

    /* Icon Button — square, uniform padding from button height − icon */
    .btn--icon { padding: var(--digits-spacing-3); aspect-ratio: 1; gap: 0; }
    .btn--icon.btn--xs { padding: var(--digits-spacing-1); }
    .btn--icon.btn--sm { padding: var(--digits-spacing-2); }
    .btn--icon.btn--md { padding: var(--digits-spacing-3); }
    .btn--icon.btn--lg { padding: var(--digits-spacing-4); }
    .btn--icon svg { width: 20px; height: 20px; display: block; }
    .btn--icon.btn--xs svg, .btn--icon.btn--sm svg { width: 16px; height: 16px; }

    /* ─── Input + Text Area (floating-label pattern) ──────────────────── */
    .input-group {
      display: flex; flex-direction: column; gap: var(--digits-spacing-2);
      transition: opacity .15s ease;
    }
    .input-group .comp-card__name { /* re-uses card label style for the title */ }

    .input, .textarea {
      display: flex; gap: var(--digits-spacing-3);
      padding: var(--digits-spacing-2) var(--digits-spacing-4);
      background: var(--background-input-default);
      border: 1px solid var(--border-subtle);
      border-radius: var(--digits-radius-s);
      cursor: text;
      transition: background .12s, border-color .12s, box-shadow .15s;
    }
    .input    { align-items: center; height: 52px; }
    .textarea { align-items: stretch; min-height: 104px; padding-top: 14px; padding-bottom: 14px; }

    /* Hover & pressed — only when not focused, errored, or disabled. */
    .input:hover:not(:focus-within),
    .textarea:hover:not(:focus-within) { background: var(--background-input-hover); }
    .input:active:not(:focus-within),
    .textarea:active:not(:focus-within) { background: var(--background-input-pressed); }

    /* Active (focused) — white bg, primary border, soft glow. */
    .input:focus-within,
    .textarea:focus-within {
      background: var(--background-layer);
      border-color: var(--background-primary-accent);
      box-shadow: 0 0 0 4px var(--primary-16);
    }

    /* Error — pink bg + pink border. */
    .input--error, .textarea--error {
      background: var(--background-error);
      border-color: var(--border-error);
    }
    /* Active-Error — focused while errored: white bg, red border, red glow. */
    .input--error:focus-within,
    .textarea--error:focus-within {
      background: var(--background-layer);
      border-color: var(--background-error-accent);
      box-shadow: 0 0 0 4px var(--red-16);
    }

    /* Disabled — entire group fades. Pointer-events off so hover is inert. */
    .input-group:has(.input__field:disabled),
    .input-group:has(.textarea__field:disabled) {
      opacity: 0.5; pointer-events: none;
    }

    /* Icons (left/right slots) */
    .input__icon {
      width: 20px; height: 20px; flex: none; align-self: center;
      color: var(--text-additional);
    }
    .input__icon svg { width: 100%; height: 100%; display: block; }

    /* ─── Floating label inner (input) ───────────────────────────────── */
    .input__inner {
      flex: 1; min-width: 0;
      display: grid; gap: var(--digits-spacing-1);
      align-content: center;
      height: 100%;
    }
    .input__label {
      font-family: 'Noto Sans Georgian', system-ui, sans-serif;
      font-weight: 400;
      font-size: var(--font-size-body-body-accent);
      line-height: var(--font-height-body-body-accent);
      color: var(--text-additional);
      pointer-events: none;
      transition: font-size .15s ease, line-height .15s ease, font-weight .15s ease;
    }
    .input__field {
      border: 0; background: transparent; outline: 0; padding: 0; margin: 0;
      font-family: 'Noto Sans Georgian', system-ui, sans-serif;
      font-weight: 400;
      font-size: var(--font-size-body-body-default);
      line-height: var(--font-height-body-body-default);
      color: var(--text-default);
      width: 100%;
      caret-color: var(--background-primary-accent);
      height: 0; overflow: hidden;
      transition: height .15s ease;
    }
    .input__field::placeholder { color: transparent; }

    /* Floated state — focused or has value */
    .input:focus-within .input__label,
    .input:has(.input__field:not(:placeholder-shown)) .input__label {
      font-size: var(--font-size-subtitle-subtitle-3);
      line-height: var(--font-height-subtitle-subtitle-3);
      font-weight: 500;
    }
    .input:focus-within .input__field,
    .input:has(.input__field:not(:placeholder-shown)) .input__field {
      height: 20px; /* matches body-default line-height */
    }

    /* ─── Floating label inner (textarea) ─────────────────────────────── */
    .textarea__inner {
      flex: 1; min-width: 0;
      display: flex; flex-direction: column; gap: var(--digits-spacing-1);
    }
    .textarea__label {
      font-family: 'Noto Sans Georgian', system-ui, sans-serif;
      font-weight: 400;
      font-size: var(--font-size-body-body-accent);
      line-height: var(--font-height-body-body-accent);
      color: var(--text-additional);
      pointer-events: none;
      transition: font-size .15s ease, line-height .15s ease, font-weight .15s ease;
    }
    .textarea__field {
      flex: 1; min-width: 0; min-height: 60px; resize: vertical;
      border: 0; background: transparent; outline: 0; padding: 0; margin: 0;
      font-family: 'Noto Sans Georgian', system-ui, sans-serif;
      font-weight: 400;
      font-size: var(--font-size-body-body-default);
      line-height: var(--font-height-body-body-default);
      color: var(--text-default);
      caret-color: var(--background-primary-accent);
    }
    .textarea__field::placeholder { color: transparent; }
    .textarea:focus-within .textarea__label,
    .textarea:has(.textarea__field:not(:placeholder-shown)) .textarea__label {
      font-size: var(--font-size-subtitle-subtitle-3);
      line-height: var(--font-height-subtitle-subtitle-3);
      font-weight: 500;
    }

    .comp-grid--input { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }

    /* ─── Helper Text ──────────────────────────────────────────────────── */
    .helper {
      margin: 0;
      display: inline-flex; align-items: center; gap: var(--digits-spacing-2);
      font-family: 'Noto Sans Georgian', system-ui, sans-serif;
      font-size: var(--font-size-other-caption);
      line-height: var(--font-height-other-caption);
      letter-spacing: 0.25px;
    }
    .helper__icon { width: 16px; height: 16px; flex: none; display: none; }
    .helper__icon svg { width: 100%; height: 100%; display: block; }
    .helper--default { color: var(--text-additional); }
    .helper--success { color: var(--text-success); }
    .helper--info    { color: var(--text-info); }
    .helper--warning { color: var(--text-warrning); /* Figma source spelling */ }
    .helper--error   { color: var(--text-error); }
    /* Show the icon for any non-default state */
    .helper:not(.helper--default) .helper__icon { display: inline-flex; }

    .helper-stack { display: flex; flex-direction: column; gap: 12px; }
    .helper-row {
      display: grid; grid-template-columns: 80px 1fr auto; gap: 16px; align-items: center;
      padding: 8px 12px; border-radius: 8px;
      background: var(--background-surface);
      border: 1px solid var(--border-default);
    }
    .helper-row__label { font-size: 11px; opacity: .55; text-transform: capitalize;
      font-family: ui-monospace, monospace; }
    .helper-row__var { font-size: 11px; opacity: .5;
      font-family: ui-monospace, monospace; }

    footer { padding: 32px; text-align: center; opacity: .5; font-size: 12px; }
  </style>
</head>
<body>
  <header class="header">
    <div class="header__title">Silknet DS <small>Token Showcase</small></div>
    <div class="toggles" role="group" aria-label="Theme">
      <button class="toggle" data-theme="light" aria-pressed="true">Light</button>
      <button class="toggle" data-theme="dark" aria-pressed="false">Dark</button>
      <button class="toggle" data-theme="system" aria-pressed="false">System</button>
    </div>
  </header>

  <main>
    <section>
      <div class="section__head">
        <h2 class="section__title">Semantic Colors</h2>
        <span class="section__sub">— ${semanticTokens.filter((t) => t.type === 'color').length} tokens, theme-aware</span>
      </div>
      ${renderSemanticColors()}
    </section>

    <section>
      <div class="section__head">
        <h2 class="section__title">Typography</h2>
        <span class="section__sub">— composite text styles (family + weight + size + line-height + letter-spacing)</span>
      </div>
      ${renderTypography()}
      ${renderFontFamilyAndWeights()}
    </section>

    <section>
      <div class="section__head">
        <h2 class="section__title">Spacing & Radius</h2>
        <span class="section__sub">— semantic scale</span>
      </div>
      ${renderSpacingAndRadius()}
    </section>

    <section>
      <div class="section__head">
        <h2 class="section__title">Primitive Palette</h2>
        <span class="section__sub">— ${primitiveTokens.filter((t) => t.type === 'color').length} colors across ${new Set(primitiveTokens.filter((t) => t.type === 'color').map((t) => t.path[0])).size} groups</span>
      </div>
      ${renderPalette()}
    </section>

    <section>
      <div class="section__head">
        <h2 class="section__title">Components — Button</h2>
        <span class="section__sub">— ${BUTTON_VARIANTS.length + 1} variants × 4 sizes × 4 states</span>
      </div>
      ${renderButtonComponent()}
    </section>

    <section>
      <div class="section__head">
        <h2 class="section__title">Components — Icon Button</h2>
        <span class="section__sub">— ${ICON_BTN_VARIANTS.length} variants × 4 sizes × 4 states</span>
      </div>
      ${renderIconButtonComponent()}
    </section>

    <section>
      <div class="section__head">
        <h2 class="section__title">Components — Input</h2>
        <span class="section__sub">— single-line text field, 8 states</span>
      </div>
      ${renderInputComponent()}
    </section>

    <section>
      <div class="section__head">
        <h2 class="section__title">Components — Text Area</h2>
        <span class="section__sub">— multi-line text field, 8 states</span>
      </div>
      ${renderTextAreaComponent()}
    </section>

    <section>
      <div class="section__head">
        <h2 class="section__title">Components — Helper Text</h2>
        <span class="section__sub">— ${HELPER_STATES.length} semantic states</span>
      </div>
      ${renderHelperTextComponent()}
    </section>
  </main>

  <footer>Generated ${new Date().toISOString()} — re-run <code>npm run sync</code> to refresh.</footer>

  <script>
    (function () {
      const root = document.documentElement;
      const buttons = Array.from(document.querySelectorAll('.toggle'));
      const mql = matchMedia('(prefers-color-scheme: dark)');
      let currentMode = 'light';

      const applyTheme = () => {
        const effective = currentMode === 'system' ? (mql.matches ? 'dark' : 'light') : currentMode;
        if (effective === 'dark') root.setAttribute('data-theme', 'dark');
        else root.removeAttribute('data-theme');
      };
      const setMode = (mode) => {
        currentMode = mode;
        applyTheme();
        buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.theme === mode)));
        try { localStorage.setItem('silknet-ds-theme', mode); } catch {}
      };

      buttons.forEach((b) => b.addEventListener('click', () => setMode(b.dataset.theme)));
      // Re-apply on OS theme change (only matters when in system mode).
      mql.addEventListener('change', () => { if (currentMode === 'system') applyTheme(); });

      const saved = (() => { try { return localStorage.getItem('silknet-ds-theme'); } catch { return null; } })();
      setMode(saved || 'system');
    })();

    // Generic helper: wire a size segmented picker + disabled checkbox to a
    // grid of elements. Removes any old size class before applying the new one.
    function wireSizePlayground({ grid, btnSelector, sizeSelector, disabledSelector, sizes }) {
      const root = document.querySelector(grid);
      if (!root) return;
      const btns = Array.from(root.querySelectorAll(btnSelector));
      const sizeBtns = Array.from(document.querySelectorAll(sizeSelector));
      const disabledChk = document.querySelector(disabledSelector);
      let current = 'md';
      const apply = () => {
        btns.forEach((b) => {
          sizes.forEach((s) => b.classList.remove('btn--' + s));
          b.classList.add('btn--' + current);
          if (disabledChk && disabledChk.checked) b.setAttribute('disabled', '');
          else b.removeAttribute('disabled');
        });
      };
      sizeBtns.forEach((s) => s.addEventListener('click', () => {
        current = s.dataset[Object.keys(s.dataset)[0]]; // pick first data-* key
        sizeBtns.forEach((x) => x.classList.toggle('seg__btn--active', x === s));
        apply();
      }));
      if (disabledChk) disabledChk.addEventListener('change', apply);
      apply();
    }

    // Button playground
    wireSizePlayground({
      grid: '[data-component-grid]',
      btnSelector: '[data-btn]',
      sizeSelector: '[data-size]',
      disabledSelector: '[data-disabled-toggle]',
      sizes: ['xs', 'sm', 'md', 'lg'],
    });

    // Icon Button playground
    wireSizePlayground({
      grid: '[data-icon-grid]',
      btnSelector: '[data-icon-btn]',
      sizeSelector: '[data-icon-size]',
      disabledSelector: '[data-icon-disabled-toggle]',
      sizes: ['xs', 'sm', 'md', 'lg'],
    });

    // Input playground — error / disabled toggles. Error toggles both the
    // wrapper class (for border/bg) and the helper class (for color/icon).
    (function () {
      const errChk = document.querySelector('[data-input-error]');
      const disChk = document.querySelector('[data-input-disabled]');
      const wraps = Array.from(document.querySelectorAll('[data-input-wrap]'));
      const fields = Array.from(document.querySelectorAll('[data-input]'));
      const helpers = Array.from(document.querySelectorAll('[data-input-helper]'));
      if (!errChk) return;
      const apply = () => {
        wraps.forEach((w) => w.classList.toggle('input--error', errChk.checked));
        helpers.forEach((h) => {
          h.classList.toggle('helper--error', errChk.checked);
          h.classList.toggle('helper--default', !errChk.checked);
        });
        fields.forEach((f) => { if (disChk.checked) f.setAttribute('disabled', ''); else f.removeAttribute('disabled'); });
      };
      errChk.addEventListener('change', apply);
      disChk.addEventListener('change', apply);
    })();

    // Text Area playground — same pattern
    (function () {
      const errChk = document.querySelector('[data-textarea-error]');
      const disChk = document.querySelector('[data-textarea-disabled]');
      const wraps = Array.from(document.querySelectorAll('[data-textarea-wrap]'));
      const fields = Array.from(document.querySelectorAll('[data-textarea]'));
      const helpers = Array.from(document.querySelectorAll('[data-textarea-helper]'));
      if (!errChk) return;
      const apply = () => {
        wraps.forEach((w) => w.classList.toggle('textarea--error', errChk.checked));
        helpers.forEach((h) => {
          h.classList.toggle('helper--error', errChk.checked);
          h.classList.toggle('helper--default', !errChk.checked);
        });
        fields.forEach((f) => { if (disChk.checked) f.setAttribute('disabled', ''); else f.removeAttribute('disabled'); });
      };
      errChk.addEventListener('change', apply);
      disChk.addEventListener('change', apply);
    })();
  </script>
</body>
</html>
`;

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_FILE, html);
console.log(`✔︎ showcase/index.html (${(html.length / 1024).toFixed(1)} KB)`);
