"use client";

import { useEffect, useState } from "react";

/* Current time, refreshed on an interval. Starts as null so server and
   client render the same markup, then fills in after hydration. */
export function useNow(intervalMs: number): number | null {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return now;
}
