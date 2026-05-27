import { forwardRef, useState, type ButtonHTMLAttributes } from 'react';
import { cx } from '../utils';
import './RadioButton.css';

export interface RadioButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'children' | 'aria-checked'> {
  /** Controlled selected state. Omit for uncontrolled. */
  selected?: boolean;
  /** Initial state when uncontrolled. */
  defaultSelected?: boolean;
  /** Fires with the new state when the user toggles. */
  onChange?: (selected: boolean) => void;
  /** Show error border (semantic — also signals invalid state). */
  error?: boolean;
}

export const RadioButton = forwardRef<HTMLButtonElement, RadioButtonProps>(function RadioButton(
  {
    selected,
    defaultSelected = false,
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
  const isControlled = selected !== undefined;
  const [internal, setInternal] = useState(defaultSelected);
  const value = isControlled ? selected : internal;

  return (
    <button
      ref={ref}
      type="button"
      role="radio"
      aria-checked={value}
      aria-invalid={error || undefined}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      disabled={disabled}
      data-selected={value || undefined}
      data-error={error || undefined}
      className={cx('silk-radio', className)}
      onClick={(e) => {
        if (!isControlled) setInternal(true);
        onChange?.(true);
        onClick?.(e);
      }}
      {...rest}
    >
      <span className="silk-radio__box" aria-hidden />
    </button>
  );
});
