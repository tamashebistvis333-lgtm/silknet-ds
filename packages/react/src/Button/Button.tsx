import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';
import './Button.css';

export type ButtonVariant =
  | 'primary'
  | 'primary-soft'
  | 'secondary'
  | 'ghost'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'silkfest'
  | 'link';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Color/style variant. Defaults to `primary`. */
  variant?: ButtonVariant;
  /** Size. Defaults to `md`. */
  size?: ButtonSize;
  /** Optional icon rendered before the label. */
  leftIcon?: ReactNode;
  /** Optional icon rendered after the label. */
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    leftIcon,
    rightIcon,
    className,
    children,
    type = 'button',
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(
        'silk-button',
        `silk-button--${variant}`,
        `silk-button--${size}`,
        className,
      )}
      {...rest}
    >
      {leftIcon != null && <span className="silk-button__icon">{leftIcon}</span>}
      {children}
      {rightIcon != null && <span className="silk-button__icon">{rightIcon}</span>}
    </button>
  );
});
