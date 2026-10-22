// Unit tests for the read-only audit in references/validation-audit.md.
// They run the exact script from the md against a small mocked Figma node tree.
// Run: node --test .claude/skills/create-flow/tests/validation-audit.test.mjs (also run in CI)
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const md = readFileSync(new URL("../references/validation-audit.md", import.meta.url), "utf8");
const SCRIPT = md.match(/```js\n([\s\S]*?)```/)[1];
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

// ---- mock Figma ---------------------------------------------------------------------------
const BOX = { x: 0, y: 0, width: 100, height: 50 };
// Like the Plugin API, `parent` and `children` return fresh wrapper objects on every access,
// so the audit must compare nodes by id, never by object identity.
const wrap = n => new Proxy(n, {});
function node(type, id, props = {}, children = []) {
  const n = { type, id, name: props.name || id, visible: true, fills: [], strokes: [], boundVariables: {}, absoluteBoundingBox: BOX, ...props };
  let parent = null;
  Object.defineProperty(n, "parent", { get: () => (parent ? wrap(parent) : null), set: p => { parent = p; } });
  Object.defineProperty(n, "children", { get: () => children.map(wrap) });
  for (const c of children) c.parent = n;
  n.findAll = pred => { const out = []; const walk = x => { for (const c of x.children || []) { if (pred(c)) out.push(c); walk(c); } }; walk(n); return out; };
  n.findAllWithCriteria = ({ types }) => n.findAll(c => types.includes(c.type));
  if (type === "INSTANCE") n.getMainComponentAsync = async () => props.main || null;
  if (type === "TEXT") n.getStyledTextSegments = () => [];
  return n;
}
const set = (key, name, defs = {}) => ({ type: "COMPONENT_SET", key, name, componentPropertyDefinitions: defs });
const comp = (name, parentSet, key) => ({ name, remote: true, key: key || null, parent: parentSet || { type: "PAGE" }, componentPropertyDefinitions: parentSet ? undefined : {} });
const inst = (id, main, props = {}, children = [], extra = {}) => node("INSTANCE", id, { main, componentProperties: props, overrides: [], ...extra }, children);
const slotNode = (id, children = [], extra = {}) => node("SLOT", id, { name: "Slot-variable", limitViolations: [], ...extra }, children);

async function runAudit(rootChildren, approved, mode = "compliance") {
  const root = node("FRAME", "1:1", { layoutMode: "VERTICAL", layoutPositioning: "AUTO", detachedInfo: null, explicitVariableModes: {}, reactions: [], absoluteBoundingBox: { x: -10, y: -10, width: 500, height: 500 } }, rootChildren);
  const page = node("PAGE", "0:1", {}, [root]);
  const byId = new Map(); const index = n => { byId.set(n.id, n); (n.children || []).forEach(index); }; index(page);
  const figma = {
    fileKey: "TEST", currentPage: page, skipInvisibleInstanceChildren: true,
    getNodeByIdAsync: async id => byId.get(id) || null, setCurrentPageAsync: async p => { figma.currentPage = p; },
    variables: { getVariableByIdAsync: async () => null, getVariableCollectionByIdAsync: async () => null },
    getStyleByIdAsync: async () => null,
  };
  const code = SCRIPT.replace('"<target file key>"', '"TEST"').replace('"<screen / wrapper / section id>"', '"1:1"')
    .replace(/const APPROVED = \{ \/\*.*?\*\/ \};/, `const APPROVED = ${JSON.stringify(approved)};`)
    .replace('const AUDIT_MODE = "compliance";', `const AUDIT_MODE = "${mode}";`);
  return new AsyncFunction("figma", code)(figma);
}

// ---- fixtures modelled on the Playground list-item / List-slot / Toggle / Badge ----------
const K = { LI: "li-set", LS: "ls-comp", AIR: "air-comp", BADGE: "badge-set", TOGGLE: "toggle-set", DIVIDER: "divider-set", OTHER: "other-set" };
const liSet = set(K.LI, "list-item", { "Body#7001:9": { type: "TEXT", defaultValue: "Body" } });
const lsComp = comp("List-slot", null, K.LS);
lsComp.componentPropertyDefinitions = { "Slot-variable#7000:1": { type: "SLOT", defaultValue: "default" }, "Show#1:1": { type: "BOOLEAN", defaultValue: true } };
const airComp = comp("airplane", null, K.AIR);
const badgeSet = set(K.BADGE, "Badge", { "Show Icon#7056:0": { type: "BOOLEAN", defaultValue: false } });
const toggleSet = set(K.TOGGLE, "Toggle");
const dividerSet = set(K.DIVIDER, "Divider");
const otherSet = set(K.OTHER, "Other");
const LI_NO = comp("Horizontal padding=No", liSet);
const LI_YES = comp("Horizontal padding=Yes", liSet);
const BADGE_DEFAULT = comp("Property=Soft, Category=Primary, Text=True", badgeSet);
const TOGGLE_ON = comp("active=yes, selected=true, error=false", toggleSet);
const TOGGLE_OFF = comp("active=yes, selected=false, error=false", toggleSet);
const TOGGLE_ERR = comp("active=yes, selected=false, error=true", toggleSet);
const DIVIDER = comp("Alignment=Centered", dividerSet);
const OTHER = comp("Kind=A", otherSet);

const SLOT_PROP = { "Slot-variable#7000:1": { type: "SLOT", value: "default" }, "Show#1:1": { type: "BOOLEAN", value: true } };
const LEFT = "7000:3160", RIGHT = "7000:3166", SLOT = "7000:3114";

const approved = (over = {}) => ({
  [K.LI]: {
    id: "ds.list-item", variants: { "Horizontal padding": ["No"] }, variantCombinations: ["Horizontal padding=No"], properties: ["Body#7001:9"],
    nestedDependencies: { "Horizontal padding=No": [{ sourceId: LEFT, key: K.LS, variant: "List-slot" }, { sourceId: RIGHT, key: K.LS, variant: "List-slot" }] },
    slots: { "Horizontal padding=No": [
      { slot: `${LEFT};${SLOT}`, defaultContent: [{ key: K.AIR, variant: "airplane" }], allowReplacement: false, allowedContent: [], minChildren: 1, maxChildren: 1 },
      { slot: `${RIGHT};${SLOT}`, defaultContent: [{ key: K.BADGE, variant: "Property=Soft, Category=Primary, Text=True" }], allowReplacement: true, allowedContent: ["ds.badge", "ds.toggle"], minChildren: 1, maxChildren: 1 },
    ] },
    ...(over.li || {}),
  },
  [K.BADGE]: { id: "ds.badge", variants: { Property: ["Filled", "Soft", "Small"], Category: ["Primary", "Success"], Text: ["True", "False"] }, properties: ["Show Icon#7056:0"] },
  [K.TOGGLE]: { id: "ds.toggle", variants: { active: ["yes"], selected: ["false", "true"], error: ["false"] }, variantCombinations: ["active=yes, selected=false, error=false", "active=yes, selected=true, error=false"], properties: [], ...(over.toggle || {}) },
  [K.DIVIDER]: { id: "ds.divider", variants: { Alignment: ["Centered"] }, variantCombinations: ["Alignment=Centered"], properties: [] },
});

// One list-item. `left` / `right` are arrays of slot children; `edited` marks hosts whose slot changed.
function listItem(id, { left, right, edited = [], hostProps = {}, hostExtraFields = {}, hostMain = {}, main = LI_NO, leftSlotExtra = {}, rightSlotExtra = {} } = {}) {
  const p = (id.startsWith("I") ? id : `I${id}`) + ";"; // nested content ids already start with I
  const host = side => {
    const sid = side === "left" ? LEFT : RIGHT;
    const kids = (side === "left" ? left : right) || [];
    return inst(`${p}${sid}`, hostMain[side] || lsComp, { ...SLOT_PROP, ...(hostProps[side] || {}) },
      [slotNode(`${p}${sid};${SLOT}`, kids, side === "left" ? leftSlotExtra : rightSlotExtra)]);
  };
  const top = inst(id, main, { "Horizontal padding": { type: "VARIANT", value: "No" }, "Body#7001:9": { type: "TEXT", value: "Body" } }, [host("left"), host("right")]);
  top.overrides = [{ id, overriddenFields: ["name"] }, ...edited.map(side => ({ id: `${p}${side === "left" ? LEFT : RIGHT}`, overriddenFields: ["componentProperties", ...(hostExtraFields[side] || [])] }))];
  return top;
}
const air = (id, extra) => inst(id, airComp, {}, [], extra);
const badge = id => inst(id, BADGE_DEFAULT, { Property: { type: "VARIANT", value: "Soft" }, Category: { type: "VARIANT", value: "Primary" }, Text: { type: "VARIANT", value: "True" }, "Show Icon#7056:0": { type: "BOOLEAN", value: false } });
const toggle = (id, m = TOGGLE_ON) => { const [a, s, e] = m.name.split(", ").map(x => x.split("=")[1]); return inst(id, m, { active: { type: "VARIANT", value: a }, selected: { type: "VARIANT", value: s }, error: { type: "VARIANT", value: e } }); };
const pre = id => (id.startsWith("I") ? id : `I${id}`) + ";";
const defaultItem = id => listItem(id, { left: [air(`${pre(id)}${LEFT};51:221`)], right: [badge(`${pre(id)}${RIGHT};51:229`)] });
const withToggle = (id, m, opts = {}) => listItem(id, { left: [air(`${pre(id)}${LEFT};51:221`)], right: [toggle(`${pre(id)}${RIGHT};${SLOT};56:380`, m)], edited: ["right"], ...opts });

const problemsOf = (res, id) => (res.nestedInstances.find(n => n.id === id) || {}).problems;
const hostOf = (res, id) => res.slotHostOverrides.find(h => h.id === id);
const slotRule = (res, id) => res.slotViolations.filter(v => v.id === id && v.problem === "slot-rule").flatMap(v => v.problems);

// ---- positive ---------------------------------------------------------------------------
test("P1 default list-item: default slot content is clean", async () => {
  const r = await runAudit([defaultItem("10:1")], approved());
  assert.deepEqual(r.nestedViolations, []);
  assert.deepEqual(r.slotViolations, []);
  assert.deepEqual(r.slotHostOverrides, []);
  assert.equal(r.nestedInstances.find(n => n.id === "I10:1;7000:3160;51:221").scope, "slot-default-content");
});

test("P2 approved Toggle replaces Badge: host componentProperties override is authorized", async () => {
  const r = await runAudit([withToggle("10:1", TOGGLE_ON)], approved());
  assert.deepEqual(r.nestedViolations, []);
  assert.deepEqual(r.unauthorizedSlotHostOverrides, []);
  assert.deepEqual(hostOf(r, "I10:1;7000:3166"), { id: "I10:1;7000:3166", top: "10:1", sourceId: RIGHT, authorized: true, reasons: [], depth: 0, fixture: null });
  assert.equal(r.nestedInstances.find(n => n.id === "I10:1;7000:3166;7000:3114;56:380").scope, "slot-replacement");
});

test("P3 default content is matched by slot path, key and variant, not by file-local child IDs", async () => {
  const top = listItem("10:1", { left: [air("I10:1;7000:3160;88:777")], right: [badge("I10:1;7000:3166;99:123")] });
  const r = await runAudit([top], approved());
  assert.deepEqual(r.nestedViolations, []);
  assert.deepEqual(r.slotViolations, []);
});

test("P4 SLOT-type properties are not reported as property overrides", async () => {
  const cSet = set("cont-set", "Container", { "Content#6379:16": { type: "SLOT", defaultValue: "a" } });
  const top = inst("20:1", comp("Container", cSet), { "Content#6379:16": { type: "SLOT", value: "b" } }, [slotNode("I20:1;6379:8019", [inst("I20:1;6379:8019;57:410", DIVIDER, { Alignment: { type: "VARIANT", value: "Centered" } })])]);
  const r = await runAudit([top], { ...approved(), "cont-set": { id: "TEST:container", variants: {}, properties: [] } });
  assert.deepEqual(r.propertyViolations, []);
  assert.deepEqual(r.instances.find(i => i.id === "20:1").slotProperties, ["Content#6379:16"]);
  assert.deepEqual(r.nestedViolations, []); // rule-less slot content checked against its own entry
});

test("P5 hidden slot: registry minimum is not enforced", async () => {
  const top = listItem("10:1", { left: [], right: [badge("I10:1;7000:3166;51:229")], edited: ["left"] });
  top.children[0].visible = false; // host hidden, e.g. by the parent's own property
  const r = await runAudit([top], approved({ li: { slots: { "Horizontal padding=No": [
    { slot: `${LEFT};${SLOT}`, defaultContent: [], allowReplacement: false, allowedContent: [], minChildren: 1 },
    approved()[K.LI].slots["Horizontal padding=No"][1]] } } }));
  assert.deepEqual(slotRule(r, "I10:1;7000:3160;7000:3114"), []);
});

// ---- negative: slot content ---------------------------------------------------------------
test("N1 replacement outside its own entry's exact variant combinations is rejected", async () => {
  const r = await runAudit([withToggle("10:1", TOGGLE_ON)], approved({ toggle: { variantCombinations: ["active=yes, selected=false, error=false"] } }));
  assert.ok(problemsOf(r, "I10:1;7000:3166;7000:3114;56:380").includes("combination active=yes, selected=true, error=false"));
  assert.equal(hostOf(r, "I10:1;7000:3166").authorized, false);
  assert.ok(problemsOf(r, "I10:1;7000:3166").includes("nested-override componentProperties"));
});

test("N2 replacement axis value outside its own entry is rejected", async () => {
  const r = await runAudit([withToggle("10:1", TOGGLE_ERR)], approved());
  assert.ok(problemsOf(r, "I10:1;7000:3166;7000:3114;56:380").includes("error=true"));
  assert.equal(hostOf(r, "I10:1;7000:3166").authorized, false);
});

test("N3 approved component not in allowedContent is rejected", async () => {
  const top = listItem("10:1", { left: [air("I10:1;7000:3160;51:221")], right: [inst("I10:1;7000:3166;7000:3114;56:390", DIVIDER, { Alignment: { type: "VARIANT", value: "Centered" } })], edited: ["right"] });
  const r = await runAudit([top], approved());
  assert.ok(problemsOf(r, "I10:1;7000:3166;7000:3114;56:390").includes("slot-content-not-allowed ds.divider"));
  assert.equal(hostOf(r, "I10:1;7000:3166").authorized, false);
});

test("N4 unapproved component as slot content is rejected", async () => {
  const top = listItem("10:1", { left: [air("I10:1;7000:3160;51:221")], right: [inst("I10:1;7000:3166;7000:3114;56:391", OTHER, { Kind: { type: "VARIANT", value: "A" } })], edited: ["right"] });
  const r = await runAudit([top], approved());
  assert.ok(problemsOf(r, "I10:1;7000:3166;7000:3114;56:391").includes("slot-content-unapproved"));
});

test("N5 replacement in a slot that does not allow it (airplane slot) is rejected", async () => {
  const top = listItem("10:1", { left: [toggle("I10:1;7000:3160;7000:3114;56:392", TOGGLE_OFF)], right: [badge("I10:1;7000:3166;51:229")], edited: ["left"] });
  const r = await runAudit([top], approved());
  assert.ok(problemsOf(r, "I10:1;7000:3160;7000:3114;56:392").includes("slot-replacement-not-allowed"));
  assert.ok(slotRule(r, "I10:1;7000:3160;7000:3114").includes("slot-content-changed"));
  assert.equal(hostOf(r, "I10:1;7000:3160").authorized, false);
});

test("N6 removed default content: content changed and below registry minimum", async () => {
  const top = listItem("10:1", { left: [], right: [badge("I10:1;7000:3166;51:229")], edited: ["left"] });
  const r = await runAudit([top], approved());
  assert.deepEqual(slotRule(r, "I10:1;7000:3160;7000:3114"), ["slot-content-changed", "slot-below-registry-min 0<1"]);
  assert.ok(problemsOf(r, "I10:1;7000:3160").includes("nested-override componentProperties"));
});

test("N7 more children than maxChildren is rejected", async () => {
  const top = listItem("10:1", { left: [air("I10:1;7000:3160;51:221")], right: [toggle("I10:1;7000:3166;7000:3114;56:380"), toggle("I10:1;7000:3166;7000:3114;56:381")], edited: ["right"] });
  const r = await runAudit([top], approved());
  assert.ok(slotRule(r, "I10:1;7000:3166;7000:3114").includes("slot-above-registry-max 2>1"));
  assert.equal(hostOf(r, "I10:1;7000:3166").authorized, false);
});

test("N8 non-instance slot child is rejected", async () => {
  const top = listItem("10:1", { left: [air("I10:1;7000:3160;51:221")], right: [node("FRAME", "I10:1;7000:3166;7000:3114;56:400", { layoutMode: "NONE" })], edited: ["right"] });
  const r = await runAudit([top], approved());
  assert.ok(slotRule(r, "I10:1;7000:3166;7000:3114").includes("slot-non-instance-content I10:1;7000:3166;7000:3114;56:400"));
});

test("N9 override on default slot content is rejected", async () => {
  const a = air("I10:1;7000:3160;51:221");
  const top = listItem("10:1", { left: [a], right: [badge("I10:1;7000:3166;51:229")] });
  top.overrides.push({ id: a.id, overriddenFields: ["fills"] });
  const r = await runAudit([top], approved());
  assert.ok(problemsOf(r, a.id).includes("nested-override fills"));
});

test("N10 stale rule: wrong default variant in the registry is flagged on untouched slots", async () => {
  const wrong = approved();
  wrong[K.LI].slots["Horizontal padding=No"][1].defaultContent = [{ key: K.BADGE, variant: "Property=Filled, Category=Primary, Text=True" }];
  const r = await runAudit([defaultItem("10:1")], wrong);
  assert.ok(slotRule(r, "I10:1;7000:3166;7000:3114").includes("slot-default-mismatch"));
});

// ---- negative: slot host --------------------------------------------------------------------
test("N11 host with a changed non-SLOT property (swap / edit) keeps its nested override", async () => {
  const r = await runAudit([withToggle("10:1", TOGGLE_ON, { hostProps: { right: { "Show#1:1": { type: "BOOLEAN", value: false } } } })], approved());
  assert.deepEqual(hostOf(r, "I10:1;7000:3166").reasons, ["host-properties-changed Show#1:1"]);
  assert.ok(problemsOf(r, "I10:1;7000:3166").includes("nested-override componentProperties"));
});

test("N12 host with an extra overridden field keeps its nested override", async () => {
  const r = await runAudit([withToggle("10:1", TOGGLE_ON, { hostExtraFields: { right: ["visible"] } })], approved());
  assert.ok(hostOf(r, "I10:1;7000:3166").reasons.includes("host-other-overrides visible"));
  assert.ok(problemsOf(r, "I10:1;7000:3166").includes("nested-override componentProperties,visible"));
});

test("N13 host variant / component change is not excused by slot content", async () => {
  const otherLs = comp("List-slot v2", null, K.LS);
  otherLs.componentPropertyDefinitions = lsComp.componentPropertyDefinitions;
  const r = await runAudit([withToggle("10:1", TOGGLE_ON, { hostMain: { right: otherLs } })], approved());
  assert.ok(problemsOf(r, "I10:1;7000:3166").includes("nested-variant-changed List-slot v2"));
  assert.equal(hostOf(r, "I10:1;7000:3166").authorized, false);
});

test("N14 slot without a registry rule: host slot edit stays a nested override (r6 behaviour)", async () => {
  const noRules = approved(); delete noRules[K.LI].slots;
  const r = await runAudit([withToggle("10:1", TOGGLE_ON)], noRules);
  assert.ok(problemsOf(r, "I10:1;7000:3166").includes("nested-override componentProperties"));
  assert.ok(hostOf(r, "I10:1;7000:3166").reasons.includes(`slot-without-rule ${RIGHT};${SLOT}`));
});

test("N15 rules are per variant: a rule for another variant does not apply", async () => {
  const yesOnly = approved();
  yesOnly[K.LI].slots = { "Horizontal padding=Yes": yesOnly[K.LI].slots["Horizontal padding=No"] };
  const r = await runAudit([withToggle("10:1", TOGGLE_ON)], yesOnly);
  assert.equal(hostOf(r, "I10:1;7000:3166").authorized, false);
});

test("R1 unrelated nested override (no slot involved) is still rejected", async () => {
  const top = defaultItem("10:1");
  top.overrides.push({ id: "I10:1;7000:3160", overriddenFields: ["visible"] });
  const r = await runAudit([top], approved());
  assert.ok(problemsOf(r, "I10:1;7000:3160").includes("nested-override visible"));
  assert.deepEqual(r.slotHostOverrides, []);
});

test("R2 top-level variant outside variantCombinations is still rejected", async () => {
  const top = defaultItem("10:1"); top.main = LI_YES; top.getMainComponentAsync = async () => LI_YES;
  top.componentProperties["Horizontal padding"].value = "Yes";
  const r = await runAudit([top], approved());
  assert.equal(r.variantViolations.length, 1);
});

test("N16 same component as the default but another variant is a replacement, checked against its own entry", async () => {
  const errBadge = inst("I10:1;7000:3166;7000:3114;56:393", comp("Property=Soft, Category=Error, Text=True", badgeSet),
    { Property: { type: "VARIANT", value: "Soft" }, Category: { type: "VARIANT", value: "Error" }, Text: { type: "VARIANT", value: "True" } });
  const top = listItem("10:1", { left: [air("I10:1;7000:3160;51:221")], right: [errBadge], edited: ["right"] });
  const r = await runAudit([top], approved());
  const rec = r.nestedInstances.find(n => n.id === errBadge.id);
  assert.equal(rec.scope, "slot-replacement");
  assert.ok(rec.problems.includes("Category=Error"));
  assert.equal(hostOf(r, "I10:1;7000:3166").authorized, false);
});

test("N17 slot host that is not a listed nested dependency is not excused", async () => {
  const noDeps = approved(); delete noDeps[K.LI].nestedDependencies;
  const r = await runAudit([withToggle("10:1", TOGGLE_ON)], noDeps);
  assert.deepEqual(hostOf(r, "I10:1;7000:3166").reasons, ["host-not-a-listed-dependency"]);
  assert.ok(problemsOf(r, "I10:1;7000:3166").includes("nested-override componentProperties"));
});

// ---- nested slots: slot content is validated recursively against its own entry -------------
const contSet = set("cont-set", "Container", { "Content#6379:16": { type: "SLOT", defaultValue: "a" } });
const CONTAINER = comp("Container", contSet);
const CONT_ENTRY = { id: "TEST:container", variants: {}, properties: [] };
const LI_ENTRY_IN_CONTAINER = { id: "ds.list-item" };
// Container 20:1 whose Content slot holds one list-item (built with the same helper, nested ids)
function containerWith(content, extra = {}) {
  const top = inst("20:1", CONTAINER, { "Content#6379:16": { type: "SLOT", value: "b" } }, [slotNode("I20:1;6379:8019", [content])], extra);
  return top;
}
const CID = "I20:1;6379:8019;57:410"; // file-local id of the appended list-item
const withContainer = (over = {}) => ({ ...approved(over), "cont-set": CONT_ENTRY });

test("NS1 list-item placed in a slot: its own slots are validated recursively (defaults clean)", async () => {
  const li = defaultItem(CID);
  const r = await runAudit([containerWith(li)], withContainer());
  assert.deepEqual(r.nestedViolations, []);
  assert.deepEqual(r.slotViolations, []);
  const airRec = r.nestedInstances.find(n => n.id === `${CID};7000:3160;51:221`);
  assert.equal(airRec.scope, "slot-default-content");
  assert.equal(airRec.depth, 1);
  assert.equal(airRec.top, CID);
});

test("NS2 approved Toggle in the nested list-item's right slot is authorized (overrides reported on the outer instance)", async () => {
  const li = withToggle(CID, TOGGLE_ON);
  const outer = containerWith(li);
  outer.overrides = li.overrides; li.overrides = []; // Figma may report nested overrides on the outer instance
  const r = await runAudit([outer], withContainer());
  assert.deepEqual(r.nestedViolations, []);
  assert.equal(hostOf(r, `${CID};7000:3166`).authorized, true);
  assert.equal(hostOf(r, `${CID};7000:3166`).depth, 1);
});

test("NS3 invalid Toggle in a nested slot is rejected and marks the outer content", async () => {
  const li = withToggle(CID, TOGGLE_ERR);
  const r = await runAudit([containerWith(li)], withContainer());
  assert.ok(problemsOf(r, `${CID};7000:3166;7000:3114;56:380`).includes("error=true"));
  assert.ok(problemsOf(r, CID).includes("slot-content-internal-problems"));
  assert.equal(hostOf(r, `${CID};7000:3166`).authorized, false);
});

test("NS4 visible nested slot whose content entry has no rule is rejected explicitly", async () => {
  const noRules = withContainer(); delete noRules[K.LI].slots;
  const r = await runAudit([containerWith(defaultItem(CID))], noRules);
  const v = r.slotViolations.filter(x => x.problem === "slot-rule").map(x => [x.id, x.problems, x.depth]);
  assert.deepEqual(v, [[`${CID};7000:3160;7000:3114`, ["nested-slot-without-rule"], 1], [`${CID};7000:3166;7000:3114`, ["nested-slot-without-rule"], 1]]);
  assert.ok(problemsOf(r, CID).includes("slot-content-internal-problems"));
});

test("NS5 hidden nested slot content is not limit-checked and has no nested-slot-without-rule", async () => {
  const noRules = withContainer(); delete noRules[K.LI].slots;
  const li = defaultItem(CID); li.visible = false;
  const r = await runAudit([containerWith(li)], noRules);
  assert.deepEqual(r.slotViolations.filter(x => x.problem === "slot-rule"), []);
});

test("NS6 nested content's own built-in dependencies are enforced (component changed)", async () => {
  const otherLs = comp("List-slot v2", null, K.LS);
  otherLs.componentPropertyDefinitions = lsComp.componentPropertyDefinitions;
  const li = listItem(CID, { left: [air(`${CID};7000:3160;51:221`)], right: [badge(`${CID};7000:3166;51:229`)], hostMain: { left: otherLs } });
  const r = await runAudit([containerWith(li)], withContainer());
  assert.ok(problemsOf(r, `${CID};7000:3160`).includes("nested-variant-changed List-slot v2"));
  assert.ok(problemsOf(r, CID).includes("slot-content-internal-problems"));
});

test("NS7 unapproved nested content is still reported, and its inner instances are not silently skipped", async () => {
  const li = defaultItem(CID);
  const noLi = withContainer(); delete noLi[K.LI];
  const a = `${CID};7000:3160;51:221`;
  const outer = containerWith(li); outer.overrides = [{ id: a, overriddenFields: ["fills"] }];
  const r = await runAudit([outer], noLi);
  assert.ok(problemsOf(r, CID).includes("slot-content-unapproved"));
  assert.ok(problemsOf(r, a).includes("slot-content-unapproved"));
  assert.ok(problemsOf(r, a).includes("slot-content-override fills"));
});

test("N18 approved replacement with a visual override (fills) is rejected", async () => {
  const top = withToggle("10:1", TOGGLE_ON);
  top.overrides.push({ id: "I10:1;7000:3166;7000:3114;56:380", overriddenFields: ["fills"] });
  const r = await runAudit([top], approved());
  assert.ok(problemsOf(r, "I10:1;7000:3166;7000:3114;56:380").includes("slot-content-override fills"));
  assert.equal(hostOf(r, "I10:1;7000:3166").authorized, false);
});

test("N19 rule-less slot content with a visual override is rejected", async () => {
  const top = inst("20:1", CONTAINER, { "Content#6379:16": { type: "SLOT", value: "b" } }, [slotNode("I20:1;6379:8019", [inst("I20:1;6379:8019;57:410", DIVIDER, { Alignment: { type: "VARIANT", value: "Centered" } })])]);
  top.overrides = [{ id: "I20:1;6379:8019;57:410", overriddenFields: ["opacity"] }];
  const r = await runAudit([top], withContainer());
  assert.ok(problemsOf(r, "I20:1;6379:8019;57:410").includes("slot-content-override opacity"));
});
