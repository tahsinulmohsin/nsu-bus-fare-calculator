"use client";

import { useCallback, useSyncExternalStore } from "react";

/* The current time as an external store, quantised to `intervalMs`, so
   every read inside one interval returns the same value and React only
   re-renders when the interval rolls over. It is null on the server and
   during hydration, so server and client markup always agree; callers
   that need a value for that first render fall back to the time the page
   was rendered on the server. */
export function useNow(intervalMs: number): number | null {
  const subscribe = useCallback(
    (onChange: () => void) => {
      // Poll a little faster than the interval so each rollover is seen
      // promptly rather than up to a whole interval late.
      const id = window.setInterval(onChange, Math.min(intervalMs, 250));
      return () => window.clearInterval(id);
    },
    [intervalMs]
  );

  return useSyncExternalStore(
    subscribe,
    () => Math.floor(Date.now() / intervalMs) * intervalMs,
    () => null
  );
}
