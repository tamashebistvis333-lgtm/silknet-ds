import { useState, useRef, useEffect, type ReactNode, type CSSProperties } from 'react';

// Wraps any element so clicking copies the given text to the clipboard,
// with a brief "Copied" floater for feedback. Handles SSR-safe clipboard
// (no-op when unavailable) and clears the floater on unmount.

export function Copyable({
  text,
  children,
  style,
  title = 'Click to copy',
}: {
  text: string;
  children: ReactNode;
  style?: CSSProperties;
  title?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const handleClick = async () => {
    try {
      await navigator.clipboard?.writeText(text);
      setCopied(true);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // Clipboard might be blocked (insecure context). Fail silently — the
      // user can still select + copy by hand.
    }
  };

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      title={title}
      style={{
        cursor: 'pointer',
        position: 'relative',
        display: 'inline-block',
        maxWidth: '100%',
        borderRadius: 4,
        transition: 'background-color 0.15s ease',
        ...style,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--background-layer-hover)')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      {children}
      {copied && (
        <span
          style={{
            position: 'absolute',
            top: -22,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--text-default)',
            color: 'var(--background-layer)',
            fontSize: 10,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            padding: '3px 8px',
            borderRadius: 4,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          Copied
        </span>
      )}
    </span>
  );
}
