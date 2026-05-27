import { forwardRef, useState, type ButtonHTMLAttributes } from 'react';
import { cx } from '../utils';
import './Toggle.css';

export interface ToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'children' | 'aria-checked'> {
  /** Controlled checked state. Omit for uncontrolled. */
  checked?: boolean;
  /** Initial state when uncontrolled. */
  defaultChecked?: boolean;
  /** Fires with the new state when the user toggles. */
  onChange?: (checked: boolean) => void;
  /** Show error border (semantic — also signals invalid state). */
  error?: boolean;
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  {
    checked,
    defaultChecked = false,
    onChange,
    error,
    disabled,
    className,
    onClick,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    ...rest
  },
  ref,
) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = useState(defaultChecked);
  const value = isControlled ? checked : internal;

  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={value}
      aria-invalid={error || undefined}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      disabled={disabled}
      className={cx('silk-toggle', { 'silk-toggle--error': error }, className)}
      onClick={(e) => {
        if (!isControlled) setInternal((v) => !v);
        onChange?.(!value);
        onClick?.(e);
      }}
      {...rest}
    >
      <span className="silk-toggle__handle" aria-hidden />
    </button>
  );
});
