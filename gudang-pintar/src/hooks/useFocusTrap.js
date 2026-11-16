import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Menjaga fokus keyboard tetap di dalam elemen saat elemen itu aktif.
 * Pemanggil menentukan elemen tujuan awal dan tindakan untuk tombol Escape.
 */
export default function useFocusTrap({
  active,
  containerRef,
  initialFocusRef,
  onEscape,
}) {
  const onEscapeRef = useRef(onEscape);

  useEffect(() => {
    onEscapeRef.current = onEscape;
  }, [onEscape]);

  useEffect(() => {
    if (!active) return undefined;

    const container = containerRef.current;
    if (!container) return undefined;

    const previousFocus = document.activeElement;
    const firstFocusable = container.querySelector(FOCUSABLE_SELECTOR);
    (initialFocusRef?.current || firstFocusable || container).focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onEscapeRef.current?.(event);
        return;
      }

      if (event.key !== "Tab") return;
      const focusableElements = container.querySelectorAll(FOCUSABLE_SELECTOR);
      if (!focusableElements.length) {
        event.preventDefault();
        container.focus();
        return;
      }

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      if (!container.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
      }
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus();
      }
    };
  }, [active, containerRef, initialFocusRef]);
}
