import type { Story } from '@ladle/react';
import { WalletButton, type WalletButtonAppearance, type WalletProvider } from '@silknet-ds/react';

export default { title: 'Wallet Button' };

export const Variants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 343 }}>
    <h1 style={{ marginTop: 0 }}>Wallet Button</h1>
    <WalletButton provider="apple-pay" appearance="black" />
    <WalletButton provider="apple-pay" appearance="white" />
    <WalletButton provider="google-pay" appearance="black" />
    <div style={{ background: 'var(--background-surface)', padding: 8, borderRadius: 16 }}>
      <WalletButton provider="google-pay" appearance="white" />
    </div>
    <p style={{ fontSize: 12, color: 'var(--text-additional)', margin: 0 }}>
      Default <code>appearance="auto"</code> follows the theme toggle (black in light, white in dark).
    </p>
  </div>
);

export const Playground: Story<{ provider: WalletProvider; appearance: WalletButtonAppearance; disabled: boolean }> = (
  args,
) => (
  <div style={{ maxWidth: 343 }}>
    <WalletButton {...args} onClick={() => console.log('pay', args.provider)} />
  </div>
);
Playground.args = { provider: 'apple-pay', appearance: 'auto', disabled: false };
Playground.argTypes = {
  provider: { options: ['apple-pay', 'google-pay'], control: { type: 'radio' } },
  appearance: { options: ['auto', 'black', 'white'], control: { type: 'radio' } },
};
