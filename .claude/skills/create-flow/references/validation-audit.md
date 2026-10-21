# Per-screen validation audit (read-only, TARGET file only)

Run after each generated screen (Step 7). This script **only reads**. Run it with
`use_figma` against the **target** file key — never against `ymEnGYUGvRRVKhHiUSGMVF`.
Load `figma:figma-use` first. Replace the three constants with literal values from this run:

- `TARGET_KEY` — the Gate A target key.
- `SCREEN_ID` — the screen frame ID returned by the generation call.
- `APPROVED` — built from the registry: for every `approved` component entry,
  `{ "<componentSetKey or componentKey>": { id: "<registry id>", variants: { Prop: [allowed…] } } }`.
  Variable keys allowed for bindings go in `APPROVED_VARIABLE_KEYS`.

The script returns facts; **you** decide PASS / FAIL / UNVERIFIED per check (SKILL.md Step 7).

```js
const TARGET_KEY = "<target file key>";
const SCREEN_ID = "<screen frame id>";
const APPROVED = { /* "<key>": { id: "<registry id>", variants: { "Size": ["Small"] } } */ };
const APPROVED_VARIABLE_KEYS = [ /* "<variable key>", ... */ ];

if (figma.fileKey !== TARGET_KEY) throw new Error(`Wrong file: ${figma.fileKey}`);
const screen = await figma.getNodeByIdAsync(SCREEN_ID);
if (!screen) throw new Error(`Screen ${SCREEN_ID} not found`);
// Make sure we are on the screen's page (one switch per call).
let page = screen; while (page && page.type !== "PAGE") page = page.parent;
if (page && page !== figma.currentPage) await figma.setCurrentPageAsync(page);

const instances = [], frames = [], texts = [], literalPaints = [], issues = [];
const varKeyCache = {};
async function varKey(alias) {
  if (!alias || !alias.id) return null;
  if (!(alias.id in varKeyCache)) {
    const v = await figma.variables.getVariableByIdAsync(alias.id);
    varKeyCache[alias.id] = v ? { key: v.key, name: v.name, remote: v.remote } : null;
  }
  return varKeyCache[alias.id];
}
function paintsOf(node, prop) {
  return Array.isArray(node[prop]) ? node[prop] : [];
}

async function visit(node) {
  if (node.type === "INSTANCE") {
    const main = await node.getMainComponentAsync();
    const set = main && main.parent && main.parent.type === "COMPONENT_SET" ? main.parent : null;
    const key = set ? set.key : main ? main.key : null;
    const props = {};
    for (const [k, p] of Object.entries(node.componentProperties || {})) props[k] = p.value;
    const entry = key ? APPROVED[key] : undefined;
    const variantViolations = [];
    if (entry && entry.variants) {
      for (const [prop, allowed] of Object.entries(entry.variants)) {
        if (prop in props && !allowed.includes(props[prop])) variantViolations.push(`${prop}=${props[prop]}`);
      }
    }
    instances.push({
      id: node.id, name: node.name,
      mainComponentName: main ? main.name : null,
      remote: main ? main.remote : null,
      key, registryId: entry ? entry.id : null,
      properties: props, variantViolations,
      layoutPositioning: node.layoutPositioning,
    });
    return; // component internals belong to the library; do not audit inside instances
  }
  if (node.type === "FRAME" || node.type === "GROUP" || node.type === "SECTION") {
    const bv = node.boundVariables || {};
    const bound = {};
    for (const [prop, val] of Object.entries(bv)) {
      const aliases = Array.isArray(val) ? val : [val];
      bound[prop] = [];
      for (const a of aliases) bound[prop].push(await varKey(a));
    }
    frames.push({
      id: node.id, name: node.name, type: node.type,
      layoutMode: "layoutMode" in node ? node.layoutMode : null,
      layoutPositioning: node.layoutPositioning,
      detached: "detachedInfo" in node ? node.detachedInfo != null : false,
      bound,
      width: node.width, height: node.height,
    });
  }
  if (node.type === "TEXT") {
    texts.push({
      id: node.id, name: node.name,
      textStyleId: typeof node.textStyleId === "string" ? node.textStyleId : "MIXED",
      fillBound: paintsOf(node, "fills").every(p => p.type !== "SOLID" || (p.boundVariables && p.boundVariables.color)),
    });
  }
  for (const prop of ["fills", "strokes"]) {
    for (const p of paintsOf(node, prop)) {
      if (p.type === "SOLID" && !(p.boundVariables && p.boundVariables.color)) {
        literalPaints.push({ id: node.id, name: node.name, prop });
      }
    }
  }
  if ("children" in node) for (const c of node.children) await visit(c);
}
await visit(screen);

const unapprovedInstances = instances.filter(i => !i.registryId || i.remote !== true);
const variantViolations = instances.filter(i => i.variantViolations.length);
const detachedFrames = frames.filter(f => f.detached);
const nonAutoLayoutFrames = frames.filter(f => f.type === "FRAME" && (!f.layoutMode || f.layoutMode === "NONE"));
const absoluteChildren = [...instances, ...frames].filter(n => n.layoutPositioning === "ABSOLUTE");
const unapprovedBindings = [];
for (const f of frames) for (const [prop, list] of Object.entries(f.bound))
  for (const v of list) if (!v || !APPROVED_VARIABLE_KEYS.includes(v.key)) unapprovedBindings.push({ id: f.id, prop, variable: v });

return {
  fileKey: figma.fileKey, page: figma.currentPage.name, screen: { id: screen.id, name: screen.name, width: screen.width, height: screen.height },
  counts: { instances: instances.length, frames: frames.length, texts: texts.length },
  instances, unapprovedInstances, variantViolations,
  detachedFrames, nonAutoLayoutFrames, absoluteChildren,
  literalPaints, unapprovedBindings,
  textsWithoutStyle: texts.filter(t => !t.textStyleId || t.textStyleId === "MIXED"),
  textsWithLiteralFill: texts.filter(t => !t.fillBound),
};
```

## Interpreting results

| Check | FAIL when | UNVERIFIED when |
|---|---|---|
| V2 provenance | any `unapprovedInstances` or `detachedFrames` | `key` null (main component unresolved) |
| V3 variants | any `variantViolations` | registry entry lacks `variants` for a property in use |
| V4 Auto Layout | structural frame in `nonAutoLayoutFrames` or control in `absoluteChildren` without an approved exception | — |
| V5 bindings | `literalPaints` / `unapprovedBindings` on generated frames without an approved exception | variable could not be resolved (`variable: null`) |
| V6 text | generated text without a style or with literal fill (component-owned text is excluded) | style key cannot be matched to the registry |
| V7 layout | screenshot shows clipping/overlap/broken wrap | no screenshot taken |

Transparent frames have no fills, which is fine. A literal paint on an *instance* is never
reported because instances are not descended into. Instance overrides are covered by V3,
and the designer reviews them visually.
