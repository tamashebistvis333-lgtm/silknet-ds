import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../utils';
import { HelperText } from '../HelperText/HelperText';
import './Input.css';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'placeholder'> {
  /** Floating label shown inside the field. Required for accessibility. */
  label: string;
  /** Optional helper text shown below the field. */
  helperText?: ReactNode;
  /** When true, applies the error style. If a string is passed it overrides helperText. */
  error?: boolean | string;
  /** Optional icon shown to the left of the label/value. */
  leftIcon?: ReactNode;
  /** Optional icon shown to the right of the label/value. */
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    helperText,
    error,
    leftIcon,
    rightIcon,
    className,
    id,
    disabled,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const isError = Boolean(error);
  const helperContent = typeof error === 'string' ? error : helperText;

  return (
    <div className={cx('silk-input-group', className)}>
      <label
        htmlFor={inputId}
        className={cx('silk-input', { 'silk-input--error': isError })}
      >
        {leftIcon != null && <span className="silk-input__icon">{leftIcon}</span>}
        <span className="silk-input__inner">
          <span className="silk-input__label">{label}</span>
          <input
            ref={ref}
            id={inputId}
            type="text"
            className="silk-input__field"
            // Single space placeholder lets CSS :placeholder-shown drive the
            // floating-label transition without any JS state.
            placeholder=" "
            disabled={disabled}
            aria-invalid={isError || undefined}
            {...rest}
          />
        </span>
        {rightIcon != null && <span className="silk-input__icon">{rightIcon}</span>}
      </label>
      {helperContent != null && (
        <HelperText state={isError ? 'error' : 'default'}>{helperContent}</HelperText>
      )}
    </div>
  );
});
