import { forwardRef, useState, type ButtonHTMLAttributes } from 'react';
import { cx } from '../utils';
import './Checkbox.css';

export interface CheckboxProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'children' | 'aria-checked'> {
  /** Controlled checked state. Omit for uncontrolled. */
  checked?: boolean;
  /** Initial state when uncontrolled. */
  defaultChecked?: boolean;
  /** Visual "mixed" state. Independent of `checked`; overrides the check indicator with a dash. */
  indeterminate?: boolean;
  /** Fires with the new state when the user toggles. */
  onChange?: (checked: boolean) => void;
  /** Show error border (semantic — also signals invalid state). */
  error?: boolean;
}

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(
  {
    checked,
    defaultChecked = false,
    indeterminate = false,
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
  const ariaChecked: boolean | 'mixed' = indeterminate ? 'mixed' : value;

  return (
    <button
      ref={ref}
      type="button"
      role="checkbox"
      aria-checked={ariaChecked}
      aria-invalid={error || undefined}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      disabled={disabled}
      data-checked={value || undefined}
      data-indeterminate={indeterminate || undefined}
      data-error={error || undefined}
      className={cx('silk-checkbox', className)}
      onClick={(e) => {
        if (!isControlled) setInternal((v) => !v);
        onChange?.(!value);
        onClick?.(e);
      }}
      {...rest}
    >
      <span className="silk-checkbox__box">
        {indeterminate ? (
          <span className="silk-checkbox__dash" aria-hidden />
        ) : value ? (
          <svg
            className="silk-checkbox__check"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : null}
      </span>
    </button>
  );
});
