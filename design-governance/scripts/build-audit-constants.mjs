// Builds the APPROVED / APPROVED_VARIABLE_KEYS / APPROVED_STYLE_KEYS constants for the read-only
// audit in .claude/skills/create-flow/references/validation-audit.md from the registry, so the
// audit never runs against hand-copied rules — and assembles the complete, ready-to-run audit.
//
//   node design-governance/scripts/build-audit-constants.mjs                      # constants only
//   node design-governance/scripts/build-audit-constants.mjs --target <file key> --root <node id> [--mode compliance]
//
// The assembled script drops full-line comments and indentation (the script has no multi-line
// template literals) so it stays under use_figma's 50,000-character limit; tests prove it returns
// the same result as the source script.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const USE_FIGMA_LIMIT = 50000;
const AUDIT_MD = new URL("../../.claude/skills/create-flow/references/validation-audit.md", import.meta.url);

const isApproved = x => x.status === "approved" && !!(x.approval && x.approval.quote);

/** Registry → audit constants. Layout rules are passed through with their own status; the audit
 *  grants FILL only when `layout.status === "approved"`. */
export function buildApproved(registry) {
  const APPROVED = {};
  for (const c of registry.components || []) {
    if (!isApproved(c)) continue;
    const e = { id: c.id, variants: c.variants, properties: (c.properties || []).map(p => p.key) };
    if (c.variantCombinations && c.variantCombinations.length) e.variantCombinations = c.variantCombinations;
    if (c.nestedDependencies) e.nestedDependencies = Object.fromEntries(Object.entries(c.nestedDependencies).map(([v, list]) =>
      [v, list.map(d => ({ sourceId: d.sourceId, key: d.key, variant: d.variant, mustRemainHidden: !!d.mustRemainHidden }))]));
    if (c.slots) e.slots = Object.fromEntries(Object.entries(c.slots).map(([v, list]) => [v, list.map(s => ({
      slot: s.slot, defaultContent: (s.defaultContent || []).map(d => ({ key: d.key, variant: d.variant })),
      allowReplacement: !!s.allowReplacement, allowedContent: s.allowedContent || [], minChildren: s.minChildren ?? null, maxChildren: s.maxChildren ?? null,
    }))]));
    if (c.layout) e.layout = {
      status: c.layout.status, nativeByVariant: c.layout.nativeByVariant, horizontal: c.layout.horizontal, vertical: c.layout.vertical,
      fill: { ...c.layout.fill, contexts: c.layout.fill.contexts.map(({ evidence, ...ctx }) => ctx) }, // evidence stays in the registry
    };
    if (c.contentConstraints && c.contentConstraints.length) e.contentConstraints = c.contentConstraints.map(k => ({
      id: k.id, property: k.property, textLayerByVariant: k.textLayerByVariant, containerLayerByVariant: k.containerLayerByVariant,
      kind: k.kind, maxLines: k.maxLines, onViolation: k.onViolation, dsIssue: k.dsIssue,
    }));
    APPROVED[c.componentSetKey || c.componentKey] = e;
  }
  return {
    APPROVED,
    APPROVED_VARIABLE_KEYS: (registry.variables || []).filter(isApproved).map(v => v.key),
    APPROVED_STYLE_KEYS: (registry.styles || []).filter(isApproved).map(s => s.key),
  };
}

export const asScript = c => Object.entries(c).map(([k, v]) => `const ${k} = ${JSON.stringify(v)};`).join("\n");

/** The audit script exactly as written in validation-audit.md (first js block). */
export const auditSource = () => readFileSync(AUDIT_MD, "utf8").match(/```js\n([\s\S]*?)```/)[1];

/** Complete audit for one run: placeholders and constants filled in, full-line comments and indentation removed. */
export function assembleAudit(registry, { targetKey, rootId, mode = "compliance", previous = null, source = auditSource(), minify = true }) {
  if (!targetKey || !rootId) throw new Error("targetKey and rootId are required");
  if (targetKey === registry.source?.fileKey) throw new Error("refusing to target the protected source library");
  const constants = buildApproved(registry);
  const replace = (code, pattern, value) => { if (!pattern.test(code)) throw new Error(`audit placeholder not found: ${pattern}`); return code.replace(pattern, value); };
  let code = source;
  code = replace(code, /^const TARGET_KEY = .*$/m, `const TARGET_KEY = ${JSON.stringify(targetKey)};`);
  code = replace(code, /^const ROOT_ID = .*$/m, `const ROOT_ID = ${JSON.stringify(rootId)};`);
  for (const k of ["APPROVED", "APPROVED_VARIABLE_KEYS", "APPROVED_STYLE_KEYS"])
    code = replace(code, new RegExp(`^const ${k} = .*$`, "m"), `const ${k} = ${JSON.stringify(constants[k])};`);
  code = replace(code, /^const PREVIOUS = .*$/m, `const PREVIOUS = ${JSON.stringify(previous)};`);
  code = replace(code, /^const AUDIT_MODE = .*$/m, `const AUDIT_MODE = ${JSON.stringify(mode)};`);
  const out = minify ? code.split("\n").filter(l => !/^\s*\/\//.test(l)).map(l => l.replace(/^\s+/, "")).filter(Boolean).join("\n") : code;
  return `// /create-flow audit — registry ${registry.revision}\n${out}\n`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const registry = JSON.parse(readFileSync(new URL("../component-registry.json", import.meta.url), "utf8"));
  const arg = name => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : null; };
  if (arg("--target")) {
    const script = assembleAudit(registry, { targetKey: arg("--target"), rootId: arg("--root"), mode: arg("--mode") || "compliance" });
    if (script.length > USE_FIGMA_LIMIT) { console.error(`assembled audit is ${script.length} chars (> ${USE_FIGMA_LIMIT})`); process.exitCode = 1; }
    process.stdout.write(script);
  } else {
    console.log(`// registry ${registry.revision} — generated by design-governance/scripts/build-audit-constants.mjs`);
    console.log(asScript(buildApproved(registry)));
  }
}
