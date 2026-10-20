import { BonusContainer } from '@silknet-ds/react';

export default { title: 'Bonus Container' };

export const Variants = () => (
  <div>
    <h1 style={{ marginTop: 0 }}>Bonus Container</h1>
    <div style={{ display: 'flex', gap: 24 }}>
      <BonusContainer label="მბ" amount="100" />
      <BonusContainer label="წთ" amount="300" additional="+15 საერთაშორისო" />
      <BonusContainer label="SMS" amount="∞" icon={null} />
    </div>
  </div>
);
