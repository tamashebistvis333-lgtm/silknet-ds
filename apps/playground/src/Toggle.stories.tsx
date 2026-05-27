import type { Story } from '@ladle/react';
import { useState } from 'react';
import { Toggle } from '@silknet-ds/react';

export default { title: 'Toggle' };

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '160px 1fr',
      alignItems: 'center',
      gap: 16,
      padding: '8px 0',
      borderBottom: '1px solid var(--border-default)',
    }}
  >
    <div style={{ fontSize: 12, fontFamily: 'ui-monospace, monospace', color: 'var(--text-additional)' }}>
      {label}
    </div>
    <div>{children}</div>
  </div>
);

export const Variants = () => (
  <div style={{ maxWidth: 480 }}>
    <h1 style={{ marginTop: 0 }}>Toggle — all states</h1>
    <Row label="Off (default)">
      <Toggle aria-label="Off" />
    </Row>
    <Row label="On">
      <Toggle defaultChecked aria-label="On" />
    </Row>
    <Row label="Error (off)">
      <Toggle error aria-label="Error off" />
    </Row>
    <Row label="Disabled off">
      <Toggle disabled aria-label="Disabled off" />
    </Row>
    <Row label="Disabled on">
      <Toggle disabled defaultChecked aria-label="Disabled on" />
    </Row>
  </div>
);

export const Playground: Story<{
  checked: boolean;
  error: boolean;
  disabled: boolean;
}> = ({ checked, error, disabled }) => {
  const [v, setV] = useState(checked);
  return (
    <Toggle
      checked={v}
      onChange={setV}
      error={error}
      disabled={disabled}
      aria-label="Playground toggle"
    />
  );
};
Playground.args = { checked: false, error: false, disabled: false };
