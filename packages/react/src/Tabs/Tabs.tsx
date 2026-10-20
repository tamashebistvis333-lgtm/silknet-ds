import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';
import './Tabs.css';

export interface TabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  /** Red 8px notification dot after the label. */
  badge?: boolean;
  children: ReactNode;
}

/** Single segment of a TabBar. Usable standalone, but normally rendered by `TabBar`. */
export const Tab = forwardRef<HTMLButtonElement, TabProps>(function Tab(
  { selected = false, badge = false, children, className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      role="tab"
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
      className={cx('silk-tab', selected && 'silk-tab--selected', className)}
      {...rest}
    >
      <span className="silk-tab__label">{children}</span>
      {badge && <span className="silk-tab__badge" aria-label="new" />}
    </button>
  );
});
