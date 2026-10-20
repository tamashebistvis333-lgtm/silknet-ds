import type { Story } from '@ladle/react';
import { useState } from 'react';
import { Chip, type ChipSize } from '@silknet-ds/react';
import { Row } from './_components/Row';

export default { title: 'Chip' };

export const Variants = () => (
  <div style={{ maxWidth: 480 }}>
    <h1 style={{ marginTop: 0 }}>Chip — all variants</h1>
    <Row label="small">
      <Chip size="small">text</Chip>
      <Chip size="small" selected>
        text
      </Chip>
    </Row>
    <Row label="medium">
      <Chip size="medium">text</Chip>
      <Chip size="medium" selected>
        text
      </Chip>
    </Row>
  </div>
);

const FILTERS = ['ინტერნეტი', 'ტელევიზია', 'მობილური', 'სახლის ტელეფონი'];

export const FilterGroup: Story<{ size: ChipSize }> = ({ size }) => {
  const [on, setOn] = useState<string[]>(['ინტერნეტი']);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {FILTERS.map((f) => (
        <Chip
          key={f}
          size={size}
          selected={on.includes(f)}
          onClick={() => setOn((cur) => (cur.includes(f) ? cur.filter((x) => x !== f) : [...cur, f]))}
        >
          {f}
        </Chip>
      ))}
    </div>
  );
};
FilterGroup.args = { size: 'medium' };
FilterGroup.argTypes = { size: { options: ['small', 'medium'], control: { type: 'radio' } } };
