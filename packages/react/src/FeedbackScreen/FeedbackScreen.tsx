import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../utils';
import { BaseFeedback, type BaseFeedbackState } from '../BaseFeedback/BaseFeedback';
import { Button } from '../Button/Button';
import { ActionSheet } from '../ActionSheet/ActionSheet';
import { CloseIcon } from '../icons';
import { usePresence, useOverlayBehavior } from '../usePresence';
import type { FeedbackAction } from '../Feedback/Feedback';
import './FeedbackScreen.css';

export type FeedbackScreenVariant = 'dialog' | 'fullscreen';

export interface FeedbackScreenProps {
  open: boolean;
  onClose: () => void;
  /** `dialog` = bottom sheet over the page; `fullscreen` = full page. */
  variant?: FeedbackScreenVariant;
  state?: BaseFeedbackState;
  title?: ReactNode;
  description?: ReactNode;
  /** Filled primary button. */
  primaryAction?: FeedbackAction;
  /** Second button — ghost in `dialog`, primary-soft in `fullscreen` (per Figma). */
  secondaryAction?: FeedbackAction;
  closeLabel?: string;
  className?: string;
}

const EXIT_MS = 400;

/** Result screen (Figma "Feedback-screen") built on BaseFeedback. */
export function FeedbackScreen({
  open,
  onClose,
  variant = 'dialog',
  state = 'success',
  title,
  description,
  primaryAction,
  secondaryAction,
  closeLabel = 'Close',
  className,
}: FeedbackScreenProps) {
  const body = (
    <>
      <BaseFeedback state={state} title={title} description={description} />
      {(primaryAction || secondaryAction) && (
        <div className="silk-feedback-screen__buttons">
          {primaryAction && (
            <Button variant="primary" size="lg" onClick={primaryAction.onClick}>
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant={variant === 'fullscreen' ? 'primary-soft' : 'ghost'}
              size="lg"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </>
  );

  if (variant === 'dialog') {
    return (
      <ActionSheet open={open} onClose={onClose} closeLabel={closeLabel} className={cx('silk-feedback-screen--dialog', className)}>
        {body}
      </ActionSheet>
    );
  }
  return (
    <FullscreenFeedback open={open} onClose={onClose} closeLabel={closeLabel} className={className}>
      {body}
    </FullscreenFeedback>
  );
}

function FullscreenFeedback({
  open,
  onClose,
  closeLabel,
  className,
  children,
}: {
  open: boolean;
  onClose: () => void;
  closeLabel: string;
  className?: string;
  children: ReactNode;
}) {
  const { mounted, visible } = usePresence(open, EXIT_MS);
  useOverlayBehavior(mounted, onClose);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible) pageRef.current?.focus();
  }, [visible]);

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <div
      ref={pageRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      className={cx('silk-feedback-screen--fullscreen', visible && 'silk-feedback-screen--visible', className)}
    >
      <button type="button" className="silk-feedback-screen__close" aria-label={closeLabel} onClick={onClose}>
        <CloseIcon size={20} />
      </button>
      {children}
    </div>,
    document.body,
  );
}
