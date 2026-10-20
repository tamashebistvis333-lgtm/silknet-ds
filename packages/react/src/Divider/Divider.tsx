import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../utils';
import './Divider.css';

export type DividerAlignment = 'centered' | 'right';

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * `centered` — 8px-tall row, line inset 16px on both sides (menu separator).
   * `right` — 1px line inset 64px on the left, 16px on the right (list rows
   * with a leading icon/avatar).
   */
  alignment?: DividerAlignment;
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(function Divider(
  { alignment = 'centered', className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      role="separator"
      className={cx('silk-divider', `silk-divider--${alignment}`, className)}
      {...rest}
    />
  );
});
