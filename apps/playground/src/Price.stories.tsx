import type { Story } from '@ladle/react';
import { Price, type PriceVariant } from '@silknet-ds/react';
import { Row } from './_components/Row';

export default { title: 'Price' };

export const Variants = () => (
  <div style={{ maxWidth: 560 }}>
    <h1 style={{ marginTop: 0 }}>Price</h1>
    <Row label="points">
      <Price variant="points" points={2500} amount={129} />
    </Row>
    <Row label="gel + old + points">
      <Price variant="gel" oldAmount={129} amount={129} points={2500} />
    </Row>
    <Row label="gel only">
      <Price variant="gel" amount={49.9} />
    </Row>
  </div>
);

export const Playground: Story<{ variant: PriceVariant; amount: number; oldAmount: number; points: number; showOld: boolean; showPoints: boolean }> = ({
  variant,
  amount,
  oldAmount,
  points,
  showOld,
  showPoints,
}) => (
  <Price
    variant={variant}
    amount={amount}
    oldAmount={showOld ? oldAmount : undefined}
    points={showPoints || variant === 'points' ? points : undefined}
  />
);
Playground.args = { variant: 'gel', amount: 99, oldAmount: 129, points: 2500, showOld: true, showPoints: true };
Playground.argTypes = { variant: { options: ['gel', 'points'], control: { type: 'radio' } } };
