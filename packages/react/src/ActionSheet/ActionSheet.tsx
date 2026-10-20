import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../utils';
import { CloseIcon } from '../icons';
import { usePresence, useOverlayBehavior } from '../usePresence';
import './ActionSheet.css';

export interface ActionSheetProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  open: boolean;
  /** Called on close button, overlay tap, Escape, or drag-down dismiss. */
  onClose: () => void;
  /** Heading 4 title (up to two lines in Figma). */
  title?: ReactNode;
  /** Helper text under the title. */
  subtitle?: ReactNode;
  /** Sheet content (Figma "Container › Content" slot). */
  children?: ReactNode;
  /** Accessible label of the × button. */
  closeLabel?: string;
}

const EXIT_MS = 400;

/**
 * Bottom sheet (Figma "Actionsheet"). Slides up with the iOS sheet curve and
 * can be dragged down by its header to dismiss.
 */
export const ActionSheet = forwardRef<HTMLDivElement, ActionSheetProps>(function ActionSheet(
  { open, onClose, title, subtitle, children, closeLabel = 'Close', className, ...rest },
  ref,
) {
  const { mounted, visible } = usePresence(open, EXIT_MS);
  useOverlayBehavior(mounted, onClose);
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ startY: number; startT: number; dy: number } | null>(null);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (visible) panelRef.current?.focus();
  }, [visible]);

  if (!mounted || typeof document === 'undefined') return null;

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button, a, input, textarea, select')) return;
    drag.current = { startY: e.clientY, startT: e.timeStamp, dy: 0 };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const raw = e.clientY - drag.current.startY;
    // Pulling up past the resting point resists, like iOS.
    const dy = raw < 0 ? raw * 0.15 : raw;
    drag.current.dy = dy;
    setDragY(dy);
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const { dy, startT } = drag.current;
    const velocity = dy / Math.max(1, e.timeStamp - startT); // px/ms
    const height = panelRef.current?.offsetHeight ?? 300;
    drag.current = null;
    setDragging(false);
    setDragY(0);
    if (dy > height * 0.3 || velocity > 0.6) onClose();
  };

  const hasHeading = title != null || subtitle != null;

  return createPortal(
    <div
      className={cx('silk-sheet', visible && 'silk-sheet--visible', dragging && 'silk-sheet--dragging')}
      style={{ ['--silk-sheet-drag' as string]: `${dragY}px` }}
    >
      <div className="silk-sheet__overlay" onClick={onClose} aria-hidden />
      <div
        ref={(el) => {
          panelRef.current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) ref.current = el;
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title != null ? titleId : undefined}
        tabIndex={-1}
        className={cx('silk-sheet__panel', className)}
        {...rest}
      >
        <div
          className="silk-sheet__header"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="silk-sheet__handle" aria-hidden />
          <div className="silk-sheet__heading">
            <div className="silk-sheet__title-row">
              {title != null && (
                <h2 id={titleId} className="silk-sheet__title">
                  {title}
                </h2>
              )}
              <button type="button" className="silk-sheet__close" aria-label={closeLabel} onClick={onClose}>
                <CloseIcon size={20} />
              </button>
            </div>
            {hasHeading && subtitle != null && <p className="silk-sheet__subtitle">{subtitle}</p>}
          </div>
        </div>
        {children != null && <div className="silk-sheet__content">{children}</div>}
      </div>
    </div>,
    document.body,
  );
});
