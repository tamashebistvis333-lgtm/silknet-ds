// Tiny classname joiner — accepts strings, falsy values, and conditional
// objects (`{ 'silk-foo--md': true }`). Intentionally tiny to avoid bringing
// in `classnames` or `clsx` as a dep.

export type ClassValue =
  | string
  | number
  | null
  | false
  | undefined
  | Record<string, boolean | null | undefined>
  | ClassValue[];

export function cx(...values: ClassValue[]): string {
  const out: string[] = [];
  for (const v of values) {
    if (!v) continue;
    if (typeof v === 'string' || typeof v === 'number') {
      out.push(String(v));
    } else if (Array.isArray(v)) {
      const inner = cx(...v);
      if (inner) out.push(inner);
    } else if (typeof v === 'object') {
      for (const [k, on] of Object.entries(v)) if (on) out.push(k);
    }
  }
  return out.join(' ');
}
