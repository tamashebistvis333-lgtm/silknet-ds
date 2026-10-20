import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';
import './Tooltip.css';

/**
 * Which edge the pointer sits on (Figma "direction"). `-start` / `-end` pin it
 * 22px from the left / right edge instead of centering it.
 */
export type TooltipPointer = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'right';

export interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  pointer?: TooltipPointer;
  /** Main line (Subtitle 2). */
  children: ReactNode;
  /** Optional secondary line (Body additional). */
  helper?: ReactNode;
}

// Pointer geometry copied from the Figma export (12px-deep rounded triangle in
// a 44×12 / 12×44 box).
const POINTER_PATHS = {
  down: { w: 44, h: 12, d: 'M20.2111 8.42229C20.9482 9.89639 23.0518 9.89639 23.7889 8.42229L28 0H16L20.2111 8.42229Z' },
  up: { w: 44, h: 12, d: 'M20.2111 3.57771C20.9482 2.10361 23.0518 2.10361 23.7889 3.57771L28 12H16L20.2111 3.57771Z' },
  left: { w: 12, h: 44, d: 'M3.57771 20.2111C2.10361 20.9482 2.10361 23.0518 3.57771 23.7889L12 28L12 16L3.57771 20.2111Z' },
  right: { w: 12, h: 44, d: 'M8.42229 23.7889C9.89639 23.0518 9.89639 20.9482 8.42229 20.2111L0 16L0 28L8.42229 23.7889Z' },
} as const;

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(
  { pointer = 'bottom', children, helper, className, ...rest },
  ref,
) {
  const side = pointer.split('-')[0] as 'top' | 'bottom' | 'left' | 'right';
  const shape = POINTER_PATHS[side === 'top' ? 'up' : side === 'bottom' ? 'down' : side];

  return (
    <div ref={ref} role="tooltip" className={cx('silk-tooltip', `silk-tooltip--${pointer}`, className)} {...rest}>
      <div className="silk-tooltip__body">
        <p className="silk-tooltip__text">{children}</p>
        {helper != null && <p className="silk-tooltip__helper">{helper}</p>}
      </div>
      <svg
        className="silk-tooltip__pointer"
        width={shape.w}
        height={shape.h}
        viewBox={`0 0 ${shape.w} ${shape.h}`}
        aria-hidden
        focusable={false}
      >
        <path d={shape.d} fill="currentColor" />
      </svg>
    </div>
  );
});
