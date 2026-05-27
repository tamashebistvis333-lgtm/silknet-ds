import type { Story } from '@ladle/react';
import { useState } from 'react';
import { Checkbox } from '@silknet-ds/react';

export default { title: 'Checkbox' };

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
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
    <div>{children}</div>
  </div>
);

export const Variants = () => (
  <div style={{ maxWidth: 480 }}>
    <h1 style={{ marginTop: 0 }}>Checkbox — all states</h1>
    <Row label="Unchecked (default)">
      <Checkbox aria-label="Unchecked" />
    </Row>
    <Row label="Checked">
      <Checkbox defaultChecked aria-label="Checked" />
    </Row>
    <Row label="Indeterminate">
      <Checkbox indeterminate aria-label="Indeterminate" />
    </Row>
    <Row label="Error (unchecked)">
      <Checkbox error aria-label="Error" />
    </Row>
    <Row label="Disabled (unchecked)">
      <Checkbox disabled aria-label="Disabled" />
    </Row>
    <Row label="Disabled (checked)">
      <Checkbox disabled defaultChecked aria-label="Disabled checked" />
    </Row>
    <Row label="Disabled (indeterminate)">
      <Checkbox disabled indeterminate aria-label="Disabled indeterminate" />
    </Row>
  </div>
);

export const Playground: Story<{
  checked: boolean;
  indeterminate: boolean;
  error: boolean;
  disabled: boolean;
}> = ({ checked, indeterminate, error, disabled }) => {
  const [v, setV] = useState(checked);
  return (
    <Checkbox
      checked={v}
      onChange={setV}
      indeterminate={indeterminate}
      error={error}
      disabled={disabled}
      aria-label="Playground checkbox"
    />
  );
};
Playground.args = { checked: false, indeterminate: false, error: false, disabled: false };
