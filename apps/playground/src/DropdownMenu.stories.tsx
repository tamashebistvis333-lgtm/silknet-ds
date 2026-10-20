import { DropdownMenu, MenuItem, Divider, InfoIcon, EditIcon, TrashIcon } from '@silknet-ds/react';

export default { title: 'Dropdown Menu' };

export const Default = () => (
  <div>
    <h1 style={{ marginTop: 0 }}>Dropdown Menu</h1>
    <DropdownMenu aria-label="Actions">
      <MenuItem icon={<InfoIcon />}>Details</MenuItem>
      <MenuItem icon={<EditIcon />}>Edit</MenuItem>
      <Divider alignment="centered" />
      <MenuItem icon={<TrashIcon />} destructive>
        Delete
      </MenuItem>
    </DropdownMenu>
    <p style={{ fontSize: 12, color: 'var(--text-additional)' }}>Tab in, then use ↑ / ↓ to move between items.</p>
  </div>
);
