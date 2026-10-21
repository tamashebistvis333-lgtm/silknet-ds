# Independent validation audit (read-only, TARGET file only)

Run this as a **separate `use_figma` call** after every generation, modification, fix, or
capability-test stage (SKILL.md rule 11, V14). Report from **this** output, never from
the write script's own return value. The script only reads. Run it against the **target**
file key, never against `ymEnGYUGvRRVKhHiUSGMVF`. Load `figma:figma-use` first.

Replace the constants with literal values from this run:

- `TARGET_KEY` — the Gate A target key.
- `ROOT_ID` — the screen frame, flow wrapper, or test section to audit.
- `APPROVED` — from the registry: for every `approved` component entry,
  `{ "<componentSetKey or componentKey>": { id: "<registry id>", variants: { "<axis>": [allowed…] }, properties: ["<exact key e.g. Label#2022:15>", …] } }`.
  Property keys are the exact Figma keys (rule 8), never `get_design_context` names.
- `APPROVED_VARIABLE_KEYS`, `APPROVED_STYLE_KEYS` — keys allowed for bindings and styles.
- `PREVIOUS` — optional: the `snapshot` returned by the previous audit, for V13
  (preservation) after a fix or modification.

The script returns facts. **You** decide PASS / FAIL / UNVERIFIED per check (SKILL.md Step 7).

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

const box = n => { const b = n.absoluteBoundingBox; return b ? { x: b.x, y: b.y, w: b.width, h: b.height } : null; };
const inside = (c, p) => c && p && c.x >= p.x - 0.5 && c.y >= p.y - 0.5 && c.x + c.w <= p.x + p.w + 0.5 && c.y + c.h <= p.y + p.h + 0.5;
const overlaps = (a, b) => !(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y);
const vcache = {};
async function vinfo(alias) {
  if (!alias || !alias.id) return null;
  if (!(alias.id in vcache)) { const v = await figma.variables.getVariableByIdAsync(alias.id); vcache[alias.id] = v ? { key: v.key, name: v.name, remote: v.remote } : null; }
  return vcache[alias.id];
}
const paintsOf = (n, p) => (Array.isArray(n[p]) ? n[p] : []);

const instances = [], frames = [], texts = [], literalPaints = [], containment = [], overlapPairs = [];
async function visit(node) {
  const parent = node.parent;
  if (node !== root && parent && parent.type !== "PAGE") {
    const ok = inside(box(node), box(parent));
    if (!ok) containment.push({ id: node.id, name: node.name, parent: parent.id, box: box(node), parentBox: box(parent) });
  }
  if (node.type === "INSTANCE") {
    const main = await node.getMainComponentAsync();
    const set = main && main.parent && main.parent.type === "COMPONENT_SET" ? main.parent : null;
    const key = set ? set.key : main ? main.key : null;
    const props = {};
    for (const [k, p] of Object.entries(node.componentProperties || {})) props[k] = p.value;
    const entry = key ? APPROVED[key] : undefined;
    const variantViolations = [], propertyViolations = [];
    if (entry && entry.variants) for (const [ax, allowed] of Object.entries(entry.variants))
      if (ax in props && !allowed.includes(props[ax])) variantViolations.push(`${ax}=${props[ax]}`);
    if (entry && entry.properties) for (const k of Object.keys(props))
      if (k.includes("#") && !entry.properties.includes(k)) propertyViolations.push(k); // non-variant props not in the approved list
    const fonts = new Set();
    for (const t of node.findAllWithCriteria({ types: ["TEXT"] }))
      for (const s of t.getStyledTextSegments(["fontName"])) fonts.add(`${s.fontName.family} ${s.fontName.style}`);
    instances.push({ id: node.id, name: node.name, parent: parent && parent.id, main: main && main.name, remote: main && main.remote,
      key, registryId: entry ? entry.id : null, properties: props, variantViolations, propertyViolations,
      fonts: [...fonts], layoutPositioning: node.layoutPositioning });
    return; // library internals are not audited
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
      layoutMode: "layoutMode" in node ? node.layoutMode : null, layoutPositioning: node.layoutPositioning,
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

return {
  fileKey: figma.fileKey, page: figma.currentPage.name, root: { id: root.id, name: root.name, box: box(root) },
  counts: { instances: instances.length, frames: frames.length, texts: texts.length },
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
  preservationDiffs, snapshot,
};
```

## Interpreting results

| Check | FAIL when | UNVERIFIED when |
|---|---|---|
| V2 provenance | any `unapprovedInstances` or `detachedFrames` | `key` null (main component unresolved) |
| V3 variants / properties | any `variantViolations` or `propertyViolations` | registry entry lacks `variants` / `properties` for something in use |
| V4 Auto Layout | structural frame in `nonAutoLayoutFrames` or control in `absoluteChildren` without an approved exception | — |
| V5 bindings | `literalPaints` / `unapprovedBindings` on generated frames without an approved exception | variable could not be resolved (`null`) |
| V6 text | generated text without a style, with an unapproved style, or with a literal fill (component-owned text is excluded) | style cannot be matched to the registry |
| V7 visual layout | screenshot shows clipping, overlap, or broken wrapping | no screenshot taken |
| V11 containment | any `containmentViolations` or `overlapPairs` | node has no bounding box (hidden/zero-size) — report it |
| V12 fonts | a font in `fontsInUse` failed to load or is unavailable in the write-call report | the write call did not report font loading |
| V13 preservation | any `preservationDiffs` not explained by an approved change | no `PREVIOUS` snapshot to compare against |
| V14 independent audit | — | this audit was not run, or its output was not used for the report |

Transparent frames have no fills, which is fine. Literal paints on an *instance* are not
reported because instances are not descended into; instance overrides are covered by V3.
A section or free frame (`layoutMode: NONE`) is the only place where sibling overlap can
happen by accident; Auto Layout parents position children themselves.
