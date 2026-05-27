import type { Story } from '@ladle/react';
import { Feedback, type FeedbackVariant } from '@silknet-ds/react';

export default { title: 'Feedback' };

const VARIANTS: FeedbackVariant[] = ['success', 'error', 'warning', 'info'];

const TITLE = 'Feedback tile goes here';
const BODY = 'Feedback body text goes here which occupies two rows';

export const Variants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400 }}>
    <h1 style={{ marginTop: 0 }}>Feedback — all variants</h1>
    {VARIANTS.map((v) => (
      <Feedback
        key={v}
        variant={v}
        title={TITLE}
        primaryAction={{ label: 'Action', onClick: () => {} }}
        secondaryAction={{ label: 'Action', onClick: () => {} }}
        onClose={() => alert(`${v}: dismissed`)}
      >
        {BODY}
      </Feedback>
    ))}
  </div>
);

export const Minimal = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400 }}>
    <h2 style={{ marginTop: 0 }}>No actions, no close</h2>
    {VARIANTS.map((v) => (
      <Feedback key={v} variant={v} title={TITLE}>
        {BODY}
      </Feedback>
    ))}
  </div>
);

export const Playground: Story<{
  variant: FeedbackVariant;
  title: string;
  body: string;
  showActions: boolean;
  showClose: boolean;
}> = ({ variant, title, body, showActions, showClose }) => (
  <Feedback
    variant={variant}
    title={title}
    primaryAction={showActions ? { label: 'Action' } : undefined}
    secondaryAction={showActions ? { label: 'Action' } : undefined}
    onClose={showClose ? () => {} : undefined}
  >
    {body}
  </Feedback>
);
Playground.args = {
  variant: 'success',
  title: TITLE,
  body: BODY,
  showActions: true,
  showClose: true,
};
Playground.argTypes = {
  variant: { options: VARIANTS, control: { type: 'radio' } },
};
