"use client";

import {
  useEffect,
  useRef,
  type MouseEvent as ReactMouseEvent,
  type RefObject,
} from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

function isVisible(el: HTMLElement) {
  return (
    el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0
  );
}

/**
 * Shared behaviour for the project / certification / command dialogs:
 * Escape to close, focus trapped inside while open, focus returned to the
 * trigger on close, and the page behind locked without a horizontal jump.
 */
export function useDialog({
  open,
  onClose,
  containerRef,
}: {
  open: boolean;
  onClose: () => void;
  containerRef: RefObject<HTMLElement | null>;
}) {
  // Keep the latest callback without re-running the effects each render.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    // Reserve the width the scrollbar occupied so locking scroll doesn't
    // shift the layout sideways.
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.setProperty("--scrollbar-gap", `${gap}px`);
    document.body.dataset.scrollLocked = "true";

    return () => {
      delete document.body.dataset.scrollLocked;
      document.body.style.removeProperty("--scrollbar-gap");
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const frame = window.requestAnimationFrame(() => {
      const el = containerRef.current;
      if (!el || el.contains(document.activeElement)) return;
      const first = Array.from(
        el.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).find(isVisible);
      first?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") return;

      const el = containerRef.current;
      if (!el) return;

      const focusable = Array.from(
        el.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter(isVisible);
      if (focusable.length === 0) return;

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      const current = document.activeElement as HTMLElement | null;
      const inside = current ? el.contains(current) : false;

      if (event.shiftKey) {
        if (!inside || current === first) {
          event.preventDefault();
          last.focus();
        }
      } else if (!inside || current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [open, containerRef]);
}

/**
 * Closes only when the press starts *and* ends on the backdrop itself, so a
 * text selection that drags out of the dialog doesn't dismiss it.
 */
export function useBackdropDismiss(onClose: () => void) {
  const pressedBackdrop = useRef(false);

  return {
    onMouseDown: (event: ReactMouseEvent) => {
      pressedBackdrop.current = event.target === event.currentTarget;
    },
    onClick: (event: ReactMouseEvent) => {
      if (event.target === event.currentTarget && pressedBackdrop.current) {
        onClose();
      }
      pressedBackdrop.current = false;
    },
  };
}
