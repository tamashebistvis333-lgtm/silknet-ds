import type { ReactNode } from 'react';
import type { Story } from '@ladle/react';
import { Input, UserIcon, EyeIcon } from '@silknet-ds/react';
import { UseIt, SectionTitle } from './_components/UseIt';

export default { title: 'Input' };

const Field = ({ children }: { children: ReactNode }) => (
  <div style={{ maxWidth: 360, marginBottom: 16 }}>{children}</div>
);

export const Variants = () => (
  <div>
    <SectionTitle>Default</SectionTitle>
    <Field>
      <Input label="სახელი" helperText="დამხმარე ტექსტი" />
    </Field>

    <SectionTitle>With icons</SectionTitle>
    <Field>
      <Input label="სახელი" helperText="left icon" leftIcon={<UserIcon />} />
    </Field>
    <Field>
      <Input
        label="სახელი"
        helperText="left + right icons"
        leftIcon={<UserIcon />}
        rightIcon={<EyeIcon />}
      />
    </Field>

    <SectionTitle>Filled (has value)</SectionTitle>
    <Field>
      <Input label="სახელი" defaultValue="ნოდარი" helperText="ფილდი ავტომატურად ტრანსფორმდება filled state-ში" />
    </Field>

    <SectionTitle>Error</SectionTitle>
    <Field>
      <Input label="სახელი" error="აუცილებელი ველი" />
    </Field>

    <SectionTitle>Disabled</SectionTitle>
    <Field>
      <Input label="სახელი" helperText="ვერ რედაქტირდება" disabled />
    </Field>

    <UseIt>{`import { Input, UserIcon } from '@silknet-ds/react';

<Input label="სახელი" helperText="დამხმარე ტექსტი" />
<Input label="სახელი" leftIcon={<UserIcon />} />
<Input label="სახელი" error="აუცილებელია" />
<Input label="სახელი" disabled defaultValue="readonly" />

// label is required (becomes the floating label).
// error: pass a string to use it as the error message in helper text.`}</UseIt>
  </div>
);

export const Playground: Story<{
  label: string;
  helperText: string;
  error: boolean;
  disabled: boolean;
  withLeftIcon: boolean;
  withRightIcon: boolean;
}> = ({ label, helperText, error, disabled, withLeftIcon, withRightIcon }) => (
  <Field>
    <Input
      label={label}
      helperText={helperText}
      error={error}
      disabled={disabled}
      leftIcon={withLeftIcon ? <UserIcon /> : undefined}
      rightIcon={withRightIcon ? <EyeIcon /> : undefined}
    />
  </Field>
);
Playground.args = {
  label: 'სახელი',
  helperText: 'დამხმარე ტექსტი',
  error: false,
  disabled: false,
  withLeftIcon: false,
  withRightIcon: false,
};
