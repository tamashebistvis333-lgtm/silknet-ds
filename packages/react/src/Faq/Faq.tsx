import { forwardRef, useId, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';
import { ChevronUpIcon } from '../icons';
import './Faq.css';

export interface FaqProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'onToggle'> {
  /** Question (header). */
  question: ReactNode;
  /** Answer (revealed when open). */
  children: ReactNode;
  /** Controlled open state. */
  open?: boolean;
  /** Uncontrolled initial state. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** Expandable question/answer card. The answer slides open smoothly. */
export const Faq = forwardRef<HTMLDivElement, FaqProps>(function Faq(
  { question, children, open, defaultOpen = false, onOpenChange, className, ...rest },
  ref,
) {
  const [inner, setInner] = useState(defaultOpen);
  const isOpen = open !== undefined ? open : inner;
  const id = useId();

  const toggle = () => {
    if (open === undefined) setInner(!isOpen);
    onOpenChange?.(!isOpen);
  };

  return (
    <div ref={ref} className={cx('silk-faq', isOpen && 'silk-faq--open', className)} {...rest}>
      <button
        type="button"
        className="silk-faq__header"
        aria-expanded={isOpen}
        aria-controls={`${id}-answer`}
        onClick={toggle}
      >
        <span className="silk-faq__question">{question}</span>
        <ChevronUpIcon className="silk-faq__chevron" />
      </button>
      <div className="silk-faq__panel" id={`${id}-answer`} role="region" aria-hidden={!isOpen}>
        <div className="silk-faq__panel-inner">
          <p className="silk-faq__answer">{children}</p>
        </div>
      </div>
    </div>
  );
});
