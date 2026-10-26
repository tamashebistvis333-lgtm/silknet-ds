# Isolated Figma capability test (Gate C)

Validated procedure. A run on 2026-10-21 (target `zzGuTpXzrcglX1zlOd4IuR`, Silknet New DS
`button` + `Badge`) exposed four failure modes that are now built into this procedure:
code-normalized property names, unloaded fonts, a frame placed outside its section, and a
target the account could not edit. See SKILL.md › "Validated findings".

**Do not run without explicit designer approval** of all of the following, quoted in the
conversation:

1. The **test location**: the approved target file + a dedicated page (default
   `🧪 Capability test`), or a separate throwaway file (creating it is its own approval).
2. The **test operations** below, **per stage**. Stage 2 needs its own approval after the
   Stage 1 report.
3. The **test assets**: component set keys, variant values to switch to, colour / text-
   colour / spacing variable keys, text style key, variable mode name. Take them from
   scoped `search_design_system` results, the registry, or token-export metadata
   (`$extensions["com.figma.modeName"]`). Never invent them. A test asset does not need
   registry `approved` status — the test proves capability, not approval. Test nodes are
   never part of a flow.

Never run any part of this against `ymEnGYUGvRRVKhHiUSGMVF`. Load `figma:figma-use` and
`figma:figma-generate-design` before every mutating `use_figma` call.

## Checks

| ID | Stage | Capability | PASS evidence |
|---|---|---|---|
| T0 | 1 | Destination + write access | `figma.fileKey === TARGET_KEY`; the first write (page/section creation) succeeds |
| T1.<c> | 1 | Import component set by key | `type === 'COMPONENT_SET'`, `remote === true` |
| P.<c> | 1 | Provenance | key and name match; expected variant axes present; expected non-variant properties present **by real Figma name** (rule 8); every source-confirmed variant name present; exact variant count where known |
| F.<c> | 1 | Fonts | every font used by the instance's text is in `listAvailableFontsAsync()` and `loadFontAsync` succeeds |
| T2.<c> | 1 | Linked instance placed | instance inside the test frame; main component `remote === true`; parent set key matches |
| C1 | 1 | Containment | test frames fully inside the section (rule 10) |
| T3.<c>.variant | 2 | Variant change | target values are in the set's `variantOptions`; read-back matches; still remote, same set key |
| T3.<c>.text | 2 | Text override | via an exposed TEXT property (exact key); read-back matches. No TEXT property → `UNVERIFIED` (limitation), never an internal-layer edit |
| T4 / T4b | 2 | Semantic colour | frame fill / text fill `boundVariables.color` = expected variable |
| T5 / T5b | 2 | Semantic spacing | `itemSpacing` / all four paddings bound to the expected variable |
| T6 | 2 | Text style | `textStyleId` = imported library style; its font available and loaded |
| T7 | 2 | Mode | `explicitVariableModes[collectionId]` = expected mode ID; collection mode names recorded |
| T8 | 2 | Prototype link stored | `reactions[0].actions[0].destinationId` = frame B. **Playback stays UNVERIFIED** until the designer presents it |
| T9 | 2 | Integrity | every top-level instance still remote with an expected set key; no `detachedInfo` anywhere |
| C2 | 2 | Containment after stage 2 | all frames fully inside the section, no overlap |
| A | 1 + 2 | Independent audit | a **separate read-only** `use_figma` call (`validation-audit.md`) confirms every PASS above |
| T10 | 2 | Visual | screenshot judged by you; never auto-PASS |

Any check that throws or reads back a mismatch is `FAIL` with the error recorded. Anything
skipped or not observable is `UNVERIFIED`. Report every row; never merge rows.

## Stage 1 script

Fill `COMPONENTS` from discovery. `expectedOtherProps` must use **real Figma property
names**. If they are not yet known (first run), leave the lists empty and record the names
from `evidence.otherProps` — the provenance check then rests on key, name, axes and variant
names, and the property names become known for the registry.

```js
const TARGET_KEY = "<approved target key>";
const TEST_PAGE_NAME = "🧪 Capability test";
const MARGIN = 40, GAP = 40;
const norm = s => s.replace(/[︎️]/g, "").trim();
const COMPONENTS = [
  // { label: "button", setKey: "<componentSetKey>", expectedSetName: "button",
  //   expectedVariantAxes: ["property", "size", "State"],
  //   expectedOtherProps: { TEXT: ["Label"], BOOLEAN: ["Left ⤵︎", "Right ⤵︎"], INSTANCE_SWAP: ["Left icon", "Right icon"] },
  //   mustContainVariants: ["property=primary, size=medium, State=default"],   // names observed via get_metadata on the source
  //   exactVariantCount: null },
];

const results = {}; const created = []; const instanceIds = {};
const pass = (id, ev) => (results[id] = { result: "PASS", evidence: ev });
const fail = (id, e) => (results[id] = { result: "FAIL", evidence: typeof e === "string" ? e : String((e && e.message) || JSON.stringify(e)) });
const unv = (id, why) => (results[id] = { result: "UNVERIFIED", evidence: why });

if (figma.fileKey !== TARGET_KEY) throw new Error(`Wrong file ${figma.fileKey}`);
let page = figma.root.children.find(p => p.name === TEST_PAGE_NAME);
if (!page) { page = figma.createPage(); page.name = TEST_PAGE_NAME; created.push(page.id); } // first write = edit-access probe
await figma.setCurrentPageAsync(page);
pass("T0", { fileKey: figma.fileKey, page: page.id });

const section = figma.createSection();
section.name = `Capability test ${new Date().toISOString()}`;
section.x = page.children.reduce((m, n) => (n === section ? m : Math.max(m, n.x + n.width)), 0) + 200;
section.y = 0; created.push(section.id);
const frameA = figma.createAutoLayout("VERTICAL", { name: "Test A" });
section.appendChild(frameA); frameA.x = MARGIN; frameA.y = MARGIN; created.push(frameA.id);

const available = await figma.listAvailableFontsAsync();
for (const c of COMPONENTS) {
  const [t1, p, f, t2] = [`T1.${c.label}`, `P.${c.label}`, `F.${c.label}`, `T2.${c.label}`];
  let set;
  try {
    set = await figma.importComponentSetByKeyAsync(c.setKey);
    if (set.type !== "COMPONENT_SET") throw new Error(`type ${set.type}`);
    pass(t1, { name: set.name, key: set.key, remote: set.remote });
  } catch (e) { fail(t1, e); [p, f, t2].forEach(id => unv(id, "import failed")); continue; }

  const defs = set.componentPropertyDefinitions;
  const axes = Object.keys(defs).filter(k => defs[k].type === "VARIANT");
  const names = set.children.map(ch => ch.name);
  const problems = [];
  if (set.remote !== true) problems.push("not remote");
  if (set.key !== c.setKey) problems.push(`key ${set.key}`);
  if (set.name !== c.expectedSetName) problems.push(`name ${set.name}`);
  for (const a of c.expectedVariantAxes) if (!axes.includes(a)) problems.push(`missing axis ${a}`);
  for (const [type, list] of Object.entries(c.expectedOtherProps || {}))
    for (const n of list) if (!Object.keys(defs).some(k => norm(k.split("#")[0]) === norm(n) && defs[k].type === type)) problems.push(`missing ${type} ${n}`);
  const missing = (c.mustContainVariants || []).filter(v => !names.includes(v));
  if (missing.length) problems.push(`variants not found ${JSON.stringify(missing)}`);
  if (c.exactVariantCount != null && names.length !== c.exactVariantCount) problems.push(`count ${names.length}`);
  const evidence = { key: set.key, remote: set.remote, name: set.name, variantCount: names.length,
    axes: Object.fromEntries(axes.map(a => [a, defs[a].variantOptions])),
    otherProps: Object.fromEntries(Object.entries(defs).filter(([, d]) => d.type !== "VARIANT").map(([k, d]) => [k, d.type])) };
  problems.length ? fail(p, { problems, evidence }) : pass(p, evidence);

  let inst = null;
  try {
    inst = set.defaultVariant.createInstance(); created.push(inst.id);
    const fonts = new Map();
    for (const t of inst.findAllWithCriteria({ types: ["TEXT"] }))
      for (const s of t.getStyledTextSegments(["fontName"])) fonts.set(`${s.fontName.family}|${s.fontName.style}`, s.fontName);
    const fr = [];
    for (const fn of fonts.values()) {
      const ok = available.some(a => a.fontName.family === fn.family && a.fontName.style === fn.style);
      let loaded = false, err = null;
      try { await figma.loadFontAsync(fn); loaded = true; } catch (e) { err = String(e && e.message); }
      fr.push({ ...fn, available: ok, loaded, err });
    }
    fr.length && fr.every(x => x.available && x.loaded) ? pass(f, fr) : fail(f, fr.length ? fr : "no text fonts found");
    frameA.appendChild(inst);
    const main = await inst.getMainComponentAsync();
    const ok = main && main.remote === true && main.parent && main.parent.key === c.setKey && inst.parent.id === frameA.id;
    if (ok) { pass(t2, { instance: inst.id, main: main.name }); instanceIds[c.label] = inst.id; }
    else fail(t2, "not a remote variant of the expected set, or not inside Test A");
  } catch (e) {
    fail(t2, e);
    if (inst && !inst.removed && inst.parent && inst.parent.id === page.id) results[t2].orphan = inst.id; // report; clean up only with approval
  }
}

// Size the section to its content (rule 10), then check containment.
section.resizeWithoutConstraints(frameA.x + frameA.width + MARGIN, frameA.y + frameA.height + MARGIN);
const inside = (n, p) => { const a = n.absoluteBoundingBox, b = p.absoluteBoundingBox;
  return a.x >= b.x && a.y >= b.y && a.x + a.width <= b.x + b.width && a.y + a.height <= b.y + b.height; };
inside(frameA, section) ? pass("C1", { section: section.id }) : fail("C1", "Test A outside section");

const stage1AllPass = Object.values(results).every(r => r.result === "PASS");
return { stage1AllPass, createdNodeIds: created, pageId: page.id, sectionId: section.id, frameA: frameA.id, instanceIds, results };
```

After it returns: run the independent audit (`validation-audit.md`) on the section, and
report Stage 1. **Stop.** Stage 2 needs `stage1AllPass === true` *and* designer approval.

## Stage 2 script

Reuses Stage 1 nodes (IDs as literals). Places frame B **beside** frame A and re-sizes the
section, so nothing overflows.

```js
const TARGET_KEY = "<approved target key>";
const SECTION_ID = "<stage 1>", FRAME_A_ID = "<stage 1>";
const INSTANCE_IDS = { /* label: "<stage 1 instance id>" */ };
const SET_KEYS = { /* label: "<componentSetKey>" */ };
const VARIANT_CHANGES = { /* label: { "<axis>": "<value from variantOptions>" } */ };
const TEXT_VALUE = "<test text>";
const COLOR_VAR_KEY = "<Tokens colour for frame fill>", TEXT_COLOR_VAR_KEY = "<Tokens text colour>";
const SPACING_VAR_KEY = "<Tokens spacing with GAP scope>", TEXT_STYLE_KEY = "<text style key>";
const MODE_NAME = "<mode name>";
const MARGIN = 40, GAP = 40;

const results = {}; const created = [];
const pass = (id, ev) => (results[id] = { result: "PASS", evidence: ev });
const fail = (id, e) => (results[id] = { result: "FAIL", evidence: typeof e === "string" ? e : String((e && e.message) || JSON.stringify(e)) });
const unv = (id, why) => (results[id] = { result: "UNVERIFIED", evidence: why });
async function loadFonts(node) {   // rule 9 — call before insert/move/clone/variant/text changes
  const seen = new Set();
  for (const t of node.findAllWithCriteria({ types: ["TEXT"] }))
    for (const s of t.getStyledTextSegments(["fontName"])) {
      const k = `${s.fontName.family}|${s.fontName.style}`;
      if (!seen.has(k)) { seen.add(k); await figma.loadFontAsync(s.fontName); }
    }
}

if (figma.fileKey !== TARGET_KEY) throw new Error(`Wrong file ${figma.fileKey}`);
const section = await figma.getNodeByIdAsync(SECTION_ID), frameA = await figma.getNodeByIdAsync(FRAME_A_ID);
if (!section || !frameA) throw new Error("Stage 1 nodes not found");
let pg = section; while (pg.type !== "PAGE") pg = pg.parent;
await figma.setCurrentPageAsync(pg);

const instances = {};
for (const label of Object.keys(INSTANCE_IDS)) {
  const [tv, tt] = [`T3.${label}.variant`, `T3.${label}.text`];
  const inst = await figma.getNodeByIdAsync(INSTANCE_IDS[label]);
  if (!inst || inst.type !== "INSTANCE") { fail(tv, "instance missing"); unv(tt, "instance missing"); continue; }
  instances[label] = inst;
  const set = (await inst.getMainComponentAsync()).parent;
  if (!set || set.key !== SET_KEYS[label]) { fail(tv, "set key changed since Stage 1"); unv(tt, "provenance changed"); continue; }
  const defs = set.componentPropertyDefinitions;
  try {
    const want = VARIANT_CHANGES[label] || {};
    const bad = Object.entries(want).filter(([k, v]) => !defs[k] || defs[k].type !== "VARIANT" || !(defs[k].variantOptions || []).includes(v));
    if (bad.length) throw new Error(`not offered by set: ${JSON.stringify(bad)}`);
    await loadFonts(inst); inst.setProperties(want); await loadFonts(inst);
    const after = inst.componentProperties, main = await inst.getMainComponentAsync();
    const mism = Object.entries(want).filter(([k, v]) => !after[k] || after[k].value !== v);
    mism.length ? fail(tv, mism) : pass(tv, { set: want, main: main.name, remote: main.remote });
  } catch (e) { fail(tv, e); }
  try {
    const textKey = Object.keys(defs).find(k => defs[k].type === "TEXT");   // exact key, e.g. "Label#2022:15"
    if (!textKey) unv(tt, "no TEXT property exposed — limitation; internal-layer edits not approved");
    else { await loadFonts(inst); inst.setProperties({ [textKey]: TEXT_VALUE });
      const v = inst.componentProperties[textKey].value; v === TEXT_VALUE ? pass(tt, { property: textKey, value: v }) : fail(tt, `read-back ${v}`); }
  } catch (e) { fail(tt, e); }
}

const bindFill = (node, v) => { node.fills = [figma.variables.setBoundVariableForPaint({ type: "SOLID", color: { r: 1, g: 1, b: 1 } }, "color", v)]; };
let color = null, spacing = null;
try { color = await figma.variables.importVariableByKeyAsync(COLOR_VAR_KEY); bindFill(frameA, color);
  frameA.fills[0].boundVariables.color.id === color.id ? pass("T4", color.name) : fail("T4", "not bound"); } catch (e) { fail("T4", e); }
try { spacing = await figma.variables.importVariableByKeyAsync(SPACING_VAR_KEY); frameA.setBoundVariable("itemSpacing", spacing);
  frameA.boundVariables.itemSpacing.id === spacing.id ? pass("T5", spacing.name) : fail("T5", "not bound"); } catch (e) { fail("T5", e); }
try { const P = ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"]; for (const k of P) frameA.setBoundVariable(k, spacing);
  P.every(k => frameA.boundVariables[k] && frameA.boundVariables[k].id === spacing.id) ? pass("T5b", P) : fail("T5b", "not bound"); } catch (e) { fail("T5b", e); }

let text = null;
try {
  const style = await figma.importStyleByKeyAsync(TEXT_STYLE_KEY);
  const fonts = await figma.listAvailableFontsAsync();
  if (!fonts.some(f => f.fontName.family === style.fontName.family && f.fontName.style === style.fontName.style)) throw new Error(`font unavailable ${JSON.stringify(style.fontName)}`);
  await figma.loadFontAsync(style.fontName);
  text = figma.createText(); await figma.loadFontAsync(text.fontName);
  await text.setTextStyleIdAsync(style.id); text.characters = TEXT_VALUE;
  frameA.appendChild(text); created.push(text.id);
  text.textStyleId === style.id ? pass("T6", { style: style.name, font: style.fontName }) : fail("T6", "style not applied");
} catch (e) { fail("T6", e); }
try { const tc = await figma.variables.importVariableByKeyAsync(TEXT_COLOR_VAR_KEY);
  text.fills = [figma.variables.setBoundVariableForPaint({ type: "SOLID", color: { r: 0, g: 0, b: 0 } }, "color", tc)];
  text.fills[0].boundVariables.color.id === tc.id ? pass("T4b", tc.name) : fail("T4b", "not bound"); } catch (e) { fail("T4b", e); }

// Frame B beside A, inside the section (rule 10)
const frameB = figma.createAutoLayout("VERTICAL", { name: "Test B (mode)" });
section.appendChild(frameB); frameB.x = frameA.x + frameA.width + GAP; frameB.y = frameA.y; created.push(frameB.id);
try {
  const coll = await figma.variables.getVariableCollectionByIdAsync(color.variableCollectionId);
  const mode = coll.modes.find(m => m.name === MODE_NAME);
  if (!mode) throw new Error(`mode "${MODE_NAME}" not found; modes: ${coll.modes.map(m => m.name).join(", ")}`);
  bindFill(frameB, color);
  for (const k of ["itemSpacing", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft"]) frameB.setBoundVariable(k, spacing);
  const first = Object.values(instances)[0];
  if (first) { await loadFonts(first); const copy = first.clone(); frameB.appendChild(copy); created.push(copy.id); }
  frameB.setExplicitVariableModeForCollection(coll, mode.modeId);
  frameB.explicitVariableModes[coll.id] === mode.modeId ? pass("T7", { collection: coll.name, mode: mode.name, modes: coll.modes.map(m => m.name) }) : fail("T7", "mode not set");
} catch (e) { fail("T7", e); }

try { await frameA.setReactionsAsync([{ trigger: { type: "ON_CLICK" }, actions: [{ type: "NODE", destinationId: frameB.id, navigation: "NAVIGATE", transition: null }] }]);
  frameA.reactions[0].actions[0].destinationId === frameB.id ? pass("T8", { from: frameA.id, to: frameB.id }) : fail("T8", "not stored"); } catch (e) { fail("T8", e); }
unv("T8.playback", "stored link only — designer must present the prototype");

// Re-size the section to all content, then containment + integrity
const right = Math.max(...section.children.map(n => n.x + n.width)), bottom = Math.max(...section.children.map(n => n.y + n.height));
section.resizeWithoutConstraints(right + MARGIN, bottom + MARGIN);
const box = n => n.absoluteBoundingBox;
const inside = (a, b) => a.x >= b.x && a.y >= b.y && a.x + a.width <= b.x + b.width && a.y + a.height <= b.y + b.height;
const overlap = (a, b) => !(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y);
inside(box(frameA), box(section)) && inside(box(frameB), box(section)) && !overlap(box(frameA), box(frameB)) ? pass("C2", "inside, no overlap") : fail("C2", "overflow or overlap");

const detached = section.findAllWithCriteria({ types: ["FRAME"] }).filter(f => f.detachedInfo != null).map(f => f.id);
const links = [];
for (const i of section.findAllWithCriteria({ types: ["INSTANCE"] })) { if (i.parent.type === "INSTANCE") continue;
  const m = await i.getMainComponentAsync(); links.push({ id: i.id, remote: m.remote, setKey: m.parent.key }); }
!detached.length && links.every(l => l.remote && Object.values(SET_KEYS).includes(l.setKey)) ? pass("T9", links) : fail("T9", { detached, links });

await section.screenshot();
results.T10 = { result: "UNVERIFIED", evidence: "judge the screenshot" };
return { createdNodeIds: created, frameB: frameB.id, results };
```

## After each stage

- Run the **independent read-only audit** (`validation-audit.md`) on the section and
  report from its output (V14). Confirm links, variants, bindings, styles, modes,
  reactions, and bounds (V11, V13).
- Report every row with its evidence. Judge T10 from the screenshot.
- Leave the test section in place, labelled. Delete only if the designer asks, and only
  the IDs created by the test, after verifying each node's identity first.
- If a script throws (`safeToRetryWithoutCanvasRead: false`), audit the test page
  read-only before anything else, report what exists (including orphaned instances),
  and wait for approval before cleaning up or retrying.
- Record the library `updatedAt` timestamps of the test assets. A later run may reuse
  these results only while those timestamps are unchanged.

## Layout sizing test (r8)

Run only with designer approval of the target, a **new separate page**, and the components /
variants / widths to test. It provides the evidence for a registry `layout` rule (README,
"Sizing rules"). Reference run: 2026-10-26, page `🧪 r8 layout capability` (`100:1240`,
section `100:1241`), kept as permanent evidence.

1. One write call: assert the target, create the page and a section, and one vertical Auto
   Layout frame per viewport width (e.g. 320 / 393 / 430) with groups bound to approved spacing
   variables. Validate every import, variant name and property key **before** creating anything.
2. Per component and variant: one native instance, one `FILL` instance, and one `FILL`
   instance with long text in each TEXT property that matters (use the product language). Use
   only approved variants and properties; fill slots only with approved replacements.
3. Record per instance, before and after `layoutSizingHorizontal = "FILL"`: component key and
   variant, `remote`, `layoutSizingHorizontal/Vertical`, width/height vs the variant's own size,
   parent inner width, the instance's own `overrides` fields, nested overrides,
   `componentProperties` (must be unchanged), slot contents, and text layers that leave their
   containers.
4. Register the section as an evidence root in `EXCLUDED_ROOTS` (`validation-audit.md`), run
   the independent audit on it in `negative-regression` mode, take one screenshot per
   viewport, and re-hash existing pages for preservation.
5. Report per component: `FILL` accepted, link intact, own-override fields added, long-text
   behaviour, native fit per width. Draft the `layout` rule as `proposed` and list everything
   not exercised under `layout.verification.UNVERIFIED`.
