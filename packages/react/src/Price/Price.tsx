import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';
import silkPoints from '../assets/silk-points.svg';
import './Price.css';

/**
 * `gel` — GEL price is primary; optional strikethrough old price before it and
 * optional Silk Points alternative after it.
 * `points` — Silk Points are primary; GEL price shown as the secondary value.
 */
export type PriceVariant = 'gel' | 'points';

export interface PriceProps extends HTMLAttributes<HTMLDivElement> {
  variant?: PriceVariant;
  /** GEL amount; rendered with the ₾ sign. */
  amount: ReactNode;
  /** Old GEL amount (strikethrough). `gel` variant only. */
  oldAmount?: ReactNode;
  /** Silk Points amount. Required for `points`, optional for `gel`. */
  points?: ReactNode;
}

const Coin = () => (
  <span className="silk-price__coin" aria-hidden>
    <img src={silkPoints} alt="" width={12.8} height={12.8} />
  </span>
);

export const Price = forwardRef<HTMLDivElement, PriceProps>(function Price(
  { variant = 'gel', amount, oldAmount, points, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx('silk-price', `silk-price--${variant}`, className)} {...rest}>
      {variant === 'gel' ? (
        <>
          {oldAmount != null && <s className="silk-price__old">{oldAmount} ₾</s>}
          <span className="silk-price__main">{amount} ₾</span>
          {points != null && (
            <span className="silk-price__points silk-price__points--secondary">
              <span>{points}</span>
              <Coin />
              <span className="silk-price__sr">Silk Points</span>
            </span>
          )}
        </>
      ) : (
        <>
          <span className="silk-price__points silk-price__points--primary">
            <span>{points}</span>
            <Coin />
            <span className="silk-price__sr">Silk Points</span>
          </span>
          <span className="silk-price__secondary">{amount} ₾</span>
        </>
      )}
    </div>
  );
});
