"use client";

import {
  CalendarClock,
  CircleCheck,
  CircleSlash,
  MoonStar,
} from "lucide-react";
import {
  TICKET_SALES,
  getSaleStatus,
  type SaleState,
  type TripType,
} from "../lib/semester";
import { useNow } from "../lib/useNow";
import { Reveal } from "./Reveal";

const CARDS: { type: TripType; title: string }[] = [
  { type: "round", title: "Round trip tickets" },
  { type: "one-way", title: "One way tickets" },
];

/* Status is carried by an icon and a word as well as colour. */
const BADGES: Record<
  SaleState,
  { label: string; icon: typeof CalendarClock; className: string }
> = {
  upcoming: {
    label: "Not open yet",
    icon: CalendarClock,
    className: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  },
  open: {
    label: "On sale now",
    icon: CircleCheck,
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
  paused: {
    label: "Paused until 10 AM",
    icon: MoonStar,
    className: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  },
  closed: {
    label: "Sale closed",
    icon: CircleSlash,
    className: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
};

const UNITS = ["days", "hours", "min", "sec"] as const;

function splitDuration(ms: number): number[] {
  const total = Math.max(0, Math.floor(ms / 1000));
  return [
    Math.floor(total / 86_400),
    Math.floor((total % 86_400) / 3_600),
    Math.floor((total % 3_600) / 60),
    total % 60,
  ];
}

/* Two live countdowns, one per ticket sale.

   The digits tick every second, so they do not animate: motion on
   something that changes this often reads as noise. Figures are tabular
   so the width never jumps between ticks. */
export function TicketSaleCountdowns() {
  const now = useNow(1_000);

  return (
    <section
      id="ticket-sale"
      className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50">
            Ticket sale
          </h2>
          <p className="mt-3 max-w-[65ch] leading-relaxed text-slate-600 dark:text-slate-300">
            Round trip and one way tickets go on sale separately on the NSU
            Transport portal. All times are Bangladesh time.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {CARDS.map((card, index) => (
            <Reveal key={card.type} delay={60 + index * 60}>
              <SaleCard type={card.type} title={card.title} now={now} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={180}>
          <p className="mt-6 max-w-[65ch] text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Missed both? You can still pay per ticket at least an hour before a
            trip, if seats are available.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function SaleCard({
  type,
  title,
  now,
}: {
  type: TripType;
  title: string;
  now: number | null;
}) {
  const sale = TICKET_SALES[type];
  const status =
    now !== null && sale.sessions ? getSaleStatus(sale.sessions, now) : null;
  const badge = status ? BADGES[status.state] : null;
  const parts =
    status?.target != null && now !== null ? splitDuration(status.target - now) : null;

  const caption = !status
    ? ""
    : status.state === "upcoming"
      ? "until the sale opens"
      : status.state === "paused"
        ? "until the sale reopens"
        : status.state === "open"
          ? status.lastDay
            ? "until the sale closes for good"
            : "until today's sale closes"
          : "";

  const spoken = parts
    ? `${title}: ${parts[0]} days, ${parts[1]} hours, ${parts[2]} minutes ${caption}`
    : `${title}: ${badge?.label ?? "loading"}`;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h3>
        {badge && (
          <span
            className={`swap inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${badge.className}`}
          >
            <badge.icon className="h-3.5 w-3.5" aria-hidden="true" />
            {badge.label}
          </span>
        )}
      </div>

      {status?.state === "closed" ? (
        <p className="swap mt-5 flex min-h-[92px] items-center rounded-[10px] bg-slate-50 px-4 text-sm leading-relaxed text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
          This sale has ended. Check the portal in case seats were released.
        </p>
      ) : (
        <div
          role="timer"
          aria-label={spoken}
          className="mt-5 grid grid-cols-4 gap-2"
        >
          {UNITS.map((unit, i) => (
            <div
              key={unit}
              className="rounded-[10px] bg-slate-50 px-2 py-3 text-center dark:bg-slate-800/60"
            >
              <span
                className="block font-mono text-2xl font-semibold text-slate-900 tabular-nums sm:text-3xl dark:text-slate-50"
                aria-hidden="true"
              >
                {parts ? String(parts[i]).padStart(2, "0") : "--"}
              </span>
              <span
                className="mt-1 block text-xs text-slate-500 dark:text-slate-400"
                aria-hidden="true"
              >
                {unit}
              </span>
            </div>
          ))}
        </div>
      )}

      <p className="mt-2 min-h-5 text-xs text-slate-500 dark:text-slate-400">
        {caption}
      </p>

      <p className="mt-4 border-t border-slate-100 pt-4 text-sm text-slate-700 dark:border-slate-800 dark:text-slate-200">
        {sale.window}
      </p>
      {sale.note && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {sale.note}
        </p>
      )}
    </div>
  );
}
