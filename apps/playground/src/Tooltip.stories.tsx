import type { Story } from '@ladle/react';
import { Tooltip, type TooltipPointer } from '@silknet-ds/react';

export default { title: 'Tooltip' };

const POINTERS: TooltipPointer[] = ['bottom-end', 'bottom', 'bottom-start', 'right', 'left', 'top-end', 'top', 'top-start'];

export const Variants = () => (
  <div>
    <h1 style={{ marginTop: 0 }}>Tooltip — pointer positions</h1>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, max-content)', gap: 40, alignItems: 'center' }}>
      {POINTERS.map((p) => (
        <div key={p} style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
          <code style={{ fontSize: 11, color: 'var(--text-additional)' }}>{p}</code>
          <Tooltip pointer={p}>This is tooltip</Tooltip>
        </div>
      ))}
    </div>
  </div>
);

export const Playground: Story<{ pointer: TooltipPointer; text: string; helper: string; showHelper: boolean }> = ({
  pointer,
  text,
  helper,
  showHelper,
}) => (
  <Tooltip pointer={pointer} helper={showHelper ? helper : undefined}>
    {text}
  </Tooltip>
);
Playground.args = { pointer: 'bottom', text: 'This is tooltip', helper: 'This is additional text', showHelper: true };
Playground.argTypes = { pointer: { options: POINTERS, control: { type: 'radio' } } };
