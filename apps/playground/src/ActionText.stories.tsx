import { ActionText, Checkbox, Toggle, RadioButton } from '@silknet-ds/react';

export default { title: 'Action Text' };

export const Variants = () => (
  <div style={{ maxWidth: 358, display: 'flex', flexDirection: 'column', gap: 24 }}>
    <h1 style={{ marginTop: 0 }}>Action + Text</h1>
    <ActionText
      action={<Checkbox defaultChecked aria-label="Label" />}
      label="Label"
      description="additional text"
      trailing={<Toggle defaultChecked aria-label="Toggle" />}
    />
    <ActionText action={<Checkbox aria-label="Label" />} label="Checkbox only" description="additional text" />
    <ActionText action={<RadioButton aria-label="Option" />} label="Radio option" />
    <ActionText label="Toggle only" description="additional text" trailing={<Toggle aria-label="Toggle" />} />
  </div>
);
