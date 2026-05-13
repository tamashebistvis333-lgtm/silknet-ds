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

// Reuses the warning semantic tokens so the callout follows light/dark theme.
const warningCallout = {
  background: 'var(--background-warning)',
  border: '1px solid var(--border-warning)',
  borderRadius: 8,
  padding: '12px 16px',
  margin: '20px 0',
  color: 'var(--text-default)',
} as const;

export const Readme = () => (
  <div style={{ maxWidth: 760, lineHeight: 1.6 }}>
    <h1 style={{ marginTop: 0 }}>Silknet Design System — Component Playground</h1>
    <p>
      ეს ფაილი წარმოადგენს მცდელობას, რომ შეიქმნას reusable და სრულად ავტომატიზირებული
      დიზაინ სისტემა, რომელიც მართვადი იქნება დიზაინერების მიერ და დეველოპერებს
      მისცემს საშუალებას თავიდან აირიდონ ის "მოსაწყენი" პროცესი, რასაც კომპონენტების
      მარქაფი და 1-1-ში დიზაინის დამთხვევას გულისხმობს.
    </p>

    <p>
      ფაილში წარმოდგენილია WEB, iOS და Android პლატფორმებისთვის დიზაინ ტოკენები
      და კომპონენტები. Light/Dark თემა გამართულია და მუშაობს.
    </p>

    <p>
      ტოკენებისა და კომპონენტების დასათვალიერებლად, გამოიყენე მარჯვნივ არსებული ნავიგაცია.
    </p>

    <div style={warningCallout}>
      <strong>გაფრთხილება.</strong>{' '}
      iOS და Android სისტემებისთვის, ჯერ-ჯერობით ხელმისაწვდომია მხოლოდ ტოკენები.
    </div>

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
      <p style={sectionTitle}>Android (Compose / View System)</p>
      <p style={{ fontSize: 13, margin: '0 0 8px' }}>
        Add JitPack to <code>settings.gradle.kts</code>:
      </p>
      <pre style={codeBlock}>
        <code>{`dependencyResolutionManagement {
  repositories {
    google()
    mavenCentral()
    maven { url = uri("https://jitpack.io") }
  }
}`}</code>
      </pre>
      <p style={{ fontSize: 13, margin: '8px 0' }}>
        Add to your app module:
      </p>
      <pre style={codeBlock}>
        <code>{`implementation("com.github.tamashebistvis333-lgtm:silknet-ds:v0.2.2")`}</code>
      </pre>
      <pre style={codeBlock}>
        <code>{`import ge.silknet.ds.Silknet
import ge.silknet.ds.SilknetTheme

@Composable
fun Demo() {
    SilknetTheme {
        Text(
            "Hello",
            style = Silknet.typography.headingHeading1,
            color = Silknet.colors.textDefault,
        )
    }
}`}</code>
      </pre>
      <p style={{ fontSize: 13, opacity: 0.7, margin: '12px 0 0' }}>
        XML resources also available: <code>@color/text_default</code>,{' '}
        <code>@dimen/digits_spacing_4</code>. Auto-switches via{' '}
        <code>values/</code> + <code>values-night/</code>.
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
