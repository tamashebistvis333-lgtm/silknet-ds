import type { Story } from '@ladle/react';
import { HelperText, type HelperTextState } from '@silknet-ds/react';
import { UseIt, SectionTitle } from './_components/UseIt';

export default { title: 'Helper Text' };

const STATES: HelperTextState[] = ['default', 'success', 'info', 'warning', 'error'];

export const Variants = () => (
  <div>
    <SectionTitle>All states</SectionTitle>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 560 }}>
      {STATES.map((state) => (
        <div
          key={state}
          style={{
            display: 'grid',
            gridTemplateColumns: '80px 1fr',
            alignItems: 'center',
            padding: '8px 12px',
            background: 'var(--background-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 8,
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 11,
              opacity: 0.55,
              textTransform: 'capitalize',
              fontFamily: 'ui-monospace, monospace',
            }}
          >
            {state}
          </div>
          <HelperText state={state}>დამხმარე ტექსტი — helper text sample</HelperText>
        </div>
      ))}
    </div>

    <UseIt>{`import { HelperText } from '@silknet-ds/react';

<HelperText>დამხმარე ტექსტი</HelperText>
<HelperText state="success">წარმატებულია</HelperText>
<HelperText state="info">ინფორმაცია</HelperText>
<HelperText state="warning">გაფრთხილება</HelperText>
<HelperText state="error">შეცდომა</HelperText>

// Non-default states auto-render their default icon.
// Pass icon={<MyIcon />} to override, or icon={null} to suppress.`}</UseIt>
  </div>
);

export const Playground: Story<{ state: HelperTextState; text: string }> = ({ state, text }) => (
  <HelperText state={state}>{text}</HelperText>
);
Playground.args = { state: 'default', text: 'დამხმარე ტექსტი' };
Playground.argTypes = {
  state: { options: STATES, control: { type: 'radio' } },
};
