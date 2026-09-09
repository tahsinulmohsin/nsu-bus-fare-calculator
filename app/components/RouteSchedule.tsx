"use client";

import { ArrowRight, Bus, Clock, MapPin } from "lucide-react";
import { LIMITED_DEPARTURE_ROUTES, ROUTES, ROUTE_LIST } from "../lib/routes";
import { TRIP_LABELS } from "../lib/semester";
import { Reveal } from "./Reveal";

/* Pickup points, campus arrivals and campus departures for one route.

   Pickup times are a small matrix (point against trip), so it stays a
   table on desktop and becomes one card per point on mobile rather
   than a table that scrolls sideways. */
export function RouteSchedule({
  selectedRoute,
  onSelectRoute,
}: {
  selectedRoute: string;
  onSelectRoute: (route: string) => void;
}) {
  const routeData = selectedRoute ? ROUTES[selectedRoute] : null;
  const routeInfo = ROUTE_LIST.find((r) => r.key === selectedRoute);
  const limitedDepartures = LIMITED_DEPARTURE_ROUTES.includes(selectedRoute);

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
            Six routes across Dhaka. Pick one to see where it stops, when it
            reaches campus, and when it leaves.
          </p>
        </Reveal>

        {/* Route picker */}
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
                      active
                        ? "text-blue-100"
                        : "text-slate-400 dark:text-slate-500"
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
            {/* Pickup points */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2.5 border-b border-slate-200 px-6 py-4 dark:border-slate-800">
                <MapPin
                  className="h-5 w-5 text-blue-600 dark:text-blue-400"
                  aria-hidden="true"
                />
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  {routeInfo.label} pickup points
                </h3>
              </div>

              {/* Desktop: matrix of point against trip */}
              <div className="hidden sm:block">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">
                    Pickup points and departure times for the {routeInfo.label}{" "}
                    route
                  </caption>
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800">
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400"
                      >
                        Pickup point
                      </th>
                      {TRIP_LABELS.map((label) => (
                        <th
                          key={label}
                          scope="col"
                          className="px-4 py-3 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400"
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {routeData.pickups.map((pickup) => (
                      <tr
                        key={pickup.point}
                        className="border-b border-slate-100 last:border-0 dark:border-slate-800/60"
                      >
                        <th
                          scope="row"
                          className="px-6 py-3.5 pr-8 font-medium text-slate-800 dark:text-slate-200"
                        >
                          {pickup.point}
                        </th>
                        {pickup.times.map((time, i) => (
                          <td
                            key={i}
                            className="px-4 py-3.5 font-mono text-slate-600 tabular-nums dark:text-slate-300"
                          >
                            {time}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile: one card per pickup point */}
              <ul className="divide-y divide-slate-100 sm:hidden dark:divide-slate-800/60">
                {routeData.pickups.map((pickup) => (
                  <li key={pickup.point} className="px-5 py-4">
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {pickup.point}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5">
                      {pickup.times.map((time, i) => (
                        <span key={i} className="text-sm">
                          <span className="text-slate-500 dark:text-slate-400">
                            {TRIP_LABELS[i] ?? `Trip ${i + 1}`}{" "}
                          </span>
                          <span className="font-mono text-slate-800 tabular-nums dark:text-slate-200">
                            {time}
                          </span>
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
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
                times={routeData.arrivals}
                labels={TRIP_LABELS}
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
                note={
                  limitedDepartures
                    ? "This route has fewer return trips than the others."
                    : undefined
                }
              />
            </div>
          </div>
        ) : (
          /* Empty state: says what to do next, not just that nothing is here. */
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
                You will get every pickup point with its times, plus when the
                bus reaches campus and when it heads back.
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
            key={i}
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
