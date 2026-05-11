# @silknet-ds/tokens

CSS tokens for the Silknet design system — light + dark themes. Generated from Figma Variables via Style Dictionary; this package just publishes the resulting CSS.

## Install

```bash
npm install @silknet-ds/tokens
```

## Use

```css
/* In your global CSS */
@import '@silknet-ds/tokens/tokens.css';
```

```ts
// Or in your app entry (Vite / Next.js / CRA)
import '@silknet-ds/tokens/tokens.css';
```

This loads both light and dark theme variables. Light applies on `:root` by default; dark activates when `<html data-theme="dark">` is set.

### Light or dark only

```ts
import '@silknet-ds/tokens/tokens.light.css';
import '@silknet-ds/tokens/tokens.dark.css';
```

### Theme switching

Set the attribute on the document root:

```ts
document.documentElement.setAttribute('data-theme', 'dark');  // or remove for light
```

For OS-driven switching:

```ts
const mq = matchMedia('(prefers-color-scheme: dark)');
const apply = () => {
  if (mq.matches) document.documentElement.setAttribute('data-theme', 'dark');
  else document.documentElement.removeAttribute('data-theme');
};
mq.addEventListener('change', apply);
apply();
```

## Token names

All tokens are CSS custom properties. Naming mirrors Figma 1:1, including a known typo (`--text-warrning` — double r) which is preserved intentionally so the source can drive automated updates.

Some examples:

```css
var(--background-primary-accent)
var(--background-layer)
var(--text-default)
var(--text-additional)
var(--digits-spacing-3)        /* 12px */
var(--digits-radius-s)         /* 12px */
var(--font-size-body-body-default)
var(--font-height-body-body-default)
var(--primary-16)              /* alpha-blended primary */
```

Browse all variables in the source files: `dist/tokens.light.css` (~360 entries).

## License

MIT
