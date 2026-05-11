import type { ReactNode } from 'react';
import type { Story } from '@ladle/react';
import { TextArea } from '@silknet-ds/react';
import { UseIt, SectionTitle } from './_components/UseIt';

export default { title: 'Text Area' };

const Field = ({ children }: { children: ReactNode }) => (
  <div style={{ maxWidth: 360, marginBottom: 16 }}>{children}</div>
);

export const Variants = () => (
  <div>
    <SectionTitle>Default</SectionTitle>
    <Field>
      <TextArea label="ტექსტ არეა" helperText="დამხმარე ტექსტი" />
    </Field>

    <SectionTitle>Filled</SectionTitle>
    <Field>
      <TextArea
        label="ტექსტ არეა"
        defaultValue={'სამი ხაზი ტექსტი\nმეორე ხაზი\nმესამე'}
      />
    </Field>

    <SectionTitle>Error</SectionTitle>
    <Field>
      <TextArea label="ტექსტ არეა" error="აუცილებელია 10 სიმბოლო მაინც" />
    </Field>

    <SectionTitle>Disabled</SectionTitle>
    <Field>
      <TextArea label="ტექსტ არეა" helperText="ვერ რედაქტირდება" disabled defaultValue="უცვლელი" />
    </Field>

    <UseIt>{`import { TextArea } from '@silknet-ds/react';

<TextArea label="ტექსტ არეა" helperText="დამხმარე ტექსტი" />
<TextArea label="ტექსტ არეა" error="აუცილებელია 10 სიმბოლო" />
<TextArea label="ტექსტ არეა" disabled defaultValue="readonly" />

// Same API as Input, multi-line. Resize handle in the bottom-right.`}</UseIt>
  </div>
);

export const Playground: Story<{
  label: string;
  helperText: string;
  error: boolean;
  disabled: boolean;
}> = ({ label, helperText, error, disabled }) => (
  <Field>
    <TextArea label={label} helperText={helperText} error={error} disabled={disabled} />
  </Field>
);
Playground.args = {
  label: 'ტექსტ არეა',
  helperText: 'დამხმარე ტექსტი',
  error: false,
  disabled: false,
};
