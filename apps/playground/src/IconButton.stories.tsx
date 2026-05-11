import type { ReactNode } from 'react';
import type { Story } from '@ladle/react';
import {
  IconButton,
  type IconButtonVariant,
  type ButtonSize,
  PlusIcon,
} from '@silknet-ds/react';
import { UseIt, SectionTitle } from './_components/UseIt';

export default { title: 'Icon Button' };

const VARIANTS: IconButtonVariant[] = ['primary', 'primary-soft', 'secondary', 'ghost'];
const SIZES: ButtonSize[] = ['xs', 'sm', 'md', 'lg'];

const Row = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>{children}</div>
);

export const Variants = () => (
  <div>
    <SectionTitle>All variants — md</SectionTitle>
    <Row>
      {VARIANTS.map((v) => (
        <IconButton key={v} variant={v} aria-label={v}>
          <PlusIcon />
        </IconButton>
      ))}
    </Row>

    <SectionTitle>Sizes (primary)</SectionTitle>
    <Row>
      {SIZES.map((s) => (
        <IconButton key={s} size={s} aria-label={`primary ${s}`}>
          <PlusIcon />
        </IconButton>
      ))}
    </Row>

    <SectionTitle>Disabled</SectionTitle>
    <Row>
      {VARIANTS.map((v) => (
        <IconButton key={v} variant={v} disabled aria-label={v}>
          <PlusIcon />
        </IconButton>
      ))}
    </Row>

    <UseIt>{`import { IconButton, PlusIcon } from '@silknet-ds/react';

<IconButton aria-label="Add"><PlusIcon /></IconButton>
<IconButton variant="ghost" size="sm" aria-label="Settings"><PlusIcon /></IconButton>

// aria-label is required — icon-only buttons need an accessible name.`}</UseIt>
  </div>
);

export const Playground: Story<{
  variant: IconButtonVariant;
  size: ButtonSize;
  disabled: boolean;
}> = ({ variant, size, disabled }) => (
  <IconButton variant={variant} size={size} disabled={disabled} aria-label="Add">
    <PlusIcon />
  </IconButton>
);
Playground.args = { variant: 'primary', size: 'md', disabled: false };
Playground.argTypes = {
  variant: { options: VARIANTS, control: { type: 'select' } },
  size: { options: SIZES, control: { type: 'radio' } },
};
