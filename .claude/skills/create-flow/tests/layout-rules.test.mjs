// Unit tests for the r8 checks in references/validation-audit.md: V15 sizing, V16 own overrides,
// V11 content-box containment, V17 text overflow, V18 content constraints, and the separate
// compliance / visual-integrity results. They run the exact script from the md against a mocked
// Figma node tree whose geometry is taken from the r8 layout capability evidence (2026-10-26,
// page 100:1240). The audit constants are generated from the real registry.
// Run: node --test .claude/skills/create-flow/tests/layout-rules.test.mjs (also run in CI)
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildApproved, assembleAudit, USE_FIGMA_LIMIT } from "../../../../design-governance/scripts/build-audit-constants.mjs";

const md = readFileSync(new URL("../references/validation-audit.md", import.meta.url), "utf8");
const SCRIPT = md.match(/```js\n([\s\S]*?)```/)[1];
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const REGISTRY = JSON.parse(readFileSync(new URL("../../../../design-governance/component-registry.json", import.meta.url), "utf8"));

// ---- mock Figma (fresh wrappers on parent/children access, like the Plugin API) ----------------
const bb = (x, y, width, height) => ({ x, y, width, height });
const wrap = n => new Proxy(n, {});
function node(type, id, props = {}, children = []) {
  const box = props.absoluteBoundingBox || bb(0, 0, 100, 50);
  const n = { type, id, name: id, visible: true, fills: [], strokes: [], boundVariables: {}, width: box.width, height: box.height, ...props, absoluteBoundingBox: box };
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
async function runAudit(rootChildren, approved, { mode = "compliance", rootId = "1:1", code: ready = null } = {}) {
  const root = node("FRAME", rootId, { layoutMode: "VERTICAL", layoutPositioning: "AUTO", detachedInfo: null, absoluteBoundingBox: bb(-1000, -1000, 5000, 5000) }, rootChildren);
  const page = node("PAGE", "0:1", {}, [root]);
  const byId = new Map(); const index = n => { byId.set(n.id, n); (n.children || []).forEach(index); }; index(page);
  const figma = {
    fileKey: "TEST", currentPage: page, skipInvisibleInstanceChildren: true,
    getNodeByIdAsync: async id => byId.get(id) || null, setCurrentPageAsync: async p => { figma.currentPage = p; },
    variables: { getVariableByIdAsync: async () => null, getVariableCollectionByIdAsync: async () => null },
    getStyleByIdAsync: async () => null,
  };
  const code = ready || SCRIPT.replace('"<target file key>"', '"TEST"').replace('"<screen / wrapper / section id>"', `"${rootId}"`)
    .replace(/const APPROVED = \{ \/\*.*?\*\/ \};/, `const APPROVED = ${JSON.stringify(approved)};`)
    .replace('const AUDIT_MODE = "compliance";', `const AUDIT_MODE = "${mode}";`);
  return new AsyncFunction("figma", code)(figma);
}

// ---- audit constants from the real registry ----------------------------------------------------
// Layout tests focus on sizing: nested dependencies and slot rules are covered by validation-audit.test.mjs.
function approvedFrom(registry, { layoutStatus = null, edit = null } = {}) {
  const r = JSON.parse(JSON.stringify(registry));
  for (const c of r.components) if (c.layout && layoutStatus) {
    c.layout.status = layoutStatus;
    c.layout.approval = layoutStatus === "approved" ? { by: "test", quote: "test approval", at: "2026-10-26", scope: "unit test" } : null;
  }
  if (edit) edit(r);
  const { APPROVED } = buildApproved(r);
  for (const e of Object.values(APPROVED)) { delete e.nestedDependencies; delete e.slots; }
  return APPROVED;
}
const AS_REGISTERED = approvedFrom(REGISTRY);                          // r8 as committed: every layout "proposed"
const FILL_APPROVED = approvedFrom(REGISTRY, { layoutStatus: "approved" }); // simulates a future approval

// ---- library variants (geometry from the r8 evidence) ---------------------------------------------
const keyOf = id => { const c = REGISTRY.components.find(x => x.id === id); return c.componentSetKey || c.componentKey; };
const setOf = (id, name) => ({ type: "COMPONENT_SET", key: keyOf(id), name, componentPropertyDefinitions: {} });
const SETS = { btn: setOf("ds.button", "button"), div: setOf("ds.divider", "Divider"), nav: setOf("ds.navigation-header", "navigation-header"),
  li: setOf("ds.list-item", "list-item"), input: setOf("ds.input", "Input"), tog: setOf("ds.toggle", "Toggle") };
const variant = (name, set, layoutMode, primary, counter, width, height) =>
  ({ name, remote: true, key: null, parent: set, layoutMode, primaryAxisSizingMode: primary, counterAxisSizingMode: counter, width, height });
const BTN = variant("property=primary, size=large, State=default", SETS.btn, "HORIZONTAL", "AUTO", "AUTO", 87, 52);
const DIV_C = variant("Alignment=Centered", SETS.div, "VERTICAL", "AUTO", "FIXED", 216, 8);
const DIV_R = variant("Alignment=Right aligned", SETS.div, "VERTICAL", "AUTO", "FIXED", 216, 0);
const NAV = variant("Property=Default", SETS.nav, "HORIZONTAL", "FIXED", "AUTO", 390, 64);
const LI_NO = variant("Horizontal padding=No", SETS.li, "HORIZONTAL", "FIXED", "FIXED", 358, 64);
const LI_YES = variant("Horizontal padding=Yes", SETS.li, "HORIZONTAL", "FIXED", "FIXED", 358, 64);
const IN_FILLED = variant("State=Filled", SETS.input, "VERTICAL", "AUTO", "FIXED", 358, 76);
const IN_ERROR = variant("State=Error", SETS.input, "VERTICAL", "AUTO", "FIXED", 358, 76);
const TOGGLE = variant("active=yes, selected=true, error=false", SETS.tog, "HORIZONTAL", "FIXED", "FIXED", 36, 20);
const nativeModes = m => { const hz = m.layoutMode === "HORIZONTAL", a = x => (x === "AUTO" ? "HUG" : "FIXED");
  return [a(hz ? m.primaryAxisSizingMode : m.counterAxisSizingMode), a(hz ? m.counterAxisSizingMode : m.primaryAxisSizingMode)]; };

/** An instance placed at (x, y). `own` = fields Figma records as overridden on the instance itself. */
function place(id, main, { x = 0, y = 0, w = main.width, h = main.height, sizingH, sizingV, own = ["name"], extra = {}, children = [] } = {}) {
  const [nh, nv] = nativeModes(main);
  return node("INSTANCE", id, {
    main, componentProperties: {}, overrides: [{ id, overriddenFields: own }],
    layoutSizingHorizontal: sizingH || nh, layoutSizingVertical: sizingV || nv, layoutPositioning: "AUTO", layoutGrow: 0, rotation: 0,
    minWidth: null, maxWidth: null, minHeight: null, maxHeight: null, absoluteBoundingBox: bb(x, y, w, h), ...extra,
  }, children);
}
/** Auto Layout frame. `inner` = width available to FILL children (width minus horizontal padding). */
function frame(id, children, { x = 0, y = 0, inner = 361, pad = 16, h = 1200, layoutMode = "VERTICAL", wrapMode = "NO_WRAP", align = "MIN", clips = false } = {}) {
  return node("FRAME", id, { layoutMode, layoutWrap: wrapMode, counterAxisAlignItems: align, paddingLeft: pad, paddingRight: pad, paddingTop: 0, paddingBottom: 0,
    clipsContent: clips, layoutPositioning: "AUTO", detachedInfo: null, absoluteBoundingBox: bb(x, y, inner + 2 * pad, h) }, children);
}
const text = (id, characters, box, { lh = 20, truncation = "DISABLED", maxLines = null, name = id } = {}) =>
  node("TEXT", id, { name, characters, lineHeight: { unit: "PIXELS", value: lh }, fontSize: 14, textTruncation: truncation, maxLines, absoluteBoundingBox: box, textStyleId: "" });

const sizingOf = (r, id) => r.sizing.find(s => s.id === id);
const problemsOf = (r, id) => (r.sizingViolations.find(s => s.id === id) || { problems: [] }).problems;
const unverifiedOf = (r, id) => (r.sizingUnverified.find(s => s.id === id) || { unverified: [] }).unverified;
const ids = list => list.map(x => x.id).sort();

// ---- positive ---------------------------------------------------------------------------------------
test("L-P1 native placement that fits: all five components are NATIVE and COMPLIANT", async () => {
  const r = await runAudit([
    frame("2:1", [
      place("3:1", BTN, { x: 16, y: 0, w: 99, own: ["height", "name", "width"],        // label changed: HUG width follows content
        children: [text("I3:1;27:185", "შენახვა", bb(36, 16, 59, 20))] }),
      place("3:2", DIV_C, { x: 16, y: 60 }),
      place("3:3", LI_NO, { x: 16, y: 80, children: [text("I3:3;7000:3163", "SMS", bb(16, 102, 200, 20))] }),
      place("3:4", IN_FILLED, { x: 16, y: 150, h: 52, own: ["height", "name", "width"], // helper text hidden: HUG height 76 -> 52
        children: [node("FRAME", "I3:4;2035:2137", { name: "Input", layoutMode: "HORIZONTAL", absoluteBoundingBox: bb(16, 150, 358, 52) }, [ // verified field path
          node("FRAME", "I3:4;2051:3013", { name: "Label+Text", layoutMode: "VERTICAL", absoluteBoundingBox: bb(32, 156, 326, 40) }, [
            text("I3:4;2051:3014", "ელ-ფოსტა", bb(32, 156, 326, 16), { lh: 16 }), text("I3:4;2051:3015", "user@silknet.com", bb(32, 176, 326, 20))])])] }),
    ]),
    frame("2:2", [place("3:5", NAV, { x: 0, y: 1300, children: [text("I3:5;4166:2587", "შეტყობინებები", bb(76, 1322, 238, 20), { truncation: "ENDING", maxLines: 2 })] })],
      { y: 1300, inner: 393, pad: 0, h: 100 }),
  ], AS_REGISTERED);
  assert.deepEqual(r.sizingViolations, []);
  assert.deepEqual(r.selfOverrideViolations, []);
  assert.deepEqual(r.sizingUnverified, []);
  assert.deepEqual(r.layoutContainment, []);
  assert.deepEqual([r.textOverflow, r.contentConstraintViolations, r.possibleTruncation], [[], [], []]);
  assert.equal(r.resultClass, "COMPLIANT");
  assert.equal(r.compliance.result, "PASS");
  // Every constrained layer is found at its verified path (Input field container 2035:2137), so nothing is UNVERIFIED.
  assert.deepEqual(r.contentConstraintUnverified, []);
  assert.equal(r.visualIntegrity.result, "PASS");
  assert.deepEqual(sizingOf(r, "3:1").horizontal, { cls: "NATIVE", contentDriven: true, delta: "87->99" });
  assert.deepEqual(sizingOf(r, "3:4").vertical, { cls: "NATIVE", contentDriven: true, delta: "76->52" });
});

test("L-P2 FILL in the tested vertical context at inner widths 288/361/398 (and 320/393/430 for the header) passes once approved", async () => {
  const kids = [];
  [288, 361, 398].forEach((inner, i) => {
    const x = i * 600, base = `${10 + i}`;
    kids.push(frame(`${base}:0`, [
      place(`${base}:1`, BTN, { x: x + 16, y: 0, w: inner, sizingH: "FILL", own: ["height", "name", "primaryAxisSizingMode", "width"] }),
      place(`${base}:2`, DIV_C, { x: x + 16, y: 60, w: inner, sizingH: "FILL", own: ["height", "name", "width"] }),
      place(`${base}:3`, DIV_R, { x: x + 16, y: 80, w: inner, sizingH: "FILL", own: ["height", "name", "width"] }), // 0 px high
      place(`${base}:4`, LI_NO, { x: x + 16, y: 100, w: inner, sizingH: "FILL", own: ["height", "name", "width"] }),
      place(`${base}:5`, LI_YES, { x: x + 16, y: 180, w: inner, sizingH: "FILL", own: ["height", "name", "width"] }),
      place(`${base}:6`, IN_FILLED, { x: x + 16, y: 260, w: inner, h: 52, sizingH: "FILL", own: ["height", "name", "width"] }),
    ], { x, inner }));
  });
  [320, 393, 430].forEach((inner, i) => {
    const x = i * 600, base = `${20 + i}`;
    kids.push(frame(`${base}:0`, [place(`${base}:1`, NAV, { x, y: 2000, w: inner, sizingH: "FILL", own: ["height", "name", "width"] })], { x, y: 2000, inner, pad: 0, h: 100 }));
  });
  const r = await runAudit(kids, FILL_APPROVED);
  assert.deepEqual(r.sizingViolations, []);
  assert.deepEqual(r.selfOverrideViolations, []); // Button FILL may add primaryAxisSizingMode
  assert.deepEqual(r.sizingUnverified, []);
  assert.deepEqual(r.layoutContainment, []);
  assert.equal(r.resultClass, "COMPLIANT");
  assert.deepEqual(sizingOf(r, "10:1").context, { id: "ctx.vertical-frame.v1", parentInnerWidth: 288 });
  assert.equal(r.sizing.filter(s => s.horizontal.cls === "FILL").length, 21);
});

test("L-P3 content-driven geometry is not an explicit resize: long header title grows the HUG height 64 -> 72", async () => {
  const nav = place("3:1", NAV, { x: 0, y: 0, h: 72, own: ["height", "name", "width"] });
  const r = await runAudit([frame("2:1", [nav], { inner: 393, pad: 0, h: 200 })], AS_REGISTERED);
  assert.deepEqual(sizingOf(r, "3:1").vertical, { cls: "NATIVE", contentDriven: true, delta: "64->72" });
  assert.deepEqual(r.sizingViolations, []);
});

// ---- negative: explicit sizing -------------------------------------------------------------------------
test("L-N1 Button frozen at a fixed 200 px (HUG -> FIXED) is an explicit resize", async () => {
  const r = await runAudit([frame("2:1", [place("3:1", BTN, { x: 16, w: 200, sizingH: "FIXED", own: ["height", "name", "primaryAxisSizingMode", "width"] })])], FILL_APPROVED);
  assert.ok(problemsOf(r, "3:1").includes("explicit-resize horizontal sizing HUG->FIXED"));
  assert.deepEqual(r.selfOverrideViolations, [{ id: "3:1", fields: ["primaryAxisSizingMode"] }]); // only allowed with FILL
  assert.equal(r.resultClass, "NON_COMPLIANT");
});

test("L-N2 list-item resized to 80 px high (FIXED axis, height override recorded) is an explicit resize", async () => {
  const r = await runAudit([frame("2:1", [place("3:1", LI_NO, { x: 16, h: 80, own: ["height", "name"] })])], AS_REGISTERED);
  assert.deepEqual(problemsOf(r, "3:1"), ["explicit-resize vertical height override 64->80"]);
});

test("L-N3 Input resized to 300 px wide (FIXED axis, width override recorded) is an explicit resize", async () => {
  const r = await runAudit([frame("2:1", [place("3:1", IN_FILLED, { x: 16, w: 300, h: 52, own: ["height", "name", "width"] })])], AS_REGISTERED);
  assert.deepEqual(problemsOf(r, "3:1"), ["explicit-resize horizontal width override 358->300"]);
});

test("L-N3b a changed FIXED width WITHOUT a recorded width override is UNVERIFIED, not an explicit resize", async () => {
  const r = await runAudit([frame("2:1", [place("3:1", IN_FILLED, { x: 16, w: 300, h: 52, own: ["height", "name"] })])], AS_REGISTERED);
  assert.deepEqual(problemsOf(r, "3:1"), []);
  assert.deepEqual(unverifiedOf(r, "3:1"), ["geometry-unexplained horizontal 358->300 (no width override recorded)"]);
  assert.equal(r.compliance.result, "UNVERIFIED");
});

test("L-N3c library drift: the variant grew to 360 but the instance keeps the verified 358 — UNVERIFIED, not an explicit resize", async () => {
  const drifted = { ...IN_FILLED, width: 360 };
  const r = await runAudit([frame("2:1", [place("3:1", drifted, { x: 16, w: 358, h: 52, own: ["height", "name", "width"] })])], AS_REGISTERED);
  assert.deepEqual(problemsOf(r, "3:1"), []);
  assert.deepEqual(unverifiedOf(r, "3:1"), ["layout-rule-stale State=Filled",
    "geometry-unexplained horizontal 360->358 (size equals the registry's verified native size; the library variant may have changed)"]);
});

test("L-N4 list-item switched to HUG width (FIXED -> HUG) is an explicit resize", async () => {
  const r = await runAudit([frame("2:1", [place("3:1", LI_NO, { x: 16, w: 300, sizingH: "HUG", own: ["name", "primaryAxisSizingMode", "width"] })])], AS_REGISTERED);
  assert.ok(problemsOf(r, "3:1").includes("explicit-resize horizontal sizing FIXED->HUG"));
});

test("L-N5 vertical FILL is rejected even when horizontal FILL is approved", async () => {
  const r = await runAudit([frame("2:1", [place("3:1", IN_FILLED, { x: 16, w: 361, h: 300, sizingH: "FILL", sizingV: "FILL", own: ["height", "name", "width"] })])], FILL_APPROVED);
  assert.deepEqual(problemsOf(r, "3:1"), ["vertical-sizing FILL"]);
});

test("L-N6 FILL inside a horizontal Auto Layout parent is an untested context", async () => {
  const r = await runAudit([frame("2:1", [place("3:1", BTN, { x: 16, w: 361, sizingH: "FILL", own: ["name", "primaryAxisSizingMode", "width"] })], { layoutMode: "HORIZONTAL" })], FILL_APPROVED);
  assert.deepEqual(problemsOf(r, "3:1"), ["fill-context parent-layout HORIZONTAL"]);
});

test("L-N7 FILL inside a wrapping parent is an untested context", async () => {
  const r = await runAudit([frame("2:1", [place("3:1", DIV_C, { x: 16, w: 361, sizingH: "FILL", own: ["name", "width"] })], { wrapMode: "WRAP" })], FILL_APPROVED);
  assert.deepEqual(problemsOf(r, "3:1"), ["fill-context parent-wrap WRAP"]);
});

test("L-N8 FILL in a parent with counterAxisAlignItems CENTER is an untested context", async () => {
  const r = await runAudit([frame("2:1", [place("3:1", DIV_C, { x: 16, w: 361, sizingH: "FILL", own: ["name", "width"] })], { align: "CENTER" })], FILL_APPROVED);
  assert.deepEqual(problemsOf(r, "3:1"), ["fill-context parent-align CENTER"]);
});

test("L-N9 absolutely positioned FILL is an untested context (and an absolute child)", async () => {
  const r = await runAudit([frame("2:1", [place("3:1", DIV_C, { x: 16, w: 361, sizingH: "FILL", own: ["name", "width"], extra: { layoutPositioning: "ABSOLUTE" } })])], FILL_APPROVED);
  assert.deepEqual(problemsOf(r, "3:1"), ["fill-context positioning ABSOLUTE"]);
});

test("L-N10 layoutGrow 1 in a vertical parent reads as vertical FILL and is rejected", async () => {
  const r = await runAudit([frame("2:1", [place("3:1", DIV_C, { x: 16, h: 400, sizingV: "FILL", own: ["height", "name"], extra: { layoutGrow: 1 } })])], FILL_APPROVED);
  assert.deepEqual(problemsOf(r, "3:1"), ["vertical-sizing FILL"]);
});

test("L-N11 min / max sizes are rejected", async () => {
  const r = await runAudit([frame("2:1", [place("3:1", LI_NO, { x: 16, extra: { minWidth: 200, maxWidth: 400 } })])], AS_REGISTERED);
  assert.deepEqual(problemsOf(r, "3:1"), ["min-max-size minWidth=200", "min-max-size maxWidth=400"]);
});

test("L-N12 visual overrides on the instance itself (opacity, fills) are rejected", async () => {
  const r = await runAudit([frame("2:1", [place("3:1", BTN, { x: 16, w: 99, own: ["fills", "height", "name", "opacity", "width"] })])], AS_REGISTERED);
  assert.deepEqual(r.selfOverrideViolations, [{ id: "3:1", fields: ["fills", "opacity"] }]);
  assert.equal(r.resultClass, "NON_COMPLIANT");
});

test("L-N13 FILL on an approved but untested variant (Input State=Error) is rejected", async () => {
  const r = await runAudit([frame("2:1", [place("3:1", IN_ERROR, { x: 16, w: 361, h: 52, sizingH: "FILL", own: ["height", "name", "width"] })])], FILL_APPROVED);
  assert.deepEqual(problemsOf(r, "3:1"), ["fill-variant-untested State=Error"]);
});

test("L-N14 FILL on a component without a layout rule (Toggle) is rejected", async () => {
  const r = await runAudit([frame("2:1", [place("3:1", TOGGLE, { x: 16, w: 361, sizingH: "FILL", own: ["name", "width"] })])], FILL_APPROVED);
  assert.deepEqual(problemsOf(r, "3:1"), ["sizing-not-allowed FILL (no layout rule)"]);
});

test("L-N15 FILL outside the tested inner widths is UNVERIFIED, not PASS", async () => {
  const r = await runAudit([frame("2:1", [place("3:1", DIV_C, { x: 16, w: 260, sizingH: "FILL", own: ["name", "width"] })], { inner: 260 })], FILL_APPROVED);
  assert.deepEqual(problemsOf(r, "3:1"), []);
  assert.deepEqual(unverifiedOf(r, "3:1"), ["fill-width-untested 260 (tested 288-398)"]);
});

// ---- negative: visual integrity (technically compliant, visually defective) --------------------------
/** Input FILL at inner 288 with a long value: the value wraps to 3 lines inside a 52 px field (evidence 100:1564). */
function longInput(id, ox = 0, oy = 0) {
  const p = `I${id};`;
  const field = node("FRAME", `${p}2035:2137`, { name: "Input", layoutMode: "HORIZONTAL", clipsContent: false, absoluteBoundingBox: bb(ox + 16, oy, 288, 52) }, [
    node("FRAME", `${p}2051:3013`, { name: "Label+Text", layoutMode: "VERTICAL", absoluteBoundingBox: bb(ox + 32, oy - 14, 256, 80) }, [
      text(`${p}2051:3014`, "ელ-ფოსტა", bb(ox + 32, oy - 14, 256, 16), { lh: 16, name: "Label" }),
      text(`${p}2051:3015`, "გრძელი სატესტო მისამართი customer.service.notifications@silknet.com", bb(ox + 32, oy + 6, 256, 60), { name: "Text" }),
    ]),
  ]);
  return place(id, IN_FILLED, { x: ox + 16, y: oy, w: 288, h: 52, sizingH: "FILL", own: ["height", "name", "width"], children: [field], extra: { name: "input / FILL long" } });
}

test("L-N16 Input with a long value: compliance PASS but COMPLIANT_WITH_VISUAL_DEFECTS (C-INPUT-TEXT-1L, DS-01)", async () => {
  const r = await runAudit([frame("2:1", [longInput("3:1")], { inner: 288 })], FILL_APPROVED);
  assert.equal(r.compliance.result, "PASS");
  assert.equal(r.resultClass, "COMPLIANT_WITH_VISUAL_DEFECTS");
  assert.deepEqual(r.technicallyCompliantButVisuallyDefective, ["3:1"]);
  const v = r.contentConstraintViolations.find(c => c.constraint === "C-INPUT-TEXT-1L");
  assert.deepEqual([v.dsIssue, v.lines, v.problems], ["DS-01", 3, ["outside Input", "lines 3>1"]]); // the verified field container
  assert.deepEqual(r.textOverflow.map(t => [t.id, t.ancestor]).sort(), [["I3:1;2051:3014", "Input"], ["I3:1;2051:3015", "Input"]]);
  assert.ok(!r.contentConstraintUnverified.some(c => c.constraint === "C-INPUT-TEXT-1L"));
  assert.ok(r.contentConstraintUnverified.some(c => c.constraint === "C-INPUT-LABEL-FIT")); // onViolation UNVERIFIED
});

test("L-N17 Button FILL at inner 288 with a long label: label wider than the button (C-BTN-LABEL-1L)", async () => {
  const btn = place("3:1", BTN, { x: 16, w: 288, sizingH: "FILL", own: ["height", "name", "primaryAxisSizingMode", "width"], extra: { name: "button / FILL long" },
    children: [text("I3:1;27:185", "ცვლილებების შენახვა და გაგრძელება", bb(13, 16, 294, 20))] });
  const r = await runAudit([frame("2:1", [btn], { inner: 288 })], FILL_APPROVED);
  assert.deepEqual(r.contentConstraintViolations.map(c => [c.constraint, c.problems]), [["C-BTN-LABEL-1L", ["outside button / FILL long"]]]);
  assert.deepEqual(r.textOverflow.map(t => t.id), ["I3:1;27:185"]);
  assert.equal(r.resultClass, "COMPLIANT_WITH_VISUAL_DEFECTS");
});

test("L-N18 native list-item (358) in a 288 content box is a containment finding with its native and inner widths", async () => {
  const r = await runAudit([frame("2:1", [place("3:1", LI_NO, { x: 16 })], { inner: 288, clips: true })], AS_REGISTERED);
  const c = r.layoutContainment.find(x => x.id === "3:1");
  assert.deepEqual([c.nativeWidth, c.parentInnerWidth, c.clippedBy], [358, 288, "2:1"]);
  assert.deepEqual(r.sizingViolations, []); // NATIVE is compliant; the defect is visual
  assert.equal(r.resultClass, "COMPLIANT_WITH_VISUAL_DEFECTS");
});

test("L-N19 header FILL with a long title at 2 of 2 lines and an ending cut-off: possible truncation is UNVERIFIED", async () => {
  const nav = place("3:1", NAV, { x: 0, w: 320, h: 72, sizingH: "FILL", own: ["height", "name", "width"],
    children: [text("I3:1;4166:2587", "შეტყობინებების პარამეტრები და არხების მართვა", bb(76, 16, 168, 40), { truncation: "ENDING", maxLines: 2 })] });
  const r = await runAudit([frame("2:1", [nav], { inner: 320, pad: 0, h: 200 })], FILL_APPROVED);
  assert.deepEqual(r.possibleTruncation.map(t => [t.id, t.lines, t.maxLines]), [["I3:1;4166:2587", 2, 2]]);
  assert.deepEqual(r.contentConstraintUnverified.map(c => [c.constraint, c.reason]), [["C-NAV-TITLE-2L", "possible-truncation 2/2"]]);
  assert.deepEqual(r.contentConstraintViolations, []);
  assert.equal(r.visualIntegrity.result, "UNVERIFIED");
  assert.equal(r.resultClass, "COMPLIANT");
});

test("L-N20 list-item Yes: the verified Body path 7001:1397 is checked; a missing layer or an unknown path is UNVERIFIED", async () => {
  const yes = place("3:1", LI_YES, { x: 16, y: 0, children: [text("I3:1;7001:1397", "SMS", bb(32, 22, 200, 20))] });
  const ok = await runAudit([frame("2:1", [yes])], AS_REGISTERED);
  assert.deepEqual([ok.contentConstraintUnverified, ok.contentConstraintViolations], [[], []]);
  const missing = await runAudit([frame("2:1", [place("3:1", LI_YES, { x: 16 })])], AS_REGISTERED);
  assert.deepEqual(missing.contentConstraintUnverified.map(c => [c.id, c.constraint, c.reason]), [["3:1", "C-LIST-BODY-FIT", "constraint-layer-missing"]]);
  const unknown = approvedFrom(REGISTRY, { edit: r => { r.components.find(c => c.id === "ds.list-item").contentConstraints[0].textLayerByVariant["Horizontal padding=Yes"] = null; } });
  const u = await runAudit([frame("2:1", [place("3:1", LI_YES, { x: 16 })])], unknown);
  assert.deepEqual(u.contentConstraintUnverified.map(c => [c.id, c.constraint, c.reason]), [["3:1", "C-LIST-BODY-FIT", "constraint-layer-unknown"]]);
});

test("L-N21 generated text wider than its frame is a text-overflow finding", async () => {
  const f = frame("2:1", [text("3:1", "საკონტაქტო ელ-ფოსტა", bb(16, 0, 400, 20))], { inner: 288 });
  const r = await runAudit([f], AS_REGISTERED);
  assert.deepEqual(r.textOverflow.map(t => [t.id, t.escapes, t.top]), [["3:1", "2:1", null]]);
});

// ---- audit-level ------------------------------------------------------------------------------------------
test("L-A1 stale rule: the registry's native size no longer matches the live variant", async () => {
  const stale = approvedFrom(REGISTRY, { edit: r => { r.components.find(c => c.id === "ds.list-item").layout.nativeByVariant["Horizontal padding=No"].width = 360; } });
  const r = await runAudit([frame("2:1", [place("3:1", LI_NO, { x: 16 })])], stale);
  assert.deepEqual(unverifiedOf(r, "3:1"), ["layout-rule-stale Horizontal padding=No"]);
  assert.deepEqual(problemsOf(r, "3:1"), []);
});

test("L-A2 r8 as committed: every layout rule is proposed, so FILL is not yet allowed anywhere", async () => {
  const r = await runAudit([frame("2:1", [place("3:1", DIV_C, { x: 16, w: 361, sizingH: "FILL", own: ["height", "name", "width"] })])], AS_REGISTERED);
  assert.deepEqual(problemsOf(r, "3:1"), ["sizing-not-allowed FILL (layout proposed)"]);
  assert.equal(r.resultClass, "NON_COMPLIANT");
});

function evidenceViewport() {
  return [
    frame("4:1", [ // padded groups, inner 288
      place("5:1", BTN, { x: 16, y: 0, w: 99, own: ["height", "name", "width"] }),
      place("5:2", BTN, { x: 16, y: 60, w: 288, sizingH: "FILL", own: ["height", "name", "primaryAxisSizingMode", "width"] }),
      place("5:3", BTN, { x: 16, y: 120, w: 288, sizingH: "FILL", own: ["height", "name", "primaryAxisSizingMode", "width"],
        children: [text("I5:3;27:185", "ცვლილებების შენახვა და გაგრძელება", bb(13, 136, 294, 20))] }),
      place("5:4", LI_NO, { x: 16, y: 200 }),
      place("5:5", LI_NO, { x: 16, y: 280, w: 288, sizingH: "FILL", own: ["height", "name", "width"] }),
      place("5:6", LI_YES, { x: 16, y: 360 }),
      place("5:7", IN_FILLED, { x: 16, y: 440, h: 52, own: ["height", "name", "width"] }),
    ], { inner: 288, clips: true }),
    frame("4:2", [longInput("5:8", 0, 1300)], { y: 1300, inner: 288 }),
    frame("4:3", [ // unpadded header group, inner 320
      place("5:9", NAV, { x: 0, y: 2000 }),
      place("5:10", NAV, { x: 0, y: 2080, w: 320, h: 72, sizingH: "FILL", own: ["height", "name", "width"],
        children: [text("I5:10;4166:2587", "შეტყობინებების პარამეტრები და არხების მართვა", bb(76, 2096, 168, 40), { truncation: "ENDING", maxLines: 2 })] }),
    ], { y: 2000, inner: 320, pad: 0, h: 200 }),
  ];
}
test("L-A3 evidence model (320 viewport of 100:1241, r8 as committed): exactly the expected findings", async () => {
  const r = await runAudit(evidenceViewport(), AS_REGISTERED);
  assert.deepEqual(ids(r.sizingViolations), ["5:10", "5:2", "5:3", "5:5", "5:8"]); // every FILL: layout still proposed
  assert.ok(r.sizingViolations.every(s => s.problems.join() === "sizing-not-allowed FILL (layout proposed)"));
  assert.deepEqual(ids(r.layoutContainment), ["5:4", "5:6", "5:7", "5:9"]);          // natives wider than 288 / 320
  assert.deepEqual([...new Set(r.textOverflow.map(t => t.top))].sort(), ["5:3", "5:8"]);
  assert.deepEqual(r.contentConstraintViolations.map(c => c.constraint).sort(), ["C-BTN-LABEL-1L", "C-INPUT-TEXT-1L"]);
  assert.deepEqual(r.possibleTruncation.map(t => t.top), ["5:10"]);
  assert.deepEqual(r.selfOverrideViolations, []);
  assert.equal(r.resultClass, "NON_COMPLIANT");
  assert.deepEqual(r.technicallyCompliantButVisuallyDefective, ["5:4", "5:6", "5:7", "5:9"]);
});

test("L-A4 an instance with both a compliance and a visual finding is NON_COMPLIANT and not listed as only visually defective", async () => {
  const r = await runAudit([frame("2:1", [place("3:1", LI_NO, { x: 16, own: ["name", "opacity"] })], { inner: 288 })], AS_REGISTERED);
  assert.equal(r.resultClass, "NON_COMPLIANT");
  assert.deepEqual(r.technicallyCompliantButVisuallyDefective, []);
  assert.equal(r.visualIntegrity.result, "FAIL");
});

test("L-A5 the r8 evidence section 100:1241 is skipped in compliance mode", async () => {
  const evidence = node("SECTION", "100:1241", { absoluteBoundingBox: bb(0, 0, 1463, 1532) }, [frame("100:1242", [place("100:1368", LI_NO, { x: 16 })], { inner: 288 })]);
  const r = await runAudit([evidence], AS_REGISTERED);
  assert.deepEqual(r.skippedFixtures, ["100:1241"]);
  assert.deepEqual([r.layoutContainment, r.sizing], [[], []]);
});

test("L-A6 an instance that exposes no sizing (older mock / non-layout node) is UNVERIFIED, never FAIL", async () => {
  const bare = node("INSTANCE", "3:1", { main: LI_NO, componentProperties: {}, overrides: [], absoluteBoundingBox: bb(16, 0, 358, 64) });
  bare.getMainComponentAsync = async () => LI_NO;
  const r = await runAudit([frame("2:1", [bare])], AS_REGISTERED);
  assert.deepEqual(problemsOf(r, "3:1"), []);
  assert.deepEqual(unverifiedOf(r, "3:1"), ["sizing-unreadable horizontal", "sizing-unreadable vertical"]);
});

test("L-A7 the audit constants carry layout rules only for the five tested components", async () => {
  const withLayout = Object.values(buildApproved(REGISTRY).APPROVED).filter(e => e.layout).map(e => `${e.id}:${e.layout.status}`).sort();
  assert.deepEqual(withLayout, ["ds.button:proposed", "ds.divider:proposed", "ds.input:proposed", "ds.list-item:proposed", "ds.navigation-header:proposed"]);
});

test("L-A8 the assembled audit fits use_figma's 50,000-char limit and returns exactly what the unstripped script returns", async () => {
  const opts = { targetKey: "TEST", rootId: "1:1" };
  const small = assembleAudit(REGISTRY, opts), full = assembleAudit(REGISTRY, { ...opts, minify: false });
  assert.ok(small.length <= USE_FIGMA_LIMIT, `assembled audit is ${small.length} chars`);
  const a = await runAudit(evidenceViewport(), null, { code: small });
  const b = await runAudit(evidenceViewport(), null, { code: full });
  assert.deepEqual(a, b);
  assert.equal(a.resultClass, "NON_COMPLIANT");
  assert.throws(() => assembleAudit(REGISTRY, { targetKey: "ymEnGYUGvRRVKhHiUSGMVF", rootId: "1:1" }), /protected source/);
});
