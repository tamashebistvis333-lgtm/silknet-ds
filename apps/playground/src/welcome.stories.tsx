export default {
  title: 'Welcome',
};

const card = {
  background: 'var(--background-surface)',
  border: '1px solid var(--border-default)',
  borderRadius: 12,
  padding: '20px 24px',
  marginBottom: 16,
} as const;

const codeBlock = {
  background: 'var(--background-layer-hover)',
  padding: '12px 14px',
  borderRadius: 8,
  overflow: 'auto',
  fontSize: 12,
  lineHeight: 1.6,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  margin: '8px 0 0',
} as const;

const sectionTitle = {
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  opacity: 0.55,
  fontFamily: 'ui-monospace, monospace',
  margin: '0 0 8px',
} as const;

export const Readme = () => (
  <div style={{ maxWidth: 760, lineHeight: 1.6 }}>
    <h1 style={{ marginTop: 0 }}>Silknet DS — Component Playground</h1>
    <p>
      Live React components consuming the Silknet design tokens. Use the sidebar
      to browse Button, Icon Button, Input, Text Area, and Helper Text. Each
      component has a <strong>Variants</strong> page (full reference + a "Use
      it" snippet at the bottom) and a <strong>Playground</strong> with live
      controls.
    </p>
    <p>
      Toggle theme via the icon in the top toolbar (Light ↔ Dark). The toggle
      sets <code>[data-theme="dark"]</code> on the document root, which is how
      the generated tokens CSS switches palettes.
    </p>

    <div style={card}>
      <p style={sectionTitle}>Web (React)</p>
      <pre style={codeBlock}>
        <code>{`npm install @silknet-ds/react @silknet-ds/tokens`}</code>
      </pre>
      <pre style={codeBlock}>
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
      <p style={{ fontSize: 13, opacity: 0.7, margin: '12px 0 0' }}>
        Dark mode: set <code>&lt;html data-theme="dark"&gt;</code>. Tokens auto-switch.
      </p>
    </div>

    <div style={card}>
      <p style={sectionTitle}>iOS (SwiftUI / UIKit)</p>
      <p style={{ fontSize: 13, margin: '0 0 8px' }}>
        Xcode → <strong>File → Add Package Dependencies…</strong>
      </p>
      <pre style={codeBlock}>
        <code>{`https://github.com/tamashebistvis333-lgtm/silknet-ds.git
Version: from 0.1.0
Library: SilknetDS`}</code>
      </pre>
      <pre style={codeBlock}>
        <code>{`import SwiftUI
import SilknetDS

struct DemoView: View {
    var body: some View {
        VStack(spacing: .silknet.digitsSpacing4) {
            Text("Hello")
                .font(.silknet.headingHeading1)
                .foregroundColor(.silknet.textDefault)

            RoundedRectangle(cornerRadius: .silknet.digitsRadiusS)
                .fill(Color.silknet.backgroundPrimaryAccent)
                .frame(height: 44)
        }
        .padding(.silknet.digitsSpacing4)
        .background(Color.silknet.backgroundLayer)
    }
}`}</code>
      </pre>
      <p style={{ fontSize: 13, opacity: 0.7, margin: '12px 0 0' }}>
        Theme switching is automatic — semantic colors follow{' '}
        <code>UITraitCollection.userInterfaceStyle</code>.
      </p>
    </div>

    <div style={card}>
      <p style={sectionTitle}>Links</p>
      <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14 }}>
        <li>
          <strong>Repo:</strong>{' '}
          <a href="https://github.com/tamashebistvis333-lgtm/silknet-ds">
            github.com/tamashebistvis333-lgtm/silknet-ds
          </a>
        </li>
        <li>
          <strong>npm — react:</strong>{' '}
          <a href="https://www.npmjs.com/package/@silknet-ds/react">
            @silknet-ds/react
          </a>
        </li>
        <li>
          <strong>npm — tokens:</strong>{' '}
          <a href="https://www.npmjs.com/package/@silknet-ds/tokens">
            @silknet-ds/tokens
          </a>
        </li>
      </ul>
    </div>
  </div>
);
