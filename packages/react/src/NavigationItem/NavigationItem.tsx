import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';
import './NavigationItem.css';

export interface NavigationItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 24px icon for the default state. */
  icon: ReactNode;
  /** 24px icon for the selected state (e.g. filled variant). Falls back to `icon`. */
  selectedIcon?: ReactNode;
  selected?: boolean;
  children: ReactNode;
}

/** Bottom-navigation tab: 24px icon over a caption. */
export const NavigationItem = forwardRef<HTMLButtonElement, NavigationItemProps>(function NavigationItem(
  { icon, selectedIcon, selected = false, children, className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-current={selected ? 'page' : undefined}
      className={cx('silk-nav-item', selected && 'silk-nav-item--selected', className)}
      {...rest}
    >
      <span className="silk-nav-item__icon">{selected && selectedIcon != null ? selectedIcon : icon}</span>
      <span className="silk-nav-item__label">{children}</span>
    </button>
  );
});
