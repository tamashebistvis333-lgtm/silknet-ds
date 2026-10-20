import { forwardRef, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../utils';
import './DropdownMenu.css';

export interface DropdownMenuProps extends HTMLAttributes<HTMLDivElement> {
  /** `MenuItem`s, optionally separated by `<Divider alignment="centered" />`. */
  children: ReactNode;
}

/** Floating menu surface. Up/Down/Home/End move focus between items. */
export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(function DropdownMenu(
  { children, className, onKeyDown, ...rest },
  ref,
) {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
    const items = Array.from(
      e.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]:not(:disabled)'),
    );
    if (!items.length) return;
    e.preventDefault();
    const i = items.indexOf(document.activeElement as HTMLElement);
    const next =
      e.key === 'Home' ? 0
      : e.key === 'End' ? items.length - 1
      : e.key === 'ArrowDown' ? (i + 1) % items.length
      : (i - 1 + items.length) % items.length;
    items[next]?.focus();
  };

  return (
    <div ref={ref} role="menu" className={cx('silk-dropdown', className)} onKeyDown={handleKeyDown} {...rest}>
      <div className="silk-dropdown__content">{children}</div>
    </div>
  );
});
