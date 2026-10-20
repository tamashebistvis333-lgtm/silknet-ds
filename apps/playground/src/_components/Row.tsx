import type { ReactNode } from 'react';

// Label + content row used by the "Variants" stories.
export const Row = ({ label, children }: { label: string; children: ReactNode }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '180px 1fr',
      alignItems: 'center',
      gap: 16,
      padding: '8px 0',
      borderBottom: '1px solid var(--border-default)',
    }}
  >
    <div style={{ fontSize: 12, fontFamily: 'ui-monospace, monospace', color: 'var(--text-additional)' }}>
      {label}
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>{children}</div>
  </div>
);
