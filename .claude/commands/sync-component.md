---
description: Update an existing showcase component to match its current Figma spec
argument-hint: <ComponentName> <figma-url>
---

You are updating a component in the silknet-ds showcase to match its current Figma source.

**Arguments:** `$ARGUMENTS` — typically a component name and a Figma URL, e.g. `Button https://www.figma.com/design/ymEnGYUGvRRVKhHiUSGMVF/...?node-id=27-379`

If the component or URL is missing or ambiguous, ask the designer once before proceeding.

## Steps

1. **Parse the URL.** Extract `fileKey` and `nodeId` (convert `node-id=27-379` to `27:379`).
2. **Fetch dual specs in parallel:**
   - `mcp__figma__get_design_context` for the node — gives you layout, sizing, and resolved color hexes.
   - `mcp__figma__get_variable_defs` for the same node — reveals the actual token bindings (often the resolved hexes hide a base+overlay token composition).
3. **For multi-state components** (Button, Input, etc.), figure out what states are in scope based on the designer's request. If they want a full update, fetch design_context for at least one node per state family (default/hover/pressed/disabled/error/etc.) — but coalesce: one fetch per visual style is usually enough; extrapolate the rest from the variable bindings.
4. **Compare to the existing implementation.** Read the relevant render function in `scripts/generate-showcase.js` and the matching CSS block.
5. **Update the code:**
   - Use existing CSS variables wherever Figma uses tokens. Never hardcode hex/px values.
   - For overlay-based interactions, use `color-mix(in srgb, var(--token) 92%, black)` for hover (8% overlay equivalent), `... 84%, black` for pressed (16% overlay equivalent).
   - Match Figma source spelling 1:1 — even known typos like `--text-warrning`.
   - Preserve the interactive playground pattern (size pickers, error/disabled toggles, real `:hover`/`:focus` states) — never replace it with a static matrix.
6. **Regenerate the showcase:** `npm run showcase`.
7. **Open `showcase/index.html` in the browser** so the designer can validate visually.
8. **Briefly report what changed** — name the variants/states/properties touched, and explicitly call out anything you couldn't fully verify from Figma so the designer knows what to scrutinize. Keep it under ~6 lines.

## Hard requirements

- **Match Figma exactly** — same padding, radius, font/line-height, color tokens, gaps, slot positions.
- **Token-driven** — if Figma's spec resolves to a hex like `#0089eb`, find the corresponding `--background-primary-accent` and use it. If unsure which token, check `mcp__figma__get_variable_defs` again.
- **Don't touch** `tokens/`, `build/`, or anything in the auto-generated pipeline — those are owned by the token sync, not by component edits.
- **Don't add new dependencies** — the showcase is intentionally vanilla HTML/CSS/JS.
- **Light AND dark theme** — your update must look right in both. The showcase has a theme toggle in the header; verify both modes mentally if you can't visually.

## Common pitfalls to avoid

- "Looks like a hardcoded hex" → it isn't. Re-fetch `get_variable_defs` and look for a base token + overlay composition.
- Replacing the interactive playground with a static state matrix → don't. The designer prefers playgrounds (size picker + real hover/focus + error/disabled toggles).
- Adding `text-decoration: underline` everywhere because hover shows an underline → check if it's only on hover/pressed (link button case).
- Assuming hover/pressed colors → fetch them. Sometimes they're the alpha-black overlay pattern, sometimes (e.g. ghost/secondary buttons) they reveal a different background token.
