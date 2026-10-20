import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';
import packageBg from '../assets/package-bg.svg';
import silkPoints from '../assets/silk-points.svg';
import './Package.css';

export interface PackageProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Package name, shown as an uppercase overline. */
  title: ReactNode;
  /** Bonus Silk Points chip in the header, e.g. 2500 → "+2500 🪙". */
  points?: ReactNode;
  /** Extra header badges (e.g. `<Badge variant="filled" category="error">Sale</Badge>`). */
  badges?: ReactNode;
  /** Allowances row — `BonusContainer`s. */
  children: ReactNode;
  /** Price (e.g. `<Price amount={129} />`). */
  price: ReactNode;
  /** Right of the price — e.g. `<Badge category="neutral">30 დღე</Badge>`. */
  meta?: ReactNode;
  /** Decorative top-right art. Defaults to the Figma gradient; `null` hides it. */
  background?: ReactNode | null;
}

/** Tariff/package card: name + badges, allowances, price. */
export const Package = forwardRef<HTMLDivElement, PackageProps>(function Package(
  { title, points, badges, children, price, meta, background, className, ...rest },
  ref,
) {
  const bg =
    background !== undefined ? background : <img src={packageBg} alt="" width={296.4} height={298.9} />;
  return (
    <div ref={ref} className={cx('silk-package', className)} {...rest}>
      {bg != null && (
        <div className="silk-package__bg" aria-hidden>
          {bg}
        </div>
      )}
      <div className="silk-package__header">
        <p className="silk-package__title">{title}</p>
        {(points != null || badges != null) && (
          <div className="silk-package__badges">
            {points != null && (
              <span className="silk-package__points">
                +{points}
                <span className="silk-package__coin">
                  <img src={silkPoints} alt="" width={12.8} height={12.8} />
                </span>
              </span>
            )}
            {badges}
          </div>
        )}
      </div>
      <div className="silk-package__bonuses">{children}</div>
      <div className="silk-package__footer">
        <div className="silk-package__price">{price}</div>
        {meta != null && <div className="silk-package__meta">{meta}</div>}
      </div>
    </div>
  );
});
