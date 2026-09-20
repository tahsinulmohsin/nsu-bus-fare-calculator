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
      className="border-t border-slate-200 py-16 sm:py-20 dark:border-slate-800"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50">
            Routes and timings
          </h2>
          <p className="mt-3 max-w-[65ch] leading-relaxed text-slate-600 dark:text-slate-300">
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
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  }`}
                >
                  <span
                    className={`font-mono text-xs ${
                      active ? "text-blue-100" : "text-slate-400 dark:text-slate-500"
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
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2.5 border-b border-slate-200 px-6 py-4 dark:border-slate-800">
                <MapPin
                  className="h-5 w-5 text-blue-600 dark:text-blue-400"
                  aria-hidden="true"
                />
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  {routeInfo.label} stoppages
                </h3>
              </div>

              <ol className="grid sm:grid-cols-2">
                {routeData.pickups.map((pickup, index) => (
                  <li
                    key={pickup.point}
                    className="flex items-baseline justify-between gap-4 border-b border-slate-100 px-6 py-3.5 last:border-0 sm:even:border-l dark:border-slate-800/60"
                  >
                    <span className="flex items-baseline gap-3">
                      <span className="font-mono text-xs text-slate-400 tabular-nums dark:text-slate-500">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm text-slate-800 dark:text-slate-200">
                        {pickup.point}
                      </span>
                    </span>
                    <span className="shrink-0 font-mono text-sm text-slate-600 tabular-nums dark:text-slate-300">
                      {pickup.morning}
                    </span>
                  </li>
                ))}
              </ol>

              <p className="flex items-start gap-2 border-t border-slate-100 bg-slate-50 px-6 py-3.5 text-xs leading-relaxed text-slate-600 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
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
                    className="h-5 w-5 text-blue-600 dark:text-blue-400"
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
                    className="h-5 w-5 text-blue-600 dark:text-blue-400"
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
            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900/50">
              <Bus
                className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600"
                aria-hidden="true"
              />
              <p className="mt-4 font-medium text-slate-700 dark:text-slate-200">
                Pick a route above
              </p>
              <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
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
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center gap-2.5">
        {icon}
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h3>
      </div>
      <ul className="space-y-2">
        {times.map((time, i) => (
          <li
            key={time}
            className="flex items-center justify-between rounded-[10px] bg-slate-50 px-4 py-2.5 dark:bg-slate-800/60"
          >
            <span className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <Clock className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              {labels?.[i] ?? `Trip ${i + 1}`}
            </span>
            <span className="font-mono text-sm font-semibold text-slate-900 tabular-nums dark:text-slate-100">
              {time}
            </span>
          </li>
        ))}
      </ul>
      {note && (
        <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          {note}
        </p>
      )}
    </div>
  );
}
