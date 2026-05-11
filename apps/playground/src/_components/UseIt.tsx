import type { ReactNode } from 'react';

// "Use it" code reference block — appended to each component's Variants
// story so designers/devs always see the import + usage snippet without
// leaving the page. Files prefixed with `_` aren't picked up by Ladle's
// stories glob.

export function UseIt({ children }: { children: string }) {
  return (
    <section style={{ marginTop: 32 }}>
      <h3
        style={{
          fontSize: 12,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          opacity: 0.6,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginTop: 0,
          marginBottom: 12,
          color: 'var(--text-secondary)',
        }}
      >
        Use it
      </h3>
      <pre
        style={{
          background: 'var(--background-surface)',
          border: '1px solid var(--border-default)',
          padding: '14px 16px',
          borderRadius: 8,
          margin: 0,
          overflow: 'auto',
          fontSize: 12,
          lineHeight: 1.6,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          color: 'var(--text-default)',
        }}
      >
        <code>{children}</code>
      </pre>
    </section>
  );
}

// Small section heading used inside Variants stories to break up the page.
export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2
      style={{
        fontSize: 13,
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        opacity: 0.55,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        margin: '24px 0 12px',
        color: 'var(--text-secondary)',
      }}
    >
      {children}
    </h2>
  );
}
