import { useEffect } from "react";

export const useClickOutside = (
  ref: React.RefObject<HTMLElement | null>,
  callback: (event: MouseEvent | PointerEvent) => void
) => {
  useEffect(() => {
    const isInsideRadixPortal = (el: Element | null) =>
      !!el && !!(el as HTMLElement).closest("[data-radix-portal]");

    const isSelectPopup = (el: Element | null) => {
      const node = el as HTMLElement | null;
      if (!node) return false;
      const role = node.getAttribute("role");
      if (role === "listbox" || role === "menu") return true;
      const popup = node.closest('[role="listbox"], [role="menu"]');
      return !!popup;
    };

    const handler = (e: MouseEvent | PointerEvent) => {
      const target = e.target as HTMLElement | null;

      if (target && (isInsideRadixPortal(target) || isSelectPopup(target))) {
        return;
      }

      const root = ref.current;
      if (root && target && !root.contains(target)) {
        callback(e);
      }
    };

    document.addEventListener("pointerdown", handler, true);
    document.addEventListener("mousedown", handler, true);
    return () => {
      document.removeEventListener("pointerdown", handler, true);
      document.removeEventListener("mousedown", handler, true);
    };
  }, [ref, callback]);
};
