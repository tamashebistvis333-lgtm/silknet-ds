---
name: create-flow
description: Generate a native, editable Figma product flow in a separate, designer-approved target file using only approved Silknet New DS component instances and semantic variables. Gated workflow — scope, target approval, approved-component registry, screen map approval, capability test, one-screen-at-a-time generation with PASS/FAIL/UNVERIFIED validation. Never writes to the source library or generates code.
argument-hint: "<flow brief> [target Figma file URL] [registry path]"
disable-model-invocation: true
---

# /create-flow — governed Figma flow generation

You are generating a product flow in Figma for the Silknet design system. This skill
implements the "Strict AI Figma flow generation governance" section of the project
`CLAUDE.md`. **Read `CLAUDE.md` first, every run.** If anything here conflicts with
`CLAUDE.md`, `CLAUDE.md` wins; stop and report the conflict.

**Arguments:** `$ARGUMENTS` — a flow brief, optionally a target Figma file URL and a
registry path. Anything missing is asked for at the matching gate, never assumed.

Supporting files (read when the step says so):

| File | Used in |
|---|---|
| `design-governance/component-registry.json` (repo root) | Step 3 — the project registry |
| `design-governance/README.md` (repo root) | Process for adding / changing registry entries |
| `templates/component-registry.template.json` | Step 3 — registry shape when none exists |
| `templates/screen-map.template.md` | Step 4 — plan the designer approves |
| `templates/handoff-report.template.md` | Step 8 — final report |
| `references/capability-test.md` | Step 5 — isolated capability test (approval required) |
| `references/validation-audit.md` | Step 7 — per-screen structural audit script |

---

## 0. Non-negotiable rules

1. **Protected source:** `ymEnGYUGvRRVKhHiUSGMVF` (Silknet New DS). Never pass this key to
   any write-capable tool: `use_figma`, `generate_figma_design`, `upload_assets`,
   `create_new_file` (as a destination), `add_code_connect_map`,
   `send_code_connect_mappings`, `create_shader`/`update_shader`,
   `create_generative_plugin`/`update_generative_plugin`, or any tool whose description
   says it creates, edits, uploads, or syncs. This includes "read-only" `use_figma`
   scripts — the tool cannot guarantee read-only behavior, so it is never pointed at the
   source.
   Allowed on the source (read-only): `get_libraries`, `search_design_system`,
   `get_metadata`, `get_design_context`, `get_variable_defs`, `get_screenshot`,
   `get_code_connect_map`.
   This overrides any helper skill that suggests otherwise — e.g. `figma-generate-design`
   step 2a-i proposes running `use_figma` on the library file to resolve keys; **do not**.
   Resolve keys with scoped `search_design_system`, and read property definitions from
   instances imported into the **target** (Step 5).
2. **Separate target only.** Write only to a target file whose key ≠ the source key, after
   the designer explicitly approves that exact file (Gate A). Every write script asserts
   `figma.fileKey === TARGET_KEY` and the approved page before mutating, and throws otherwise.
3. **Approval is explicit and recorded.** Search results, publication, component names,
   resemblance, silence, or earlier implementations are never approval. Only registry
   entries with `"status": "approved"` *and* recorded designer evidence may be placed.
4. **No invention.** Never invent component keys, node IDs, variable keys, library keys,
   approval status, modes, revisions, or check results. Unknown = empty + `UNVERIFIED`.
5. **No substitutes.** If a required component, variant, state, binding, import, or
   validation capability is missing, stop the affected work and report a blocker. Do not
   draw look-alike controls from primitives, detach instances, clone main components, or
   recolor with literals. A placeholder is allowed only if the designer explicitly
   approves it for that slot; it must be visibly labeled
   `PLACEHOLDER — not a DS component` and reported as a gap, never as compliant.
   **Missing component properties are limitations, not obstacles to work around.** If a
   component exposes no property for something the flow needs (e.g. Badge has no TEXT
   property, so its label cannot be overridden), record it as a limitation
   (`UNVERIFIED` / gap) and report it. Never detach the instance, edit its internal
   layers, or swap in another component to achieve it unless the designer explicitly
   approves that exact workaround for that exact node.
6. **No code or repo side effects.** This skill does not write application code,
   components, showcase, tokens, or native packages, and does not run
   `npm run sync|build|showcase|watch|build:*`. The only repository file it may create or
   edit is the registry file, at a path the designer approved, with explicit permission
   (Step 3). Never edit `tokens/`, `build/`, `showcase/`, `packages/`, `Sources/`,
   `android/`, `scripts/`, or unrelated files. No commit, push, or publish.
7. **Honest status.** Use `PASS` only with performed checks and inspected evidence;
   `FAIL` for evidence of a violation; `UNVERIFIED` for anything missing, stale,
   inaccessible, or not run. Keep the three separate: never merge them into one verdict
   per area, never relabel UNVERIFIED as PASS because it "probably works", and never
   report a capability as PASS unless it was exercised in this run (or a recorded run
   whose library timestamps still match). A stored prototype link is not proof that
   playback works; a write script's own self-report is not proof — see rule 11.
   Overall = FAIL if any FAIL; else UNVERIFIED if any UNVERIFIED; else PASS. Designer
   approval is recorded separately and never upgrades missing evidence to PASS.
8. **Real Figma property names only.** `get_design_context` returns code-normalized names
   (`label`, `left`, `showIcon`). The actual properties are keys in the owning component
   set's `componentPropertyDefinitions`, e.g. `Label#2022:15` (TEXT),
   `Left ⤵︎#27:0` (BOOLEAN, contains U+FE0E), `Show Icon#7056:0` (BOOLEAN). VARIANT keys
   have no `#id` (`property`, `size`, `State`). Use the exact key strings in
   `setProperties`, in the registry, and in reports. Never derive keys from
   `get_design_context`; if the key has not been read from the imported set, the property
   is `UNVERIFIED`. When comparing names, strip variation selectors (`U+FE0E/U+FE0F`)
   only for matching — still write the exact key.
9. **Load fonts before touching instances or text.** Before inserting (`appendChild` /
   `insertChild`), moving, re-parenting, cloning, changing variants, or setting TEXT
   properties of an instance, load every font its text uses
   (`getStyledTextSegments(['fontName'])` on each TEXT node → `figma.loadFontAsync`), and
   reload after a variant change. Silknet components use Noto Sans Georgian (observed:
   Medium, SemiBold). Record each font's availability (`listAvailableFontsAsync`) and load
   result; an unloaded/unavailable font is `FAIL`, not a reason to substitute a font.
10. **Stay inside the container.** Every generated frame must lie fully within its parent
    container's bounds (section, screen, or Auto Layout parent) with no unintended
    overlap or overflow. Size sections/screens to their content plus margins after
    placing children; never place children by fixed offsets without checking the
    parent's size.
11. **Independent read-only audit.** After generating or modifying anything (screens,
    flows, capability tests, fixes), run a separate read-only `use_figma` audit on the
    target (`references/validation-audit.md`) and report from **its** output, not from
    the write script's return value.
12. **Preserve what is linked.** Generation and fixes must keep real library instance
    links (`remote: true`, expected set key), selected variants, semantic variable
    bindings, applied text/effect styles, explicit variable modes, and prototype
    reactions. Any operation that would break one of these is a `FAIL` and must not be
    used as a fix. Layout fixes change only position/size of frames and containers.
    Component instances keep their native sizing; the only sizing change allowed on an
    instance is horizontal `FILL` where the entry's `layout` rule is `approved` (Step 3,
    V15). Never resize an instance to an arbitrary width or height.

Prerequisite skills (Figma plugin rules): load `figma:figma-design-to-code` before any
`get_design_context` call; load `figma:figma-use` **and** `figma:figma-generate-design`
before any mutating `use_figma` call (both names in `skillNames`); load
`figma:figma-create-new-file` before `create_new_file`. Call `create_session` once per run
with the target key as soon as it is known (use the source key for read-only discovery
before that) and pass the session ID on every file tool call.

---

## Step 1 — Preflight and scope

1. Read `CLAUDE.md`. Confirm the governance section is present; if not, stop and report.
2. `whoami` — record account and plans (needed for `create_new_file`). Report access issues.
3. `get_libraries` on the source — record the Silknet New DS **library key** as observed
   this run (do not reuse a remembered value without re-checking). Every
   `search_design_system` call passes `includeLibraryKeys: [<that key>]`; other team
   libraries (e.g. "Components", "Silknet B-Care", "Iconography") contain look-alikes.
4. Establish scope from the brief: user goal, actors, entry points, happy path,
   alternate/error/recovery paths, required states (empty, loading, success, error,
   disabled), viewport(s), theme mode(s), prototype requirements, acceptance criteria.
   Ask only about decisions that materially change the result; label assumptions
   `ASSUMPTION` and get them confirmed in Gate B.

## Step 2 — Gate A: target file

- If the brief gave a Figma URL, parse the key (`/design/:key/…`; branch URLs use the
  branch key). If key == source key → refuse and ask for another file.
- If no target exists: propose a file name and location (drafts or a project) and wait
  for explicit approval before `create_new_file`. If the user has several plans, ask which.
- Ask for (or propose and get approval of) the **output page name** and frame naming
  prefix for this task. Do not touch other pages or frames.
- Record: source key, target key + URL, page, naming prefix, approval quote + timestamp.
- Until Gate A passes, only read-only discovery is allowed.
- Edit access cannot be verified read-only. The first approved write (Step 5) is the
  probe. If it fails with `Can't call "<api>" in read-only mode` while
  `figma.editorType === "figma"`, the connected account cannot edit that file (verified
  2026-10-21: same session/tools wrote normally to an editable file). Stop, report it as
  a permission blocker, and ask the designer to grant edit access or approve another
  target — never fall back to the source or to a different file on your own.

## Step 3 — Approved-component registry

1. **Load** `design-governance/component-registry.json` (the project registry; another
   path only if the designer names one). Parse it; if it is missing or invalid JSON, stop
   and report. Check `source.fileKey === "ymEnGYUGvRRVKhHiUSGMVF"` and that
   `source.libraryKey` equals the key `get_libraries` returns this run — a mismatch
   blocks the run. Process for changing the registry: `design-governance/README.md`.
2. **If none exists:** show `templates/component-registry.template.json`. Ask whether to
   create the file at the approved path. Create it only with an explicit yes; otherwise
   keep the proposed registry in the conversation/handoff only.

**Enforcement — reject (blocker in Gate B, `FAIL` in the audit):**

| Asset | Rejected when |
|---|---|
| Component | no entry; `status ≠ "approved"`; `approval.quote` empty; key differs from a fresh scoped search; library `updatedAt` newer than `libraryUpdatedAt` (until re-inspected) |
| Variant | value not in the entry's `variants` (an **empty** `variants` map approves nothing); value not in `variantOptions`; the full combination does not exist as a variant name in the imported set; the entry has a non-empty `variantCombinations` and the full variant name is not in it |
| Property | key not in the entry's `properties` (exact key, rule 8) **and** its value differs from the component default (an unapproved property left at its default is not an override); value outside its `allowed`; INSTANCE_SWAP target not in `instanceSwapAllowed` |
| Nested | the entry has `nestedDependencies` for the placed variant and a built-in nested instance does not match it (different component or variant, any override, an unlisted nested instance, a listed dependency missing, or a `mustRemainHidden` dependency that is visible); without `nestedDependencies`, any override on a built-in nested instance |
| Slot content | the host entry has a `slots` rule for the slot (matched by slot path, never by child node IDs) and a child is neither its `defaultContent` at that position (same key and variant, no overrides) nor an allowed replacement (`allowReplacement`, own `approved` entry listed in `allowedContent`, within that entry's variants, `variantCombinations` and properties); content changed or removed when replacement is not allowed; outside `minChildren` / `maxChildren`; a non-instance child; untouched content that differs from `defaultContent` (stale rule); any override on slot content other than property values and layer name. Without a rule: the instance has no `approved` entry of its own or is outside that entry's scope; the slot reports `limitViolations`. Slot content is audited recursively against its own entry (its nested dependencies, slots and slot hosts); a visible slot inside slot content without a rule of its own is rejected |
| Slot host | the instance that owns an edited slot carries a `componentProperties` override that is not explained by approved slot content: the host is not a listed nested dependency, has other overridden fields or problems, has a non-`SLOT` property changed (swap or edit), or owns a slot without a rule or with a slot/content problem |
| Empty slot / placeholder | a visible `SLOT` reports `limitViolations` (e.g. empty below its minimum); any visible fill bound to a `Pink/*` placeholder variable. A slot hidden by its host's own property (e.g. `Slot#8218:12 = false`) is not checked |
| Variable | key not in `variables` with `status: "approved"` + approval quote; the binding (node type + property, and `layoutMode` where listed) is not in the entry's `approvedUsage` — declared `scopes` alone never authorize a use; an explicit mode selection that the approval does not cover |
| Style | key not in `styles` with `status: "approved"` + approval quote; wrong `styleType`; node type / property not in the entry's `approvedUsage` |
| Sizing (r8) | an explicit resize — the instance's sizing mode differs from its variant's, or a `FIXED` axis differs from the variant **and** that dimension is overridden (size changes from text, properties or Auto Layout on a `HUG` axis are not resizes); horizontal `FILL` unless the entry's `layout.status` is `"approved"`, the variant is in `layout.fill.variantCombinations` and the parent matches a `layout.fill.contexts` entry (vertical Auto Layout `FRAME`, no wrap, listed cross-axis alignment, child not absolute); any vertical sizing other than native; `min/max` width or height; rotation. A `FIXED` change without override evidence, a stale `nativeByVariant` or a parent width outside `testedInnerWidth` is `UNVERIFIED`, not a rejection |
| Own overrides (r8) | a field overridden on the instance itself other than `name`, `width`, `height`, `componentProperties`, or — with approved `FILL` — `layout.fill.extraOverrideFields` |
| Content constraint (r8) | a placed text breaks the entry's `contentConstraints` rule for that variant (`SINGLE_LINE`, `MAX_LINES`, `FIT_CONTAINER`). This is a **visual defect**, reported separately from compliance (`COMPLIANT_WITH_VISUAL_DEFECTS`); there are no character limits. Pick shorter approved text or report the limitation — never resize, detach or edit internals to make text fit |

`proposed`, `deprecated`, and `blocked` entries are never placed; a `deprecated` entry's
`replacedBy` must itself be approved.

**Non-blocking unknowns (reported as `UNVERIFIED`, never a reason to reject):**
`requiredBindings` keys (internal to the component), `sourceNodeId` /
`identityLink: "unverified"` (unless the designer requires node-level proof for that
flow), fonts of variants not yet exercised (they are loaded and checked at placement,
rule 9), `collectionModes` not read directly. An unknown optional field on one entry
never blocks other approved entries or other verified functionality.
3. **Discovery (read-only, source):** for each component the flow needs,
   `search_design_system` (scoped). From each hit record `assetType`,
   `componentSetKey`/`componentKey`, `updatedAt`, `filePath`. Inspect the source node
   with `get_metadata` (variant matrix), `get_design_context` + `get_variable_defs`
   (bindings, properties) and `get_screenshot`. Variables and styles likewise
   (`key`, collection, scopes). Prefer the semantic **Tokens** collection; do not bind
   **Primitives** unless an approved exception says so.
   Treat `get_design_context` property names as hints only (rule 8). Record exact
   property keys and variant options **only** after reading
   `componentPropertyDefinitions` from the set imported into the target (Step 5 stage 1);
   until then the registry's `properties` stay empty and listed under `unverified`.
   Record the full variant option lists from the imported set, not just the variants you
   happened to inspect in the source.
4. Write discovered candidates as `"status": "proposed"` with evidence. Fields you could
   not observe stay empty and are listed under `unverified`. Known limitation: no
   read-only tool returns both an import key and the source node ID for the same asset —
   the key↔node link stays `UNVERIFIED` until the designer confirms it.
5. Present the proposed set, allowed variants/overrides, and gaps. Only entries the
   designer explicitly approves (quote recorded per entry) become `approved`.
   Never widen an entry's allowed variants or overrides without a new approval.
6. Revalidate before reuse: if a hit's `updatedAt` is newer than the entry's
   `inspectedAt`, mark the entry `UNVERIFIED` and re-inspect before use.

## Step 4 — Gate B: screen map and component mapping

Fill `templates/screen-map.template.md`: screens, states, actions → destinations,
prototype links (if in scope), and for every UI element the registry entry ID, variant
values, text overrides, and token bindings. List blockers (missing components/states,
unapproved entries, missing bindings) explicitly. Present it and **wait for designer
approval**. Do not generate anything until approved; record the approval quote.
If required elements are blocked, ask whether to (a) wait for a library change,
(b) drop/defer the affected screen, or (c) approve a labeled placeholder for that slot.

## Step 5 — Gate C: capability test

Generation requires PASS evidence, in the approved target environment, for: destination
assertion, import by key, instance creation, variant/text property setting, variable
binding, text-style application, required fonts, required modes, and (if prototypes are
in scope) reactions. If no such evidence exists from this run (or a recorded earlier run
whose library timestamps still match), follow `references/capability-test.md` — **only
after the designer explicitly approves the test operations and their location**.
The test runs in two stages with a hard gate between them:
**Stage 1** imports each component, proves provenance, and places linked instances;
**Stage 2** (variants, text, tokens, styles, modes, prototype) runs only if every Stage 1
check is PASS and the designer approves it. Any FAIL → stop and report the blocker. Any
UNVERIFIED that a screen depends on → do not generate that screen. If a failed script
leaves nodes behind (e.g. an instance created before a later step threw), find them with
a read-only audit, report their IDs, and clean up only with approval and only those IDs.

## Step 6 — Generate one screen at a time

For each approved screen, in plan order:

1. One `use_figma` call (or a few retry-safe calls) that:
   - asserts `figma.fileKey === TARGET_KEY`, switches to the approved page once;
   - creates the screen frame named `<prefix>/<screen name>` with Auto Layout
     (`figma.createAutoLayout`), positioned clear of existing content;
   - imports each component by its **registry key** (`importComponentSetByKeyAsync` /
     `importComponentByKeyAsync`), creates instances, and applies only approved
     properties via `setProperties` using the **exact** keys from the owning component
     set's `componentPropertyDefinitions` (rule 8; TEXT/BOOLEAN/INSTANCE_SWAP keys carry
     `#id`), after checking each value is in that set's `variantOptions` **and** that the
     full target combination exists as a variant name in `set.children` (not every axis
     combination exists — e.g. Button has 68 of 80); a missing combination is a `FAIL`
     for that element, never a nearest-match substitute; when the registry entry has a
     non-empty `variantCombinations`, the resolved variant name must also be in that list;
   - loads every font used by an instance before inserting, moving, cloning, or changing
     it, and again after variant changes (rule 9);
   - binds structural frame fills/strokes/padding/gaps/radii to approved semantic
     variables (`importVariableByKeyAsync` + `setBoundVariable` /
     `setBoundVariableForPaint`); applies approved text/effect styles by key;
   - sets the approved variable mode on the screen frame if a mode is in scope;
   - places every frame fully inside its parent and sizes containers to content plus
     margins (rule 10);
   - keeps every instance at its native size; sets `layoutSizingHorizontal = "FILL"` only
     when the entry's `layout.status` is `"approved"` and the variant and parent context are
     listed in its `layout.fill` (Step 3, Sizing). A native instance wider than its
     container is a visual defect to report, not something to fix by resizing; generated
     container frames may use `FILL` (layout-only, rule 12);
   - never detaches, never edits main components, never edits nested layers outside
     approved overrides, never uses literal colors/sizes where a token exists;
   - never changes built-in nested instances (variant, swap, visibility or any other
     override) and leaves unapproved properties at their defaults; fills a `SLOT` only by
     appending instances of `approved` entries (never via `setProperties`), within that
     entry's own approved variants and properties, and only where the host entry has a
     `slots` rule that allows the replacement; never leaves a visible slot empty or a
     `Pink/*` placeholder visible — an unused slot is hidden with its host's own approved
     property instead;
   - returns every created/mutated node ID and a component-usage list.
2. Run Step 7 validation on that screen — a **separate read-only audit** (rule 11).
   Repair FAILs within scope without breaking anything rule 12 protects, then re-audit.
3. Report the screen (link `https://www.figma.com/design/<TARGET_KEY>?node-id=<id>`,
   results) and **stop for designer review** before the next screen.

## Step 7 — Validate each screen

Run the read-only audit in `references/validation-audit.md` **on the target only**, then
one `get_screenshot` of the screen. Use `AUDIT_MODE = "compliance"` for screens and flows:
intentionally non-compliant fixture sections (`EXCLUDED_ROOTS`, e.g. `43:206`) never count
toward compliance. Audit a fixture only explicitly (`negative-regression`), and the whole
Playground only when the designer asks for it (`full`, fixtures reported apart). Record per check: method, evidence (node IDs /
output), result, remediation. Mandatory checks:

| # | Check | Evidence source |
|---|---|---|
| V1 | Writes landed only in the target file/page; source untouched | `figma.fileKey`, page id in write result; no write calls issued to the source key |
| V2 | Every component instance is remote, non-detached, from an approved registry entry (by key) | audit: `mainComponent.remote`, `key`/set `key`, `detachedInfo` |
| V3 | Variant/property values are within the entry's allowed values | audit: `componentProperties` vs registry |
| V4 | Structural frames use Auto Layout; no absolute-positioned controls | audit: `layoutMode`, `layoutPositioning` |
| V5 | Fills/strokes/spacing on generated frames are bound to approved variables; no unapproved literals | audit: `boundVariables`, literal-paint list |
| V6 | Text uses approved styles / component text properties | audit: `textStyleId`, instance text props |
| V7 | No clipping/overlap/broken wrapping at the specified size(s) | screenshot + audit bounds |
| V8 | Screen/state/navigation coverage vs the approved map | map vs created frames; reactions if in scope |
| V9 | Accessibility | contrast computed from resolved values where possible; focus / screen-reader = designer review → UNVERIFIED until reviewed |
| V10 | No code generation, repo mutation, source write, or publish occurred | your own tool-call log this run |
| V11 | Every generated frame is fully inside its parent container; no unintended overlap or overflow | audit: `absoluteBoundingBox` of each frame vs parent, pairwise overlap |
| V12 | Fonts used by placed instances/text were available and loaded | write-call font report + audit `fontName` read-back |
| V13 | Linked state preserved after every modification (links, variants, bindings, styles, modes, reactions) | audit read-back compared with the previous audit |
| V14 | Results come from an independent read-only audit, not the write script | separate `use_figma` read call output |
| V15 | Instance sizing is native or approved `FILL` in a tested context; no explicit resize | audit: `sizing`, `sizingViolations`, `sizingUnverified` |
| V16 | No overrides on the instance itself beyond name, size and (with `FILL`) the listed extra fields | audit: `selfOverrideViolations` |
| V17 | Visible text stays inside its containers; possible cut-off is reviewed on the screenshot | audit: `textOverflow`, `possibleTruncation` |
| V18 | Component-specific content constraints hold | audit: `contentConstraintViolations`, `contentConstraintUnverified` |
| V19 | Prototype playback (if in scope) | designer presents the prototype → UNVERIFIED until done; a stored reaction alone is PASS only for "link stored" |

V11 also covers the content box: `layoutContainment` lists nodes outside their Auto Layout
parent's padding, with native and available width. Report the audit's two results
separately — `compliance` (V2–V6, V15, V16) and `visualIntegrity` (V11, V17, V18) — with its
`resultClass`. `COMPLIANT_WITH_VISUAL_DEFECTS` (listed in
`technicallyCompliantButVisuallyDefective`) is a FAIL for the screen, never a PASS.

A screenshot never proves provenance or bindings; structure never proves visual quality.

## Step 8 — Handoff

Fill `templates/handoff-report.template.md` and present it: target link(s) and node IDs,
registry path + revision, components used (usage manifest), missing components and
gaps, component limitations (properties not exposed), per-check PASS/FAIL/UNVERIFIED
with evidence taken from the independent audit, overall result, pending designer
decisions, exceptions with approvals, and an explicit statement that no code was
generated and no repository file other than the approved registry was touched.
Never call the flow complete, compliant, or implementation-ready while any mandatory
check is FAIL or UNVERIFIED. Implementation is a separate, explicitly approved task.

## Recovery

If a write goes to the wrong file/page or changes protected content: stop all writes,
report exactly what changed (IDs), and reverse only when the reversal is known to be safe
and the designer approves it. Never delete unrelated content to hide an error.

## Validated findings (capability test, 2026-10-21)

Recorded from an approved test in target `zzGuTpXzrcglX1zlOd4IuR` with Silknet New DS
`button` (`7c3e71bf0a0ffba71efbf997fa41e4dd986065d0`) and `Badge`
(`4365e8336baa34d805885823c67f57a10f7d78a0`). Re-verify before relying on them — they are
evidence for that run, not permanent facts.

| Finding | Status then | Consequence for this skill |
|---|---|---|
| Import by key + linked instances (`remote: true`, set key match) | PASS | Allowed path for placing components |
| Variant change via `setProperties` with values from `variantOptions` | PASS | Rule 8, Step 6 |
| Button text via `Label#2022:15` | PASS | Use exact keys (rule 8) |
| Badge exposes no TEXT property | UNVERIFIED by design | Limitation; no internal-layer edits (rule 5) |
| `get_design_context` names (`label`, `left`, `showIcon`) ≠ real keys | caused a FAIL | Rule 8 |
| Placing instances without loading Noto Sans Georgian Medium/SemiBold | caused a FAIL | Rule 9 |
| Semantic color (`Background/surface`, `Text/default`) + spacing (`Digits/spacing/4` on gap **and** padding) bindings | PASS | Bind containers to Tokens |
| Text style `Subtitle/Subtitle 2` | PASS | Apply library text styles by key |
| `Tokens` collection modes `Light` / `Dark`; explicit Dark on a frame | PASS | Mode per frame |
| Prototype reaction stored (ON_CLICK → NAVIGATE) | PASS (stored) / UNVERIFIED (playback) | V19 |
| Frame placed by fixed offset outside its section | caused a FAIL | Rule 10, V11 |
| `read-only mode` error on a file the account could not edit | permission blocker | Gate A note |

## Validated findings (layout capability test, 2026-10-26)

Recorded in target `zzGuTpXzrcglX1zlOd4IuR`, page `🧪 r8 layout capability` (`100:1240`,
section `100:1241`, kept as permanent evidence), for `ds.button`, `ds.divider`,
`ds.navigation-header`, `ds.list-item` and `ds.input` at 320 / 393 / 430 px. Registry r8 records
them as `layout` rules with status `proposed` — no `FILL` permission is active until the designer
approves a rule.

| Finding | Status then | Consequence for this skill |
|---|---|---|
| Horizontal `FILL` in a vertical Auto Layout frame keeps the library link, key, variant and properties | PASS | `FILL` can become an approved sizing option per entry (V15) |
| `FILL` records `width`/`height` overrides (Button also `primaryAxisSizingMode`) | PASS (recorded) | Size overrides are not evidence of resizing on their own (V15, V16) |
| Text, property and Auto Layout changes also record `width`/`height` overrides | PASS (recorded) | Classify by sizing mode and variant geometry, not by override fields |
| Native widths (390 header, 358 list-item / Input) overflow a 320 px screen | caused FAILs | V11 content box; `FILL` is needed for narrow screens once approved |
| Long Input value wraps out of the fixed-height field; long Button label overflows at 288 | caused FAILs | V18 constraints `C-INPUT-TEXT-1L` (DS-01), `C-BTN-LABEL-1L` |
| Long header title is cut off with an ellipsis at 2 lines | visual defect / UNVERIFIED | V17 `possibleTruncation`, `C-NAV-TITLE-2L` |
