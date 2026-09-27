"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { ROUTES } from "./routes";
import { WEEKDAYS, type TripType } from "./semester";

/* The calculator's choices live in the URL and nowhere else, so a shared
   link reproduces a fare exactly and there is no state to copy back and
   forth. The URL is read as an external store: empty on the server and
   during hydration (so the markup matches), then the real query string. */

export interface FareParams {
  trip: TripType;
  route: string;
  days: number[];
  suspended: number;
}

const TRIPS: TripType[] = ["round", "one-way", "per-day"];
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("popstate", onChange);
  };
}

export function parseFareParams(search: string): FareParams {
  const params = new URLSearchParams(search);
  const trip = params.get("trip") as TripType;
  const route = params.get("route") ?? "";
  const slugs = (params.get("days") ?? "").split(",");
  const days = WEEKDAYS.filter((d) => slugs.includes(d.short.toLowerCase())).map(
    (d) => d.key as number
  );
  const suspended = parseInt(params.get("suspended") ?? "", 10);
  return {
    trip: TRIPS.includes(trip) ? trip : "round",
    route: ROUTES[route] ? route : "",
    days,
    suspended: suspended > 0 ? suspended : 0,
  };
}

function serialize(p: FareParams): string {
  const params = new URLSearchParams();
  if (p.trip !== "round") params.set("trip", p.trip);
  if (p.route) params.set("route", p.route);
  if (p.days.length) {
    params.set(
      "days",
      WEEKDAYS.filter((d) => p.days.includes(d.key))
        .map((d) => d.short.toLowerCase())
        .join(",")
    );
  }
  if (p.suspended > 0) params.set("suspended", String(p.suspended));
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function useFareParams(): [FareParams, (next: Partial<FareParams>) => void] {
  const search = useSyncExternalStore(
    subscribe,
    () => window.location.search,
    () => ""
  );
  const params = useMemo(() => parseFareParams(search), [search]);

  const update = useCallback((next: Partial<FareParams>) => {
    const merged = { ...parseFareParams(window.location.search), ...next };
    const { pathname, hash } = window.location;
    window.history.replaceState(null, "", `${pathname}${serialize(merged)}${hash}`);
    listeners.forEach((listener) => listener());
  }, []);

  return [params, update];
}
