"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { ARRIVALS, DEPARTURE_NOTES, ROUTES, ROUTE_LIST } from "../lib/routes";
import { BOOKING_URL, FARE_PER_TRIP, SEMESTER_LABEL } from "../lib/semester";
import { ArrowLink, SectionHeading, Tag } from "./ui";

const listJoin = (items: string[]) =>
  items.length <= 1
    ? items.join("")
    : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

export const routeAnchor = (key: string) => `route-${key.toLowerCase()}`;

/* Every route, its stops, its trips back and its fare, as chevron rows
   of native disclosures inside one list card, beside a card of what is
   the same on every route.

   All six routes are in the HTML whether they are open or not, so a
   search for "Uttara to NSU bus" or a stop name finds this page, and a
   visitor can scan every route without picking one first. The route
   chosen in the calculator opens itself and is marked as theirs. */
export function RouteSchedule({ selectedRoute }: { selectedRoute: string }) {
  /* Routes the visitor opened or closed by hand. The calculator's route
     is open unless they closed it. */
  const [toggled, setToggled] = useState<Record<string, boolean>>({});
  const isOpen = (key: string) => toggled[key] ?? key === selectedRoute;

  return (
    <section id="routes" aria-labelledby="routes-title" className="scroll-mt-4 bg-canvas py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="routes-title" title="NSU bus routes and pickup points">
          Six routes across Dhaka to the Bashundhara campus. Open a route to
          see its stops and when the bus heads back.
        </SectionHeading>

        <div className="mt-10 grid gap-6 sm:mt-12 lg:grid-cols-12 lg:items-start lg:gap-8">
          <ol className="min-w-0 divide-y divide-line-soft overflow-hidden rounded-card bg-surface shadow-card ring-1 ring-line lg:col-span-8">
            {ROUTE_LIST.map((route) => {
              const data = ROUTES[route.key];
              const mine = route.key === selectedRoute;
              const [firstStop] = data.pickups[0].point.split(" (");
              const lastTrip = data.departures[data.departures.length - 1];
              const note = DEPARTURE_NOTES[route.key];

              return (
                <li key={route.key} id={routeAnchor(route.key)} className="scroll-mt-4">
                  <details
                    open={isOpen(route.key)}
                    onToggle={(event) => {
                      const open = event.currentTarget.open;
                      if (open !== isOpen(route.key)) {
                        setToggled((t) => ({ ...t, [route.key]: open }));
                      }
                    }}
                  >
                    <summary className="flex min-h-11 cursor-pointer items-center gap-4 px-5 py-4 transition-colors duration-200 hover:bg-sunken sm:px-6">
                      <span
                        className={`flex size-14 shrink-0 flex-col items-center justify-center rounded-tile ${
                          mine ? "bg-primary text-on-primary" : "bg-tile text-heading"
                        }`}
                        aria-hidden="true"
                      >
                        <span className="text-xl leading-none font-bold tabular-nums">{route.number}</span>
                        <span className="mt-1 text-[0.625rem] font-semibold uppercase">Route</span>
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <h3 className="text-lg font-bold text-heading">{route.label} to NSU</h3>
                          {mine && <Tag>Your route</Tag>}
                        </div>
                        <p className="mt-0.5 text-sm text-ink-body">
                          {data.pickups.length} stops from {firstStop}, last bus back at {lastTrip}
                        </p>
                      </div>
                      <ChevronRight className="chevron size-5 shrink-0 text-accent" aria-hidden="true" />
                    </summary>

                    <div className="grid gap-6 border-t border-line-soft bg-sunken/50 px-5 py-5 sm:px-6 md:grid-cols-[minmax(0,1fr)_15rem]">
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-heading">Pickup points, in order</h4>
                        <ol className="mt-2">
                          {data.pickups.map((pickup, index) => (
                            <li
                              key={pickup.point}
                              className="flex items-baseline justify-between gap-4 border-b border-line py-2.5 last:border-0"
                            >
                              <span className="flex min-w-0 items-baseline gap-3">
                                <span className="w-5 shrink-0 text-right text-xs font-semibold text-ink-muted tabular-nums">
                                  {index + 1}
                                </span>
                                <span className="text-sm text-ink-strong">{pickup.point}</span>
                              </span>
                              <span className="shrink-0 text-sm text-ink-body tabular-nums">
                                {pickup.morning}
                              </span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <dl className="space-y-4 text-sm">
                        <div>
                          <dt className="text-ink-body">Bus fare from {route.label}</dt>
                          <dd className="mt-0.5 font-semibold text-heading">
                            Tk {FARE_PER_TRIP} one way, Tk {FARE_PER_TRIP * 2} round trip
                          </dd>
                        </div>
                        <div>
                          <dt className="text-ink-body">Reaches NSU</dt>
                          <dd className="mt-0.5 font-semibold text-heading tabular-nums">
                            {ARRIVALS.join(", ")}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-ink-body">Leaves NSU</dt>
                          <dd className="mt-0.5 font-semibold text-heading tabular-nums">
                            {data.departures.join(", ")}
                          </dd>
                          {note && (
                            <dd className="mt-1 text-xs leading-relaxed text-ink-body">{note}</dd>
                          )}
                        </div>
                      </dl>
                    </div>
                  </details>
                </li>
              );
            })}
          </ol>

          {/* What is the same on every route. */}
          <div
            role="group"
            aria-labelledby="every-route-title"
            className="min-w-0 overflow-hidden rounded-card bg-surface shadow-card ring-1 ring-line lg:sticky lg:top-6 lg:col-span-4"
          >
            <h3
              id="every-route-title"
              className="bg-notice px-6 py-2.5 text-center text-sm font-semibold tracking-wide text-on-notice uppercase"
            >
              Every route
            </h3>
            <dl className="divide-y divide-line-soft">
              <div className="px-6 py-4">
                <dt className="text-sm text-ink-body">Reaches the Bashundhara campus</dt>
                <dd className="mt-1 text-lg font-bold text-heading tabular-nums">
                  {listJoin(ARRIVALS)}
                </dd>
              </div>
              <div className="px-6 py-4">
                <dt className="text-sm text-ink-body">Fare</dt>
                <dd className="mt-1 text-lg font-bold text-heading">
                  Tk {FARE_PER_TRIP} one way, Tk {FARE_PER_TRIP * 2} round trip
                </dd>
              </div>
              <div className="px-6 py-4">
                <dt className="text-sm text-ink-body">Morning pickup times</dt>
                <dd className="mt-1 text-sm leading-relaxed text-ink-body">
                  Indicative, carried over from last semester. The{" "}
                  {SEMESTER_LABEL} notice lists the stops but not their times,
                  and the afternoon and evening trips were re-timed.
                </dd>
              </div>
            </dl>
            <div className="border-t border-line-soft px-6 py-4">
              <ArrowLink href={BOOKING_URL} external>
                Check times on the portal
              </ArrowLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
