import { MenuItem, StarIcon, ArrowRightIcon, TrashIcon } from '@silknet-ds/react';

export default { title: 'Menu Item' };

export const Variants = () => (
  <div style={{ width: 216 }}>
    <h1 style={{ marginTop: 0 }}>Menu Item</h1>
    <MenuItem role="button" icon={<StarIcon />}>Label</MenuItem>
    <MenuItem role="button" icon={<StarIcon />} trailing={<ArrowRightIcon />}>
      With submenu
    </MenuItem>
    <MenuItem role="button">No icon</MenuItem>
    <MenuItem role="button" icon={<TrashIcon />} destructive>
      Delete
    </MenuItem>
    <MenuItem role="button" icon={<StarIcon />} disabled>
      Disabled
    </MenuItem>
  </div>
);
