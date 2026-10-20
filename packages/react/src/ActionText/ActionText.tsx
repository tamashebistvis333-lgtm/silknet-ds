import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';
import './ActionText.css';

export interface ActionTextProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Label (Subtitle 2). */
  label: ReactNode;
  /** Secondary line under the label. */
  description?: ReactNode;
  /** Leading control — typically `<Checkbox />` or `<RadioButton />`. */
  action?: ReactNode;
  /** Trailing control — typically `<Toggle />`. */
  trailing?: ReactNode;
}

/** Figma "action+text": a leading control, label + description, optional trailing control. */
export const ActionText = forwardRef<HTMLDivElement, ActionTextProps>(function ActionText(
  { label, description, action, trailing, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx('silk-action-text', className)} {...rest}>
      {action != null && <div className="silk-action-text__control">{action}</div>}
      <div className="silk-action-text__text">
        <p className="silk-action-text__label">{label}</p>
        {description != null && <p className="silk-action-text__description">{description}</p>}
      </div>
      {trailing != null && <div className="silk-action-text__control">{trailing}</div>}
    </div>
  );
});
