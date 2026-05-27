import type { Story } from '@ladle/react';
import { BaseFeedback, type BaseFeedbackState } from '@silknet-ds/react';

export default { title: 'Base Feedback' };

const STATES: BaseFeedbackState[] = ['success', 'warning', 'error'];

const TITLE = 'შენი ორხაზიანი სათური იქნება აქ';
const DESCRIPTION =
  'ეს შინაარსი შექმნილია ჩართვისა და ინფორმირების მიზნით, რაც მას ნებისმიერი პროექტისთვის მთავარ აქტივად აქცევს.';

export const Variants = () => (
  <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
    {STATES.map((s) => (
      <BaseFeedback key={s} state={s} title={TITLE} description={DESCRIPTION} />
    ))}
  </div>
);

export const TitleOnly = () => (
  <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
    {STATES.map((s) => (
      <BaseFeedback key={s} state={s} title={TITLE} />
    ))}
  </div>
);

export const Playground: Story<{
  state: BaseFeedbackState;
  title: string;
  description: string;
}> = ({ state, title, description }) => (
  <BaseFeedback state={state} title={title} description={description} />
);
Playground.args = { state: 'success', title: TITLE, description: DESCRIPTION };
Playground.argTypes = {
  state: { options: STATES, control: { type: 'radio' } },
};
