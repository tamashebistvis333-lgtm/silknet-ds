import type { Story } from '@ladle/react';
import { Badge, type BadgeCategory, type BadgeVariant } from '@silknet-ds/react';
import { Row } from './_components/Row';

export default { title: 'Badge' };

const CATEGORIES: BadgeCategory[] = ['primary', 'success', 'error', 'warning', 'info', 'neutral', 'disabled'];
const VARIANTS: BadgeVariant[] = ['soft', 'filled', 'dot', 'dot-small'];

export const Variants = () => (
  <div style={{ maxWidth: 900 }}>
    <h1 style={{ marginTop: 0 }}>Badge — all variants</h1>
    {VARIANTS.map((v) => (
      <Row key={v} label={v}>
        {CATEGORIES.map((c) => (
          <Badge key={c} variant={v} category={c} aria-label={v.startsWith('dot') ? c : undefined}>
            {c}
          </Badge>
        ))}
      </Row>
    ))}
    <Row label="soft, no icon">
      {CATEGORIES.map((c) => (
        <Badge key={c} category={c} icon={null}>
          {c}
        </Badge>
      ))}
    </Row>
  </div>
);

export const Playground: Story<{
  variant: BadgeVariant;
  category: BadgeCategory;
  label: string;
  showIcon: boolean;
}> = ({ variant, category, label, showIcon }) => (
  <Badge variant={variant} category={category} icon={showIcon ? undefined : null}>
    {label}
  </Badge>
);
Playground.args = { variant: 'soft', category: 'primary', label: 'primary', showIcon: true };
Playground.argTypes = {
  variant: { options: VARIANTS, control: { type: 'radio' } },
  category: { options: CATEGORIES, control: { type: 'radio' } },
};
