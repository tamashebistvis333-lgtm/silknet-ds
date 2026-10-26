# Design governance — Approved Component Registry

`component-registry.json` lists which Silknet New DS components, variables, and styles
`/create-flow` may place in generated Figma flows, and exactly how. It is an **approval
manifest**, not a second source of truth: the Figma library `ymEnGYUGvRRVKhHiUSGMVF`
(Silknet New DS) stays authoritative. Field definitions live in
`.claude/skills/create-flow/templates/component-registry.template.json`; enforcement rules
live in `.claude/skills/create-flow/SKILL.md` (Step 3).

## Statuses

| Status | Meaning | Usable in flows? |
|---|---|---|
| `proposed` | Discovered and evidenced, waiting for designer approval | No |
| `approved` | Designer approved, quote recorded in `approval` | Yes — only the approved `variants` / `properties` |
| `deprecated` | Retired; `replacedBy` names the successor | No |
| `blocked` | Known problem (e.g. provenance failed) | No |

Empty never means "allowed": an empty `variants` map approves no variants, an empty
`approval.quote` means not approved.

## Adding a component after it is published in Figma

1. **Publish** the component in the Silknet New DS library (designer, in Figma). Nothing in
   this process writes to the library file.
2. **Discover (read-only).** Ask Claude to register the component. It runs:
   - `get_libraries` → confirm the library key matches `source.libraryKey`;
   - `search_design_system` limited to that library → `componentSetKey`/`componentKey`,
     `assetType`, `updatedAt`;
   - `get_metadata` on the source node → variant names and node IDs;
   - `get_design_context` + `get_variable_defs` → internal bindings (property names from
     these tools are **hints only**);
   - `get_screenshot` for reference.
3. **Sandbox import (needs designer approval of the target file and operations).** A Stage 1
   run from `.claude/skills/create-flow/references/capability-test.md`, in an approved
   target file (never the library). It imports by key, proves provenance (`remote`, key,
   name, axes, source variant names), reads the **exact** property keys and full
   `variantOptions` and `variantCount`, and records and loads the fonts. Stage 2 is optional
   and only needed to prove variant switching, text overrides, bindings, or modes for this
   component. Run the independent read-only audit afterwards. Clean up test nodes only
   with approval.
4. **Draft the entry** as `"status": "proposed"`. Copy values only from step 2–3 evidence.
   Anything not observed stays empty and is listed under `unverified`. Missing
   capabilities, such as no TEXT property, go under `limitations`. Fill `identityEvidence`
   and `verification` (`PASS` = exercised, `UNVERIFIED` = not exercised).
5. **Designer approval, per entry.** The designer states which `variants`, `states`,
   `sizes`, `modes`, `properties` and swap targets are allowed. Record their exact words in
   `approval` (`by`, `quote`, `at`, `scope`), set `"status": "approved"`, bump `revision`
   and `updatedAt`.
6. **Save via PR.** Changes go on a branch and a pull request for designer review. Nothing
   is committed or merged without approval.

Variables and styles follow the same steps. Step 3 binds the variable to a frame (or
applies the style to a text node) in the sandbox, and approval is recorded on the
`variables` / `styles` entry.

## Keeping entries current

- **Library changed:** if `search_design_system` shows a newer `updatedAt` than the
  entry's `libraryUpdatedAt`, `/create-flow` treats the entry as `UNVERIFIED` and will not
  place it until steps 2–3 are re-run and the entry is updated (approval scope is
  re-confirmed if variants or properties changed).
- **Key changed:** the old entry becomes `deprecated` with `replacedBy` pointing to a new
  entry, which needs its own approval.
- **Identity proof:** `identityLink` becomes `designer-confirmed` only when the designer
  confirms the key and source node pair. Until then it stays `unverified`. That is
  reported, but it does not block use unless the designer asks for node-level proof.
- **Never** edit the registry to make a flow pass: no widening of allowed values, no
  approval without a quote, no guessed keys.

## Sizing rules (`layout`, since r8)

Component instances keep their native sizing. A component may additionally allow horizontal
`FILL` only through a `layout` rule on its entry (shape: `layout-governance.schema.json`):

1. **Evidence first.** Run the layout sizing test from
   `.claude/skills/create-flow/references/capability-test.md` (approved target, separate page)
   for every variant and parent context you want to allow. Record native sizing per variant
   (`nativeByVariant`), the tested variants (`fill.variantCombinations`), the tested context and
   inner widths (`fill.contexts`) and any extra own-override fields `FILL` adds.
2. **Add the rule as `"status": "proposed"` with `"approval": null`.** A proposed rule grants
   nothing: the audit treats the component as native-only.
3. **Regression.** Run the audit's positive and negative layout cases (CI) and, with designer
   approval, the Figma regression page.
4. **Designer approval.** Record `layout.approval` (`by`, `quote`, `at`, `scope`) and set
   `"status": "approved"` in a separate commit. The entry's r7 `approval` is never edited for this.

Never add arbitrary widths or heights, vertical `FILL`, untested contexts or variants, or
character limits. Long-text limits are `contentConstraints` (line and container rules per text
layer), each linked to an issue in `design-system-issues.md` when it is a library defect.

The r8 evidence page `🧪 r8 layout capability` (`100:1240`, section `100:1241`) in the
Playground is permanent; do not modify or delete it.

## Validation

```bash
npm run test:governance
```

Runs the audit tests (`.claude/skills/create-flow/tests/`), the registry tests
(`design-governance/tests/`) and `scripts/validate-registry.mjs` (schema + semantic checks).
Before merging a registry change, also compare with the base branch:

```bash
node design-governance/scripts/validate-registry.mjs --baseline-ref origin/main
```

`scripts/build-audit-constants.mjs` prints the `APPROVED` constants for the audit script from
the registry.
