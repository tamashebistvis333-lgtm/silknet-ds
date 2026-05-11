import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';
import type { ButtonSize } from '../Button/Button';
import './IconButton.css';

export type IconButtonVariant = 'primary' | 'primary-soft' | 'secondary' | 'ghost';

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  /** Color/style variant. Defaults to `primary`. */
  variant?: IconButtonVariant;
  /** Size. Defaults to `md`. */
  size?: ButtonSize;
  /** Required: accessible label for the button (icon-only buttons need it). */
  'aria-label': string;
  /** The icon to render — typically an inline <svg>. */
  children: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { variant = 'primary', size = 'md', className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(
        'silk-button',
        'silk-icon-button',
        `silk-button--${variant}`,
        `silk-button--${size}`,
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
});
