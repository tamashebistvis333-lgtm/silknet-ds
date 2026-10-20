import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';
import { IconButton } from '../IconButton/IconButton';
import { ArrowLeftIcon, SearchIcon } from '../icons';
import './NavigationHeader.css';

export interface NavigationHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Centered title (default variant). */
  title?: ReactNode;
  /** Shows the back arrow and calls this on press. */
  onBack?: () => void;
  /** Accessible label for the back button. */
  backLabel?: string;
  /** Right slot, up to two 32px icon buttons (`<IconButton variant="ghost" size="sm">`). */
  actions?: ReactNode;
  /**
   * Search variant: replaces title + actions with a search field. Pass a
   * click handler to open your search screen.
   */
  onSearch?: () => void;
  /** Placeholder shown in the search field. */
  searchPlaceholder?: ReactNode;
}

export const NavigationHeader = forwardRef<HTMLElement, NavigationHeaderProps>(function NavigationHeader(
  { title, onBack, backLabel = 'Back', actions, onSearch, searchPlaceholder = 'ძებნა', className, ...rest },
  ref,
) {
  const isSearch = onSearch != null;
  return (
    <header
      ref={ref}
      className={cx('silk-nav-header', isSearch && 'silk-nav-header--search', className)}
      {...rest}
    >
      <div className="silk-nav-header__side">
        {onBack && (
          <IconButton variant="ghost" size="sm" aria-label={backLabel} onClick={onBack}>
            <ArrowLeftIcon />
          </IconButton>
        )}
      </div>
      {isSearch ? (
        <button type="button" className="silk-nav-header__search" onClick={onSearch}>
          <SearchIcon />
          <span>{searchPlaceholder}</span>
        </button>
      ) : (
        <>
          <h1 className="silk-nav-header__title">{title}</h1>
          <div className="silk-nav-header__side silk-nav-header__side--end">{actions}</div>
        </>
      )}
    </header>
  );
});
