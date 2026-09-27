"use client";

import { ArrowRight, Bus, Clock, Info, MapPin } from "lucide-react";
import {
  ARRIVALS,
  DEPARTURE_NOTES,
  ROUTES,
  ROUTE_LIST,
} from "../lib/routes";
import { TRIP_LABELS } from "../lib/semester";
import { Reveal } from "./Reveal";

/* Stoppages, campus arrivals and campus departures for one route.

   Each stoppage carries a single indicative morning pickup time, so the
   same list works at every width without a table that scrolls sideways. */
export function RouteSchedule({
  selectedRoute,
  onSelectRoute,
}: {
  selectedRoute: string;
  onSelectRoute: (route: string) => void;
}) {
  const routeData = selectedRoute ? ROUTES[selectedRoute] : null;
  const routeInfo = ROUTE_LIST.find((r) => r.key === selectedRoute);
  const departureNote = DEPARTURE_NOTES[selectedRoute];

  return (
    <section
      id="routes"
      aria-labelledby="routes-title"
      className="scroll-mt-4 border-t border-line py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2
            id="routes-title"
            className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
          >
            Routes and timings
          </h2>
          <p className="mt-3 max-w-[60ch] leading-relaxed text-ink-body">
            Six routes across Dhaka. Every route reaches campus at the same
            three times, but the evening trips back differ by route.
          </p>
        </Reveal>

        <Reveal delay={60}>
          <div
            className="mt-8 flex flex-wrap gap-2"
            role="group"
            aria-label="Bus route"
          >
            {ROUTE_LIST.map((route) => {
              const active = route.key === selectedRoute;
              return (
                <button
                  key={route.key}
                  type="button"
                  onClick={() => onSelectRoute(active ? "" : route.key)}
                  aria-pressed={active}
                  className={`pressable flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${
                    active
                      ? "border-accent bg-accent text-on-accent"
                      : "border-line-control bg-surface text-ink-strong hover:border-line-hover hover:bg-sunken"
                  }`}
                >
                  <span
                    className={`font-mono text-xs ${
                      active ? "text-on-accent" : "text-ink-muted"
                    }`}
                  >
                    {route.number}
                  </span>
                  {route.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        {routeData && routeInfo ? (
          <div key={selectedRoute} className="swap mt-8 space-y-6">
            {/* Stoppages */}
            <div className="overflow-hidden rounded-card border border-line bg-surface">
              <div className="flex items-center gap-2.5 border-b border-line px-6 py-4">
                <MapPin
                  className="h-5 w-5 text-accent-ink"
                  aria-hidden="true"
                />
                <h3 className="font-semibold text-ink">
                  {routeInfo.label} stoppages
                </h3>
              </div>

              <ol className="grid sm:grid-cols-2">
                {routeData.pickups.map((pickup, index) => (
                  <li
                    key={pickup.point}
                    className="flex items-baseline justify-between gap-4 border-b border-line-soft px-6 py-3.5 last:border-0 sm:even:border-l"
                  >
                    <span className="flex items-baseline gap-3">
                      <span className="font-mono text-xs text-ink-muted tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm text-ink-strong">
                        {pickup.point}
                      </span>
                    </span>
                    <span className="shrink-0 font-mono text-sm text-ink-body tabular-nums">
                      {pickup.morning}
                    </span>
                  </li>
                ))}
              </ol>

              <p className="flex items-start gap-2 border-t border-line-soft bg-sunken px-6 py-3.5 text-xs leading-relaxed text-ink-body">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                Morning pickup times are indicative, carried over from last
                semester. The Fall 2026 notice lists the stoppages but no
                pickup times, and the afternoon and evening trips were
                re-timed, so check the transport portal for those.
              </p>
            </div>

            {/* Campus arrivals and departures */}
            <div className="grid gap-6 sm:grid-cols-2">
              <TimeList
                icon={
                  <ArrowRight
                    className="h-5 w-5 text-accent-ink"
                    aria-hidden="true"
                  />
                }
                title="Arrives at NSU"
                times={ARRIVALS}
                labels={TRIP_LABELS}
                note="The same three arrivals on all six routes."
              />
              <TimeList
                icon={
                  <Bus
                    className="h-5 w-5 text-accent-ink"
                    aria-hidden="true"
                  />
                }
                title="Leaves NSU"
                times={routeData.departures}
                note={departureNote}
              />
            </div>
          </div>
        ) : (
          <Reveal delay={120}>
            <div className="mt-8 rounded-card border border-dashed border-line-hover bg-surface px-6 py-14 text-center">
              <Bus
                className="mx-auto h-8 w-8 text-ink-faint"
                aria-hidden="true"
              />
              <p className="mt-4 font-medium text-ink-strong">
                Pick a route above
              </p>
              <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-ink-body">
                You will get every stoppage on that route, and exactly which
                trips back to it run in the evening.
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

function TimeList({
  icon,
  title,
  times,
  labels,
  note,
}: {
  icon: React.ReactNode;
  title: string;
  times: string[];
  labels?: string[];
  note?: string;
}) {
  return (
    <div className="rounded-card border border-line bg-surface p-6">
      <div className="mb-4 flex items-center gap-2.5">
        {icon}
        <h3 className="font-semibold text-ink">
          {title}
        </h3>
      </div>
      <ul className="space-y-2">
        {times.map((time, i) => (
          <li
            key={time}
            className="flex items-center justify-between rounded-control bg-sunken px-4 py-2.5"
          >
            <span className="flex items-center gap-2 text-sm text-ink-body">
              <Clock className="h-3.5 w-3.5 text-ink-faint" aria-hidden="true" />
              {labels?.[i] ?? `Trip ${i + 1}`}
            </span>
            <span className="font-mono text-sm font-semibold text-ink tabular-nums">
              {time}
            </span>
          </li>
        ))}
      </ul>
      {note && (
        <p className="mt-3 text-xs leading-relaxed text-ink-body">
          {note}
        </p>
      )}
    </div>
  );
}
