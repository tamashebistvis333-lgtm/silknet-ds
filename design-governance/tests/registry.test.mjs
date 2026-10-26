// Registry r8 tests: layout-governance schema, semantic checks, this revision's policy, and proof
// that every r7 field and approval is unchanged.
// Run: node --test design-governance/tests/registry.test.mjs (also run in CI)
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validate, unsupportedKeywords, semanticErrors, stripR8, approvalDigests, canonical, sha256 } from "../scripts/validate-registry.mjs";

const read = p => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const REGISTRY = JSON.parse(read("component-registry.json"));
const SCHEMA = JSON.parse(read("layout-governance.schema.json"));
const ISSUES = read("design-system-issues.md");
const clone = x => JSON.parse(JSON.stringify(x));
const entry = (r, id) => r.components.find(c => c.id === id);
const errorsFor = mutate => { const r = clone(REGISTRY); mutate(r); return validate(SCHEMA, r); };
const APPROVAL = { by: "Designer (test)", quote: "approve FILL for ds.divider", at: "2026-10-27", scope: "ds.divider FILL" };

// Frozen from origin/main at 1bfdf57 (registry r7), with revision / updatedAt removed. If an r7 field changes,
// these fail — r7 approvals may only change through a new, separately approved revision.
const R7_CONTENT_DIGEST = "0cf58a8ab2d3c8d5fcd4395b208739e593ee5c86a55e31d7cfb76ecb36f21ef9";
const R7_APPROVAL_DIGESTS = {
  "ds.button": "584cd8497867fbc51f614bfa90f36020c6a48085e2182918980308be61c37057",
  "ds.badge": "5d9036fd210c928fe6be027a81ef03a246e74d8f7763dcb06bb632c96a267010",
  "ds.divider": "1d158053f1ca78816952d306a1b55f28261be8c205644704ed486d04720e7c09",
  "ds.toggle": "7c71d44f5996866186735115893c05755f6855f0df7a8f857f2613f05edf7ceb",
  "ds.icon-button": "f2a958e37693c69ac7b7710dba995169dc5b5b86f2921959b122e483fd3d8f54",
  "ds.navigation-header": "8ef5d349e62fd60d8f96251d83fe27800554bc4d025280204064c35a6927a8d0",
  "ds.list-item": "f6f98e0ceb9d7bbf5c95628ca8d3825a63f23d2f5ce59f5f5e8f1b661aa545bc",
  "ds.input": "0424df226866476926986407fceea22a4960f95bd9c94f5d1ec19b1341bd83e4",
  "var.background-surface": "491963d69d11fdb471669ddd122b7284291ea0f673d0b8e161b1320d3ee09b89",
  "var.text-default": "188eaeaed810c66cc19850d4c23580cff1b5f12754ec270ab86d7210b3d5c436",
  "var.spacing-4": "25aaf9188156a261da8aed84af3f53783867623d49ce6505493514591e784cf3",
  "style.subtitle-2": "b81b01f5b465fa2c7c380d9168e4ffd4cc1110bdf67ac1263d2a5f7ba145e959",
};

// ---- schema and registry are valid ----------------------------------------------------------------
test("S1 the schema uses only keywords the validator implements", () => {
  assert.deepEqual(unsupportedKeywords(SCHEMA), []);
  assert.deepEqual(unsupportedKeywords({ properties: { a: { oneOf: [] } } }), ["$.properties.a.oneOf"]);
});

test("S2 the committed registry is valid against the schema and the semantic checks", () => {
  assert.deepEqual(validate(SCHEMA, REGISTRY), []);
  assert.deepEqual(semanticErrors(REGISTRY, ISSUES), []);
});

// ---- approval metadata (correction 3) -----------------------------------------------------------------
test("S3 approval: null is valid for proposed and blocked rules", () => {
  assert.deepEqual(errorsFor(r => { entry(r, "ds.divider").layout.approval = null; }), []);
  assert.deepEqual(errorsFor(r => { Object.assign(entry(r, "ds.divider").layout, { status: "blocked", approval: null }); }), []);
});

test("S4 approval: an approved rule requires complete approval metadata", () => {
  assert.deepEqual(errorsFor(r => { Object.assign(entry(r, "ds.divider").layout, { status: "approved", approval: APPROVAL }); }), []);
  assert.ok(errorsFor(r => { Object.assign(entry(r, "ds.divider").layout, { status: "approved", approval: null }); })
    .some(e => e.includes("components[2].layout.approval: expected object")));
  assert.ok(errorsFor(r => { Object.assign(entry(r, "ds.divider").layout, { status: "approved", approval: { ...APPROVAL, quote: "" } }); })
    .some(e => e.includes("approval.quote: shorter than 1")));
  assert.ok(errorsFor(r => { const { scope, ...partial } = APPROVAL; Object.assign(entry(r, "ds.divider").layout, { status: "approved", approval: partial }); })
    .some(e => e.includes('missing required "scope"')));
  assert.ok(errorsFor(r => { Object.assign(entry(r, "ds.divider").layout, { status: "approved", approval: { ...APPROVAL, at: "yesterday" } }); })
    .some(e => e.includes("approval.at: does not match")));
});

test("S5 approval: a proposed rule may not carry approval metadata (no half-approved state)", () => {
  assert.ok(errorsFor(r => { entry(r, "ds.divider").layout.approval = APPROVAL; }).some(e => e.includes("layout.approval: expected null")));
});

// ---- layout shape (corrections 1, 2, 4, 5, 7) -----------------------------------------------------------
test("S6 vertical sizing can only be NATIVE; horizontal must include NATIVE and only NATIVE/FILL", () => {
  assert.ok(errorsFor(r => { entry(r, "ds.input").layout.vertical.allowed = ["NATIVE", "FILL"]; }).length > 0);
  assert.ok(errorsFor(r => { entry(r, "ds.input").layout.horizontal.allowed = ["FILL"]; }).some(e => e.includes("contains no item")));
  assert.ok(errorsFor(r => { entry(r, "ds.input").layout.horizontal.allowed = ["NATIVE", "FIXED_WIDTH"]; }).length > 0);
});

test("S7 no arbitrary sizes: a layout rule cannot carry widths/heights outside nativeByVariant", () => {
  assert.ok(errorsFor(r => { entry(r, "ds.button").layout.allowedWidths = [200, 300]; }).some(e => e.includes('unknown property "allowedWidths"')));
  assert.ok(errorsFor(r => { entry(r, "ds.list-item").layout.nativeByVariant["Horizontal padding=No"].width = null; }).length > 0); // FIXED needs a width
  assert.ok(errorsFor(r => { entry(r, "ds.button").layout.nativeByVariant["property=primary, size=large, State=default"].width = 99; }).length > 0); // HUG has none
});

test("S8 FILL contexts are limited to the tested vertical Auto Layout frame", () => {
  assert.ok(errorsFor(r => { entry(r, "ds.button").layout.fill.contexts[0].parentLayoutMode = "HORIZONTAL"; }).length > 0);
  assert.ok(errorsFor(r => { entry(r, "ds.button").layout.fill.contexts[0].parentLayoutWrap = "WRAP"; }).length > 0);
  assert.ok(errorsFor(r => { entry(r, "ds.button").layout.fill.contexts[0].parentType = "SLOT"; }).length > 0);
  assert.ok(errorsFor(r => { delete entry(r, "ds.button").layout.fill.contexts[0].testedInnerWidth; }).length > 0);
});

test("S9 content constraints are component-specific line/container rules — no character limits", () => {
  assert.ok(errorsFor(r => { entry(r, "ds.input").contentConstraints[0].maxChars = 40; }).some(e => e.includes('unknown property "maxChars"')));
  assert.ok(errorsFor(r => { entry(r, "ds.navigation-header").contentConstraints[0].maxLines = null; }).length > 0); // MAX_LINES needs maxLines
  assert.ok(errorsFor(r => { entry(r, "ds.button").contentConstraints[0].maxLines = 2; }).length > 0);            // SINGLE_LINE has none
  assert.ok(errorsFor(r => { entry(r, "ds.button").contentConstraints[0].kind = "MAX_CHARACTERS"; }).length > 0);
  assert.ok(errorsFor(r => { entry(r, "ds.input").contentConstraints[0].textLayerByVariant["State=Filled"] = "Text"; }).length > 0); // layer path, not a name
});

test("S10 layoutSchemaVersion is required and fixed at 1", () => {
  assert.ok(errorsFor(r => { r.layoutSchemaVersion = 2; }).length > 0);
  assert.ok(errorsFor(r => { delete r.layoutSchemaVersion; }).some(e => e.includes('missing required "layoutSchemaVersion"')));
});

// ---- semantic checks against r7 data ---------------------------------------------------------------------
test("S11 semantic: FILL variants, native evidence, constraint properties and DS issues must match r7 data", () => {
  const sem = mutate => { const r = clone(REGISTRY); mutate(r); return semanticErrors(r, ISSUES); };
  assert.ok(sem(r => { entry(r, "ds.input").layout.fill.variantCombinations.push("State=Hover"); }).some(e => e.includes('"State=Hover" is not an approved variant')));
  assert.ok(sem(r => { entry(r, "ds.input").layout.fill.variantCombinations.push("State=Error"); }).some(e => e.includes('"State=Error" has no nativeByVariant evidence')));
  assert.ok(sem(r => { entry(r, "ds.input").contentConstraints[0].property = "Slot#8218:12"; }).some(e => e.includes("is not an approved property")));
  assert.ok(sem(r => { entry(r, "ds.input").contentConstraints[0].dsIssue = "DS-99"; }).some(e => e.includes("DS-99, which is not in")));
  assert.ok(sem(r => { entry(r, "ds.input").layout.fill.contexts = []; }).some(e => e.includes("FILL allowed without tested variants and contexts")));
  assert.ok(sem(r => { entry(r, "ds.badge").layout = clone(entry(r, "ds.divider").layout); entry(r, "ds.badge").status = "proposed"; })
    .some(e => e.includes("ds.badge: layout on an entry whose status is proposed")));
  assert.ok(sem(r => { r.variables[0].layout = {}; }).some(e => e.includes("only valid on components")));
});

// ---- this revision's policy (corrections 1, 2) ----------------------------------------------------------
test("S12 r8 policy: layout rules exist only for the five tested components", () => {
  assert.deepEqual(REGISTRY.components.filter(c => c.layout).map(c => c.id).sort(),
    ["ds.button", "ds.divider", "ds.input", "ds.list-item", "ds.navigation-header"]);
  assert.deepEqual(REGISTRY.components.filter(c => c.contentConstraints).map(c => c.id).sort(),
    ["ds.button", "ds.divider", "ds.input", "ds.list-item", "ds.navigation-header"]);
});

test("S13 r8 policy: every layout rule is proposed with approval null — no FILL permission is active", () => {
  for (const c of REGISTRY.components.filter(x => x.layout)) {
    assert.equal(c.layout.status, "proposed", c.id);
    assert.equal(c.layout.approval, null, c.id);
  }
});

test("S14 r8 policy: FILL is limited to exactly the variants exercised in the capability test", () => {
  const fill = Object.fromEntries(REGISTRY.components.filter(c => c.layout).map(c => [c.id, c.layout.fill.variantCombinations]));
  assert.deepEqual(fill, {
    "ds.button": ["property=primary, size=large, State=default"],
    "ds.divider": ["Alignment=Centered", "Alignment=Right aligned"],
    "ds.navigation-header": ["Property=Default"],
    "ds.list-item": ["Horizontal padding=No", "Horizontal padding=Yes"],
    "ds.input": ["State=Filled"],
  });
});

// ---- r7 preservation (correction 8) ------------------------------------------------------------------------
test("R1 every r7 field is unchanged (registry minus the r8 additions equals r7 at 1bfdf57)", () => {
  assert.equal(REGISTRY.revision, "r8");
  assert.equal(sha256(canonical(stripR8(REGISTRY))), R7_CONTENT_DIGEST);
});

test("R2 every r7 approval object is unchanged", () => {
  assert.deepEqual(approvalDigests(REGISTRY), R7_APPROVAL_DIGESTS);
});

test("R3 the registry file keeps the canonical 2-space formatting (minimal, insertion-only diffs)", () => {
  assert.equal(JSON.stringify(REGISTRY, null, 2) + "\n", read("component-registry.json"));
});
