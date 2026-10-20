import {
  forwardRef,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../utils';
import { Tab } from './Tabs';
import './Tabs.css';

export interface TabBarItem {
  value: string;
  label: ReactNode;
  badge?: boolean;
  disabled?: boolean;
}

export interface TabBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** 2–5 segments (Figma ships quantity=2…5). */
  items: TabBarItem[];
  /** Controlled selected value. */
  value?: string;
  /** Uncontrolled initial value. Defaults to the first item. */
  defaultValue?: string;
  onChange?: (value: string) => void;
}

/**
 * Segmented control: equal-width Tabs on a surface track. Arrow keys move selection.
 * The selected-state pill is a single sliding indicator (iOS UISegmentedControl
 * style) so switching tabs glides instead of jumping.
 */
export const TabBar = forwardRef<HTMLDivElement, TabBarProps>(function TabBar(
  { items, value, defaultValue, onChange, className, ...rest },
  ref,
) {
  const [inner, setInner] = useState(defaultValue ?? items[0]?.value);
  const current = value !== undefined ? value : inner;
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (v: string) => {
    if (value === undefined) setInner(v);
    onChange?.(v);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const enabled = items.filter((i) => !i.disabled);
    const idx = enabled.findIndex((i) => i.value === current);
    const next = enabled[(idx + (e.key === 'ArrowRight' ? 1 : -1) + enabled.length) % enabled.length];
    if (!next) return;
    e.preventDefault();
    select(next.value);
    tabRefs.current[items.indexOf(next)]?.focus();
  };

  const selectedIndex = Math.max(0, items.findIndex((i) => i.value === current));
  const indicatorVars = {
    '--silk-tabbar-count': items.length,
    '--silk-tabbar-index': selectedIndex,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      role="tablist"
      className={cx('silk-tabbar', className)}
      onKeyDown={onKeyDown}
      {...rest}
      style={{ ...indicatorVars, ...rest.style }}
    >
      <span className="silk-tabbar__indicator" aria-hidden />
      {items.map((item, i) => (
        <Tab
          key={item.value}
          ref={(el) => {
            tabRefs.current[i] = el;
          }}
          selected={item.value === current}
          badge={item.badge}
          disabled={item.disabled}
          onClick={() => select(item.value)}
        >
          {item.label}
        </Tab>
      ))}
    </div>
  );
});
