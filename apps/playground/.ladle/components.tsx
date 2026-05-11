import { useEffect } from 'react';
import type { GlobalProvider } from '@ladle/react';

// Wrap every story with global setup:
//   1. Load token CSS variables (light + dark) — both stylesheets register on
//      the root; the dark one only activates when [data-theme="dark"] is set.
//   2. Load the React component styles.
//   3. Mirror Ladle's built-in theme toggle (top-right of the toolbar) onto
//      the document root via the `data-theme` attribute the tokens expect.
//   4. Set body font to Noto Sans Georgian so stories match production.

import '@silknet-ds/tokens/tokens.css';
import '@silknet-ds/react/styles.css';

export const Provider: GlobalProvider = ({ children, globalState }) => {
  useEffect(() => {
    const isDark = globalState.theme === 'dark';
    const root = document.documentElement;
    if (isDark) root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
  }, [globalState.theme]);

  return (
    <div
      style={{
        fontFamily: "'Noto Sans Georgian', system-ui, sans-serif",
        color: 'var(--text-default)',
        background: 'var(--background-layer)',
        padding: '24px',
        minHeight: '100vh',
        boxSizing: 'border-box',
      }}
    >
      {children}
    </div>
  );
};
