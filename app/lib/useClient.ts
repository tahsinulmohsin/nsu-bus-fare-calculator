"use client";

import { useSyncExternalStore } from "react";

const noSubscription = () => () => {};

/* True once the component is running in the browser, false on the server
   and during hydration. Replaces the useEffect(setMounted) pattern. */
export function useIsClient(): boolean {
  return useSyncExternalStore(noSubscription, () => true, () => false);
}

/* Whether the visitor has asked for reduced motion, kept live. False on
   the server. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}
