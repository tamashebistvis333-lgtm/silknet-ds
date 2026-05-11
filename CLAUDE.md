# silknet-ds — Designer-owned Cross-Platform Design System

## Project context

Silknet's design system. **Single source of truth = Figma file `ymEnGYUGvRRVKhHiUSGMVF`** (Silknet New DS).

- The **designer (user)** owns Figma — tokens, components, typography, every visual decision.
- This **codebase consumes from Figma** — never the reverse.
- **Developers** will eventually consume from this codebase as a versioned package — they should never edit tokens or hand-translate designs into platform code.

When the designer asks for any change, frame work in terms of "what does Figma say?" first, then translate that intent into code.

## Workflow

### Tokens (data: colors, typography, spacing, radius)

Tokens are pure data and **fully automated**:

1. Designer exports Variables from Figma → 4 JSON files appear in `~/Desktop/Tokens/`
2. The folder watcher (`npm run watch`, runs in a separate terminal) auto-runs `npm run sync` whenever those files change
3. `sync` = import (normalize) → build (multi-platform) → regenerate showcase
4. Designer refreshes the showcase tab in their browser

If the watcher isn't running, `npm run sync` does the same thing manually.

### Components (Button, Input, Text Area, Helper Text, Icon Button, future ones)

Components **cannot be auto-synced** — they require interpretation, not just data transfer. The workflow is **AI-assisted**:

1. Designer makes the change in Figma
2. Designer opens this Claude Code session and uses **`/sync-component <name> <figma-url>`**
3. Claude:
   - Fetches the new spec via Figma MCP (`get_design_context` for layout, `get_variable_defs` for token bindings)
   - Updates the relevant render function and CSS in `scripts/generate-showcase.js`
   - Runs `npm run showcase`
   - Reports what changed
4. Designer validates in the browser

### Adding a brand-new component

Same as the update flow but more thorough:
- Fetch metadata for the component frame to understand variants/sizes/states matrix
- Fetch design context for representative variants of each visual style
- Build it incrementally; designer validates at each variant family
- Add a new section in the showcase

## Hard rules

- **Never edit `tokens/*.json` by hand** — they are regenerated from `~/Desktop/Tokens/` by `scripts/import-figma.js`. Manual edits will be wiped on the next sync.
- **Never edit `build/**` files by hand** — fully auto-generated; they're in `.gitignore`.
- **Always reference existing CSS variables** when adding/updating component styles. Never hardcode hex or px values. If Figma's spec resolves to a hex like `#0089eb`, find the corresponding token (`--background-primary-accent`) and use it.
- **Match Figma source spelling 1:1**, including known typos. Example: `--text-warrning` (double 'r') is in the Figma source. Do NOT "correct" it — when the source is fixed, ours auto-updates.
- **For overlay-based interactions** (hover/pressed darkening), use the same alpha-black overlay pattern Figma uses (`Background/layer-hover` = 8%, `Background/layer-pressed` = 16%). On text colors where you can't literally overlay, use `color-mix(in srgb, var(--token) 92%, black)` for hover, `... 84%, black` for pressed — this stays driven by the source token.
- **Composite text styles live in `tokens/text-styles.json`** and are *manually maintained* — they're not in Figma's Variables export. They live in Figma's "Local Styles" and were extracted via the Figma MCP from a node that uses them (node `27:110`). To refresh them, fetch that node again with `mcp__figma__get_variable_defs` and update the JSON.

## File map

```
silknet-ds/
├── tokens/                          ← normalized DTCG tokens (auto-generated)
│   ├── primitives.json              ← color palettes, raw spacing
│   ├── semantic.light.json          ← Light theme semantic colors
│   ├── semantic.dark.json           ← Dark theme semantic colors
│   ├── typography.json              ← font primitives (family, weight, sizes)
│   └── text-styles.json             ← composite text styles (manually maintained!)
├── build/                           ← platform outputs (auto-generated, gitignored)
│   ├── ios/DesignTokens{Light,Dark}.swift
│   ├── android/DesignTokens{Light,Dark}.kt    ← Jetpack Compose
│   ├── android/res/values{,-night}/colors.xml ← Android XML system theming
│   └── css/tokens.{light,dark}.css
├── showcase/index.html              ← designer-facing visual catalog
├── scripts/
│   ├── import-figma.js              ← Figma export → tokens/ normalization
│   ├── generate-showcase.js         ← tokens + components → showcase HTML
│   └── watch-figma.js               ← folder watcher
├── build.js                         ← Style Dictionary multi-platform build
└── package.json
```

## Commands

| Command | What it does |
|---|---|
| `npm run sync` | Full pipeline: import → clean → build → build:swift → regenerate showcase |
| `npm run watch` | Folder watcher; auto-runs sync when Figma export files change |
| `npm run showcase` | Regenerate just the showcase HTML (after editing component code) |
| `npm run build` | Regenerate just the multi-platform raw code (Swift/Kotlin/XML/CSS) |
| `npm run build:swift` | Regenerate the SPM Swift sources under `Sources/SilknetDS/` |
| `npm run build:packages` | Build the npm packages (tokens + react) |
| `npm run import` | Just normalize the Figma exports into `tokens/` |
| `npm run clean` | Delete `build/` |

**Important:** `Sources/SilknetDS/*.swift` files are COMMITTED to git (unlike `build/**`) because Swift Package Manager pulls source directly from the repo. CI fails if they're out of sync with the latest tokens. Always run `npm run build:swift` (or `npm run sync`) after editing tokens; the watcher does this automatically.

## Figma MCP usage tips

When fetching from Figma:
- **Always use BOTH `get_design_context` AND `get_variable_defs`** for the same node. `get_design_context` flattens variable references to resolved hex values (you'll think things are hardcoded when they aren't). `get_variable_defs` reveals the actual token bindings.
- Specs that look like hardcoded colors (e.g., link button hover = `#007ed8`) often turn out to be a base token + overlay token (`primary-accent` + `layer-hover`). Verify before assuming.
- For component matrices (Button has ~160 variants), fetch metadata first to understand the structure, then design_context for one representative per visual family — extrapolate the rest.
