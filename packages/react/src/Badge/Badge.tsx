import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';
import { AwardIcon } from '../icons';
import './Badge.css';

export type BadgeCategory = 'primary' | 'success' | 'error' | 'warning' | 'info' | 'neutral' | 'disabled';
/** `soft` / `filled` = labelled pill. `dot` = 12px status dot, `dot-small` = 8px. */
export type BadgeVariant = 'soft' | 'filled' | 'dot' | 'dot-small';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  category?: BadgeCategory;
  variant?: BadgeVariant;
  /** Label (rendered uppercase). Ignored for dot variants. */
  children?: ReactNode;
  /** Leading 12px icon. Defaults to the Figma "award" icon; pass `null` to hide. */
  icon?: ReactNode | null;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { category = 'primary', variant = 'soft', children, icon, className, ...rest },
  ref,
) {
  const isDot = variant === 'dot' || variant === 'dot-small';
  const resolvedIcon = icon !== undefined ? icon : <AwardIcon />;

  return (
    <span
      ref={ref}
      className={cx('silk-badge', `silk-badge--${variant}`, `silk-badge--${category}`, className)}
      {...rest}
    >
      {!isDot && resolvedIcon != null && <span className="silk-badge__icon">{resolvedIcon}</span>}
      {!isDot && children != null && <span className="silk-badge__label">{children}</span>}
    </span>
  );
});
