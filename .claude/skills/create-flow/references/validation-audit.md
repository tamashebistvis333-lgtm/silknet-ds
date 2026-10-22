# Independent validation audit (read-only, TARGET file only)

Run this as a **separate `use_figma` call** after every generation, modification, fix, or
capability-test stage (SKILL.md rule 11, V14). Report from **this** output, never from
the write script's own return value. The script only reads. Run it against the **target**
file key, never against `ymEnGYUGvRRVKhHiUSGMVF`. Load `figma:figma-use` first.

Replace the constants with literal values from this run:

- `TARGET_KEY` — the Gate A target key.
- `ROOT_ID` — the screen frame, flow wrapper, or test section to audit.
- `APPROVED` — from the registry: for every `approved` component entry,
  `{ "<componentSetKey or componentKey>": { id: "<registry id>", variants: { "<axis>": [allowed…] }, variantCombinations: ["<exact variant name>", …], properties: ["<exact key e.g. Label#2022:15>", …], nestedDependencies: { "<variant name>": [{ sourceId, key, variant, mustRemainHidden }, …] }, slots: { "<variant name>": [{ slot, defaultContent: [{ key, variant }], allowReplacement, allowedContent: ["<registry id>", …], minChildren, maxChildren }, …] } } }`.
  Copy `variantCombinations`, `nestedDependencies` and `slots` only when the entry has them;
  `variantCombinations` limits the allowed combinations to those exact names.
  Property keys are the exact Figma keys (rule 8), never `get_design_context` names.
- `APPROVED_VARIABLE_KEYS`, `APPROVED_STYLE_KEYS` — keys allowed for bindings and styles.
- `PREVIOUS` — optional: the `snapshot` returned by the previous audit, for V13
  (preservation) after a fix or modification.
- `AUDIT_MODE` — `"compliance"` (default), `"negative-regression"` or `"full"`:
  - `compliance`: normal approved-screen audit. Fixture sections in `EXCLUDED_ROOTS` are
    skipped (listed in `skippedFixtures`); a `ROOT_ID` inside a fixture is refused.
  - `negative-regression`: explicit audit of a fixture section; `ROOT_ID` must be (inside) a
    fixture root. Every finding is counted — fixtures are expected to produce violations.
  - `full`: explicit audit of anything, e.g. the whole Playground page as `ROOT_ID`.
    Fixture findings are kept apart in `fixtureFindings` and never counted in the summary.
- `EXCLUDED_ROOTS` — node IDs of intentionally non-compliant fixture sections (below).

Known fixture sections (target `zzGuTpXzrcglX1zlOd4IuR`, page `🧪 Capability test`):

| Node | Purpose |
|---|---|
| `43:206` | `NEGATIVE FIXTURES — INTENTIONALLY NON-COMPLIANT — r6 enforcement` (N1–N5). Keep unchanged; audit only with `negative-regression` or `full`. |

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
- **Slot rules** (`slots`): a `SLOT` inside the top-level instance is matched to a rule by its
  stable layer path (`slot`, e.g. `7000:3166;7000:3114` — the slot's ID without the
  `I<top>;` prefix), never by the file-local IDs of its children. Each direct child is:
  - **default content** when it matches `defaultContent` at the same position by component
    key and variant name — it must carry no overrides;
  - otherwise a **replacement**: allowed only when `allowReplacement` is true, the instance
    has its own `approved` entry whose `id` is in `allowedContent`, and it passes that
    entry's variants, `variantCombinations` and properties. Its only allowed overrides are
    `componentProperties` (property values, checked above) and `name` (layer name); any other
    is `slot-content-override`.
  Slot-level problems go to `slotViolations`: a non-instance child, content changed while
  `allowReplacement` is false (including removed content), fewer than `minChildren`
  (visible slots only) or more than `maxChildren` children, and `slot-default-mismatch` —
  the slot host carries no slot edit, yet its content differs from `defaultContent` (the
  registry no longer matches the library default; re-inspect).
- **Slot hosts**: putting content into a slot records a `componentProperties` override on
  the instance that owns the slot (e.g. the List-slot inside list-item). That override is
  authorized — and not reported as `nested-override` — only when all of these hold: the
  host is a matched nested dependency with no other problem, `componentProperties` is its
  only overridden field, every non-`SLOT`, non-variant property of the host is at its
  default (no swaps or property edits), and every slot it owns has a rule with no slot-level
  or content problem. The decision and its reasons are in `slotHostOverrides`.
- **Slot content without a rule** (direct child of a `SLOT` that has no matching rule and is
  not a listed dependency): checked against its **own** registry entry like a top-level
  instance, plus the slot's `limitViolations`, and the same `slot-content-override` rule. Its
  host's slot edit stays a `nested-override`.
- **Nested slot content (recursive):** every instance placed in a slot is audited again as its
  own root, against its **own** entry — its `nestedDependencies`, its `slots` rules (paths are
  relative to the content instance) and its slot hosts — with `depth` > 0 on every record. Any
  failure inside it adds `slot-content-internal-problems` to the content, which also blocks its
  host's slot-edit authorization. A visible slot inside slot content whose entry has no rule for
  it is rejected as `nested-slot-without-rule`; nested slots are never assumed valid. Hidden
  slots (by a property or any ancestor, including hidden slot content) are not limit-checked.
  Instances below a non-instance slot child are `inside-slot-content` and must carry no overrides.
- **`SLOT` properties** (`type: "SLOT"`) are not checked as properties; slot content is
  governed by the rules above. They are listed in `slotProperties`.
- **Slots and placeholders**: every effectively visible `SLOT` inside a top-level instance
  must have no `limitViolations` — an empty visible slot below its minimum is reported in
  `slotViolations`. Slots hidden by a property or an ancestor are listed in `hiddenSlots`
  and ignored. Any effectively visible fill bound to a `Pink/*` variable (the library's
  slot placeholder colour) is reported in `placeholderVisible`.

```js
const TARGET_KEY = "<target file key>";
const ROOT_ID = "<screen / wrapper / section id>";
const APPROVED = { /* "<key>": { id: "<registry id>", variants: { "size": ["medium"] }, properties: ["Label#2022:15"] } */ };
const APPROVED_VARIABLE_KEYS = [ /* "<variable key>" */ ];
const APPROVED_STYLE_KEYS = [ /* "<style key>" */ ];
const PREVIOUS = null; // or the previous audit's `snapshot`
const AUDIT_MODE = "compliance"; // "compliance" | "negative-regression" | "full"
const EXCLUDED_ROOTS = ["43:206"]; // intentionally non-compliant fixture sections

if (figma.fileKey !== TARGET_KEY) throw new Error(`Wrong file: ${figma.fileKey}`);
const root = await figma.getNodeByIdAsync(ROOT_ID);
if (!root) throw new Error(`Root ${ROOT_ID} not found`);
let page = root; while (page && page.type !== "PAGE") page = page.parent;
if (page && page !== figma.currentPage) await figma.setCurrentPageAsync(page);
const fixtureOf = n => { for (let p = n; p; p = p.parent) if (EXCLUDED_ROOTS.includes(p.id)) return p.id; return null; };
const rootFixture = fixtureOf(root);
if (AUDIT_MODE === "compliance" && rootFixture) throw new Error(`${ROOT_ID} is inside fixture ${rootFixture}; use AUDIT_MODE "negative-regression"`);
if (AUDIT_MODE === "negative-regression" && !rootFixture) throw new Error(`negative-regression must target a fixture root (${EXCLUDED_ROOTS.join(", ")})`);
const counted = x => AUDIT_MODE === "negative-regression" || !x.fixture; // fixture findings never count as compliance results
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
const typesOf = n => { const o = {}; for (const [k, p] of Object.entries(n.componentProperties || {})) o[k] = p.type; return o; };
// Variant, combination and property scope of one instance against its own registry entry.
// SLOT properties are skipped here: slot content is checked by slot rules / slot-content scope.
function scopeCheck(entry, main, set, props, types = {}) {
  const variantViolations = [], propertyViolations = [], propertiesAtDefault = [], slotProperties = [];
  if (entry.variants) for (const [ax, allowed] of Object.entries(entry.variants))
    if (ax in props && !allowed.includes(props[ax])) variantViolations.push(`${ax}=${props[ax]}`);
  if (entry.variantCombinations && entry.variantCombinations.length && main && !entry.variantCombinations.includes(main.name))
    variantViolations.push(`combination ${main.name}`); // resolved variant name, not just axis values
  const defs = main ? (set || main).componentPropertyDefinitions : {};
  for (const k of Object.keys(props)) {
    if (types[k] === "SLOT") { slotProperties.push(k); continue; }
    if (!k.includes("#") || (entry.properties || []).includes(k)) continue; // variants and approved properties
    if (defs[k] && props[k] === defs[k].defaultValue) propertiesAtDefault.push(k); // unchanged default: not an override
    else propertyViolations.push(`${k}=${JSON.stringify(props[k])}`);
  }
  return { variantViolations, propertyViolations, propertiesAtDefault, slotProperties };
}

const instances = [], frames = [], texts = [], literalPaints = [], containment = [], overlapPairs = [], nestedInstances = [], missingDependencies = [];
const slotViolations = [], hiddenSlots = [], placeholderVisible = [], skippedFixtures = [], slotHostOverrides = [];
// Visible from `n` up to (not including) `stop`; null `stop` walks to the page.
const visibleUpTo = (n, stop) => { for (let p = n; p && (!stop || p.id !== stop.id) && p.type !== "PAGE"; p = p.parent) if (p.visible === false) return false; return true; };
async function pinkFills(n) {
  const out = [];
  for (const p of paintsOf(n, "fills")) if (p.visible !== false && p.opacity !== 0 && p.boundVariables && p.boundVariables.color) {
    const v = await vinfo(p.boundVariables.color);
    if (v && /^Pink\//.test(v.name)) out.push(v.name);
  }
  return out;
}
// Visible SLOT limits and visible Pink/* placeholders inside one top-level instance.
async function auditSlots(top, fixture) {
  const topVisible = visibleUpTo(top, null);
  for (const n of [top, ...top.findAll(() => true)]) {
    const visible = topVisible && visibleUpTo(n, top);
    if (n.type === "SLOT") {
      const rec = { id: n.id, top: top.id, name: n.name, children: n.children.length, limitViolations: [...(n.limitViolations || [])], fixture };
      if (!visible) hiddenSlots.push(rec);
      else if (rec.limitViolations.length) slotViolations.push({ ...rec, problem: rec.children === 0 ? "empty-visible-slot" : "slot-limit" });
    }
    if (visible) for (const v of await pinkFills(n)) placeholderVisible.push({ id: n.id, top: top.id, name: n.name, variable: v, fixture });
  }
}
// Nested instances of one instance, hidden ones included. Called for each top-level instance (depth 0) and
// recursively for each instance placed in a slot, which is validated against its own entry (depth > 0).
// Returns true when anything inside `top` failed.
async function auditNested(top, topEntry, topVariant, fixture, depth = 0, parentOverrides = [], topHidden = false) {
  const deps = topEntry && topEntry.nestedDependencies ? topEntry.nestedDependencies[topVariant] || null : null;
  const rules = topEntry && topEntry.slots ? topEntry.slots[topVariant] || [] : [];
  const prefix = (top.id.startsWith("I") ? top.id : `I${top.id}`) + ";"; // layer paths below `top`
  const seen = new Set(), topOverrides = [...parentOverrides, ...(top.overrides || [])], records = [], hostsHere = [];
  // Inside an instance placed in a slot below `top`: handled by the recursive call for that content.
  const insideContent = n => { for (let p = n.parent; p && p.id !== top.id; p = p.parent) if (p.type === "INSTANCE" && p.parent && p.parent.type === "SLOT") return true; return false; };
  const fieldsOf = n => [...new Set([...topOverrides.filter(o => o.id === n.id), ...(n.overrides || []).filter(o => o.id === n.id)].flatMap(o => o.overriddenFields))];
  // Slot rules, matched by the slot's stable layer path inside the top-level instance (never by child IDs)
  const slotInfo = new Map();
  for (const s of top.findAllWithCriteria({ types: ["SLOT"] })) {
    if (insideContent(s)) continue;
    const path = s.id.startsWith(prefix) ? s.id.slice(prefix.length) : null;
    const rule = path ? rules.find(r => r.slot === path) || null : null;
    let host = s.parent; while (host && host.type !== "INSTANCE") host = host.parent;
    const info = { id: s.id, path, rule, host: host ? host.id : null, problems: [] };
    slotInfo.set(s.id, info);
    const slotVisible = !topHidden && visibleUpTo(top, null) && visibleUpTo(s, top);
    if (!rule) {
      // A visible slot inside slot content must have a rule of its own; nested slots are never assumed valid.
      if (depth > 0 && slotVisible) {
        info.problems.push("nested-slot-without-rule");
        slotViolations.push({ id: s.id, top: top.id, name: s.name, path, children: s.children.length, problem: "slot-rule", problems: info.problems, depth, fixture });
      }
      continue;
    }
    const def = rule.defaultContent || [], items = [];
    for (const c of s.children) {
      if (c.type !== "INSTANCE") { info.problems.push(`slot-non-instance-content ${c.id}`); items.push(null); continue; }
      const { main, key } = await resolve(c); items.push({ key, variant: main && main.name });
    }
    const matchesDefault = items.length === def.length && items.every((it, i) => it && it.key === def[i].key && it.variant === def[i].variant);
    const hostEdited = host && host.id !== top.id ? fieldsOf(host).includes("componentProperties") : null; // top-level hosts do not report slot edits
    if (!matchesDefault && !rule.allowReplacement) info.problems.push("slot-content-changed");
    if (!matchesDefault && hostEdited === false) info.problems.push("slot-default-mismatch");
    if (rule.minChildren != null && s.children.length < rule.minChildren && slotVisible)
      info.problems.push(`slot-below-registry-min ${s.children.length}<${rule.minChildren}`);
    if (rule.maxChildren != null && s.children.length > rule.maxChildren) info.problems.push(`slot-above-registry-max ${s.children.length}>${rule.maxChildren}`);
    if (info.problems.length) slotViolations.push({ id: s.id, top: top.id, name: s.name, path, children: s.children.length, problem: "slot-rule", problems: info.problems, depth, fixture });
  }
  const hostIds = new Set([...slotInfo.values()].map(i => i.host));
  for (const n of top.findAllWithCriteria({ types: ["INSTANCE"] })) {
    if (insideContent(n)) continue;
    const { main, set, key } = await resolve(n);
    const path = []; let hiddenByAncestor = false, slot = null, slotItem = null;
    for (let c = n, p = n.parent; p && p.id !== top.id; c = p, p = p.parent) {
      path.unshift(p.name);
      if (p.visible === false) hiddenByAncestor = true;
      if (p.type === "SLOT" && !slot) { slot = p; slotItem = c; }
    }
    const effectiveVisible = n.visible && !hiddenByAncestor && !topHidden;
    const sourceId = n.id.startsWith(prefix) ? n.id.slice(prefix.length) : null;
    // Overrides on this nested instance, as reported by the top-level instance and by the instance itself
    const fromTop = topOverrides.filter(o => o.id === n.id).flatMap(o => o.overriddenFields);
    const fromSelf = (n.overrides || []).filter(o => o.id === n.id).flatMap(o => o.overriddenFields);
    const overriddenFields = [...new Set([...fromTop, ...fromSelf])];
    const contentOverrides = overriddenFields.filter(f => f !== "componentProperties" && f !== "name"); // slot content: property values (checked below) and layer name only
    const dep = deps && sourceId ? deps.find(d => d.sourceId === sourceId) : null;
    const rule = slotItem === n && slotInfo.has(slot.id) ? slotInfo.get(slot.id).rule : null;
    const problems = []; let scope;
    if (rule) {
      const d = (rule.defaultContent || [])[slot.children.findIndex(c => c.id === n.id)]; // node wrappers are not identity-stable
      if (d && key === d.key && main && main.name === d.variant) {
        scope = "slot-default-content";
        if (overriddenFields.length) problems.push(`nested-override ${overriddenFields.join(",")}`);
      } else {
        scope = "slot-replacement";
        const entry = key ? APPROVED[key] : undefined;
        if (contentOverrides.length) problems.push(`slot-content-override ${contentOverrides.join(",")}`);
        if (!rule.allowReplacement) problems.push("slot-replacement-not-allowed");
        if (!entry || !main || main.remote !== true) problems.push("slot-content-unapproved");
        else {
          if (!(rule.allowedContent || []).includes(entry.id)) problems.push(`slot-content-not-allowed ${entry.id}`);
          const r = scopeCheck(entry, main, set, propsOf(n), typesOf(n)); problems.push(...r.variantViolations, ...r.propertyViolations);
        }
      }
      if (slot.limitViolations && slot.limitViolations.length) problems.push(`slot-limit ${slot.limitViolations.join(",")}`);
    } else if (dep) {
      scope = `nested-dependency-of:${topEntry.id}`; seen.add(dep.sourceId);
      if (key !== dep.key) problems.push(`nested-component-changed ${key}`);
      if (!main || main.name !== dep.variant) problems.push(`nested-variant-changed ${main && main.name}`);
      if (overriddenFields.length) problems.push(`nested-override ${overriddenFields.join(",")}`);
      if (dep.mustRemainHidden && effectiveVisible) problems.push("hidden-dependency-visible");
    } else if (slotItem === n) {
      scope = "slot-content";
      const entry = key ? APPROVED[key] : undefined;
      if (contentOverrides.length) problems.push(`slot-content-override ${contentOverrides.join(",")}`);
      if (!entry || !main || main.remote !== true) problems.push("slot-content-unapproved");
      else { const r = scopeCheck(entry, main, set, propsOf(n), typesOf(n)); problems.push(...r.variantViolations, ...r.propertyViolations); }
      if (slot.limitViolations && slot.limitViolations.length) problems.push(`slot-limit ${slot.limitViolations.join(",")}`);
    } else if (slotItem) {
      scope = "inside-slot-content"; // below a non-instance slot child
      if (overriddenFields.length) problems.push(`nested-override ${overriddenFields.join(",")}`);
    } else if (deps) {
      scope = "unexpected-nested"; problems.push("unexpected-nested-instance");
    } else {
      scope = "nested-unlisted";
      if (overriddenFields.length) problems.push(`nested-override ${overriddenFields.join(",")}`);
    }
    // Slot content is validated recursively against its own entry: its nested instances and its own slots.
    if (slotItem === n && await auditNested(n, key ? APPROVED[key] : undefined, main && main.name, fixture, depth + 1, topOverrides, !effectiveVisible))
      problems.push("slot-content-internal-problems");
    // Non-SLOT, non-variant properties of a slot host that differ from the component default
    let hostPropsChanged = null;
    if (hostIds.has(n.id)) {
      const defs = main ? (set || main).componentPropertyDefinitions : {}, props = propsOf(n), types = typesOf(n);
      hostPropsChanged = Object.keys(props).filter(k => types[k] !== "SLOT" && types[k] !== "VARIANT" && (!defs[k] || props[k] !== defs[k].defaultValue));
    }
    records.push({ id: n.id, top: top.id, sourceId, path: path.join(" / "), name: n.name, visible: n.visible, hiddenByAncestor,
      main: main && main.name, remote: main && main.remote, assetType: set ? "COMPONENT_SET" : "COMPONENT", key, setName: set && set.name,
      scope, registryId: key && APPROVED[key] ? APPROVED[key].id : null, overriddenFields,
      overrideEvidence: { fromTop, fromSelf }, slot: slot ? slot.id : null, hostPropsChanged, depth, problems, fixture });
  }
  // A slot host's componentProperties override is authorized only when it results from approved slot content.
  for (const rec of records) {
    const hosted = [...slotInfo.values()].filter(i => i.host === rec.id);
    if (!hosted.length || !rec.overriddenFields.includes("componentProperties")) continue;
    const reasons = [];
    if (!rec.scope.startsWith("nested-dependency-of")) reasons.push("host-not-a-listed-dependency");
    const otherFields = rec.overriddenFields.filter(f => f !== "componentProperties");
    if (otherFields.length) reasons.push(`host-other-overrides ${otherFields.join(",")}`);
    const otherProblems = rec.problems.filter(p => !p.startsWith("nested-override"));
    if (otherProblems.length) reasons.push(`host-problems ${otherProblems.join(",")}`);
    if (rec.hostPropsChanged.length) reasons.push(`host-properties-changed ${rec.hostPropsChanged.join(",")}`);
    for (const i of hosted) {
      if (!i.rule) reasons.push(`slot-without-rule ${i.path}`);
      else if (i.problems.length) reasons.push(`slot-problems ${i.path}`);
      if (records.some(r => r.slot === i.id && r.problems.length)) reasons.push(`slot-content-problems ${i.path}`);
    }
    if (!reasons.length) rec.problems = rec.problems.filter(p => p !== "nested-override componentProperties");
    const h = { id: rec.id, top: top.id, sourceId: rec.sourceId, authorized: !reasons.length, reasons, depth, fixture };
    slotHostOverrides.push(h); hostsHere.push(h);
  }
  nestedInstances.push(...records);
  const missing = deps ? deps.filter(d => !seen.has(d.sourceId)) : [];
  for (const d of missing) missingDependencies.push({ top: top.id, sourceId: d.sourceId, key: d.key, depth, fixture });
  return records.some(r => r.problems.length) || [...slotInfo.values()].some(i => i.problems.length) || missing.length > 0 || hostsHere.some(h => !h.authorized);
}
async function visit(node, fixture) {
  if (node !== root && EXCLUDED_ROOTS.includes(node.id)) {
    if (AUDIT_MODE === "compliance") { skippedFixtures.push(node.id); return; } // fixtures never enter compliance results
    fixture = node.id;
  }
  const parent = node.parent;
  if (node !== root && parent && parent.type !== "PAGE") {
    const ok = inside(box(node), box(parent));
    if (!ok) containment.push({ id: node.id, name: node.name, parent: parent.id, box: box(node), parentBox: box(parent), fixture });
  }
  if (node.type === "INSTANCE") {
    const { main, set, key } = await resolve(node);
    const props = propsOf(node);
    const entry = key ? APPROVED[key] : undefined;
    const r = entry ? scopeCheck(entry, main, set, props, typesOf(node)) : { variantViolations: [], propertyViolations: [], propertiesAtDefault: [], slotProperties: [] };
    const fonts = new Set();
    for (const t of node.findAllWithCriteria({ types: ["TEXT"] }))
      for (const s of t.getStyledTextSegments(["fontName"])) fonts.add(`${s.fontName.family} ${s.fontName.style}`);
    instances.push({ id: node.id, name: node.name, parent: parent && parent.id, main: main && main.name, remote: main && main.remote,
      key, registryId: entry ? entry.id : null, properties: props, ...r, fonts: [...fonts], layoutPositioning: layoutPos(node), fixture });
    await auditNested(node, entry, main && main.name, fixture); // nested scope; other library internals are not audited
    await auditSlots(node, fixture); // visible SLOT limits and Pink/* placeholders
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
      box: box(node), fixture });
    // Sibling overlap among frames/instances in non-Auto-Layout containers (sections, free frames)
    if ("children" in node && (node.type === "SECTION" || node.layoutMode === "NONE")) {
      const kids = node.children.filter(c => c.type === "FRAME" || c.type === "INSTANCE" || c.type === "SECTION");
      for (let i = 0; i < kids.length; i++) for (let j = i + 1; j < kids.length; j++)
        if (overlaps(box(kids[i]), box(kids[j]))) overlapPairs.push({ pair: [kids[i].id, kids[j].id], fixture });
    }
  }
  if (node.type === "TEXT") {
    let style = null;
    if (typeof node.textStyleId === "string" && node.textStyleId) { const s = await figma.getStyleByIdAsync(node.textStyleId); style = s ? { name: s.name, key: s.key, remote: s.remote } : null; }
    const fills = [];
    for (const p of paintsOf(node, "fills")) fills.push(p.type !== "SOLID" ? p.type : p.boundVariables && p.boundVariables.color ? await vinfo(p.boundVariables.color) : "LITERAL");
    const fonts = [...new Set(node.getStyledTextSegments(["fontName"]).map(s => `${s.fontName.family} ${s.fontName.style}`))];
    texts.push({ id: node.id, name: node.name, parent: parent && parent.id, style, styleMixed: typeof node.textStyleId !== "string", fills, fonts, fixture });
  }
  for (const prop of ["fills", "strokes"])
    for (const p of paintsOf(node, prop))
      if (p.type === "SOLID" && !(p.boundVariables && p.boundVariables.color)) literalPaints.push({ id: node.id, name: node.name, prop, fixture });
  if (visibleUpTo(node, null)) for (const v of await pinkFills(node)) placeholderVisible.push({ id: node.id, top: null, name: node.name, variable: v, fixture });
  if ("children" in node) for (const c of node.children) await visit(c, fixture);
}
await visit(root, rootFixture);

const unapprovedBindings = [];
for (const f of frames) for (const [prop, list] of Object.entries(f.bound))
  for (const v of list) if (!v || !APPROVED_VARIABLE_KEYS.includes(v.key)) unapprovedBindings.push({ id: f.id, prop, variable: v, fixture: f.fixture });

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
// Compliance summaries use counted() records only; in "full" mode fixture findings are reported apart.
const summarize = keep => {
  const I = instances.filter(keep), F = frames.filter(keep), T = texts.filter(keep), N = nestedInstances.filter(keep);
  return {
    unapprovedInstances: I.filter(i => !i.registryId || i.remote !== true),
    variantViolations: I.filter(i => i.variantViolations.length), propertyViolations: I.filter(i => i.propertyViolations.length),
    detachedFrames: F.filter(f => f.detached).map(f => f.id),
    nonAutoLayoutFrames: F.filter(f => f.type === "FRAME" && (!f.layoutMode || f.layoutMode === "NONE")).map(f => f.id),
    absoluteChildren: [...I, ...F].filter(n => n.layoutPositioning === "ABSOLUTE").map(n => n.id),
    containmentViolations: containment.filter(keep), overlapPairs: overlapPairs.filter(keep).map(o => o.pair),
    literalPaints: literalPaints.filter(keep), unapprovedBindings: unapprovedBindings.filter(keep),
    unapprovedStyles: T.filter(t => t.style && !APPROVED_STYLE_KEYS.includes(t.style.key)),
    textsWithoutStyle: T.filter(t => !t.style || t.styleMixed).map(t => t.id),
    textsWithLiteralFill: T.filter(t => t.fills.includes("LITERAL")).map(t => t.id),
    nestedViolations: N.filter(n => n.problems.length).map(n => ({ id: n.id, top: n.top, sourceId: n.sourceId, scope: n.scope, problems: n.problems })),
    missingDependencies: missingDependencies.filter(keep),
    hiddenDependencyVisible: N.filter(n => n.problems.includes("hidden-dependency-visible")).map(n => n.id),
    nestedUnlinked: N.filter(n => n.remote !== true || !n.key).map(n => n.id),
    slotViolations: slotViolations.filter(keep), placeholderVisible: placeholderVisible.filter(keep),
    unauthorizedSlotHostOverrides: slotHostOverrides.filter(keep).filter(h => !h.authorized),
  };
};
return {
  fileKey: figma.fileKey, page: figma.currentPage.name, root: { id: root.id, name: root.name, box: box(root) },
  mode: AUDIT_MODE, excludedRoots: EXCLUDED_ROOTS, skippedFixtures,
  counts: { instances: instances.length, frames: frames.length, texts: texts.length, nested: nestedInstances.length },
  instances, frames, texts,
  ...summarize(counted),
  fontsInUse: [...new Set([...instances.flatMap(i => i.fonts), ...texts.flatMap(t => t.fonts)])],
  nestedInstances,
  nestedHidden: nestedInstances.filter(n => n.visible === false || n.hiddenByAncestor).map(n => n.id),
  nestedNotInRegistry: nestedInstances.filter(n => counted(n) && !n.registryId && !n.scope.startsWith("nested-dependency-of")).map(n => ({ id: n.id, name: n.name, key: n.key })),
  hiddenSlots, slotHostOverrides,
  fixtureFindings: AUDIT_MODE === "full" ? summarize(x => !!x.fixture) : null,
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
| V3 slots | any `slotViolations` (a visible slot outside its limits — an empty visible slot below its minimum is `empty-visible-slot`; a slot that breaks its registry rule is `slot-rule` with `problems`); limit checks ignore slots in `hiddenSlots` | — |
| V3 slot content | any `nestedViolations` with scope `slot-default-content` (an override on default content) or `slot-replacement` (replacement not allowed, content not in `allowedContent`, unapproved, or outside its own entry's variants, combinations or properties) | the host entry has no `slots` rule for a slot the flow edits — the edit is then reported as a `nested-override` on its host |
| V3 slot hosts | any `unauthorizedSlotHostOverrides`; `slotHostOverrides` with `authorized: true` are slot edits, not overrides | — |
| V3 nested slots | any record with `depth` > 0 that has problems (`slot-content-internal-problems` on its content), or a `nested-slot-without-rule` slot violation | — |
| V5 placeholders | any `placeholderVisible` (a visible fill bound to a `Pink/*` placeholder variable) | — |
| Fixtures | in `compliance` mode, `ROOT_ID` inside an `EXCLUDED_ROOTS` section (the script refuses it) | `skippedFixtures` is not empty while the flow under audit was expected inside that root — report it |
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

In `negative-regression` mode every finding is expected: report, per fixture, whether the
intended violation was detected, never PASS/FAIL for compliance. In `full` mode the top-level
summary excludes fixtures and `fixtureFindings` lists their findings separately.

Transparent frames have no fills, which is fine. Literal paints on an *instance* are not
reported because instance internals are not walked for paints or containment; instance
overrides are covered by V3. Nested instances (including hidden ones, listed in
`nestedHidden`) are walked for provenance and nested scope only.
A section or free frame (`layoutMode: NONE`) is the only place where sibling overlap can
happen by accident; Auto Layout parents position children themselves.
