# Isolated Figma capability test (Gate C)

**Do not run without explicit designer approval** of all of the following, quoted in the
conversation:

1. The **test location**: the approved target file + a dedicated page/section name
   (default `🧪 Capability test`), or a separate throwaway file (creating it is its own
   approval).
2. The **test operations** listed below.
3. The **test assets**: which component key, color variable key, spacing variable key,
   text style key, and variable collection/mode to use. Take them from scoped
   `search_design_system` results or the registry. Never invent them. A test asset does
   not need registry `approved` status, because the test proves capability, not approval.
   Test nodes are never part of a flow.

Never run this against `ymEnGYUGvRRVKhHiUSGMVF`. Load `figma:figma-use` (and
`figma:figma-generate-design`, since the test mutates the canvas) before calling `use_figma`.

## What it proves

| ID | Capability | PASS evidence |
|---|---|---|
| T0 | Destination assertion | `figma.fileKey === TARGET_KEY`; test page resolved |
| T1 | Import component set by key | returned node `type === 'COMPONENT_SET'`, `remote === true`, `key === COMPONENT_SET_KEY` |
| T2 | Create a linked instance | instance's main component `remote === true`, parent set `key` matches |
| T3 | Set variant + text properties | read-back `componentProperties` equals the values set |
| T4 | Bind a COLOR variable to a fill | frame `fills[0].boundVariables.color` resolves to `COLOR_VAR_KEY` |
| T5 | Bind a FLOAT variable to spacing | frame `boundVariables.itemSpacing` resolves to `SPACING_VAR_KEY` |
| T6 | Import + apply a text style; font available | `textStyleId` set; style font family present in `listAvailableFontsAsync()` and loaded |
| T7 | Set a variable mode on a frame | `explicitVariableModes[collectionId] === MODE_ID` |
| T8 | Prototype reaction | read-back `reactions[0].actions[0].destinationId` equals frame B |
| T9 | No detach | instance still `INSTANCE`; no frame has `detachedInfo` |
| T10 | Visual | screenshot of the test section renders the instance with library styling |

Any T that throws or reads back a mismatch is `FAIL`, with the error recorded. Any T
that was skipped (e.g. no approved mode to test) is `UNVERIFIED`. Report every row.

## Script (fill the constants, then run once with `use_figma` on the TARGET key)

```js
const TARGET_KEY = "<approved target file key>";
const TEST_PAGE_NAME = "<approved test page name>";       // must already exist or be approved for creation
const COMPONENT_SET_KEY = "<componentSetKey from scoped search>";
const VARIANT_CHANGE = { /* "<VariantProp>": "<allowed value>" */ };
const TEXT_PROP_VALUE = "<test text or empty to skip>";
const COLOR_VAR_KEY = "<COLOR variable key from Tokens>";
const SPACING_VAR_KEY = "<FLOAT variable key with GAP scope>";
const TEXT_STYLE_KEY = "<text style key>";
const MODE_NAME = "<mode name to test, e.g. Dark — or empty to skip>";

const results = {}; const created = [];
const pass = (id, evidence) => (results[id] = { result: "PASS", evidence });
const fail = (id, e) => (results[id] = { result: "FAIL", evidence: String(e && e.message || e) });
const skip = (id, why) => (results[id] = { result: "UNVERIFIED", evidence: why });

// T0
if (figma.fileKey !== TARGET_KEY) throw new Error(`Wrong file ${figma.fileKey}`);
const page = figma.root.children.find(p => p.name === TEST_PAGE_NAME);
if (!page) throw new Error(`Test page "${TEST_PAGE_NAME}" not found — create it only with approval`);
await figma.setCurrentPageAsync(page);
pass("T0", { fileKey: figma.fileKey, page: page.id });

const maxX = page.children.reduce((m, n) => Math.max(m, n.x + n.width), 0);
const section = figma.createSection();
section.name = `Capability test ${new Date().toISOString()}`;
section.x = maxX + 200; section.y = 0;
created.push(section.id);

const frameA = figma.createAutoLayout("VERTICAL", { name: "Test A", itemSpacing: 0 });
const frameB = figma.createAutoLayout("VERTICAL", { name: "Test B" });
section.appendChild(frameA); section.appendChild(frameB);
frameB.x = 500;
created.push(frameA.id, frameB.id);

// T1 + T2
let instance = null;
try {
  const set = await figma.importComponentSetByKeyAsync(COMPONENT_SET_KEY);
  if (set.type !== "COMPONENT_SET" || set.remote !== true || set.key !== COMPONENT_SET_KEY) throw new Error(`set mismatch ${set.type}/${set.remote}/${set.key}`);
  pass("T1", { name: set.name, key: set.key, remote: set.remote });
  instance = set.defaultVariant.createInstance();
  frameA.appendChild(instance); created.push(instance.id);
  const main = await instance.getMainComponentAsync();
  const ok = main && main.remote === true && main.parent && main.parent.key === COMPONENT_SET_KEY;
  ok ? pass("T2", { instance: instance.id, main: main.name }) : fail("T2", "main component not remote / key mismatch");
} catch (e) { fail("T1", e); skip("T2", "T1 failed"); }

// T3
if (instance) {
  try {
    const owner = (await instance.getMainComponentAsync()).parent;
    const defs = owner.componentPropertyDefinitions;
    const props = { ...VARIANT_CHANGE };
    const textKey = Object.keys(defs).find(k => defs[k].type === "TEXT");
    if (TEXT_PROP_VALUE && textKey) props[textKey] = TEXT_PROP_VALUE;
    instance.setProperties(props);
    const after = instance.componentProperties;
    const mismatches = Object.entries(props).filter(([k, v]) => !after[k] || after[k].value !== v);
    mismatches.length ? fail("T3", JSON.stringify(mismatches)) : pass("T3", props);
  } catch (e) { fail("T3", e); }
} else skip("T3", "no instance");

// T4 + T5
try {
  const color = await figma.variables.importVariableByKeyAsync(COLOR_VAR_KEY);
  const base = { type: "SOLID", color: { r: 1, g: 1, b: 1 } };
  frameA.fills = [figma.variables.setBoundVariableForPaint(base, "color", color)];
  const b = frameA.fills[0].boundVariables && frameA.fills[0].boundVariables.color;
  b && b.id === color.id ? pass("T4", { variable: color.name }) : fail("T4", "fill not bound");
} catch (e) { fail("T4", e); }
try {
  const sp = await figma.variables.importVariableByKeyAsync(SPACING_VAR_KEY);
  frameA.setBoundVariable("itemSpacing", sp);
  const b = frameA.boundVariables && frameA.boundVariables.itemSpacing;
  b && b.id === sp.id ? pass("T5", { variable: sp.name }) : fail("T5", "itemSpacing not bound");
} catch (e) { fail("T5", e); }

// T6
try {
  const style = await figma.importStyleByKeyAsync(TEXT_STYLE_KEY);
  const fonts = await figma.listAvailableFontsAsync();
  const family = style.fontName.family;
  if (!fonts.some(f => f.fontName.family === family)) throw new Error(`font family not available: ${family}`);
  await figma.loadFontAsync(style.fontName);
  const t = figma.createText();
  await figma.loadFontAsync(t.fontName); // new text nodes start in the default font; load it before restyling
  await t.setTextStyleIdAsync(style.id);
  t.characters = "ტესტი / Test";
  frameA.appendChild(t); created.push(t.id);
  t.textStyleId === style.id ? pass("T6", { style: style.name, font: style.fontName }) : fail("T6", "style not applied");
} catch (e) { fail("T6", e); }

// T7
if (MODE_NAME) {
  try {
    const color = await figma.variables.importVariableByKeyAsync(COLOR_VAR_KEY);
    const coll = await figma.variables.getVariableCollectionByIdAsync(color.variableCollectionId);
    const mode = coll && coll.modes.find(m => m.name === MODE_NAME);
    if (!mode) throw new Error(`mode "${MODE_NAME}" not found; modes: ${coll ? coll.modes.map(m => m.name).join(", ") : "collection unavailable"}`);
    frameB.setExplicitVariableModeForCollection(coll, mode.modeId);
    frameB.explicitVariableModes[coll.id] === mode.modeId ? pass("T7", { collection: coll.name, mode: mode.name, modes: coll.modes.map(m => m.name) }) : fail("T7", "mode not set");
  } catch (e) { fail("T7", e); }
} else skip("T7", "no mode approved for testing");

// T8
try {
  await frameA.setReactionsAsync([{ trigger: { type: "ON_CLICK" }, actions: [{ type: "NODE", destinationId: frameB.id, navigation: "NAVIGATE", transition: null }] }]);
  const r = frameA.reactions;
  r[0] && r[0].actions && r[0].actions[0].destinationId === frameB.id ? pass("T8", { from: frameA.id, to: frameB.id }) : fail("T8", "reaction not stored");
} catch (e) { fail("T8", e); }

// T9
const detached = section.findAllWithCriteria({ types: ["FRAME"] }).filter(f => f.detachedInfo != null).map(f => f.id);
instance && instance.type === "INSTANCE" && detached.length === 0 ? pass("T9", { detached }) : fail("T9", { detached, instanceType: instance && instance.type });

// T10 — inline screenshot for visual inspection (judge it yourself; do not auto-PASS)
await section.screenshot();
results.T10 = { result: "UNVERIFIED", evidence: "screenshot returned — assess visually and update" };

return { createdNodeIds: created, sectionId: section.id, results };
```

## After the run

- Report every T row with its result and evidence. Judge T10 from the screenshot.
- Leave the test section in place, labeled. Delete it only if the designer asks, and only
  the IDs in `createdNodeIds`.
- If the script throws before returning (`safeToRetryWithoutCanvasRead: false`), read the
  test page first to see what was created, then report. Do not retry blindly.
- Record the library `updatedAt` timestamps of the test assets. A later run may reuse
  these results only while those timestamps are unchanged.
