import { Package, BonusContainer, Price, Badge, GlobalIcon, MessagesIcon, InfoIcon } from '@silknet-ds/react';

export default { title: 'Package' };

// Figma's minutes icon slot is empty — keep the 16px space so columns align.
const EmptyIcon = () => <span style={{ width: 16, height: 16, display: 'inline-block' }} />;

export const Default = () => (
  <div style={{ maxWidth: 358, display: 'flex', flexDirection: 'column', gap: 16 }}>
    <h1 style={{ marginTop: 0 }}>Package</h1>
    <Package
      title="ყველაფერი ულიმიტო"
      price={<Price amount={129} />}
      meta={<Badge category="neutral">30 დღე</Badge>}
    >
      <BonusContainer icon={<GlobalIcon />} label="მბ" amount="ულიმიტო" />
      <BonusContainer icon={<EmptyIcon />} label="წთ" amount="ულიმიტო" />
      <BonusContainer icon={<MessagesIcon />} label="სმს" amount="ულიმიტო" />
    </Package>
    <Package
      title="ყველაფერი ულიმიტო"
      points={2500}
      badges={
        <>
          <Badge variant="filled" category="error">
            Sale
          </Badge>
          <Badge category="neutral" icon={<InfoIcon />} aria-label="Info" />
        </>
      }
      price={<Price amount={99} oldAmount={129} />}
      meta={<Badge category="neutral">30 დღე</Badge>}
    >
      <BonusContainer icon={<GlobalIcon />} label="მბ" amount="ულიმიტო" />
      <BonusContainer icon={<MessagesIcon />} label="სმს" amount="ულიმიტო" />
    </Package>
  </div>
);
