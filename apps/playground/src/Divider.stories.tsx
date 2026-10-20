import { Divider } from '@silknet-ds/react';

export default { title: 'Divider' };

export const Variants = () => (
  <div style={{ maxWidth: 216 }}>
    <h1 style={{ marginTop: 0 }}>Divider</h1>
    <p style={{ fontSize: 12, color: 'var(--text-additional)' }}>centered</p>
    <div style={{ background: 'var(--background-surface)' }}>
      <Divider alignment="centered" />
    </div>
    <p style={{ fontSize: 12, color: 'var(--text-additional)' }}>right</p>
    <div style={{ background: 'var(--background-surface)', padding: '8px 0' }}>
      <Divider alignment="right" />
    </div>
  </div>
);
