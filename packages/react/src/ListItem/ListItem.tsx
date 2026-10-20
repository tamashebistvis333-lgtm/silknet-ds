import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';
import './ListItem.css';

export interface ListItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Main text (Body default). */
  children: ReactNode;
  /** Helper line above the main text. */
  overline?: ReactNode;
  /** Helper line below the main text. */
  description?: ReactNode;
  /** Leading slot — typically a 24px icon or an Avatar. */
  leading?: ReactNode;
  /** Trailing slot — Badge, Toggle, chevron, value… */
  trailing?: ReactNode;
  /** Adds 16px horizontal padding (Figma "Horizontal padding=Yes"). */
  inset?: boolean;
}

export const ListItem = forwardRef<HTMLDivElement, ListItemProps>(function ListItem(
  { children, overline, description, leading, trailing, inset = false, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx('silk-list-item', inset && 'silk-list-item--inset', className)} {...rest}>
      {leading != null && <div className="silk-list-item__slot silk-list-item__leading">{leading}</div>}
      <div className="silk-list-item__text">
        {overline != null && <p className="silk-list-item__helper">{overline}</p>}
        <p className="silk-list-item__body">{children}</p>
        {description != null && <p className="silk-list-item__helper">{description}</p>}
      </div>
      {trailing != null && <div className="silk-list-item__slot">{trailing}</div>}
    </div>
  );
});
