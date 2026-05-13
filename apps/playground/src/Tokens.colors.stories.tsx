import type { ReactNode, CSSProperties } from 'react';
import {
  semanticColors,
  paletteColors,
  type ColorToken,
} from './_data/tokens';
import { Copyable } from './_components/Copyable';
import { Collapsible } from './_components/Collapsible';

export default { title: 'Tokens / Colors' };

// Compact table layout: one row per token. Five columns share widths
// across rows so eyes scan vertically.
//   [swatch] [token + hex]  [iOS]  [Android]  [React]
const COLUMNS = '56px minmax(180px, 1fr) minmax(220px, 1.4fr) minmax(220px, 1.4fr) minmax(180px, 1fr)';

const rowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: COLUMNS,
  alignItems: 'center',
  gap: 16,
  padding: '8px 4px',
  borderBottom: '1px solid var(--border-default)',
  minHeight: 56,
};

const headerStyle: CSSProperties = {
  ...rowStyle,
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: 'var(--text-additional)',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  position: 'sticky',
  top: 0,
  background: 'var(--background-layer)',
  zIndex: 2,
  paddingTop: 12,
  paddingBottom: 12,
  minHeight: 0,
};

const swatchStyle = (hex: string): CSSProperties => ({
  width: 40,
  height: 40,
  borderRadius: 8,
  background: hex,
  boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)',
});

const refColStyle: CSSProperties = {
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: 12,
  color: 'var(--text-secondary)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  minWidth: 0,
  padding: '4px 6px',
};

function Row({ c, showDark }: { c: ColorToken; showDark: boolean }) {
  const hasDark = showDark && c.hexDark && c.hexDark.toLowerCase() !== c.hex.toLowerCase();
  return (
    <div style={rowStyle}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={swatchStyle(c.hex)} title={c.hex.toUpperCase()}>
          {hasDark && (
            <div
              style={{
                width: '50%',
                height: '100%',
                background: c.hexDark,
                marginLeft: '50%',
                borderTopRightRadius: 8,
                borderBottomRightRadius: 8,
              }}
              title={`Dark: ${c.hexDark!.toUpperCase()}`}
            />
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        <Copyable
          text={c.path}
          title={`Click to copy "${c.path}"`}
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: 13,
            color: 'var(--text-default)',
            wordBreak: 'break-all',
            padding: '2px 4px',
          }}
        >
          {c.path}
        </Copyable>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <Copyable
            text={c.hex.toUpperCase()}
            title={`Click to copy "${c.hex.toUpperCase()}"`}
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--text-default)',
              padding: '2px 4px',
            }}
          >
            {c.hex.toUpperCase()}
          </Copyable>
          {hasDark && (
            <Copyable
              text={c.hexDark!.toUpperCase()}
              title={`Click to copy "${c.hexDark!.toUpperCase()}"`}
              style={{
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                fontSize: 11,
                color: 'var(--text-additional)',
                padding: '2px 4px',
              }}
            >
              dark · {c.hexDark!.toUpperCase()}
            </Copyable>
          )}
        </div>
      </div>

      <Copyable text={c.ios} style={refColStyle}>{c.ios}</Copyable>
      <Copyable text={c.androidCompose} style={refColStyle}>{c.androidCompose}</Copyable>
      <Copyable text={c.reactCss} style={refColStyle}>{c.reactCss}</Copyable>
    </div>
  );
}

function Header() {
  return (
    <div style={headerStyle}>
      <div>Color</div>
      <div>Token</div>
      <div>iOS</div>
      <div>Android</div>
      <div>React</div>
    </div>
  );
}

const PageIntro = ({ children }: { children: ReactNode }) => (
  <p
    style={{
      maxWidth: 720,
      lineHeight: 1.5,
      color: 'var(--text-secondary)',
      marginTop: 0,
      fontSize: 13,
    }}
  >
    {children}
  </p>
);

function groupBy<T>(items: T[], key: (t: T) => string): Map<string, T[]> {
  const m = new Map<string, T[]>();
  for (const item of items) {
    const k = key(item);
    if (!m.has(k)) m.set(k, []);
    m.get(k)!.push(item);
  }
  return m;
}

// ─── Stories ────────────────────────────────────────────────────────────────

export const Semantic = () => {
  const groups = Array.from(groupBy(semanticColors, (c) => c.category).entries());
  return (
    <div>
      <h1 style={{ marginTop: 0, marginBottom: 8 }}>Semantic colors</h1>
      <PageIntro>
        Theme-aware tokens. The swatch shows light on the left, dark on the
        right (when they differ). Click any token name, hex, or platform
        reference to copy it to your clipboard. Groups are collapsed by
        default — click a header to expand.
      </PageIntro>

      <Header />
      {groups.map(([category, list]) => (
        <Collapsible key={category} title={category} count={list.length}>
          {list.map((c) => (
            <Row key={c.path} c={c} showDark />
          ))}
        </Collapsible>
      ))}
    </div>
  );
};

export const Palette = () => {
  const groups = Array.from(groupBy(paletteColors, (c) => c.category).entries());
  return (
    <div>
      <h1 style={{ marginTop: 0, marginBottom: 8 }}>Primitive palette</h1>
      <PageIntro>
        Raw color steps — same value across light/dark themes. Prefer semantic
        tokens for product UI; reach for primitives only when you need a
        specific brand color regardless of theme. Click any value to copy.
      </PageIntro>

      <Header />
      {groups.map(([category, list]) => (
        <Collapsible key={category} title={category} count={list.length}>
          {list.map((c) => (
            <Row key={c.path} c={c} showDark={false} />
          ))}
        </Collapsible>
      ))}
    </div>
  );
};
