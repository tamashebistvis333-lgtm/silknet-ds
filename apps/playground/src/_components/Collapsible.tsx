import { useState, type ReactNode } from 'react';

// Collapsible section with a clickable header that toggles its body. The
// header doubles as a sticky-friendly visual anchor; the chevron rotates
// rather than swapping characters to keep the animation smooth.

export function Collapsible({
  title,
  count,
  defaultOpen = false,
  children,
}: {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: '100%',
          padding: '14px 4px',
          background: 'transparent',
          border: 0,
          borderBottom: '1px solid var(--border-default)',
          textAlign: 'left',
          cursor: 'pointer',
          color: 'var(--text-default)',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        }}
      >
        <span
          aria-hidden
          style={{
            display: 'inline-block',
            width: 12,
            transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.15s ease',
            color: 'var(--text-additional)',
          }}
        >
          ▶
        </span>
        <span
          style={{
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--text-secondary)',
          }}
        >
          {title}
        </span>
        {count != null && (
          <span
            style={{
              fontSize: 11,
              color: 'var(--text-additional)',
              marginLeft: 4,
            }}
          >
            ({count})
          </span>
        )}
      </button>
      {open && <div>{children}</div>}
    </section>
  );
}
