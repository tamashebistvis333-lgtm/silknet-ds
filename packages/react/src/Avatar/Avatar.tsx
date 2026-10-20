import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../utils';
import { ProfileIcon } from '../icons';
import './Avatar.css';

export type AvatarSize = 'large' | 'medium' | 'small' | 'xsmall';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** 48 / 32 / 24 / 16 px. */
  size?: AvatarSize;
  /** Photo URL. Wins over `initials`. */
  src?: string;
  /** Alt text for the photo; also used as the accessible name. */
  alt?: string;
  /** 1–2 letters shown when there's no photo. xsmall shows only the first. */
  initials?: string;
  /** Online/status dot at the bottom-right. */
  status?: boolean;
}

// Figma ships the profile glyph at 24/20/16/12 px, all with a 1.5px stroke.
const ICON_SIZE: Record<AvatarSize, number> = { large: 24, medium: 20, small: 16, xsmall: 12 };

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { size = 'large', src, alt, initials, status = false, className, ...rest },
  ref,
) {
  const kind = src ? 'image' : initials ? 'initials' : 'placeholder';
  const iconSize = ICON_SIZE[size];
  const letters = initials ? (size === 'xsmall' ? initials.slice(0, 1) : initials.slice(0, 2)) : '';

  return (
    <span
      ref={ref}
      role={kind === 'image' ? undefined : 'img'}
      aria-label={kind === 'image' ? undefined : alt ?? initials}
      className={cx('silk-avatar', `silk-avatar--${size}`, `silk-avatar--${kind}`, className)}
      {...rest}
    >
      <span className="silk-avatar__circle">
        {kind === 'image' && <img className="silk-avatar__img" src={src} alt={alt ?? ''} />}
        {kind === 'initials' && (
          <span className="silk-avatar__initials" aria-hidden>
            {letters}
          </span>
        )}
        {kind === 'placeholder' && (
          <ProfileIcon
            className="silk-avatar__icon"
            width={iconSize}
            height={iconSize}
            strokeWidth={(1.5 * 24) / iconSize}
          />
        )}
      </span>
      {status && <span className="silk-avatar__status" />}
    </span>
  );
});
