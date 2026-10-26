// Validates design-governance/component-registry.json against layout-governance.schema.json
// (r8 additions only) plus semantic checks against the r7 data, and optionally proves that every
// r7 field is unchanged compared with a git baseline.
//
//   node design-governance/scripts/validate-registry.mjs [--baseline-ref <git ref>]
//
// No dependencies: the validator implements exactly the JSON Schema keywords in SUPPORTED and
// refuses any schema that uses another keyword, so nothing in the schema is silently ignored.
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = new URL("../../", import.meta.url);
export const PATHS = {
  registry: "design-governance/component-registry.json",
  schema: "design-governance/layout-governance.schema.json",
  issues: "design-governance/design-system-issues.md",
};

// ---- minimal JSON Schema (2020-12 subset) ------------------------------------------------------
export const SUPPORTED = new Set([
  "$schema", "$id", "$defs", "$ref", "$comment", "title", "description",
  "type", "enum", "const", "required", "properties", "additionalProperties", "minProperties",
  "items", "minItems", "uniqueItems", "contains", "minLength", "pattern", "minimum",
  "allOf", "if", "then", "else",
]);
const SUBSCHEMA_MAPS = ["properties", "$defs"];
const SUBSCHEMAS = ["items", "contains", "if", "then", "else"];

export const canonical = v =>
  v && typeof v === "object"
    ? Array.isArray(v) ? `[${v.map(canonical).join(",")}]`
      : `{${Object.keys(v).sort().map(k => `${JSON.stringify(k)}:${canonical(v[k])}`).join(",")}}`
    : JSON.stringify(v);
export const sha256 = s => createHash("sha256").update(s).digest("hex");

/** Every keyword in the schema must be one this validator implements. */
export function unsupportedKeywords(schema, path = "$") {
  const out = [];
  if (!schema || typeof schema !== "object" || Array.isArray(schema)) return out;
  for (const [k, v] of Object.entries(schema)) {
    if (!SUPPORTED.has(k)) out.push(`${path}.${k}`);
    if (SUBSCHEMA_MAPS.includes(k)) for (const [n, s] of Object.entries(v)) out.push(...unsupportedKeywords(s, `${path}.${k}.${n}`));
    if (SUBSCHEMAS.includes(k)) out.push(...unsupportedKeywords(v, `${path}.${k}`));
    if (k === "additionalProperties" && typeof v === "object") out.push(...unsupportedKeywords(v, `${path}.${k}`));
    if (k === "allOf") v.forEach((s, i) => out.push(...unsupportedKeywords(s, `${path}.allOf[${i}]`)));
  }
  return out;
}

const typeOf = v => (v === null ? "null" : Array.isArray(v) ? "array" : typeof v === "number" ? (Number.isInteger(v) ? "integer" : "number") : typeof v);
const typeMatches = (t, v) => t === typeOf(v) || (t === "number" && typeOf(v) === "integer");
const isObject = v => typeOf(v) === "object";
function resolveRef(root, ref) {
  const m = /^#\/\$defs\/([^/]+)$/.exec(ref);
  if (!m || !root.$defs || !root.$defs[m[1]]) throw new Error(`Unresolvable $ref ${ref}`);
  return root.$defs[m[1]];
}

/** Returns a list of "path: message" errors; empty means valid. */
export function validate(schema, data, root = schema, path = "$") {
  const errors = [];
  if (schema.$ref) errors.push(...validate(resolveRef(root, schema.$ref), data, root, path));
  if (schema.type) {
    const types = [].concat(schema.type);
    if (!types.some(t => typeMatches(t, data))) return [...errors, `${path}: expected ${types.join("|")}, got ${typeOf(data)}`];
  }
  if ("const" in schema && canonical(schema.const) !== canonical(data)) errors.push(`${path}: must equal ${JSON.stringify(schema.const)}`);
  if (schema.enum && !schema.enum.some(e => canonical(e) === canonical(data))) errors.push(`${path}: must be one of ${JSON.stringify(schema.enum)}`);
  if (typeof data === "string") {
    if (schema.minLength != null && data.length < schema.minLength) errors.push(`${path}: shorter than ${schema.minLength}`);
    if (schema.pattern && !new RegExp(schema.pattern, "u").test(data)) errors.push(`${path}: does not match ${schema.pattern}`);
  }
  if (typeof data === "number" && schema.minimum != null && data < schema.minimum) errors.push(`${path}: below ${schema.minimum}`);
  if (Array.isArray(data)) {
    if (schema.minItems != null && data.length < schema.minItems) errors.push(`${path}: fewer than ${schema.minItems} items`);
    if (schema.uniqueItems && new Set(data.map(canonical)).size !== data.length) errors.push(`${path}: items not unique`);
    if (schema.items) data.forEach((d, i) => errors.push(...validate(schema.items, d, root, `${path}[${i}]`)));
    if (schema.contains && !data.some(d => validate(schema.contains, d, root).length === 0)) errors.push(`${path}: contains no item matching ${JSON.stringify(schema.contains)}`);
  }
  if (isObject(data)) {
    for (const k of schema.required || []) if (!(k in data)) errors.push(`${path}: missing required "${k}"`);
    if (schema.minProperties != null && Object.keys(data).length < schema.minProperties) errors.push(`${path}: fewer than ${schema.minProperties} properties`);
    const props = schema.properties || {};
    for (const [k, v] of Object.entries(data)) {
      if (k in props) errors.push(...validate(props[k], v, root, `${path}.${k}`));
      else if (schema.additionalProperties === false) errors.push(`${path}: unknown property "${k}"`);
      else if (isObject(schema.additionalProperties)) errors.push(...validate(schema.additionalProperties, v, root, `${path}.${k}`));
    }
  }
  for (const s of schema.allOf || []) errors.push(...validate(s, data, root, path));
  if (schema.if) {
    const branch = validate(schema.if, data, root, path).length === 0 ? schema.then : schema.else;
    if (branch) errors.push(...validate(branch, data, root, path));
  }
  return errors;
}

// ---- semantic checks against r7 data -------------------------------------------------------------
/** Is the full variant name approved by the entry (variantCombinations, else every axis in `variants`)? */
export function variantApproved(entry, name) {
  if (entry.variantCombinations && entry.variantCombinations.length) return entry.variantCombinations.includes(name);
  const pairs = name.split(",").map(p => p.trim().split("="));
  return pairs.length > 0 && pairs.every(([axis, value]) => entry.variants && (entry.variants[axis] || []).includes(value));
}

export function semanticErrors(registry, issuesMarkdown = null) {
  const errors = [], constraintIds = new Set();
  for (const e of registry.components || []) {
    const at = e.id;
    if (e.layout) {
      const L = e.layout;
      if (e.status !== "approved") errors.push(`${at}: layout on an entry whose status is ${e.status}`);
      for (const v of Object.keys(L.nativeByVariant || {})) if (!variantApproved(e, v)) errors.push(`${at}: nativeByVariant "${v}" is not an approved variant`);
      for (const v of L.fill?.variantCombinations || []) {
        if (!variantApproved(e, v)) errors.push(`${at}: fill variant "${v}" is not an approved variant`);
        if (!(v in (L.nativeByVariant || {}))) errors.push(`${at}: fill variant "${v}" has no nativeByVariant evidence`);
      }
      if ((L.horizontal?.allowed || []).includes("FILL") && (!(L.fill?.contexts || []).length || !(L.fill?.variantCombinations || []).length))
        errors.push(`${at}: FILL allowed without tested variants and contexts`);
      for (const c of L.fill?.contexts || []) if (c.testedInnerWidth.min > c.testedInnerWidth.max) errors.push(`${at}: ${c.id} testedInnerWidth min > max`);
    }
    for (const c of e.contentConstraints || []) {
      if (constraintIds.has(c.id)) errors.push(`${at}: duplicate constraint id ${c.id}`);
      constraintIds.add(c.id);
      if (!(e.properties || []).some(p => p.key === c.property)) errors.push(`${at}: ${c.id} property "${c.property}" is not an approved property`);
      for (const v of Object.keys(c.textLayerByVariant || {})) if (!variantApproved(e, v)) errors.push(`${at}: ${c.id} variant "${v}" is not approved`);
      for (const v of Object.keys(c.containerLayerByVariant || {})) if (!(v in c.textLayerByVariant)) errors.push(`${at}: ${c.id} container variant "${v}" has no text layer entry`);
      if (c.dsIssue && issuesMarkdown != null && !new RegExp(`^##+ ${c.dsIssue}\\b`, "m").test(issuesMarkdown)) errors.push(`${at}: ${c.id} references ${c.dsIssue}, which is not in ${PATHS.issues}`);
    }
  }
  for (const group of ["variables", "styles"]) for (const x of registry[group] || []) if ("layout" in x || "contentConstraints" in x) errors.push(`${x.id}: layout fields are only valid on components`);
  return errors;
}

// ---- r7 preservation -------------------------------------------------------------------------------
/** The registry without the r8 additions (and without revision / updatedAt, which change every revision). */
export function stripR8(registry) {
  const r = JSON.parse(JSON.stringify(registry));
  delete r.layoutSchemaVersion; delete r.revision; delete r.updatedAt;
  for (const c of r.components || []) { delete c.layout; delete c.contentConstraints; }
  return r;
}
export function approvalDigests(registry) {
  const out = {};
  for (const group of ["components", "variables", "styles"]) for (const x of registry[group] || []) out[x.id] = sha256(canonical(x.approval ?? null));
  return out;
}

// ---- CLI ---------------------------------------------------------------------------------------------
function main(argv) {
  const read = p => readFileSync(new URL(p, ROOT), "utf8");
  const registry = JSON.parse(read(PATHS.registry));
  const schema = JSON.parse(read(PATHS.schema));
  let issues = null; try { issues = read(PATHS.issues); } catch { /* optional */ }
  const problems = [];
  const unsupported = unsupportedKeywords(schema);
  if (unsupported.length) problems.push(...unsupported.map(k => `schema uses unsupported keyword ${k}`));
  else problems.push(...validate(schema, registry));
  problems.push(...semanticErrors(registry, issues));

  const i = argv.indexOf("--baseline-ref");
  if (i >= 0) {
    const ref = argv[i + 1];
    const base = JSON.parse(execFileSync("git", ["show", `${ref}:${PATHS.registry}`], { cwd: fileURLToPath(ROOT), encoding: "utf8" }));
    const a = stripR8(base), b = stripR8(registry);
    if (canonical(a) !== canonical(b)) {
      problems.push(`r7 content differs from ${ref}`);
      for (const group of ["components", "variables", "styles"]) {
        const before = Object.fromEntries((a[group] || []).map(x => [x.id, canonical(x)]));
        for (const x of b[group] || []) if (before[x.id] !== canonical(x)) problems.push(`  ${group} ${x.id} changed`);
      }
    }
    const da = approvalDigests(base), db = approvalDigests(registry);
    for (const id of new Set([...Object.keys(da), ...Object.keys(db)])) if (da[id] !== db[id]) problems.push(`approval of ${id} differs from ${ref}`);
    console.log(`baseline ${ref}: revision ${base.revision} -> ${registry.revision}; r7 fields ${problems.some(p => p.startsWith("r7 content")) ? "CHANGED" : "unchanged"}; approvals compared: ${Object.keys(da).length}`);
  }

  const withLayout = (registry.components || []).filter(c => c.layout).map(c => `${c.id}:${c.layout.status}`);
  console.log(`registry ${registry.revision}: ${registry.components.length} components; layout rules: ${withLayout.join(", ") || "none"}`);
  if (problems.length) { console.error(problems.map(p => `✖ ${p}`).join("\n")); return 1; }
  console.log("✔ schema keywords supported, registry valid, semantic checks passed");
  return 0;
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) process.exitCode = main(process.argv.slice(2));
