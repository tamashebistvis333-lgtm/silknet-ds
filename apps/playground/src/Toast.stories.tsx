import type { Story } from '@ladle/react';
import { Toast, type ToastVariant } from '@silknet-ds/react';

export default { title: 'Toast' };

const VARIANTS: ToastVariant[] = ['success', 'error', 'warning', 'info'];

export const Variants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
    <h1 style={{ marginTop: 0 }}>Toast — all variants</h1>
    {VARIANTS.map((v) => (
      <Toast key={v} variant={v}>
        Feedback tile goes here
      </Toast>
    ))}
  </div>
);

export const WithAction = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
    {VARIANTS.map((v) => (
      <Toast key={v} variant={v} action="Undo" onAction={() => alert(`${v}: Undo clicked`)}>
        Feedback tile goes here
      </Toast>
    ))}
  </div>
);

export const Playground: Story<{
  variant: ToastVariant;
  message: string;
  showAction: boolean;
}> = ({ variant, message, showAction }) => (
  <Toast variant={variant} action={showAction ? 'Undo' : undefined}>
    {message}
  </Toast>
);
Playground.args = { variant: 'success', message: 'Feedback tile goes here', showAction: true };
Playground.argTypes = {
  variant: { options: VARIANTS, control: { type: 'radio' } },
};
