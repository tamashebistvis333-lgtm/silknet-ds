import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';
import { GlobalIcon } from '../icons';
import './BonusContainer.css';

export interface BonusContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Unit/caption next to the icon, e.g. "მბ", "წთ". */
  label: ReactNode;
  /** Main value, e.g. "100". */
  amount: ReactNode;
  /** Optional caption after the amount, e.g. "+15 საერთაშორისო". */
  additional?: ReactNode;
  /** 16px leading icon. Defaults to the Figma "global" icon; `null` hides it. */
  icon?: ReactNode | null;
}

/** Package allowance tile: icon + unit caption over the amount. */
export const BonusContainer = forwardRef<HTMLDivElement, BonusContainerProps>(function BonusContainer(
  { label, amount, additional, icon, className, ...rest },
  ref,
) {
  const resolvedIcon = icon !== undefined ? icon : <GlobalIcon />;
  return (
    <div ref={ref} className={cx('silk-bonus', className)} {...rest}>
      <div className="silk-bonus__head">
        {resolvedIcon != null && <span className="silk-bonus__icon">{resolvedIcon}</span>}
        <span className="silk-bonus__caption">{label}</span>
      </div>
      <div className="silk-bonus__amount">
        <span className="silk-bonus__value">{amount}</span>
        {additional != null && <span className="silk-bonus__caption">{additional}</span>}
      </div>
    </div>
  );
});
