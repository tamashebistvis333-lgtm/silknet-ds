import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';
import './MenuItem.css';

export interface MenuItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 16px leading icon. */
  icon?: ReactNode;
  /** 16px trailing element, e.g. `<ArrowRightIcon />` for a submenu. */
  trailing?: ReactNode;
  /** Error-colored label + icon (e.g. "Delete"). */
  destructive?: boolean;
  children: ReactNode;
}

export const MenuItem = forwardRef<HTMLButtonElement, MenuItemProps>(function MenuItem(
  { icon, trailing, destructive = false, children, className, type = 'button', role = 'menuitem', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      role={role}
      className={cx('silk-menu-item', destructive && 'silk-menu-item--destructive', className)}
      {...rest}
    >
      {icon != null && <span className="silk-menu-item__icon">{icon}</span>}
      <span className="silk-menu-item__label">{children}</span>
      {trailing != null && <span className="silk-menu-item__trailing">{trailing}</span>}
    </button>
  );
});
