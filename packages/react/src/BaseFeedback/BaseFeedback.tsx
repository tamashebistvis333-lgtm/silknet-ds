import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';
import './BaseFeedback.css';

export type BaseFeedbackState = 'success' | 'error' | 'warning';

export interface BaseFeedbackProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /** Semantic state — drives the badge colors and shape. */
  state?: BaseFeedbackState;
  /** Heading. Pass null to suppress. */
  title?: ReactNode;
  /** Body / description paragraph. Pass null to suppress. */
  description?: ReactNode;
  /** Override the entire badge icon. Useful when none of the default shapes fit. */
  icon?: ReactNode;
}

// Filled 56x56 badge SVGs — reproduce the Figma assets pixel-perfect.
// Each renders a solid colored shape in the variant's accent color, with
// a white inner glyph (checkmark / exclamation).
function SuccessIcon() {
  return (
    <svg viewBox="0 0 56 56" fill="none" aria-hidden focusable={false}>
      <rect width="56" height="56" rx="28" fill="var(--background-success-accent)" />
      <path
        d="M18 27.169l6.963 7.97a1 1 0 0 0 1.504 0L38 22"
        stroke="var(--text-contrast)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 56 56" fill="none" aria-hidden focusable={false}>
      <path
        d="M28.002 50.976H13.456c-8.33 0-11.81-5.927-7.777-13.17l7.489-13.432 7.057-12.62c4.273-7.672 11.282-7.672 15.554 0l7.057 12.644 7.489 13.432c4.033 7.243.528 13.17-7.777 13.17H28.002Z"
        fill="var(--background-warning-accent)"
      />
      <path d="M28 21v12" stroke="var(--text-contrast)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M28 41h.001" stroke="var(--text-contrast)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg viewBox="0 0 56 56" fill="none" aria-hidden focusable={false}>
      <circle cx="28" cy="28" r="28" fill="var(--background-error-accent)" />
      <path d="M28 20v12" stroke="var(--text-contrast)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M28 40h.001" stroke="var(--text-contrast)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const DEFAULT_ICONS: Record<BaseFeedbackState, ReactNode> = {
  success: <SuccessIcon />,
  error: <ErrorIcon />,
  warning: <WarningIcon />,
};

export const BaseFeedback = forwardRef<HTMLDivElement, BaseFeedbackProps>(function BaseFeedback(
  { state = 'success', title, description, icon, className, ...rest },
  ref,
) {
  const badge = icon ?? DEFAULT_ICONS[state];
  return (
    <div
      ref={ref}
      role={state === 'error' ? 'alert' : 'status'}
      className={cx('silk-base-feedback', `silk-base-feedback--${state}`, className)}
      {...rest}
    >
      <div className="silk-base-feedback__badge">{badge}</div>
      {(title != null || description != null) && (
        <div className="silk-base-feedback__container">
          {title != null && <p className="silk-base-feedback__title">{title}</p>}
          {description != null && (
            <p className="silk-base-feedback__description">{description}</p>
          )}
        </div>
      )}
    </div>
  );
});
