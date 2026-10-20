import type { Story } from '@ladle/react';
import { Tab, TabBar } from '@silknet-ds/react';
import { Row } from './_components/Row';

export default { title: 'Tab Bar' };

const make = (n: number) =>
  Array.from({ length: n }, (_, i) => ({ value: `t${i}`, label: 'TabBar', badge: i === n - 1 }));

export const Variants = () => (
  <div style={{ maxWidth: 560 }}>
    <h1 style={{ marginTop: 0 }}>Tab Bar — 2 to 5 segments</h1>
    {[2, 3, 4, 5].map((n) => (
      <Row key={n} label={`quantity=${n}`}>
        <div style={{ width: 358 }}>
          <TabBar items={make(n)} />
        </div>
      </Row>
    ))}
    <Row label="Tab (single)">
      <div role="tablist" style={{ display: 'flex', gap: 8 }}>
        <Tab selected>TabBar</Tab>
        <Tab>TabBar</Tab>
        <Tab badge>TabBar</Tab>
      </div>
    </Row>
  </div>
);

export const Playground: Story<{ quantity: number }> = ({ quantity }) => (
  <div style={{ width: 358 }}>
    <TabBar items={make(quantity)} onChange={(v) => console.log('tab', v)} />
  </div>
);
Playground.args = { quantity: 3 };
Playground.argTypes = { quantity: { options: [2, 3, 4, 5], control: { type: 'radio' } } };
