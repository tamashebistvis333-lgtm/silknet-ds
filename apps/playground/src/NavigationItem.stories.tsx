import { useState } from 'react';
import { NavigationItem, HomeIcon, StarIcon, UserIcon } from '@silknet-ds/react';

export default { title: 'Navigation Item' };

export const Variants = () => (
  <div>
    <h1 style={{ marginTop: 0 }}>Navigation Item</h1>
    <div style={{ display: 'flex', gap: 21 }}>
      <NavigationItem selected icon={<HomeIcon />} selectedIcon={<HomeIcon filled />}>
        Home
      </NavigationItem>
      <NavigationItem icon={<HomeIcon />} selectedIcon={<HomeIcon filled />}>
        Home
      </NavigationItem>
    </div>
  </div>
);

const TABS = [
  { id: 'home', label: 'Home', icon: <HomeIcon />, selectedIcon: <HomeIcon filled /> },
  { id: 'offers', label: 'Offers', icon: <StarIcon width={24} height={24} /> },
  { id: 'profile', label: 'Profile', icon: <UserIcon /> },
];

export const InABar = () => {
  const [current, setCurrent] = useState('home');
  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        maxWidth: 390,
        padding: '8px 0',
        background: 'var(--background-navigation)',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      {TABS.map((t) => (
        <NavigationItem
          key={t.id}
          icon={t.icon}
          selectedIcon={t.selectedIcon}
          selected={current === t.id}
          onClick={() => setCurrent(t.id)}
        >
          {t.label}
        </NavigationItem>
      ))}
    </nav>
  );
};
