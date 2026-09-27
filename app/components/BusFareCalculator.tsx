"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Check, ChevronDown, CreditCard, Link2, Minus, Plus } from "lucide-react";
import {
  BOOKING_URL,
  CALENDAR_URL,
  CHARGEABLE_DAYS,
  FARE_PER_TRIP,
  FRIDAYS,
  NOTICE_PUBLISHED,
  PAYMENT_METHODS,
  SEMESTER_END,
  SEMESTER_END_DATE,
  SEMESTER_LABEL,
  SEMESTER_START,
  SEMESTER_START_DATE,
  TICKET_SALES,
  TOTAL_DAYS,
  WEEKDAYS,
  countWeekdayInRange,
  formatBdDateTime,
  formatBdTime,
  getSaleStatus,
  type TripType,
} from "../lib/semester";
import { useNow } from "../lib/useNow";
import { useFareParams } from "../lib/useFareParams";
import { ROUTE_LIST } from "../lib/routes";
import { HeroVideo } from "./HeroVideo";
import { RefundNotice } from "./RefundNotice";
import { RouteSchedule, routeAnchor } from "./RouteSchedule";
import { ScrollTopButton } from "./ScrollTopButton";
import { SiteHeader } from "./SiteHeader";
import { TicketSaleCountdowns } from "./TicketSaleCountdowns";
import { SectionHeading } from "./ui";

/* Labels follow the notice: Round Trip, One Way Trip, Pay Per Ticket. */
const TRIP_OPTIONS: { value: TripType; label: string; hint: string }[] = [
  { value: "round", label: "Round trip", hint: "Both ways" },
  { value: "one-way", label: "One way", hint: "One direction" },
  { value: "per-day", label: "Pay per ticket", hint: "Bought on the day" },
];

export default function BusFareCalculator({
  renderedAt,
  about,
  gallery,
  faq,
  footer,
}: {
  renderedAt: number;
  /* Server-rendered sections passed in so their text ships as plain HTML
     and adds nothing to the client bundle. */
  about?: React.ReactNode;
  gallery?: React.ReactNode;
  faq?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const now = useNow(30_000);

  /* ─── Shareable state ───
     Trip type, route, days and suspended days live in the URL, so a
     student can send a friend exactly the fare they worked out. */
  const [params, setParams] = useFareParams();
  const { trip: tripType, route: selectedRoute, days: selectedDays, suspended: suspensions } =
    params;
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [interacted, setInteracted] = useState(false);

  /* How many times each weekday falls inside the service period. */
  const weekdayCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    for (const day of WEEKDAYS) {
      counts[day.key] = countWeekdayInRange(day.key, SEMESTER_START_DATE, SEMESTER_END_DATE);
    }
    return counts;
  }, []);

  const countFor = (days: number[]) =>
    days.reduce((sum, day) => sum + (weekdayCounts[day] ?? 0), 0);

  /* Every change goes through here: it records that the visitor has
     acted (so the total starts being announced) and invalidates any
     earlier "Link copied" confirmation. */
  const change = (next: Parameters<typeof setParams>[0]) => {
    setInteracted(true);
    setCopyState("idle");
    setParams(next);
  };

  const billedDays = countFor(selectedDays);
  const refundDays = Math.min(suspensions, billedDays);

  /* NSU charges every selected non-Friday day up front. When service is
     later suspended on a non-Friday, that day is refunded to the
     student's bank account after the semester, so an expected
     suspension is shown as money coming back rather than as a discount
     on what is paid at booking. */
  const perDayRate = tripType === "round" ? FARE_PER_TRIP * 2 : FARE_PER_TRIP;
  const totalFare = tripType === "per-day" ? FARE_PER_TRIP : perDayRate * billedDays;
  const refundAmount = tripType === "per-day" ? 0 : perDayRate * refundDays;
  const netFare = totalFare - refundAmount;
  const allDaysSelected = selectedDays.length === WEEKDAYS.length;
  const routeInfo = ROUTE_LIST.find((r) => r.key === selectedRoute);
  const tripLabel = TRIP_OPTIONS.find((o) => o.value === tripType)!.label;

  const money = (amount: number) => amount.toLocaleString("en-US");

  const totalDetail =
    tripType === "per-day"
      ? "One trip, bought on the day"
      : billedDays > 0
        ? `${billedDays} days at ৳${perDayRate} a day`
        : "Pick your travel days to see a total";

  /* ─── Booking copy follows the sale ───
     The server's render time decides the first paint so the HTML and
     the first client render agree; the live clock takes over after. */
  const saleNow = now ?? renderedAt;
  const sale = TICKET_SALES[tripType];
  const saleStatus = sale.sessions ? getSaleStatus(sale.sessions, saleNow) : null;
  const nextSession = sale.sessions?.find((s) => Date.parse(s.opens) > saleNow);
  const saleOpen = !saleStatus || saleStatus.state === "open";
  const saleClosed = saleStatus?.state === "closed";

  let saleNote: string;
  if (!saleStatus) {
    saleNote = "Buy at least an hour before the trip starts, if seats are available.";
  } else if (saleStatus.state === "upcoming") {
    saleNote = `${tripLabel} tickets go on sale on ${formatBdDateTime(saleStatus.target!)}. You can register on the portal before then.`;
  } else if (saleStatus.state === "open") {
    saleNote = saleStatus.lastDay || !nextSession
      ? `On sale now. This is the last day, and the sale closes at ${formatBdTime(saleStatus.target!)}.`
      : `On sale now until ${formatBdTime(saleStatus.target!)} today, and again from ${formatBdDateTime(Date.parse(nextSession.opens))}.`;
  } else if (saleStatus.state === "paused") {
    saleNote = `The sale reopens on ${formatBdDateTime(saleStatus.target!)}.`;
  } else {
    saleNote = `The ${tripLabel.toLowerCase()} ticket sale has closed. You can still pay per ticket at least an hour before a trip, if seats are available.`;
  }

  /* ─── Handlers ─── */
  const changeTrip = (value: TripType) => change({ trip: value });

  const changeRoute = (route: string) => change({ route });

  const toggleDay = (dayKey: number) => {
    const next = selectedDays.includes(dayKey)
      ? selectedDays.filter((d) => d !== dayKey)
      : [...selectedDays, dayKey];
    change({ days: next, suspended: Math.min(suspensions, countFor(next)) });
  };

  const toggleAllDays = () =>
    change(
      allDaysSelected
        ? { days: [], suspended: 0 }
        : { days: WEEKDAYS.map((d) => d.key) }
    );

  const changeSuspensions = (value: number) =>
    change({ suspended: Math.min(billedDays, Math.max(0, value)) });

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  };

  /* ─── Phone fare bar ───
     Below the lg breakpoint the summary card sits under every control,
     so a compact total follows the controls and hides whenever the real
     summary is on screen. Scroll padding keeps keyboard focus clear of
     it. */
  const controlsRef = useRef<HTMLDivElement>(null);
  const totalRef = useRef<HTMLDivElement>(null);
  const [controlsInView, setControlsInView] = useState(false);
  const [totalInView, setTotalInView] = useState(false);

  useEffect(() => {
    const controls = controlsRef.current;
    const total = totalRef.current;
    if (!controls || !total) return;
    const watchControls = new IntersectionObserver(
      ([entry]) => setControlsInView(entry.isIntersecting),
      { rootMargin: "0px 0px -25% 0px" }
    );
    const watchTotal = new IntersectionObserver(
      ([entry]) => setTotalInView(entry.isIntersecting),
      { rootMargin: "0px 0px -88px 0px" }
    );
    watchControls.observe(controls);
    watchTotal.observe(total);
    return () => {
      watchControls.disconnect();
      watchTotal.disconnect();
    };
  }, []);

  const barVisible = controlsInView && !totalInView;

  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 1023px)").matches;
    document.documentElement.style.scrollPaddingBottom =
      barVisible && narrow ? "96px" : "";
  }, [barVisible]);

  const announcement = interacted
    ? `Charged at booking: ${money(totalFare)} taka. ${totalDetail}.${
        refundDays > 0 ? ` Expected refund ${money(refundAmount)} taka.` : ""
      }`
    : "";

  const labelClass = "block text-base font-bold text-heading";
  const helpClass = "mt-1 max-w-[60ch] text-sm leading-relaxed text-ink-body";
  const stepperClass =
    "pressable flex size-12 cursor-pointer items-center justify-center bg-pale text-on-pale ring-1 ring-line-control ring-inset hover:bg-pale-hover disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div id="top" className="min-h-screen bg-canvas text-ink">
      <a
        href="#calculator"
        className="sr-only bg-surface px-4 py-3 text-sm font-semibold text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
      >
        Skip to the fare calculator
      </a>

      <SiteHeader />

      <main id="main">
        {/* ═══════════════ Hero ═══════════════ */}
        <section
          aria-labelledby="page-title"
          className="relative isolate flex min-h-[28rem] items-end overflow-hidden bg-media sm:min-h-[34rem] lg:min-h-[min(40rem,calc(100svh-7.75rem))]"
        >
          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-24 pb-20 sm:px-6 sm:pb-24 lg:px-8">
            <h1
              id="page-title"
              className="rise max-w-3xl text-[2.5rem] leading-[1.08] font-bold tracking-tight text-balance text-on-media sm:text-6xl lg:text-[4rem]"
            >
              NSU student bus fare calculator
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-pretty text-on-media-muted">
              What North South University&apos;s {SEMESTER_LABEL} bus costs
              for the days you travel, from {SEMESTER_START} to {SEMESTER_END}.
            </p>
            <div className="mt-8 grid gap-1 sm:flex">
              <a
                href="#calculator"
                className="pressable inline-flex min-h-14 items-center justify-center bg-media px-8 text-base font-medium text-on-media ring-1 ring-on-media/25 ring-inset hover:bg-utility"
              >
                Work out my fare
              </a>
              <a
                href="#routes"
                className="pressable inline-flex min-h-14 items-center justify-center bg-on-media px-8 text-base font-medium text-media hover:bg-on-media-muted"
              >
                See bus routes
              </a>
            </div>
          </div>

          {/* After the hero copy in the DOM so keyboard focus meets the
              headline and its buttons before the video control, matching
              the visual order; it still paints underneath. */}
          <HeroVideo />
        </section>

        {!NOTICE_PUBLISHED && (
          <div className="border-b border-line bg-tag">
            <p className="mx-auto max-w-7xl px-4 py-4 text-sm leading-relaxed font-medium text-on-tag sm:px-6 lg:px-8">
              North South University has not published the official{" "}
              {SEMESTER_LABEL} bus service notice yet. The dates, booking
              window and fares here are provisional until it is out.
            </p>
          </div>
        )}

        <TicketSaleCountdowns renderedAt={renderedAt} />

        {/* ═══════════════ Calculator ═══════════════ */}
        <section
          id="calculator"
          aria-labelledby="calculator-title"
          className="scroll-mt-4 bg-band py-16 sm:py-24"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading id="calculator-title" title="Work out your semester fare">
              Fridays are never charged. Every other day you pick is billed
              when you book.
            </SectionHeading>

            <div className="mt-10 grid gap-6 sm:mt-12 lg:grid-cols-12 lg:gap-8">
              {/* ─── Controls ─── */}
              <div
                ref={controlsRef}
                className="min-w-0 space-y-9 rounded-card bg-surface p-5 shadow-card ring-1 ring-line sm:p-8 lg:col-span-7"
              >
                <fieldset>
                  <legend className={labelClass}>Trip type</legend>
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {TRIP_OPTIONS.map((option) => {
                      const active = tripType === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => changeTrip(option.value)}
                          aria-pressed={active}
                          className={`pressable min-h-14 min-w-0 cursor-pointer px-4 py-3 text-left ${
                            active
                              ? "bg-primary text-on-primary"
                              : "bg-pale text-on-pale ring-1 ring-line-control ring-inset hover:bg-pale-hover"
                          }`}
                        >
                          <span className="flex items-center justify-between gap-2 text-sm font-semibold">
                            {option.label}
                            {active && <Check className="size-4 shrink-0" aria-hidden="true" />}
                          </span>
                          <span
                            className={`mt-0.5 block text-xs ${
                              active ? "text-on-primary/80" : "text-ink-body"
                            }`}
                          >
                            {option.hint}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div>
                  <label htmlFor="route" className={labelClass}>
                    Your route
                  </label>
                  <div className="relative mt-3">
                    <select
                      id="route"
                      value={selectedRoute}
                      onChange={(e) => changeRoute(e.target.value)}
                      aria-describedby="route-help"
                      className="h-12 w-full cursor-pointer appearance-none rounded-input border border-line-control bg-surface pr-11 pl-4 text-base text-ink hover:border-line-hover"
                    >
                      <option value="">Select your route</option>
                      {ROUTE_LIST.map((route) => (
                        <option key={route.key} value={route.key}>
                          Route {route.number}: {route.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-ink-muted"
                      aria-hidden="true"
                    />
                  </div>
                  <p id="route-help" className={helpClass}>
                    Your route does not change the fare.{" "}
                    {routeInfo ? (
                      <a
                        href={`#${routeAnchor(routeInfo.key)}`}
                        className="-my-3 inline-flex items-center py-3 font-semibold text-accent underline hover:text-accent-hover"
                      >
                        See the {routeInfo.label} stops and times
                      </a>
                    ) : (
                      "Picking one shows its stops and times further down."
                    )}
                  </p>
                </div>

                {tripType !== "per-day" && (
                  <div role="group" aria-labelledby="days-label" aria-describedby="days-help">
                    <div className="flex items-center justify-between gap-3">
                      <p id="days-label" className={labelClass}>
                        Days you will travel
                      </p>
                      <button
                        type="button"
                        onClick={toggleAllDays}
                        className="-my-3 -mr-2 inline-flex cursor-pointer items-center px-2 py-3 text-sm font-semibold text-accent hover:text-accent-hover hover:underline"
                      >
                        {allDaysSelected ? "Clear all" : "Select all"}
                      </button>
                    </div>
                    <p id="days-help" className={helpClass}>
                      Each tile shows how many times that day falls in the
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
                            className={`pressable flex min-h-[4.5rem] min-w-0 cursor-pointer flex-col items-center justify-center rounded-tile ${
                              active
                                ? "bg-primary text-on-primary"
                                : "bg-tile text-heading ring-line-hover ring-inset hover:ring-1"
                            }`}
                          >
                            <span className="text-lg leading-none font-bold">{day.short}</span>
                            <span
                              className={`mt-1.5 text-[0.6875rem] font-semibold uppercase tabular-nums ${
                                active ? "text-on-primary/80" : "text-ink-muted"
                              }`}
                            >
                              {weekdayCounts[day.key]} days
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {tripType !== "per-day" && billedDays > 0 && (
                  <div className="swap">
                    <div className="flex flex-wrap items-center justify-between gap-x-3">
                      <label htmlFor="suspensions" className={labelClass}>
                        Days you expect service to be suspended
                      </label>
                      <a
                        href={CALENDAR_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="-my-3 inline-flex items-center gap-1 py-3 text-sm font-semibold text-accent hover:text-accent-hover hover:underline"
                      >
                        Academic calendar
                        <ArrowUpRight className="size-3.5" aria-hidden="true" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => changeSuspensions(suspensions - 1)}
                        disabled={suspensions <= 0}
                        aria-label="One fewer day"
                        className={stepperClass}
                      >
                        <Minus className="size-4" aria-hidden="true" />
                      </button>
                      <input
                        id="suspensions"
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={billedDays}
                        value={suspensions}
                        onChange={(e) => changeSuspensions(parseInt(e.target.value, 10) || 0)}
                        aria-describedby="suspensions-help"
                        className="h-12 w-20 rounded-input border border-line-control bg-surface text-center text-lg font-bold text-ink tabular-nums hover:border-line-hover"
                      />
                      <button
                        type="button"
                        onClick={() => changeSuspensions(suspensions + 1)}
                        disabled={suspensions >= billedDays}
                        aria-label="One more day"
                        className={stepperClass}
                      >
                        <Plus className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                    <p id="suspensions-help" className={`${helpClass} mt-3`}>
                      Fridays are already excluded. If the bus does not run on
                      any other day, NSU sends that money back to your bank
                      account after the semester. This is your expected refund,
                      not a discount at booking.
                    </p>
                  </div>
                )}
              </div>

              {/* ─── Summary ───
                  The grid item stretches to the controls' height, which
                  gives the sticky card room to travel on desktop. */}
              <div className="min-w-0 lg:col-span-5">
                <div id="fare-summary" className="scroll-mt-4 lg:sticky lg:top-6">
                  <div className="overflow-hidden rounded-card bg-surface shadow-card ring-1 ring-line">
                    <div ref={totalRef} className="bg-inverse px-6 py-7 sm:px-8">
                      <p className="text-sm font-medium text-on-inverse-muted">
                        {tripType === "per-day" ? "Fare per trip" : "Charged at booking"}
                      </p>
                      <p className="mt-1.5 text-5xl font-bold tracking-tight text-on-inverse tabular-nums">
                        ৳{money(totalFare)}
                      </p>
                      <p className="mt-2 text-sm text-on-inverse-subtle">{totalDetail}</p>
                    </div>

                    {refundDays > 0 && (
                      <dl className="swap divide-y divide-line-soft">
                        <div className="flex items-center justify-between px-6 py-4 sm:px-8">
                          <dt className="text-sm text-ink-body">Expected refund, after the semester</dt>
                          <dd className="text-base font-bold text-positive tabular-nums">
                            ৳{money(refundAmount)}
                          </dd>
                        </div>
                        <div className="flex items-center justify-between px-6 py-4 sm:px-8">
                          <dt className="text-sm font-semibold text-ink-strong">Net cost</dt>
                          <dd className="text-base font-bold text-heading tabular-nums">
                            ৳{money(netFare)}
                          </dd>
                        </div>
                      </dl>
                    )}

                    <div className="border-t border-line-soft p-6 sm:p-8">
                      <a
                        href={BOOKING_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        id="book-ticket-cta"
                        className="pressable flex min-h-14 items-center justify-center gap-2 bg-notice px-5 text-base font-semibold text-on-notice hover:bg-notice-hover"
                      >
                        {saleOpen ? "Book on the NSU portal" : "Open the NSU portal"}
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>

                      <div className="mt-4 space-y-2 text-sm leading-relaxed text-ink-body">
                        <p className={saleClosed ? "font-semibold text-danger" : undefined}>
                          {saleNote}
                        </p>
                        {saleClosed && (
                          <button
                            type="button"
                            onClick={() => changeTrip("per-day")}
                            className="-my-3 inline-flex cursor-pointer items-center py-3 font-semibold text-accent underline hover:text-accent-hover"
                          >
                            Switch to pay per ticket
                          </button>
                        )}
                        {sale.note && !saleClosed && tripType !== "per-day" && <p>{sale.note}</p>}
                        <p className="flex items-start gap-2 font-semibold text-ink-strong">
                          <CreditCard className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                          Pay with {PAYMENT_METHODS} only.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={copyLink}
                        className="pressable mt-5 inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 border border-primary px-4 text-sm font-semibold text-primary hover:bg-pale"
                      >
                        {copyState === "copied" ? (
                          <Check className="size-4 text-positive" aria-hidden="true" />
                        ) : (
                          <Link2 className="size-4" aria-hidden="true" />
                        )}
                        {copyState === "copied"
                          ? "Link copied"
                          : copyState === "failed"
                            ? "Could not copy. Use the address bar instead."
                            : "Copy a link to this fare"}
                      </button>
                      <p role="status" className="sr-only">
                        {copyState === "copied" ? "Link to this fare copied" : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ─── Reference facts ─── */}
              <div
                role="group"
                aria-labelledby="glance-title"
                className="min-w-0 rounded-card bg-surface p-6 shadow-card ring-1 ring-line sm:p-8 lg:col-span-12"
              >
                <h3 id="glance-title" className="text-lg font-bold text-heading">
                  {SEMESTER_LABEL} at a glance
                </h3>
                <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 lg:grid-cols-7">
                  {[
                    { term: "Service period", value: `${SEMESTER_START} to ${SEMESTER_END}`, wide: true },
                    { term: "Chargeable days", value: `${CHARGEABLE_DAYS} of ${TOTAL_DAYS}` },
                    { term: "Fridays excluded", value: String(FRIDAYS) },
                    { term: "One way", value: `৳${FARE_PER_TRIP}` },
                    { term: "Round trip", value: `৳${FARE_PER_TRIP * 2}` },
                  ].map((fact) => (
                    <div
                      key={fact.term}
                      className={fact.wide ? "col-span-2 sm:col-span-4 lg:col-span-3" : undefined}
                    >
                      <dt className="text-sm text-ink-body">{fact.term}</dt>
                      <dd className="mt-1 text-base font-bold text-heading tabular-nums">
                        {fact.value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-6 border-t border-line-soft pt-4 text-sm leading-relaxed text-ink-body">
                  From the {SEMESTER_LABEL} bus ticket notice issued by the
                  Office of the Registrar.
                </p>
              </div>
            </div>

            <p aria-live="polite" aria-atomic="true" className="sr-only">
              {announcement}
            </p>
          </div>
        </section>

        {about}

        {gallery}

        <RouteSchedule selectedRoute={selectedRoute} />

        {faq}

        <RefundNotice />

        {/* Fixed in place; kept inside main so it sits in a landmark. */}
        <ScrollTopButton />
      </main>

      {footer}

      {/* ═══════════════ Phone fare bar ═══════════════ */}
      <aside
        aria-label="Running fare total"
        className="fare-bar fixed inset-x-0 bottom-0 z-30 bg-inverse text-on-inverse shadow-[0_-8px_24px_-12px_rgb(6_23_66/0.5)] lg:hidden"
        data-visible={barVisible}
        inert={!barVisible}
        aria-hidden={!barVisible}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
          <div className="min-w-0">
            <p className="text-xs text-on-inverse-muted">
              {tripType === "per-day" ? "Fare per trip" : "Charged at booking"}
            </p>
            <p className="text-xl font-bold tabular-nums">৳{money(totalFare)}</p>
          </div>
          <div className="min-w-0 text-right">
            <p className="text-xs text-on-inverse-muted">
              {tripType === "per-day"
                ? "Bought on the day"
                : billedDays > 0
                  ? `${billedDays} days${refundDays > 0 ? `, ৳${money(refundAmount)} back` : ""}`
                  : "No days picked yet"}
            </p>
            <a
              href="#fare-summary"
              className="inline-flex items-center py-3 text-sm font-semibold text-on-inverse underline"
            >
              See breakdown
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}
