import { forwardRef, type HTMLAttributes, type ReactNode, type SVGProps } from 'react';
import { cx } from '../utils';
import { CheckCircleIcon, ErrorIcon, WarnIcon, InfoIcon } from '../icons';
import './Feedback.css';

export type FeedbackVariant = 'success' | 'error' | 'warning' | 'info';

export interface FeedbackAction {
  /** Button label. */
  label: ReactNode;
  /** Click handler. */
  onClick?: () => void;
}

export interface FeedbackProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role' | 'title'> {
  /** Semantic state — drives bg, border, title color, and icon. */
  variant?: FeedbackVariant;
  /** Optional title (subtitle-2, state-colored). */
  title?: ReactNode;
  /** Required body text (body-default, --text-default). */
  children: ReactNode;
  /** Primary action — rendered as a filled small button in the variant's accent color. */
  primaryAction?: FeedbackAction;
  /** Secondary action — rendered as a borderless small button. */
  secondaryAction?: FeedbackAction;
  /** Close (×) button — pass a handler to enable. */
  onClose?: () => void;
  /** Override the leading icon. Pass `null` to suppress. */
  icon?: ReactNode | null;
}

const DEFAULT_ICONS: Record<FeedbackVariant, ReactNode> = {
  success: <CheckCircleIcon />,
  error: <ErrorIcon />,
  warning: <WarnIcon />,
  info: <InfoIcon />,
};

const CloseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden focusable={false} {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const Feedback = forwardRef<HTMLDivElement, FeedbackProps>(function Feedback(
  {
    variant = 'success',
    title,
    children,
    primaryAction,
    secondaryAction,
    onClose,
    icon,
    className,
    ...rest
  },
  ref,
) {
  const resolvedIcon = icon !== undefined ? icon : DEFAULT_ICONS[variant];

  return (
    <div
      ref={ref}
      role={variant === 'error' ? 'alert' : 'status'}
      className={cx('silk-feedback', `silk-feedback--${variant}`, className)}
      {...rest}
    >
      {resolvedIcon != null && <span className="silk-feedback__icon">{resolvedIcon}</span>}
      <div className="silk-feedback__content">
        <div className="silk-feedback__title-body">
          {title != null && <p className="silk-feedback__title">{title}</p>}
          <p className="silk-feedback__body">{children}</p>
        </div>
        {(primaryAction || secondaryAction) && (
          <div className="silk-feedback__actions">
            {primaryAction && (
              <button
                type="button"
                className="silk-feedback__action silk-feedback__action--primary"
                onClick={primaryAction.onClick}
              >
                {primaryAction.label}
              </button>
            )}
            {secondaryAction && (
              <button
                type="button"
                className="silk-feedback__action silk-feedback__action--secondary"
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </button>
            )}
          </div>
        )}
      </div>
      {onClose && (
        <button
          type="button"
          className="silk-feedback__close"
          aria-label="Dismiss"
          onClick={onClose}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
});
