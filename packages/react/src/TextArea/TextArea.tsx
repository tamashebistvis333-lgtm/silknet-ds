import {
  forwardRef,
  useId,
  type TextareaHTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../utils';
import { HelperText } from '../HelperText/HelperText';
import './TextArea.css';

export interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'placeholder'> {
  label: string;
  helperText?: ReactNode;
  /** When true, applies the error style. If a string is passed it overrides helperText. */
  error?: boolean | string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, helperText, error, className, id, disabled, ...rest },
  ref,
) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const isError = Boolean(error);
  const helperContent = typeof error === 'string' ? error : helperText;

  return (
    <div className={cx('silk-input-group', className)}>
      <label
        htmlFor={textareaId}
        className={cx('silk-textarea', { 'silk-textarea--error': isError })}
      >
        <span className="silk-textarea__inner">
          <span className="silk-textarea__label">{label}</span>
          <textarea
            ref={ref}
            id={textareaId}
            className="silk-textarea__field"
            placeholder=" "
            disabled={disabled}
            aria-invalid={isError || undefined}
            {...rest}
          />
        </span>
      </label>
      {helperContent != null && (
        <HelperText state={isError ? 'error' : 'default'}>{helperContent}</HelperText>
      )}
    </div>
  );
});
