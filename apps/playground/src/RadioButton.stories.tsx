import type { Story } from '@ladle/react';
import { useState } from 'react';
import { RadioButton } from '@silknet-ds/react';

export default { title: 'Radio Button' };

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
    <h1 style={{ marginTop: 0 }}>Radio button — all states</h1>
    <Row label="Unselected (default)">
      <RadioButton aria-label="Unselected" />
    </Row>
    <Row label="Selected">
      <RadioButton defaultSelected aria-label="Selected" />
    </Row>
    <Row label="Error (unselected)">
      <RadioButton error aria-label="Error" />
    </Row>
    <Row label="Disabled (unselected)">
      <RadioButton disabled aria-label="Disabled unselected" />
    </Row>
    <Row label="Disabled (selected)">
      <RadioButton disabled defaultSelected aria-label="Disabled selected" />
    </Row>
  </div>
);

// Radio group demo (typical real-world usage)
export const Group = () => {
  const [v, setV] = useState('two');
  const opts = ['one', 'two', 'three'];
  return (
    <div style={{ maxWidth: 480 }}>
      <h1 style={{ marginTop: 0 }}>Radio group</h1>
      <div role="radiogroup" aria-label="Group demo" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {opts.map((opt) => (
          <label key={opt} style={{ display: 'inline-flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
            <RadioButton selected={v === opt} onChange={() => setV(opt)} aria-label={opt} />
            <span style={{ fontSize: 14, color: 'var(--text-default)' }}>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export const Playground: Story<{
  selected: boolean;
  error: boolean;
  disabled: boolean;
}> = ({ selected, error, disabled }) => {
  const [v, setV] = useState(selected);
  return (
    <RadioButton
      selected={v}
      onChange={setV}
      error={error}
      disabled={disabled}
      aria-label="Playground radio"
    />
  );
};
Playground.args = { selected: false, error: false, disabled: false };
