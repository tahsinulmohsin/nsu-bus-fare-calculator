"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import {
  AlertTriangle,
  ArrowUpRight,
  Bus,
  Calendar,
  Check,
  CreditCard,
  Info,
  Link2,
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
import { ROUTES, ROUTE_LIST } from "../lib/routes";
import { HeroVideo } from "./HeroVideo";
import { RefundNotice } from "./RefundNotice";
import { Reveal } from "./Reveal";
import { RouteSchedule } from "./RouteSchedule";
import { TicketSaleCountdowns } from "./TicketSaleCountdowns";

/* Labels follow the notice: Round Trip, One Way Trip, Pay Per Ticket. */
const TRIP_OPTIONS: { value: TripType; label: string; hint: string }[] = [
  { value: "round", label: "Round trip", hint: "Both ways" },
  { value: "one-way", label: "One way", hint: "One direction" },
  { value: "per-day", label: "Pay per ticket", hint: "Bought on the day" },
];

export default function BusFareCalculator({ renderedAt }: { renderedAt: number }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [selectedRoute, setSelectedRoute] = useState("");
  const [tripType, setTripType] = useState<TripType>("round");
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [suspensions, setSuspensions] = useState(0);
  const [urlReady, setUrlReady] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const interacted = useRef(false);
  const now = useNow(30_000);

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

  /* ─── Shareable state ───
     The fare lives in the URL, so a student can send a friend exactly
     the route and days they picked. Read once on load, then kept in
     sync without adding history entries. */
  useEffect(() => {
    setMounted(true);
    const params = new URLSearchParams(window.location.search);

    const trip = params.get("trip");
    if (TRIP_OPTIONS.some((o) => o.value === trip)) setTripType(trip as TripType);

    const route = params.get("route");
    if (route && ROUTES[route]) setSelectedRoute(route);

    const days = (params.get("days") ?? "")
      .split(",")
      .map((slug) => WEEKDAYS.find((d) => d.short.toLowerCase() === slug)?.key)
      .filter((key): key is (typeof WEEKDAYS)[number]["key"] => key !== undefined);
    const uniqueDays = [...new Set(days)];
    if (uniqueDays.length) setSelectedDays(uniqueDays);

    const suspended = parseInt(params.get("suspended") ?? "", 10);
    if (suspended > 0) setSuspensions(Math.min(suspended, countFor(uniqueDays)));

    setUrlReady(true);
    // Runs once on load; countFor only reads the fixed weekday counts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!urlReady) return;
    const params = new URLSearchParams();
    if (tripType !== "round") params.set("trip", tripType);
    if (selectedRoute) params.set("route", selectedRoute);
    if (selectedDays.length) {
      params.set(
        "days",
        WEEKDAYS.filter((d) => selectedDays.includes(d.key))
          .map((d) => d.short.toLowerCase())
          .join(",")
      );
    }
    if (suspensions > 0) params.set("suspended", String(suspensions));
    const query = params.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`
    );
    setCopyState("idle");
  }, [urlReady, tripType, selectedRoute, selectedDays, suspensions]);

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
  const changeTrip = (value: TripType) => {
    interacted.current = true;
    setTripType(value);
  };

  const changeRoute = (route: string) => {
    interacted.current = true;
    setSelectedRoute(route);
  };

  const toggleDay = (dayKey: number) => {
    interacted.current = true;
    const next = selectedDays.includes(dayKey)
      ? selectedDays.filter((d) => d !== dayKey)
      : [...selectedDays, dayKey];
    setSelectedDays(next);
    setSuspensions((current) => Math.min(current, countFor(next)));
  };

  const toggleAllDays = () => {
    interacted.current = true;
    if (allDaysSelected) {
      setSelectedDays([]);
      setSuspensions(0);
    } else {
      setSelectedDays(WEEKDAYS.map((d) => d.key));
    }
  };

  const changeSuspensions = (value: number) => {
    interacted.current = true;
    setSuspensions(Math.min(billedDays, Math.max(0, value)));
  };

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

  const announcement = interacted.current
    ? `Charged at booking: ${money(totalFare)} taka. ${totalDetail}.${
        refundDays > 0 ? ` Expected refund ${money(refundAmount)} taka.` : ""
      }`
    : "";

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <a
        href="#calculator"
        className="sr-only rounded-control bg-surface px-4 py-3 text-sm font-semibold text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
      >
        Skip to the fare calculator
      </a>

      {/* ═══════════════ Hero ═══════════════ */}
      <header className="relative isolate overflow-hidden bg-media">
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Navigation stays on one line and under 80px tall. */}
          <nav aria-label="Site" className="flex h-[72px] items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-semibold text-on-media">
              <Bus className="h-5 w-5 shrink-0 text-media-accent" aria-hidden="true" />
              <span className="hidden sm:inline">North South University Bus Fare</span>
              <span className="sm:hidden">NSU Bus Fare</span>
            </span>
            {mounted && (
              <button
                type="button"
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                aria-label={
                  resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme"
                }
                className="pressable flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-on-media/20 text-on-media hover:bg-on-media/10"
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
              <span className="inline-flex items-center gap-1.5 rounded-full bg-on-media/10 px-3 py-1 font-mono text-xs text-on-media-chip ring-1 ring-on-media/15 ring-inset">
                <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                {SEMESTER_START} to {SEMESTER_END}
              </span>
              <span className="inline-flex items-center rounded-full bg-on-media/10 px-3 py-1 font-mono text-xs text-on-media-chip ring-1 ring-on-media/15 ring-inset">
                {CHARGEABLE_DAYS} chargeable days
              </span>
            </div>

            <h1 className="rise stagger-1 mt-5 text-4xl font-semibold tracking-tight text-balance text-on-media sm:text-5xl lg:text-6xl">
              Know your bus fare before you book
            </h1>

            <p className="rise stagger-2 mt-5 max-w-xl text-lg leading-relaxed text-on-media-muted">
              Pick your days, and see what {SEMESTER_LABEL} costs and what comes
              back if a trip is cancelled.
            </p>

            <div className="rise stagger-3 mt-8">
              <a
                href="#calculator"
                className="pressable inline-flex min-h-11 items-center gap-2 rounded-control bg-accent px-6 py-3.5 text-sm font-semibold text-on-accent hover:bg-accent-hover"
              >
                Work out my fare
              </a>
            </div>
          </div>
        </div>

        {/* After the hero copy in the DOM so keyboard focus meets the
            headline and its button before the video control, matching the
            visual order; it still paints underneath. */}
        <HeroVideo />
      </header>

      {!NOTICE_PUBLISHED && (
        <div className="border-b border-line bg-caution-soft">
          <div className="mx-auto flex max-w-6xl gap-3 px-4 py-4 sm:px-6 lg:px-8">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-caution-ink" aria-hidden="true" />
            <p className="max-w-[65ch] text-sm leading-relaxed text-ink">
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

      <main id="main">
        <TicketSaleCountdowns renderedAt={renderedAt} />

        {/* ═══════════════ Calculator ═══════════════ */}
        <section
          id="calculator"
          aria-labelledby="calculator-title"
          className="mx-auto max-w-6xl scroll-mt-4 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
        >
          <Reveal>
            <h2 id="calculator-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Your fare
            </h2>
            <p className="mt-3 max-w-[60ch] leading-relaxed text-ink-body">
              Fridays are never charged. Everything else you pick is billed when
              you book.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-8 lg:grid-cols-5">
            {/* ─── Controls ─── */}
            <div ref={controlsRef} className="min-w-0 space-y-8 lg:col-span-3">
              <Reveal delay={60}>
                <fieldset>
                  <legend className="text-sm font-medium text-ink-strong">Trip type</legend>
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {TRIP_OPTIONS.map((option) => {
                      const active = tripType === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => changeTrip(option.value)}
                          aria-pressed={active}
                          className={`pressable min-h-11 min-w-0 cursor-pointer rounded-control border px-4 py-3 text-left ${
                            active
                              ? "border-accent bg-accent-soft"
                              : "border-line-control bg-surface hover:border-line-hover"
                          }`}
                        >
                          <span
                            className={`block text-sm font-semibold ${
                              active ? "text-accent-strong" : "text-ink"
                            }`}
                          >
                            {option.label}
                          </span>
                          <span className="mt-0.5 block text-xs text-ink-body">{option.hint}</span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              </Reveal>

              <Reveal delay={100}>
                <div>
                  <label htmlFor="route" className="block text-sm font-medium text-ink-strong">
                    Route
                  </label>
                  <select
                    id="route"
                    value={selectedRoute}
                    onChange={(e) => changeRoute(e.target.value)}
                    aria-describedby="route-help"
                    className="mt-2 min-h-11 w-full cursor-pointer rounded-control border border-line-control bg-surface px-3.5 py-2.5 text-sm text-ink"
                  >
                    <option value="">Select your route</option>
                    {ROUTE_LIST.map((route) => (
                      <option key={route.key} value={route.key}>
                        {route.number} {route.label}
                      </option>
                    ))}
                  </select>
                  <p id="route-help" className="mt-2 max-w-[60ch] text-xs leading-relaxed text-ink-body">
                    Your route does not change the fare.{" "}
                    {routeInfo ? (
                      <a
                        href="#routes"
                        className="-my-3 inline-flex items-center py-3 font-medium text-accent-ink underline hover:text-accent-strong"
                      >
                        See the {routeInfo.label} stops and times
                      </a>
                    ) : (
                      "Picking one shows its stops and times further down."
                    )}
                  </p>
                </div>
              </Reveal>

              {tripType !== "per-day" && (
                <Reveal delay={140}>
                  <div role="group" aria-labelledby="days-label" aria-describedby="days-help">
                    <div className="flex items-center justify-between gap-3">
                      <p id="days-label" className="text-sm font-medium text-ink-strong">
                        Days you will travel
                      </p>
                      <button
                        type="button"
                        onClick={toggleAllDays}
                        className="-my-3 -mr-2 inline-flex cursor-pointer items-center px-2 py-3 text-sm font-medium text-accent-ink hover:text-accent-strong"
                      >
                        {allDaysSelected ? "Clear all" : "Select all"}
                      </button>
                    </div>
                    <p id="days-help" className="mt-1 max-w-[60ch] text-xs leading-relaxed text-ink-body">
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
                            className={`pressable min-h-11 min-w-0 cursor-pointer rounded-control border px-2 py-2.5 ${
                              active
                                ? "border-accent bg-accent-soft"
                                : "border-line-control bg-surface hover:border-line-hover"
                            }`}
                          >
                            <span
                              className={`block text-sm font-semibold ${
                                active ? "text-accent-strong" : "text-ink-strong"
                              }`}
                            >
                              {day.short}
                            </span>
                            <span className="mt-0.5 block font-mono text-xs text-ink-body tabular-nums">
                              {weekdayCounts[day.key]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </Reveal>
              )}

              {tripType !== "per-day" && billedDays > 0 && (
                <div className="swap">
                  <div className="flex flex-wrap items-center justify-between gap-x-3">
                    <label htmlFor="suspensions" className="text-sm font-medium text-ink-strong">
                      Days you expect service to be suspended
                    </label>
                    <a
                      href={CALENDAR_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="-my-3.5 inline-flex items-center gap-1 py-3.5 text-xs font-medium text-accent-ink hover:text-accent-strong"
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
                      className="pressable flex h-11 w-11 cursor-pointer items-center justify-center rounded-control border border-line-control bg-surface text-ink-body hover:bg-sunken disabled:cursor-not-allowed disabled:opacity-40"
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
                      onChange={(e) => changeSuspensions(parseInt(e.target.value, 10) || 0)}
                      aria-describedby="suspensions-help"
                      className="h-11 w-20 rounded-control border border-line-control bg-surface text-center font-mono text-lg font-semibold text-ink tabular-nums"
                    />
                    <button
                      type="button"
                      onClick={() => changeSuspensions(suspensions + 1)}
                      disabled={suspensions >= billedDays}
                      aria-label="One more day"
                      className="pressable flex h-11 w-11 cursor-pointer items-center justify-center rounded-control border border-line-control bg-surface text-ink-body hover:bg-sunken disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                  <p id="suspensions-help" className="mt-2.5 max-w-[60ch] text-xs leading-relaxed text-ink-body">
                    Fridays are already excluded. If the bus does not run on any
                    other day, NSU sends that money back to your bank account
                    after the semester. This is your expected refund, not a
                    discount at booking.
                  </p>
                </div>
              )}
            </div>

            {/* ─── Summary ─── */}
            <div className="min-w-0 lg:col-span-2">
              <Reveal delay={80}>
                <div id="fare-summary" className="scroll-mt-4 space-y-4 lg:sticky lg:top-6">
                  <div className="overflow-hidden rounded-card border border-line bg-surface">
                    <div ref={totalRef} className="bg-inverse px-6 py-7">
                      <p className="text-sm font-medium text-on-inverse-muted">
                        {tripType === "per-day" ? "Fare per trip" : "Charged at booking"}
                      </p>
                      <p className="mt-1.5 font-mono text-4xl font-semibold tracking-tight text-on-inverse tabular-nums">
                        ৳{money(totalFare)}
                      </p>
                      <p className="mt-2 text-xs text-on-inverse-subtle">{totalDetail}</p>
                    </div>

                    {refundDays > 0 && (
                      <div className="swap divide-y divide-line-soft">
                        <div className="flex items-center justify-between px-6 py-3.5">
                          <span className="text-sm text-ink-body">Expected refund</span>
                          <span className="font-mono text-sm font-semibold text-positive tabular-nums">
                            ৳{money(refundAmount)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between px-6 py-3.5">
                          <span className="text-sm font-medium text-ink-strong">Net cost</span>
                          <span className="font-mono text-sm font-bold text-ink tabular-nums">
                            ৳{money(netFare)}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="border-t border-line-soft p-6">
                      <a
                        href={BOOKING_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        id="book-ticket-cta"
                        className="pressable flex min-h-11 items-center justify-center gap-2 rounded-control bg-cta px-5 py-3.5 text-sm font-semibold text-on-accent hover:bg-cta-hover"
                      >
                        <Ticket className="h-4 w-4" aria-hidden="true" />
                        {saleOpen ? "Book on the NSU portal" : "Open the NSU portal"}
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>

                      <div className="mt-3 space-y-2 text-xs leading-relaxed text-ink-body">
                        <p className={saleClosed ? "font-medium text-danger" : undefined}>
                          {saleNote}
                        </p>
                        {saleClosed && (
                          <button
                            type="button"
                            onClick={() => changeTrip("per-day")}
                            className="-my-3.5 inline-flex cursor-pointer items-center py-3.5 font-medium text-accent-ink underline hover:text-accent-strong"
                          >
                            Switch to pay per ticket
                          </button>
                        )}
                        {sale.note && !saleClosed && tripType !== "per-day" && <p>{sale.note}</p>}
                        <p className="flex items-start gap-1.5 font-medium text-ink-strong">
                          <CreditCard className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          Pay with {PAYMENT_METHODS} only.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={copyLink}
                        className="pressable mt-4 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-control border border-line-control px-4 py-3 text-sm font-medium text-ink-strong hover:border-line-hover hover:bg-sunken"
                      >
                        {copyState === "copied" ? (
                          <Check className="h-4 w-4 text-positive" aria-hidden="true" />
                        ) : (
                          <Link2 className="h-4 w-4" aria-hidden="true" />
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

                  <div className="rounded-card border border-line bg-surface p-6 text-sm">
                    <div className="mb-4 flex items-center gap-2.5">
                      <Info className="h-5 w-5 text-accent-ink" aria-hidden="true" />
                      <h3 className="font-semibold text-ink">{SEMESTER_LABEL} at a glance</h3>
                    </div>
                    <dl>
                      {[
                        { term: "Service period", value: `${SEMESTER_START} to ${SEMESTER_END}` },
                        { term: "Chargeable days", value: `${CHARGEABLE_DAYS} of ${TOTAL_DAYS}` },
                        { term: "Fridays excluded", value: String(FRIDAYS) },
                        { term: "One way", value: `৳${FARE_PER_TRIP}` },
                        { term: "Round trip", value: `৳${FARE_PER_TRIP * 2}` },
                      ].map((row) => (
                        <div
                          key={row.term}
                          className="flex items-baseline justify-between gap-4 border-t border-line-soft py-2.5 first:border-0 first:pt-0"
                        >
                          <dt className="text-ink-body">{row.term}</dt>
                          <dd className="text-right font-mono text-ink tabular-nums">{row.value}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-4 border-t border-line-soft pt-4 text-xs leading-relaxed text-ink-body">
                      From the {SEMESTER_LABEL} bus ticket notice issued by the
                      Office of the Registrar.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          <p aria-live="polite" aria-atomic="true" className="sr-only">
            {announcement}
          </p>
        </section>

        <RouteSchedule selectedRoute={selectedRoute} onSelectRoute={changeRoute} />

        <RefundNotice />
      </main>

      {/* ═══════════════ Footer ═══════════════ */}
      <footer className="border-t border-line py-8 pb-28 lg:pb-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span className="flex items-center gap-2 text-sm font-medium text-ink-body">
            <Bus className="h-4 w-4" aria-hidden="true" />
            North South University Bus Fare Calculator, {SEMESTER_LABEL}
          </span>
          <p className="text-xs leading-relaxed text-ink-body">
            Unofficial tool. Always check the{" "}
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent-ink underline hover:text-accent-strong"
            >
              NSU Transport portal
            </a>{" "}
            before you rely on these numbers.
          </p>
        </div>
      </footer>

      {/* ═══════════════ Phone fare bar ═══════════════ */}
      <aside
        aria-label="Running fare total"
        className="fare-bar fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface shadow-[0_-8px_24px_-12px_rgb(15_23_43/0.35)] lg:hidden"
        data-visible={barVisible}
        inert={!barVisible}
        aria-hidden={!barVisible}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
          <div className="min-w-0">
            <p className="text-xs text-ink-body">
              {tripType === "per-day" ? "Fare per trip" : "Charged at booking"}
            </p>
            <p className="font-mono text-xl font-semibold text-ink tabular-nums">
              ৳{money(totalFare)}
            </p>
          </div>
          <div className="min-w-0 text-right">
            <p className="text-xs text-ink-body">
              {tripType === "per-day"
                ? "Bought on the day"
                : billedDays > 0
                  ? `${billedDays} days${refundDays > 0 ? `, ৳${money(refundAmount)} back` : ""}`
                  : "No days picked yet"}
            </p>
            <a
              href="#fare-summary"
              className="inline-flex items-center py-3 text-sm font-semibold text-accent-ink underline"
            >
              See breakdown
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}
