import type { Story } from '@ladle/react';
import { useState } from 'react';
import { FeedbackScreen, Button, type FeedbackScreenVariant } from '@silknet-ds/react';

export default { title: 'Feedback Screen' };

type State = 'success' | 'error' | 'warning';

export const Playground: Story<{ variant: FeedbackScreenVariant; state: State; secondary: boolean }> = ({
  variant,
  state,
  secondary,
}) => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Feedback Screen</h1>
      <Button onClick={() => setOpen(true)}>Open ({variant})</Button>
      <FeedbackScreen
        open={open}
        onClose={close}
        variant={variant}
        state={state}
        title="შენი ორხაზიანი სათური იქნება აქ"
        description="ეს შინაარსი შექმნილია ჩართვისა და ინფორმირების მიზნით, რაც მას ნებისმიერი პროექტისთვის მთავარ აქტივად აქცევს."
        primaryAction={{ label: 'Primary button', onClick: close }}
        secondaryAction={
          secondary
            ? { label: variant === 'fullscreen' ? 'Soft primary button' : 'Ghost button', onClick: close }
            : undefined
        }
      />
    </div>
  );
};
Playground.args = { variant: 'dialog', state: 'success', secondary: true };
Playground.argTypes = {
  variant: { options: ['dialog', 'fullscreen'], control: { type: 'radio' } },
  state: { options: ['success', 'error', 'warning'], control: { type: 'radio' } },
};
