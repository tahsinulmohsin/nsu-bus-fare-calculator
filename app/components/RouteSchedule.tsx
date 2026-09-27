"use client";

import { useState } from "react";
import { ChevronDown, Info } from "lucide-react";
import { ARRIVALS, DEPARTURE_NOTES, ROUTES, ROUTE_LIST } from "../lib/routes";
import { FARE_PER_TRIP, SEMESTER_LABEL } from "../lib/semester";
import { Reveal } from "./Reveal";

const listJoin = (items: string[]) =>
  items.length <= 1
    ? items.join("")
    : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

export const routeAnchor = (key: string) => `route-${key.toLowerCase()}`;

/* Every route, its stops, its trips back and its fare, as a list of
   native disclosures.

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
    <section
      id="routes"
      aria-labelledby="routes-title"
      className="scroll-mt-4 border-t border-line py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 id="routes-title" className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            NSU bus routes and pickup points
          </h2>
          <p className="mt-3 max-w-[60ch] leading-relaxed text-ink-body">
            Six routes across Dhaka, all at Tk {FARE_PER_TRIP} one way or Tk{" "}
            {FARE_PER_TRIP * 2} for a round trip. Every route reaches the
            Bashundhara campus at {listJoin(ARRIVALS)}. Open a route to see its
            stops and when the bus heads back.
          </p>
        </Reveal>

        <ol className="mt-8 space-y-3">
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
                  className={`group rounded-card border bg-surface ${
                    mine ? "border-accent" : "border-line"
                  }`}
                >
                  <summary className="flex min-h-11 cursor-pointer list-none items-center gap-4 rounded-card px-5 py-4 hover:bg-sunken [&::-webkit-details-marker]:hidden">
                    <span className="font-mono text-sm text-ink-muted tabular-nums" aria-hidden="true">
                      {route.number}
                    </span>
                    <span className="min-w-0 flex-1">
                      <h3 className="font-semibold text-ink">{route.label} to NSU</h3>
                      <span className="mt-0.5 block text-sm text-ink-body">
                        {data.pickups.length} stops from {firstStop}, last bus back at {lastTrip}
                      </span>
                    </span>
                    {mine && (
                      <span className="hidden shrink-0 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent-strong sm:inline">
                        Your route
                      </span>
                    )}
                    <ChevronDown
                      className="h-5 w-5 shrink-0 text-ink-muted transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
                      aria-hidden="true"
                    />
                  </summary>

                  <div className="grid gap-6 border-t border-line-soft px-5 py-5 md:grid-cols-[minmax(0,1fr)_16rem]">
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium text-ink-strong">
                        Pickup points, in order
                      </h4>
                      <ol className="mt-2">
                        {data.pickups.map((pickup, index) => (
                          <li
                            key={pickup.point}
                            className="flex items-baseline justify-between gap-4 border-b border-line-soft py-2.5 last:border-0"
                          >
                            <span className="flex min-w-0 items-baseline gap-3">
                              <span className="font-mono text-xs text-ink-muted tabular-nums">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              <span className="text-sm text-ink-strong">{pickup.point}</span>
                            </span>
                            <span className="shrink-0 font-mono text-sm text-ink-body tabular-nums">
                              {pickup.morning}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <dl className="space-y-4 text-sm">
                      <div>
                        <dt className="text-ink-body">Bus fare from {route.label}</dt>
                        <dd className="mt-0.5 font-medium text-ink">
                          Tk {FARE_PER_TRIP} one way, Tk {FARE_PER_TRIP * 2} round trip
                        </dd>
                      </div>
                      <div>
                        <dt className="text-ink-body">Reaches NSU</dt>
                        <dd className="mt-0.5 font-mono text-ink tabular-nums">{ARRIVALS.join(", ")}</dd>
                      </div>
                      <div>
                        <dt className="text-ink-body">Leaves NSU</dt>
                        <dd className="mt-0.5 font-mono text-ink tabular-nums">
                          {data.departures.join(", ")}
                        </dd>
                        {note && <dd className="mt-1 text-xs leading-relaxed text-ink-body">{note}</dd>}
                      </div>
                    </dl>
                  </div>
                </details>
              </li>
            );
          })}
        </ol>

        <p className="mt-5 flex max-w-[60ch] items-start gap-2 text-xs leading-relaxed text-ink-body">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Morning pickup times are indicative, carried over from last semester.
          The {SEMESTER_LABEL} notice lists the stops but not their times, and the
          afternoon and evening trips were re-timed, so check the transport
          portal for those.
        </p>
      </div>
    </section>
  );
}
