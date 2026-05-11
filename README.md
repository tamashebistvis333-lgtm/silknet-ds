# silknet-ds

Silknet's design system. Tokens flow from Figma into platform code (iOS, Android, Web) through a single source of truth, plus a React component library.

**Live playground:** runs locally with `npm run dev` — see all components, all variants, dark/light theme switch.

## Packages

| Package | What | Install |
|---|---|---|
| [`@silknet-ds/tokens`](./packages/tokens) | Generated CSS tokens (light + dark) | `npm i @silknet-ds/tokens` |
| [`@silknet-ds/react`](./packages/react) | React components: Button, IconButton, Input, TextArea, HelperText | `npm i @silknet-ds/react` |

## Quick use (in your app)

```bash
npm install @silknet-ds/react @silknet-ds/tokens
```

```tsx
// Once at app entry — load CSS variables + component styles.
import '@silknet-ds/tokens/tokens.css';
import '@silknet-ds/react/styles.css';

import { Button, Input } from '@silknet-ds/react';

export function Demo() {
  return (
    <>
      <Button variant="primary">Save</Button>
      <Input label="სახელი" helperText="დამხმარე ტექსტი" />
    </>
  );
}
```

Dark theme: set `<html data-theme="dark">`. Tokens auto-switch.

## Develop locally

```bash
npm install
npm run dev          # Ladle playground at http://localhost:61000
```

## Workflows

### For designers — change a token

1. Edit a Figma Variable (color, size, radius, etc.)
2. Export Variables → put the JSONs in `~/Desktop/Tokens/` (overwrite)
3. The watcher (`npm run watch`, run once and leave open) auto-rebuilds tokens, platform code, and the showcase.
4. Refresh `showcase/index.html` in your browser.

### For designers — change a component

Components require interpretation, not just data transfer. Open Claude Code in this repo and use `/sync-component <name> <figma-url>`. See `CLAUDE.md` for the full playbook.

### For developers — consume in another app

```bash
npm install @silknet-ds/react @silknet-ds/tokens
```

Then import as shown above. Browse the live playground for all variants.

## Repo scripts

| Command | What |
|---|---|
| `npm run sync` | Full token pipeline: import → build → showcase |
| `npm run watch` | Auto-sync on Figma export changes |
| `npm run build:packages` | Build tokens + react packages |
| `npm run dev` | Start the Ladle component playground |
| `npm run showcase` / `build` / `import` / `clean` | Individual pipeline steps |

## Repo layout

```
silknet-ds/
├── tokens/                    Normalized DTCG tokens (auto-generated)
├── build/                     Multi-platform outputs (iOS Swift, Android Kotlin/XML, CSS)
├── showcase/index.html        Designer-facing visual catalog
├── packages/
│   ├── tokens/                @silknet-ds/tokens
│   └── react/                 @silknet-ds/react
├── apps/
│   └── playground/            Ladle component playground
├── scripts/                   Token pipeline (import-figma, generate-showcase, watch-figma)
├── build.js                   Style Dictionary multi-platform build
├── CLAUDE.md                  AI playbook for component updates
└── .claude/commands/          Custom Claude Code slash commands
```

## Tech

- **Tokens pipeline:** [Style Dictionary v4](https://styledictionary.com/) + W3C DTCG format
- **Component library:** TypeScript, [tsup](https://tsup.egoist.dev/) (ESM + types)
- **Playground:** [Ladle](https://ladle.dev/)
- **CSS strategy:** plain CSS with `silk-` prefix, ships as a single bundled stylesheet

## License

[MIT](./LICENSE) — © 2026 Sandro Tarkhnishvili
