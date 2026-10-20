import { useState } from 'react';
import { ActionSheet, Button, MenuItem, EditIcon, TrashIcon, Divider } from '@silknet-ds/react';

export default { title: 'Action Sheet' };

export const Default = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Action Sheet</h1>
      <p style={{ fontSize: 14, color: 'var(--text-additional)' }}>
        Open it, then close with ×, the backdrop, Esc, or by dragging the top of the sheet down.
      </p>
      <Button onClick={() => setOpen(true)}>Open action sheet</Button>
      <ActionSheet
        open={open}
        onClose={() => setOpen(false)}
        title="აქ შეგიძლია დაწერო დიალოგის ორ ხაზიანი სათაური"
        subtitle="საჭიროების შემთხვევაში შეგიძლია მიამატო დამხმარე ტექსტი"
      >
        <div style={{ height: 151, borderRadius: 16, background: 'var(--background-pink)' }} />
      </ActionSheet>
    </div>
  );
};

export const WithMenu = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open menu sheet</Button>
      <ActionSheet open={open} onClose={() => setOpen(false)} title="მოქმედებები">
        <div>
          <MenuItem icon={<EditIcon />} onClick={() => setOpen(false)}>
            რედაქტირება
          </MenuItem>
          <Divider />
          <MenuItem icon={<TrashIcon />} destructive onClick={() => setOpen(false)}>
            წაშლა
          </MenuItem>
        </div>
      </ActionSheet>
    </div>
  );
};
