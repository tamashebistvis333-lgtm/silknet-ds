import type { Story } from '@ladle/react';
import { Avatar, type AvatarSize } from '@silknet-ds/react';
import { Row } from './_components/Row';
import photo from './_assets/avatar-sample.png';

export default { title: 'Avatar' };

const SIZES: AvatarSize[] = ['large', 'medium', 'small', 'xsmall'];

export const Variants = () => (
  <div style={{ maxWidth: 640 }}>
    <h1 style={{ marginTop: 0 }}>Avatar — all variants</h1>
    <Row label="image + status">
      {SIZES.map((s) => (
        <Avatar key={s} size={s} src={photo} alt="Sample user" status />
      ))}
    </Row>
    <Row label="placeholder + status">
      {SIZES.map((s) => (
        <Avatar key={s} size={s} alt="Unknown user" status />
      ))}
    </Row>
    <Row label="initials + status">
      {SIZES.map((s) => (
        <Avatar key={s} size={s} initials="AB" status />
      ))}
    </Row>
    <Row label="no status">
      {SIZES.map((s) => (
        <Avatar key={s} size={s} initials="AB" />
      ))}
    </Row>
  </div>
);

export const Playground: Story<{
  size: AvatarSize;
  kind: 'image' | 'initials' | 'placeholder';
  initials: string;
  status: boolean;
}> = ({ size, kind, initials, status }) => (
  <Avatar
    size={size}
    src={kind === 'image' ? photo : undefined}
    initials={kind === 'initials' ? initials : undefined}
    alt="User"
    status={status}
  />
);
Playground.args = { size: 'large', kind: 'initials', initials: 'AB', status: true };
Playground.argTypes = {
  size: { options: SIZES, control: { type: 'radio' } },
  kind: { options: ['image', 'initials', 'placeholder'], control: { type: 'radio' } },
};
