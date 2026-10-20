import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cx } from '../utils';
import gMark from '../assets/google-g-mark.svg';
import gPayWhite from '../assets/google-pay-typeface-white.svg';
import gPayGrey from '../assets/google-pay-typeface-grey.svg';
import './WalletButton.css';

export type WalletProvider = 'apple-pay' | 'google-pay';
/**
 * `auto` follows the app theme (black button in light mode, white in dark),
 * matching Figma's "light theme" / "dark theme" pairs. `black` / `white` force one.
 */
export type WalletButtonAppearance = 'auto' | 'black' | 'white';

export interface WalletButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  provider: WalletProvider;
  appearance?: WalletButtonAppearance;
  /** Leading copy. Figma: "Pay with". */
  label?: string;
}

export const WalletButton = forwardRef<HTMLButtonElement, WalletButtonProps>(function WalletButton(
  { provider, appearance = 'auto', label = 'Pay with', className, type = 'button', ...rest },
  ref,
) {
  const name = provider === 'apple-pay' ? 'Apple Pay' : 'Google Pay';
  return (
    <button
      ref={ref}
      type={type}
      aria-label={`${label} ${name}`}
      className={cx('silk-wallet', `silk-wallet--${provider}`, `silk-wallet--${appearance}`, className)}
      {...rest}
    >
      <span className="silk-wallet__label" aria-hidden>
        {label}
      </span>
      {provider === 'apple-pay' ? (
        // U+F8FF is the Apple logo in Apple system fonts — Apple Pay only
        // renders on Apple platforms, where this glyph is always available.
        <span className="silk-wallet__apple-mark" aria-hidden>
          {''}Pay
        </span>
      ) : (
        <span className="silk-wallet__gpay" aria-hidden>
          <img className="silk-wallet__g" src={gMark} alt="" width={19.75} height={20.034} />
          <img className="silk-wallet__pay silk-wallet__pay--white" src={gPayWhite} alt="" width={35.1} height={22.725} />
          <img className="silk-wallet__pay silk-wallet__pay--grey" src={gPayGrey} alt="" width={35.1} height={22.725} />
        </span>
      )}
    </button>
  );
});
