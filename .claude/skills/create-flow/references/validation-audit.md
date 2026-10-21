# Independent validation audit (read-only, TARGET file only)

Run this as a **separate `use_figma` call** after every generation, modification, fix, or
capability-test stage (SKILL.md rule 11, V14). Report from **this** output, never from
the write script's own return value. The script only reads. Run it against the **target**
file key, never against `ymEnGYUGvRRVKhHiUSGMVF`. Load `figma:figma-use` first.

Replace the constants with literal values from this run:

- `TARGET_KEY` — the Gate A target key.
- `ROOT_ID` — the screen frame, flow wrapper, or test section to audit.
- `APPROVED` — from the registry: for every `approved` component entry,
  `{ "<componentSetKey or componentKey>": { id: "<registry id>", variants: { "<axis>": [allowed…] }, variantCombinations: ["<exact variant name>", …], properties: ["<exact key e.g. Label#2022:15>", …], nestedDependencies: { "<variant name>": [{ sourceId, key, variant, mustRemainHidden }, …] } } }`.
  Copy `variantCombinations` and `nestedDependencies` only when the entry has them;
  `variantCombinations` limits the allowed combinations to those exact names.
  Property keys are the exact Figma keys (rule 8), never `get_design_context` names.
- `APPROVED_VARIABLE_KEYS`, `APPROVED_STYLE_KEYS` — keys allowed for bindings and styles.
- `PREVIOUS` — optional: the `snapshot` returned by the previous audit, for V13
  (preservation) after a fix or modification.

The script returns facts. **You** decide PASS / FAIL / UNVERIFIED per check (SKILL.md Step 7).

`ROOT_ID` may be a SECTION: layout-only properties (`layoutPositioning`, `layoutMode`) are
read through capability guards, because SECTION nodes do not expose them. The script turns
off `figma.skipInvisibleInstanceChildren` (a plugin-runtime read setting, not a document
change) so hidden nested instances are included in the audit; it restores the previous
value before returning.

How instances are scoped:

- **Top-level instance** (not inside another instance): checked against its own registry
  entry — variants, `variantCombinations`, and properties. A non-variant property that is
  not approved is a violation only when its value differs from the component default;
  unchanged ones are listed in `propertiesAtDefault`.
- **Built-in nested instance** (part of the component, matched by `sourceId` — the layer
  path inside the top-level instance, e.g. `4166:2597;2073:2043`): when the top-level entry
  has `nestedDependencies` for its variant, the nested instance must match a listed
  dependency (same key, same variant name), carry no overrides, and stay hidden when the
  dependency says `mustRemainHidden`. Without a dependency list, the nested instance must
  carry no overrides (backward compatible).
- **Slot content** (direct child of a `SLOT` node that is not a listed dependency): checked
  against its **own** registry entry like a top-level instance, plus the slot's
  `limitViolations`. Instances inside slot content must carry no overrides.

```js
const TARGET_KEY = "<target file key>";
const ROOT_ID = "<screen / wrapper / section id>";
const APPROVED = { /* "<key>": { id: "<registry id>", variants: { "size": ["medium"] }, properties: ["Label#2022:15"] } */ };
const APPROVED_VARIABLE_KEYS = [ /* "<variable key>" */ ];
const APPROVED_STYLE_KEYS = [ /* "<style key>" */ ];
const PREVIOUS = null; // or the previous audit's `snapshot`

if (figma.fileKey !== TARGET_KEY) throw new Error(`Wrong file: ${figma.fileKey}`);
const root = await figma.getNodeByIdAsync(ROOT_ID);
if (!root) throw new Error(`Root ${ROOT_ID} not found`);
let page = root; while (page && page.type !== "PAGE") page = page.parent;
if (page && page !== figma.currentPage) await figma.setCurrentPageAsync(page);
const prevSkipInvisible = figma.skipInvisibleInstanceChildren;
figma.skipInvisibleInstanceChildren = false; // include hidden nested instances (read setting only)

const box = n => { const b = n.absoluteBoundingBox; return b ? { x: b.x, y: b.y, w: b.width, h: b.height } : null; };
const layoutPos = n => ("layoutPositioning" in n ? n.layoutPositioning : null); // SECTION has no layoutPositioning
const inside = (c, p) => c && p && c.x >= p.x - 0.5 && c.y >= p.y - 0.5 && c.x + c.w <= p.x + p.w + 0.5 && c.y + c.h <= p.y + p.h + 0.5;
const overlaps = (a, b) => !(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y);
const vcache = {};
async function vinfo(alias) {
  if (!alias || !alias.id) return null;
  if (!(alias.id in vcache)) { const v = await figma.variables.getVariableByIdAsync(alias.id); vcache[alias.id] = v ? { key: v.key, name: v.name, remote: v.remote } : null; }
  return vcache[alias.id];
}
const paintsOf = (n, p) => (Array.isArray(n[p]) ? n[p] : []);
async function resolve(n) {
  const main = await n.getMainComponentAsync();
  const set = main && main.parent && main.parent.type === "COMPONENT_SET" ? main.parent : null;
  return { main, set, key: set ? set.key : main ? main.key : null };
}
const propsOf = n => { const o = {}; for (const [k, p] of Object.entries(n.componentProperties || {})) o[k] = p.value; return o; };
// Variant, combination and property scope of one instance against its own registry entry.
function scopeCheck(entry, main, set, props) {
  const variantViolations = [], propertyViolations = [], propertiesAtDefault = [];
  if (entry.variants) for (const [ax, allowed] of Object.entries(entry.variants))
    if (ax in props && !allowed.includes(props[ax])) variantViolations.push(`${ax}=${props[ax]}`);
  if (entry.variantCombinations && entry.variantCombinations.length && main && !entry.variantCombinations.includes(main.name))
    variantViolations.push(`combination ${main.name}`); // resolved variant name, not just axis values
  const defs = main ? (set || main).componentPropertyDefinitions : {};
  for (const k of Object.keys(props)) {
    if (!k.includes("#") || (entry.properties || []).includes(k)) continue; // variants and approved properties
    if (defs[k] && props[k] === defs[k].defaultValue) propertiesAtDefault.push(k); // unchanged default: not an override
    else propertyViolations.push(`${k}=${JSON.stringify(props[k])}`);
  }
  return { variantViolations, propertyViolations, propertiesAtDefault };
}

const instances = [], frames = [], texts = [], literalPaints = [], containment = [], overlapPairs = [], nestedInstances = [], missingDependencies = [];
// Nested instances of one top-level instance, hidden ones included.
async function auditNested(top, topEntry, topVariant) {
  const deps = topEntry && topEntry.nestedDependencies ? topEntry.nestedDependencies[topVariant] || null : null;
  const seen = new Set(), prefix = `I${top.id};`, topOverrides = top.overrides || [];
  for (const n of top.findAllWithCriteria({ types: ["INSTANCE"] })) {
    const { main, set, key } = await resolve(n);
    const path = []; let hiddenByAncestor = false, slot = null, slotItem = null;
    for (let c = n, p = n.parent; p && p.id !== top.id; c = p, p = p.parent) {
      path.unshift(p.name);
      if (p.visible === false) hiddenByAncestor = true;
      if (p.type === "SLOT" && !slot) { slot = p; slotItem = c; }
    }
    const effectiveVisible = n.visible && !hiddenByAncestor;
    const sourceId = n.id.startsWith(prefix) ? n.id.slice(prefix.length) : null;
    // Overrides on this nested instance, as reported by the top-level instance and by the instance itself
    const fromTop = topOverrides.filter(o => o.id === n.id).flatMap(o => o.overriddenFields);
    const fromSelf = (n.overrides || []).filter(o => o.id === n.id).flatMap(o => o.overriddenFields);
    const overriddenFields = [...new Set([...fromTop, ...fromSelf])];
    const dep = deps && sourceId ? deps.find(d => d.sourceId === sourceId) : null;
    const problems = []; let scope;
    if (dep) {
      scope = `nested-dependency-of:${topEntry.id}`; seen.add(dep.sourceId);
      if (key !== dep.key) problems.push(`nested-component-changed ${key}`);
      if (!main || main.name !== dep.variant) problems.push(`nested-variant-changed ${main && main.name}`);
      if (overriddenFields.length) problems.push(`nested-override ${overriddenFields.join(",")}`);
      if (dep.mustRemainHidden && effectiveVisible) problems.push("hidden-dependency-visible");
    } else if (slotItem === n) {
      scope = "slot-content";
      const entry = key ? APPROVED[key] : undefined;
      if (!entry || !main || main.remote !== true) problems.push("slot-content-unapproved");
      else { const r = scopeCheck(entry, main, set, propsOf(n)); problems.push(...r.variantViolations, ...r.propertyViolations); }
      if (slot.limitViolations && slot.limitViolations.length) problems.push(`slot-limit ${slot.limitViolations.join(",")}`);
    } else if (slotItem) {
      scope = "inside-slot-content";
      if (overriddenFields.length) problems.push(`nested-override ${overriddenFields.join(",")}`);
    } else if (deps) {
      scope = "unexpected-nested"; problems.push("unexpected-nested-instance");
    } else {
      scope = "nested-unlisted";
      if (overriddenFields.length) problems.push(`nested-override ${overriddenFields.join(",")}`);
    }
    nestedInstances.push({ id: n.id, top: top.id, sourceId, path: path.join(" / "), name: n.name, visible: n.visible, hiddenByAncestor,
      main: main && main.name, remote: main && main.remote, assetType: set ? "COMPONENT_SET" : "COMPONENT", key, setName: set && set.name,
      scope, registryId: key && APPROVED[key] ? APPROVED[key].id : null, overriddenFields,
      overrideEvidence: { fromTop, fromSelf }, problems });
  }
  if (deps) for (const d of deps) if (!seen.has(d.sourceId)) missingDependencies.push({ top: top.id, sourceId: d.sourceId, key: d.key });
}
async function visit(node) {
  const parent = node.parent;
  if (node !== root && parent && parent.type !== "PAGE") {
    const ok = inside(box(node), box(parent));
    if (!ok) containment.push({ id: node.id, name: node.name, parent: parent.id, box: box(node), parentBox: box(parent) });
  }
  if (node.type === "INSTANCE") {
    const { main, set, key } = await resolve(node);
    const props = propsOf(node);
    const entry = key ? APPROVED[key] : undefined;
    const r = entry ? scopeCheck(entry, main, set, props) : { variantViolations: [], propertyViolations: [], propertiesAtDefault: [] };
    const fonts = new Set();
    for (const t of node.findAllWithCriteria({ types: ["TEXT"] }))
      for (const s of t.getStyledTextSegments(["fontName"])) fonts.add(`${s.fontName.family} ${s.fontName.style}`);
    instances.push({ id: node.id, name: node.name, parent: parent && parent.id, main: main && main.name, remote: main && main.remote,
      key, registryId: entry ? entry.id : null, properties: props, ...r, fonts: [...fonts], layoutPositioning: layoutPos(node) });
    await auditNested(node, entry, main && main.name); // nested scope; other library internals are not audited
    return;
  }
  if (node.type === "FRAME" || node.type === "GROUP" || node.type === "SECTION") {
    const bound = {};
    for (const [prop, val] of Object.entries(node.boundVariables || {})) {
      bound[prop] = [];
      for (const a of (Array.isArray(val) ? val : [val])) bound[prop].push(await vinfo(a));
    }
    const fillBindings = [];
    for (const p of paintsOf(node, "fills")) fillBindings.push(p.boundVariables && p.boundVariables.color ? await vinfo(p.boundVariables.color) : null);
    const modes = {};
    for (const [cid, mid] of Object.entries(node.explicitVariableModes || {})) {
      const c = await figma.variables.getVariableCollectionByIdAsync(cid);
      modes[c ? c.name : cid] = c ? (c.modes.find(m => m.modeId === mid) || {}).name || mid : mid;
    }
    frames.push({ id: node.id, name: node.name, type: node.type, parent: parent && parent.id,
      layoutMode: "layoutMode" in node ? node.layoutMode : null, layoutPositioning: layoutPos(node),
      detached: "detachedInfo" in node ? node.detachedInfo != null : false, bound, fillBindings, modes,
      reactions: (node.reactions || []).map(r => ({ trigger: r.trigger && r.trigger.type, actions: (r.actions || []).map(a => ({ type: a.type, navigation: a.navigation, destinationId: a.destinationId })) })),
      box: box(node) });
    // Sibling overlap among frames/instances in non-Auto-Layout containers (sections, free frames)
    if ("children" in node && (node.type === "SECTION" || node.layoutMode === "NONE")) {
      const kids = node.children.filter(c => c.type === "FRAME" || c.type === "INSTANCE" || c.type === "SECTION");
      for (let i = 0; i < kids.length; i++) for (let j = i + 1; j < kids.length; j++)
        if (overlaps(box(kids[i]), box(kids[j]))) overlapPairs.push([kids[i].id, kids[j].id]);
    }
  }
  if (node.type === "TEXT") {
    let style = null;
    if (typeof node.textStyleId === "string" && node.textStyleId) { const s = await figma.getStyleByIdAsync(node.textStyleId); style = s ? { name: s.name, key: s.key, remote: s.remote } : null; }
    const fills = [];
    for (const p of paintsOf(node, "fills")) fills.push(p.type !== "SOLID" ? p.type : p.boundVariables && p.boundVariables.color ? await vinfo(p.boundVariables.color) : "LITERAL");
    const fonts = [...new Set(node.getStyledTextSegments(["fontName"]).map(s => `${s.fontName.family} ${s.fontName.style}`))];
    texts.push({ id: node.id, name: node.name, parent: parent && parent.id, style, styleMixed: typeof node.textStyleId !== "string", fills, fonts });
  }
  for (const prop of ["fills", "strokes"])
    for (const p of paintsOf(node, prop))
      if (p.type === "SOLID" && !(p.boundVariables && p.boundVariables.color)) literalPaints.push({ id: node.id, name: node.name, prop });
  if ("children" in node) for (const c of node.children) await visit(c);
}
await visit(root);

const unapprovedInstances = instances.filter(i => !i.registryId || i.remote !== true);
const unapprovedBindings = [];
for (const f of frames) for (const [prop, list] of Object.entries(f.bound))
  for (const v of list) if (!v || !APPROVED_VARIABLE_KEYS.includes(v.key)) unapprovedBindings.push({ id: f.id, prop, variable: v });
const unapprovedStyles = texts.filter(t => t.style && !APPROVED_STYLE_KEYS.includes(t.style.key));

// Snapshot for V13 (preservation) — compare with PREVIOUS after a fix/modification
const snapshot = {
  instances: Object.fromEntries(instances.map(i => [i.id, { key: i.key, remote: i.remote, main: i.main, properties: i.properties }])),
  frames: Object.fromEntries(frames.map(f => [f.id, { bound: f.bound, fillBindings: f.fillBindings, modes: f.modes, reactions: f.reactions, detached: f.detached }])),
  texts: Object.fromEntries(texts.map(t => [t.id, { style: t.style, fills: t.fills }])),
};
const preservationDiffs = [];
if (PREVIOUS) for (const group of ["instances", "frames", "texts"])
  for (const [id, prev] of Object.entries(PREVIOUS[group] || {})) {
    const now = snapshot[group][id];
    if (!now) preservationDiffs.push({ id, group, change: "missing" });
    else if (JSON.stringify(now) !== JSON.stringify(prev)) preservationDiffs.push({ id, group, before: prev, after: now });
  }

figma.skipInvisibleInstanceChildren = prevSkipInvisible;
return {
  fileKey: figma.fileKey, page: figma.currentPage.name, root: { id: root.id, name: root.name, box: box(root) },
  counts: { instances: instances.length, frames: frames.length, texts: texts.length, nested: nestedInstances.length },
  instances, frames, texts,
  unapprovedInstances, variantViolations: instances.filter(i => i.variantViolations.length), propertyViolations: instances.filter(i => i.propertyViolations.length),
  detachedFrames: frames.filter(f => f.detached).map(f => f.id),
  nonAutoLayoutFrames: frames.filter(f => f.type === "FRAME" && (!f.layoutMode || f.layoutMode === "NONE")).map(f => f.id),
  absoluteChildren: [...instances, ...frames].filter(n => n.layoutPositioning === "ABSOLUTE").map(n => n.id),
  containmentViolations: containment, overlapPairs,
  literalPaints, unapprovedBindings, unapprovedStyles,
  textsWithoutStyle: texts.filter(t => !t.style || t.styleMixed).map(t => t.id),
  textsWithLiteralFill: texts.filter(t => t.fills.includes("LITERAL")).map(t => t.id),
  fontsInUse: [...new Set([...instances.flatMap(i => i.fonts), ...texts.flatMap(t => t.fonts)])],
  nestedInstances,
  nestedViolations: nestedInstances.filter(n => n.problems.length).map(n => ({ id: n.id, top: n.top, sourceId: n.sourceId, scope: n.scope, problems: n.problems })),
  missingDependencies,
  hiddenDependencyVisible: nestedInstances.filter(n => n.problems.includes("hidden-dependency-visible")).map(n => n.id),
  nestedUnlinked: nestedInstances.filter(n => n.remote !== true || !n.key).map(n => n.id),
  nestedHidden: nestedInstances.filter(n => n.visible === false || n.hiddenByAncestor).map(n => n.id),
  nestedNotInRegistry: nestedInstances.filter(n => !n.registryId && !n.scope.startsWith("nested-dependency-of")).map(n => ({ id: n.id, name: n.name, key: n.key })),
  preservationDiffs, snapshot,
};
```

## Interpreting results

| Check | FAIL when | UNVERIFIED when |
|---|---|---|
| V2 provenance | any `unapprovedInstances` or `detachedFrames` | `key` null (main component unresolved) |
| V2 nested provenance | any `nestedUnlinked`, or a nested key that differs from the source structure | a nested component's library origin is not confirmed by a scoped `search_design_system` (`remote: true` proves a library link, not which library) |
| V2 nested registry status | — (reported separately; never merged with provenance) | any `nestedNotInRegistry` that a flow relies on and the designer has not approved as nested content |
| V3 variants / properties | any `variantViolations` or `propertyViolations` (only properties whose value differs from the component default; unchanged ones are in `propertiesAtDefault` and are not violations) | registry entry lacks `variants` / `properties` for something in use |
| V3 nested scope | any `nestedViolations` (changed nested component or variant, nested override, unexpected nested instance, unapproved slot content, slot limit) or `missingDependencies` | the top-level entry has no `nestedDependencies` for that variant and the nested content matters to the flow |
| V3 hidden dependencies | any `hiddenDependencyVisible` | — |
| V4 Auto Layout | structural frame in `nonAutoLayoutFrames` or control in `absoluteChildren` without an approved exception | — |
| V5 bindings | `literalPaints` / `unapprovedBindings` on generated frames without an approved exception | variable could not be resolved (`null`) |
| V6 text | generated text without a style, with an unapproved style, or with a literal fill (component-owned text is excluded) | style cannot be matched to the registry |
| V7 visual layout | screenshot shows clipping, overlap, or broken wrapping | no screenshot taken |
| V11 containment | any `containmentViolations` or `overlapPairs` | node has no bounding box (hidden/zero-size) — report it |
| V12 fonts | a font in `fontsInUse` failed to load or is unavailable in the write-call report | the write call did not report font loading |
| V13 preservation | any `preservationDiffs` not explained by an approved change | no `PREVIOUS` snapshot to compare against |
| V14 independent audit | — | this audit was not run, or its output was not used for the report |

`overrideEvidence` shows where each nested override was reported: `fromTop` (the top-level
instance's `overrides`) and `fromSelf` (the nested instance's own `overrides`). Report both;
do not assume a nested edit appears in either until a capability test has shown it.

Transparent frames have no fills, which is fine. Literal paints on an *instance* are not
reported because instance internals are not walked for paints or containment; instance
overrides are covered by V3. Nested instances (including hidden ones, listed in
`nestedHidden`) are walked for provenance and nested scope only.
A section or free frame (`layoutMode: NONE`) is the only place where sibling overlap can
happen by accident; Auto Layout parents position children themselves.
