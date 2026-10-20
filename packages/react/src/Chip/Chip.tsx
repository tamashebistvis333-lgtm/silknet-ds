import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';
import { CloseIcon } from '../icons';
import './Chip.css';

export type ChipSize = 'small' | 'medium';

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ChipSize;
  /** Selected chips get the primary tint and a trailing icon. */
  selected?: boolean;
  /** Trailing icon shown when selected. Defaults to close (×); `null` hides it. */
  icon?: ReactNode | null;
  children: ReactNode;
}

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { size = 'small', selected = false, icon, children, className, type = 'button', ...rest },
  ref,
) {
  const resolvedIcon = icon !== undefined ? icon : <CloseIcon size={size === 'small' ? 12 : 16} />;

  return (
    <button
      ref={ref}
      type={type}
      aria-pressed={selected}
      className={cx('silk-chip', `silk-chip--${size}`, selected && 'silk-chip--selected', className)}
      {...rest}
    >
      <span className="silk-chip__label">{children}</span>
      {selected && resolvedIcon != null && <span className="silk-chip__icon">{resolvedIcon}</span>}
    </button>
  );
});
