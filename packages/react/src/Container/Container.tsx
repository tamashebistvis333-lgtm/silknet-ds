import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';
import './Container.css';

export interface ContainerProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Section title (Heading 4). */
  title?: ReactNode;
  /** Line under the title. */
  subtitle?: ReactNode;
  /** Right-aligned header action — typically `<Button variant="link">`. */
  action?: ReactNode;
  /** Section content (Figma "Content" slot). */
  children?: ReactNode;
}

/** Figma "Container": titled content section. Header is omitted when there's no title/subtitle/action. */
export const Container = forwardRef<HTMLElement, ContainerProps>(function Container(
  { title, subtitle, action, children, className, ...rest },
  ref,
) {
  const hasHeader = title != null || subtitle != null || action != null;
  return (
    <section ref={ref} className={cx('silk-container', className)} {...rest}>
      {hasHeader && (
        <div className="silk-container__header">
          <div className="silk-container__heading">
            {title != null && <h2 className="silk-container__title">{title}</h2>}
            {subtitle != null && <p className="silk-container__subtitle">{subtitle}</p>}
          </div>
          {action != null && <div className="silk-container__action">{action}</div>}
        </div>
      )}
      {children != null && <div className="silk-container__content">{children}</div>}
    </section>
  );
});
