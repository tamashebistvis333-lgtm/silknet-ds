import type { ReactNode } from 'react';
import type { Story } from '@ladle/react';
import { Button, type ButtonVariant, type ButtonSize, PlusIcon } from '@silknet-ds/react';
import { UseIt, SectionTitle } from './_components/UseIt';

export default { title: 'Button' };

const VARIANTS: ButtonVariant[] = [
  'primary', 'primary-soft', 'secondary', 'ghost',
  'success', 'warning', 'error', 'info', 'silkfest', 'link',
];
const SIZES: ButtonSize[] = ['xs', 'sm', 'md', 'lg'];

const Row = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>{children}</div>
);

// ─── Variants — comprehensive reference ────────────────────────────────────
export const Variants = () => (
  <div>
    <SectionTitle>All variants — md</SectionTitle>
    <Row>
      {VARIANTS.map((v) => (
        <Button key={v} variant={v}>{v}</Button>
      ))}
    </Row>

    <SectionTitle>Sizes (primary)</SectionTitle>
    <Row>
      {SIZES.map((s) => (
        <Button key={s} size={s}>{s}</Button>
      ))}
    </Row>

    <SectionTitle>With icons</SectionTitle>
    <Row>
      <Button leftIcon={<PlusIcon />}>Add</Button>
      <Button rightIcon={<PlusIcon />}>Next</Button>
      <Button leftIcon={<PlusIcon />} rightIcon={<PlusIcon />}>Both</Button>
      <Button variant="secondary" leftIcon={<PlusIcon />}>Secondary</Button>
    </Row>

    <SectionTitle>Disabled</SectionTitle>
    <Row>
      {VARIANTS.map((v) => (
        <Button key={v} variant={v} disabled>{v}</Button>
      ))}
    </Row>

    <SectionTitle>Link variant — xs only per Figma</SectionTitle>
    <Row>
      <Button variant="link" size="xs">Default</Button>
      <Button variant="link" size="xs" disabled>Disabled</Button>
    </Row>

    <UseIt>{`import { Button, PlusIcon } from '@silknet-ds/react';

<Button variant="primary">Save</Button>
<Button variant="secondary" size="lg" leftIcon={<PlusIcon />}>Add item</Button>
<Button variant="ghost" disabled>Cancel</Button>
<Button variant="link" size="xs">Read more</Button>`}</UseIt>
  </div>
);

// ─── Playground — live controls ────────────────────────────────────────────
export const Playground: Story<{
  variant: ButtonVariant;
  size: ButtonSize;
  disabled: boolean;
  label: string;
  withLeftIcon: boolean;
  withRightIcon: boolean;
}> = ({ variant, size, disabled, label, withLeftIcon, withRightIcon }) => (
  <Button
    variant={variant}
    size={size}
    disabled={disabled}
    leftIcon={withLeftIcon ? <PlusIcon /> : undefined}
    rightIcon={withRightIcon ? <PlusIcon /> : undefined}
  >
    {label}
  </Button>
);
Playground.args = {
  variant: 'primary',
  size: 'md',
  disabled: false,
  label: 'Button',
  withLeftIcon: false,
  withRightIcon: false,
};
Playground.argTypes = {
  variant: { options: VARIANTS, control: { type: 'select' } },
  size: { options: SIZES, control: { type: 'radio' } },
};
