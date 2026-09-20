"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import {
  AlertTriangle,
  ArrowUpRight,
  Bus,
  Calendar,
  Info,
  Minus,
  Moon,
  Plus,
  Sun,
  Ticket,
} from "lucide-react";
import {
  BOOKING_URL,
  CALENDAR_URL,
  CHARGEABLE_DAYS,
  FARE_PER_TRIP,
  FRIDAYS,
  NOTICE_PUBLISHED,
  SEMESTER_END,
  SEMESTER_END_DATE,
  SEMESTER_LABEL,
  SEMESTER_START,
  SEMESTER_START_DATE,
  TICKET_SALES,
  TOTAL_DAYS,
  TRIP_LABELS,
  WEEKDAYS,
  countWeekdayInRange,
  type TripType,
} from "../lib/semester";
import { ARRIVALS, ROUTES, ROUTE_LIST } from "../lib/routes";
import { HeroVideo } from "./HeroVideo";
import { RefundNotice } from "./RefundNotice";
import { Reveal } from "./Reveal";
import { RouteSchedule } from "./RouteSchedule";

const TRIP_OPTIONS: { value: TripType; label: string; hint: string }[] = [
  { value: "round", label: "Round trip", hint: "Both ways" },
  { value: "one-way", label: "One way", hint: "Single leg" },
  { value: "per-day", label: "Per day", hint: "Ad hoc" },
];

export default function BusFareCalculator() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [selectedRoute, setSelectedRoute] = useState("");
  const [tripType, setTripType] = useState<TripType>("round");
  const [toNsuTiming, setToNsuTiming] = useState("");
  const [fromNsuTiming, setFromNsuTiming] = useState("");
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [suspensions, setSuspensions] = useState(0);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    setNow(Date.now());
  }, []);

  /* Round trip and one way tickets sell in different windows, so the
     note under the booking button follows the selected trip type. */
  const sale = TICKET_SALES[tripType];
  const saleClosed =
    now !== null &&
    sale.deadlineISO !== undefined &&
    now > new Date(sale.deadlineISO).getTime();

  /* How many times each weekday falls inside the service period. */
  const weekdayCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    for (const day of WEEKDAYS) {
      counts[day.key] = countWeekdayInRange(
        day.key,
        SEMESTER_START_DATE,
        SEMESTER_END_DATE
      );
    }
    return counts;
  }, []);

  const billedDays = useMemo(
    () => selectedDays.reduce((sum, day) => sum + (weekdayCounts[day] ?? 0), 0),
    [selectedDays, weekdayCounts]
  );

  const refundDays = Math.min(suspensions, billedDays);

  /* NSU charges every selected non-Friday day up front. When service is
     later suspended on a non-Friday, that day is refunded to the
     student's bank account after the semester, so an expected
     suspension is shown as money coming back rather than as a
     discount on what is paid at booking. */
  const perDayRate = tripType === "round" ? FARE_PER_TRIP * 2 : FARE_PER_TRIP;
  const totalFare =
    tripType === "per-day" ? FARE_PER_TRIP : perDayRate * billedDays;
  const refundAmount = tripType === "per-day" ? 0 : perDayRate * refundDays;
  const netFare = totalFare - refundAmount;

  const routeData = selectedRoute ? ROUTES[selectedRoute] : null;
  const routeInfo = ROUTE_LIST.find((r) => r.key === selectedRoute);

  const handleRouteChange = (route: string) => {
    setSelectedRoute(route);
    setToNsuTiming("");
    setFromNsuTiming("");
  };

  const toggleDay = (dayKey: number) => {
    setSelectedDays((prev) => {
      const next = prev.includes(dayKey)
        ? prev.filter((d) => d !== dayKey)
        : [...prev, dayKey];
      const nextTotal = next.reduce(
        (sum, d) => sum + (weekdayCounts[d] ?? 0),
        0
      );
      setSuspensions((current) => Math.min(current, nextTotal));
      return next;
    });
  };

  const changeSuspensions = (value: number) =>
    setSuspensions(Math.min(billedDays, Math.max(0, value)));

  const money = (amount: number) => amount.toLocaleString("en-US");

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* ═══════════════ Hero ═══════════════ */}
      <header className="relative isolate overflow-hidden bg-slate-950">
        <HeroVideo />

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Navigation stays on one line and under 80px tall. */}
          <nav className="flex h-[72px] items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-semibold text-white">
              <Bus className="h-5 w-5 shrink-0 text-blue-400" aria-hidden="true" />
              <span className="hidden sm:inline">
                North South University Bus Fare
              </span>
              <span className="sm:hidden">NSU Bus Fare</span>
            </span>
            {mounted && (
              <button
                type="button"
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                aria-label={
                  resolvedTheme === "dark"
                    ? "Switch to light theme"
                    : "Switch to dark theme"
                }
                className="pressable flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/20 text-white/90 hover:bg-white/10 hover:text-white"
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="h-4.5 w-4.5" aria-hidden="true" />
                ) : (
                  <Moon className="h-4.5 w-4.5" aria-hidden="true" />
                )}
              </button>
            )}
          </nav>

          <div className="max-w-2xl pt-10 pb-16 sm:pt-16 sm:pb-24">
            <div className="rise flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 font-mono text-xs text-blue-100 ring-1 ring-white/15 ring-inset">
                <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                {SEMESTER_START} to {SEMESTER_END}
              </span>
              <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 font-mono text-xs text-blue-100 ring-1 ring-white/15 ring-inset">
                {CHARGEABLE_DAYS} chargeable days
              </span>
            </div>

            <h1 className="rise stagger-1 mt-5 text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl lg:text-6xl">
              Know your bus fare before you book
            </h1>

            <p className="rise stagger-2 mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
              Pick your days, and see what {SEMESTER_LABEL} costs and what comes
              back if a trip is cancelled.
            </p>

            <div className="rise stagger-3 mt-8">
              <a
                href="#calculator"
                className="pressable inline-flex min-h-11 items-center gap-2 rounded-[10px] bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-blue-500"
              >
                Work out my fare
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════════ Provisional data notice ═══════════════ */}
      {!NOTICE_PUBLISHED && (
        <div className="border-b border-amber-200 bg-amber-50 dark:border-amber-500/25 dark:bg-amber-500/10">
          <div className="mx-auto flex max-w-6xl gap-3 px-4 py-4 sm:px-6 lg:px-8">
            <AlertTriangle
              className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400"
              aria-hidden="true"
            />
            <p className="text-sm leading-relaxed text-amber-900 dark:text-amber-100">
              <span className="font-semibold">
                North South University has not published the official{" "}
                {SEMESTER_LABEL} bus service notice yet.
              </span>{" "}
              The dates, booking window and fares here are worked out from the{" "}
              {SEMESTER_LABEL} academic calendar and how last semester ran, so
              treat them as provisional. This page will be updated as soon as
              the notice is out.
            </p>
          </div>
        </div>
      )}

      {/* ═══════════════ Calculator ═══════════════ */}
      <main
        id="calculator"
        className="mx-auto max-w-6xl scroll-mt-4 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      >
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Your fare
          </h2>
          <p className="mt-3 max-w-[65ch] leading-relaxed text-slate-600 dark:text-slate-300">
            Fridays are never charged. Everything else you pick is billed when
            you book.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-5">
          {/* ─── Controls ─── */}
          <div className="space-y-8 lg:col-span-3">
            {/* Trip type */}
            <Reveal delay={60}>
              <fieldset>
                <legend className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Trip type
                </legend>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {TRIP_OPTIONS.map((option) => {
                    const active = tripType === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setTripType(option.value)}
                        aria-pressed={active}
                        className={`pressable min-h-11 cursor-pointer rounded-[10px] border px-4 py-3 text-left ${
                          active
                            ? "border-blue-600 bg-blue-50 dark:bg-blue-500/10"
                            : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"
                        }`}
                      >
                        <span
                          className={`block text-sm font-semibold ${
                            active
                              ? "text-blue-700 dark:text-blue-300"
                              : "text-slate-800 dark:text-slate-100"
                          }`}
                        >
                          {option.label}
                        </span>
                        <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                          {option.hint}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            </Reveal>

            {/* Route and timings */}
            <Reveal delay={100}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="route"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    Route
                  </label>
                  <select
                    id="route"
                    value={selectedRoute}
                    onChange={(e) => handleRouteChange(e.target.value)}
                    className="mt-2 min-h-11 w-full cursor-pointer rounded-[10px] border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    <option value="">Select your route</option>
                    {ROUTE_LIST.map((route) => (
                      <option key={route.key} value={route.key}>
                        {route.number} {route.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    Route does not change the fare. It sets the timings you can
                    pick and the schedule shown below.
                  </p>
                </div>

                {routeData && tripType !== "per-day" && (
                  <div className="swap grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="to-nsu"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                      >
                        Trip to NSU
                      </label>
                      <select
                        id="to-nsu"
                        value={toNsuTiming}
                        onChange={(e) => setToNsuTiming(e.target.value)}
                        className="mt-2 min-h-11 w-full cursor-pointer rounded-[10px] border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      >
                        <option value="">Any timing</option>
                        {ARRIVALS.map((time, i) => (
                          <option key={i} value={String(i)}>
                            {TRIP_LABELS[i] ?? `Trip ${i + 1}`}, arrives {time}
                          </option>
                        ))}
                      </select>
                    </div>

                    {tripType === "round" && (
                      <div>
                        <label
                          htmlFor="from-nsu"
                          className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                        >
                          Trip from NSU
                        </label>
                        <select
                          id="from-nsu"
                          value={fromNsuTiming}
                          onChange={(e) => setFromNsuTiming(e.target.value)}
                          className="mt-2 min-h-11 w-full cursor-pointer rounded-[10px] border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                        >
                          <option value="">Any timing</option>
                          {routeData.departures.map((time, i) => (
                            <option key={i} value={String(i)}>
                              Leaves {time}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Reveal>

            {/* Days */}
            {tripType !== "per-day" && (
              <Reveal delay={140}>
                <fieldset>
                  <legend className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Days you will travel
                  </legend>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    The number on each day is how many times it falls in the
                    service period.
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {WEEKDAYS.map((day) => {
                      const active = selectedDays.includes(day.key);
                      return (
                        <button
                          key={day.key}
                          type="button"
                          onClick={() => toggleDay(day.key)}
                          aria-pressed={active}
                          aria-label={`${day.full}, ${weekdayCounts[day.key]} days`}
                          className={`pressable min-h-11 cursor-pointer rounded-[10px] border px-2 py-2.5 ${
                            active
                              ? "border-blue-600 bg-blue-50 dark:bg-blue-500/10"
                              : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"
                          }`}
                        >
                          <span
                            className={`block text-sm font-semibold ${
                              active
                                ? "text-blue-700 dark:text-blue-300"
                                : "text-slate-700 dark:text-slate-200"
                            }`}
                          >
                            {day.short}
                          </span>
                          <span className="mt-0.5 block font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400">
                            {weekdayCounts[day.key]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              </Reveal>
            )}

            {/* Expected suspensions */}
            {tripType !== "per-day" && billedDays > 0 && (
              <Reveal delay={180}>
                <div className="swap">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label
                      htmlFor="suspensions"
                      className="text-sm font-medium text-slate-700 dark:text-slate-200"
                    >
                      Days you expect service to be suspended
                    </label>
                    <a
                      href={CALENDAR_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      Academic calendar
                      <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                    </a>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => changeSuspensions(suspensions - 1)}
                      disabled={suspensions <= 0}
                      aria-label="One fewer day"
                      className="pressable flex h-11 w-11 cursor-pointer items-center justify-center rounded-[10px] border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <Minus className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <input
                      id="suspensions"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={billedDays}
                      value={suspensions}
                      onChange={(e) =>
                        changeSuspensions(parseInt(e.target.value, 10) || 0)
                      }
                      className="h-11 w-20 rounded-[10px] border border-slate-200 bg-white text-center font-mono text-lg font-semibold text-slate-900 tabular-nums dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                    <button
                      type="button"
                      onClick={() => changeSuspensions(suspensions + 1)}
                      disabled={suspensions >= billedDays}
                      aria-label="One more day"
                      className="pressable flex h-11 w-11 cursor-pointer items-center justify-center rounded-[10px] border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                  <p className="mt-2.5 max-w-[60ch] text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    Fridays are already excluded. If the bus does not run on any
                    other day, NSU sends that money back to your bank account
                    after the semester. This is your expected refund, not a
                    discount at booking.
                  </p>
                </div>
              </Reveal>
            )}
          </div>

          {/* ─── Summary ─── */}
          <div className="lg:col-span-2">
            <Reveal delay={80}>
              <div className="space-y-4 lg:sticky lg:top-6">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                  <div className="bg-slate-900 px-6 py-7 dark:bg-slate-800/70">
                    <p className="text-sm font-medium text-slate-300">
                      {tripType === "per-day"
                        ? "Fare per day"
                        : "Charged at booking"}
                    </p>
                    <p className="mt-1.5 font-mono text-4xl font-semibold tracking-tight text-white tabular-nums">
                      ৳{money(totalFare)}
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      {tripType === "per-day"
                        ? "Fixed price for a single ad hoc trip"
                        : billedDays > 0
                          ? `${billedDays} days at ৳${perDayRate} a day`
                          : "Pick your travel days to see a total"}
                    </p>
                  </div>

                  {refundDays > 0 && (
                    <div className="swap divide-y divide-slate-100 dark:divide-slate-800">
                      <div className="flex items-center justify-between px-6 py-3.5">
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                          Expected refund
                        </span>
                        <span className="font-mono text-sm font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                          ৳{money(refundAmount)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between px-6 py-3.5">
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                          Net cost
                        </span>
                        <span className="font-mono text-sm font-bold text-slate-900 tabular-nums dark:text-slate-50">
                          ৳{money(netFare)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-slate-100 p-6 dark:border-slate-800">
                    <a
                      href={BOOKING_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      id="book-ticket-cta"
                      className="pressable flex min-h-11 items-center justify-center gap-2 rounded-[10px] bg-orange-700 px-5 py-3.5 text-sm font-semibold text-white hover:bg-orange-800"
                    >
                      <Ticket className="h-4 w-4" aria-hidden="true" />
                      Book on the NSU portal
                    </a>
                    <div className="mt-3 space-y-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      {saleClosed ? (
                        <p className="font-medium text-red-600 dark:text-red-400">
                          The {TRIP_OPTIONS.find((o) => o.value === tripType)
                            ?.label.toLowerCase()}{" "}
                          ticket sale has closed.
                        </p>
                      ) : (
                        <p>
                          <span className="font-medium text-slate-700 dark:text-slate-200">
                            Ticket sale:
                          </span>{" "}
                          {sale.window}
                        </p>
                      )}
                      {sale.note && !saleClosed && <p>{sale.note}</p>}
                    </div>
                  </div>
                </div>

                {/* Reference figures */}
                <dl className="rounded-2xl border border-slate-200 bg-white p-6 text-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-4 flex items-center gap-2.5">
                    <Info
                      className="h-5 w-5 text-blue-600 dark:text-blue-400"
                      aria-hidden="true"
                    />
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                      {SEMESTER_LABEL} at a glance
                    </h3>
                  </div>
                  {[
                    { term: "Service period", value: `${SEMESTER_START} to ${SEMESTER_END}` },
                    { term: "Chargeable days", value: `${CHARGEABLE_DAYS} of ${TOTAL_DAYS}` },
                    { term: "Fridays excluded", value: String(FRIDAYS) },
                    { term: "One way", value: `৳${FARE_PER_TRIP}` },
                    { term: "Round trip", value: `৳${FARE_PER_TRIP * 2}` },
                  ].map((row) => (
                    <div
                      key={row.term}
                      className="flex items-baseline justify-between gap-4 border-t border-slate-100 py-2.5 first:border-0 first:pt-0 dark:border-slate-800"
                    >
                      <dt className="text-slate-600 dark:text-slate-400">
                        {row.term}
                      </dt>
                      <dd className="text-right font-mono text-slate-900 tabular-nums dark:text-slate-100">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                  <p className="mt-4 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    From the {SEMESTER_LABEL} bus ticket notice issued by the
                    Office of the Registrar.
                  </p>
                </dl>
              </div>
            </Reveal>
          </div>
        </div>
      </main>

      <RefundNotice />

      <RouteSchedule
        selectedRoute={selectedRoute}
        onSelectRoute={handleRouteChange}
      />

      {/* ═══════════════ Footer ═══════════════ */}
      <footer className="border-t border-slate-200 py-8 dark:border-slate-800">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Bus className="h-4 w-4" aria-hidden="true" />
            North South University Bus Fare Calculator, {SEMESTER_LABEL}
          </span>
          <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Unofficial tool. Always check the{" "}
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-700 dark:text-blue-400"
            >
              NSU Transport portal
            </a>{" "}
            before you rely on these numbers.
          </p>
        </div>
      </footer>
    </div>
  );
}
