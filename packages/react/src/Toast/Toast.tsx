import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';
import { CheckCircleIcon, ErrorIcon, WarnIcon, InfoIcon } from '../icons';
import './Toast.css';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'> {
  /** Semantic state — drives bg, border, text, and icon. */
  variant?: ToastVariant;
  /** Message text. */
  children: ReactNode;
  /** Optional inline action button (e.g. "Undo"). */
  action?: ReactNode;
  /** Called when the action button is clicked. Use with `action`. */
  onAction?: () => void;
  /** Override the auto-rendered icon. Pass `null` to suppress. */
  icon?: ReactNode | null;
}

const DEFAULT_ICONS: Record<ToastVariant, ReactNode> = {
  success: <CheckCircleIcon />,
  error: <ErrorIcon />,
  warning: <WarnIcon />,
  info: <InfoIcon />,
};

export const Toast = forwardRef<HTMLDivElement, ToastProps>(function Toast(
  { variant = 'success', children, action, onAction, icon, className, ...rest },
  ref,
) {
  const resolvedIcon = icon !== undefined ? icon : DEFAULT_ICONS[variant];

  return (
    <div
      ref={ref}
      role="status"
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
      className={cx('silk-toast', `silk-toast--${variant}`, className)}
      {...rest}
    >
      {resolvedIcon != null && <span className="silk-toast__icon">{resolvedIcon}</span>}
      <p className="silk-toast__message">{children}</p>
      {action != null && (
        <button type="button" className="silk-toast__action" onClick={onAction}>
          {action}
        </button>
      )}
    </div>
  );
});
