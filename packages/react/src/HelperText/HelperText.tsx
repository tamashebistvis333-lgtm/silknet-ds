import { type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';
import { CheckIcon, InfoIcon, WarnIcon, ErrorIcon } from '../icons';
import './HelperText.css';

export type HelperTextState = 'default' | 'success' | 'info' | 'warning' | 'error';

export interface HelperTextProps extends HTMLAttributes<HTMLParagraphElement> {
  /** Semantic state. Defaults to `default` (no icon). */
  state?: HelperTextState;
  /** Override the auto-rendered icon. Pass `null` to suppress for a non-default state. */
  icon?: ReactNode | null;
}

const DEFAULT_ICONS: Record<Exclude<HelperTextState, 'default'>, ReactNode> = {
  success: <CheckIcon />,
  info: <InfoIcon />,
  warning: <WarnIcon />,
  error: <ErrorIcon />,
};

export function HelperText({
  state = 'default',
  icon,
  className,
  children,
  ...rest
}: HelperTextProps) {
  // For non-default states: use the provided icon if any, else the default
  // for that state. Pass `icon={null}` to explicitly suppress.
  const resolvedIcon =
    state === 'default'
      ? null
      : icon !== undefined
        ? icon
        : DEFAULT_ICONS[state];

  return (
    <p className={cx('silk-helper', `silk-helper--${state}`, className)} {...rest}>
      {resolvedIcon != null && <span className="silk-helper__icon">{resolvedIcon}</span>}
      <span>{children}</span>
    </p>
  );
}
