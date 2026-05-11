export default {
  title: 'Welcome',
};

export const Readme = () => (
  <div style={{ maxWidth: 720, lineHeight: 1.6 }}>
    <h1 style={{ marginTop: 0 }}>Silknet DS — Component Playground</h1>
    <p>
      Live React components consuming the Silknet design tokens. Use the sidebar
      to browse Button, Icon Button, Input, Text Area, and Helper Text — each
      component has stories for all variants and a controls panel for ad-hoc
      tinkering.
    </p>
    <p>
      Toggle theme via the icon in the top toolbar (Light ↔ Dark). The toggle
      sets <code>[data-theme="dark"]</code> on the document root, which is how
      the generated tokens CSS switches palettes.
    </p>
    <h2>Install in your app</h2>
    <pre
      style={{
        background: 'var(--background-surface)',
        padding: '12px 16px',
        borderRadius: 8,
        overflow: 'auto',
      }}
    >
      <code>{`npm install @silknet-ds/react @silknet-ds/tokens`}</code>
    </pre>
    <h2>Use it</h2>
    <pre
      style={{
        background: 'var(--background-surface)',
        padding: '12px 16px',
        borderRadius: 8,
        overflow: 'auto',
      }}
    >
      <code>{`// once at app entry:
import '@silknet-ds/tokens/tokens.css';
import '@silknet-ds/react/styles.css';

import { Button, Input } from '@silknet-ds/react';

export function Demo() {
  return (
    <>
      <Button variant="primary">Save</Button>
      <Input label="სახელი" helperText="დამხმარე ტექსტი" />
    </>
  );
}`}</code>
    </pre>
  </div>
);
