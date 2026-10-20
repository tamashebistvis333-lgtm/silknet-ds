import type { Story } from '@ladle/react';
import { ListItem, AirplaneIcon, Badge, Toggle, ArrowRightIcon, Avatar } from '@silknet-ds/react';

export default { title: 'List Item' };

export const Variants = () => (
  <div style={{ maxWidth: 358 }}>
    <h1 style={{ marginTop: 0 }}>List Item</h1>
    <ListItem leading={<AirplaneIcon />} overline="ზედა დამხმარე ტექსტი" trailing={<Badge>primary</Badge>}>
      მთავარი ტექსტი
    </ListItem>
    <ListItem inset leading={<AirplaneIcon />} overline="ზედა დამხმარე ტექსტი" trailing={<Badge>primary</Badge>}>
      მთავარი ტექსტი (inset)
    </ListItem>
    <ListItem leading={<Avatar size="medium" initials="AB" />} description="ქვედა დამხმარე ტექსტი" trailing={<Toggle aria-label="toggle" />}>
      მთავარი ტექსტი
    </ListItem>
    <ListItem trailing={<span style={{ color: 'var(--text-additional)', display: 'flex' }}><ArrowRightIcon /></span>}>
      Text only
    </ListItem>
  </div>
);

export const Playground: Story<{ inset: boolean; showTop: boolean; showBottom: boolean; leading: boolean; trailing: boolean }> = ({
  inset,
  showTop,
  showBottom,
  leading,
  trailing,
}) => (
  <div style={{ maxWidth: 358, background: 'var(--background-surface)', borderRadius: 16 }}>
    <ListItem
      inset={inset}
      leading={leading ? <AirplaneIcon /> : undefined}
      trailing={trailing ? <Badge>primary</Badge> : undefined}
      overline={showTop ? 'ზედა დამხმარე ტექსტი' : undefined}
      description={showBottom ? 'ქვედა დამხმარე ტექსტი' : undefined}
    >
      მთავარი ტექსტი
    </ListItem>
  </div>
);
Playground.args = { inset: true, showTop: true, showBottom: false, leading: true, trailing: true };
