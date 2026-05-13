import type { ReactNode, CSSProperties } from 'react';
import {
  textStyles,
  fontFamily,
  fontWeights,
  type TextStyleToken,
} from './_data/tokens';
import { Copyable } from './_components/Copyable';
import { Collapsible } from './_components/Collapsible';

export default { title: 'Tokens / Typography' };

// Same five-column layout as Colors:
//   [sample text] [token + specs]  [iOS]  [Android]  [React]
const COLUMNS = 'minmax(220px, 1.4fr) minmax(180px, 1fr) minmax(220px, 1.2fr) minmax(220px, 1.2fr) minmax(180px, 1fr)';

const rowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: COLUMNS,
  alignItems: 'center',
  gap: 16,
  padding: '12px 4px',
  borderBottom: '1px solid var(--border-default)',
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
};

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

function sampleStyle(s: TextStyleToken): CSSProperties {
  return {
    fontFamily: `'${s.fontFamily}', system-ui, sans-serif`,
    fontWeight: s.fontWeight,
    fontSize: s.fontSize,
    lineHeight: s.lineHeight,
    letterSpacing: s.letterSpacing,
    color: 'var(--text-default)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };
}

function compactSpecs(s: TextStyleToken) {
  const parts = [`${s.fontSize}/${s.lineHeight}`, `w${s.fontWeight}`];
  if (s.letterSpacing !== '0px') parts.push(`ls ${s.letterSpacing}`);
  return parts.join(' · ');
}

function reactSummary(s: TextStyleToken) {
  return `${s.fontSize}/${s.lineHeight} · w${s.fontWeight}`;
}

function reactFullBlock(s: TextStyleToken) {
  return [
    `font-family: '${s.fontFamily}', system-ui, sans-serif;`,
    `font-weight: ${s.fontWeight};`,
    `font-size: ${s.fontSize};`,
    `line-height: ${s.lineHeight};`,
    `letter-spacing: ${s.letterSpacing};`,
  ].join('\n');
}

function Row({ s }: { s: TextStyleToken }) {
  return (
    <div style={rowStyle}>
      <div style={sampleStyle(s)} title="ქართული ტექსტი — Sample Aa 123">
        ქართული — Sample Aa 123
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        <Copyable
          text={s.path}
          title={`Click to copy "${s.path}"`}
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: 13,
            color: 'var(--text-default)',
            wordBreak: 'break-all',
            padding: '2px 4px',
          }}
        >
          {s.path}
        </Copyable>
        <div
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: 11,
            color: 'var(--text-additional)',
            padding: '0 4px',
          }}
        >
          {compactSpecs(s)}
        </div>
      </div>

      <Copyable text={s.ios} style={refColStyle}>{s.ios}</Copyable>
      <Copyable text={s.androidCompose} style={refColStyle}>{s.androidCompose}</Copyable>
      <Copyable
        text={reactFullBlock(s)}
        title="Click to copy the full CSS block"
        style={refColStyle}
      >
        {reactSummary(s)}
      </Copyable>
    </div>
  );
}

function Header() {
  return (
    <div style={headerStyle}>
      <div>Sample</div>
      <div>Token</div>
      <div>iOS</div>
      <div>Android</div>
      <div>React (CSS)</div>
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

export const TextStyles = () => {
  const groups = Array.from(groupBy(textStyles, (s) => s.category).entries());
  return (
    <div>
      <h1 style={{ marginTop: 0, marginBottom: 8 }}>Typography</h1>
      <PageIntro>
        Composite text styles — family + weight + size + line-height +
        letter-spacing combined into one named style per row. Click any
        token name or platform reference to copy. The React column shows a
        compact summary; clicking copies the full CSS block. Groups are
        collapsed by default.
      </PageIntro>

      <Header />
      {groups.map(([category, list]) => (
        <Collapsible key={category} title={category} count={list.length}>
          {list.map((s) => (
            <Row key={s.path} s={s} />
          ))}
        </Collapsible>
      ))}
    </div>
  );
};

// ─── Family + Weights primitives (kept compact, no rows) ────────────────────

export const FamilyAndWeights = () => (
  <div>
    <h1 style={{ marginTop: 0, marginBottom: 8 }}>Font primitives</h1>
    <PageIntro>
      The single font family used across the system, plus the four weights
      from which all composite styles above are built. Click any value to
      copy.
    </PageIntro>

    <h2
      style={{
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        opacity: 0.55,
        fontFamily: 'ui-monospace, monospace',
        margin: '24px 0 12px',
        color: 'var(--text-secondary)',
      }}
    >
      Family
    </h2>
    <div
      style={{
        padding: '20px 24px',
        background: 'var(--background-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 12,
        marginBottom: 16,
      }}
    >
      <div
        style={{
          fontFamily: `'${fontFamily}', system-ui, sans-serif`,
          fontSize: 28,
          fontWeight: 500,
          color: 'var(--text-default)',
          marginBottom: 14,
        }}
      >
        ქართული ტექსტი — The quick brown fox 123
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '60px 1fr',
          gap: '6px 16px',
          fontSize: 12,
          fontFamily: 'ui-monospace, monospace',
          color: 'var(--text-secondary)',
        }}
      >
        <div style={{ opacity: 0.55, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 10 }}>Family</div>
        <Copyable text={fontFamily}>{fontFamily}</Copyable>
        <div style={{ opacity: 0.55, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 10 }}>iOS</div>
        <Copyable text="SilknetTypography.fontFamily">SilknetTypography.fontFamily</Copyable>
        <div style={{ opacity: 0.55, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 10 }}>Android</div>
        <Copyable text="SilknetFontFamily">SilknetFontFamily</Copyable>
        <div style={{ opacity: 0.55, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 10 }}>React</div>
        <Copyable text="var(--font-family-family)">var(--font-family-family)</Copyable>
      </div>
    </div>

    <h2
      style={{
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        opacity: 0.55,
        fontFamily: 'ui-monospace, monospace',
        margin: '24px 0 12px',
        color: 'var(--text-secondary)',
      }}
    >
      Weights
    </h2>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 12,
      }}
    >
      {fontWeights.map((w) => (
        <div
          key={w.value}
          style={{
            padding: '20px 16px',
            background: 'var(--background-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 12,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontFamily: `'${fontFamily}', system-ui, sans-serif`,
              fontWeight: w.cssWeight,
              fontSize: 36,
              lineHeight: 1,
              color: 'var(--text-default)',
            }}
          >
            Aa
          </div>
          <div
            style={{
              fontSize: 12,
              opacity: 0.7,
              marginTop: 8,
              textTransform: 'capitalize',
              color: 'var(--text-default)',
            }}
          >
            {w.value}{' '}
            <Copyable text={String(w.cssWeight)} style={{ fontSize: 11 }}>
              ({w.cssWeight})
            </Copyable>
          </div>
        </div>
      ))}
    </div>
  </div>
);
