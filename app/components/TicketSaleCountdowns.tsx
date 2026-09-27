"use client";

import {
  CalendarClock,
  CircleCheck,
  CircleSlash,
  CreditCard,
  MoonStar,
} from "lucide-react";
import {
  PAYMENT_METHODS,
  TICKET_SALES,
  allSalesClosed,
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
    className: "bg-accent-soft text-accent-strong",
  },
  open: {
    label: "On sale now",
    icon: CircleCheck,
    className: "bg-positive-soft text-positive-ink",
  },
  paused: {
    label: "Paused until 10 AM",
    icon: MoonStar,
    className: "bg-caution-soft text-caution-ink",
  },
  closed: {
    label: "Sale closed",
    icon: CircleSlash,
    className: "bg-neutral-soft text-neutral-ink",
  },
};

const UNITS = [
  { short: "d", long: "days" },
  { short: "h", long: "hours" },
  { short: "m", long: "minutes" },
  { short: "s", long: "seconds" },
];

function splitDuration(ms: number): number[] {
  const total = Math.max(0, Math.floor(ms / 1000));
  return [
    Math.floor(total / 86_400),
    Math.floor((total % 86_400) / 3_600),
    Math.floor((total % 3_600) / 60),
    total % 60,
  ];
}

/* A live countdown for each ticket sale, kept to a slim band so the
   calculator is still close to the top on a phone. Once both sales are
   over it shrinks to a single line pointing at pay per ticket.

   `renderedAt` is when the server rendered the page. It decides which
   layout ships in the HTML, so the band does not jump after load; the
   ticking digits only appear once the browser knows the real time. */
export function TicketSaleCountdowns({ renderedAt }: { renderedAt: number }) {
  const live = useNow(1_000);
  const now = live ?? renderedAt;

  if (allSalesClosed(now)) {
    return (
      <section
        id="ticket-sale"
        aria-labelledby="ticket-sale-title"
        className="border-b border-line bg-band"
      >
        <div className="mx-auto flex max-w-6xl gap-3 px-4 py-6 sm:px-6 lg:px-8">
          <CircleSlash
            className="mt-0.5 h-5 w-5 shrink-0 text-ink-muted"
            aria-hidden="true"
          />
          <div>
            <h2 id="ticket-sale-title" className="font-semibold text-ink">
              Round trip and one way ticket sales have closed
            </h2>
            <p className="mt-1 max-w-[60ch] text-sm leading-relaxed text-ink-body">
              You can still pay per ticket at least an hour before a trip, if
              seats are available. Pay with {PAYMENT_METHODS}.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="ticket-sale"
      aria-labelledby="ticket-sale-title"
      className="border-b border-line bg-band"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h2
              id="ticket-sale-title"
              className="text-xl font-semibold tracking-tight text-ink sm:text-2xl"
            >
              Ticket sale
            </h2>
            <p className="text-sm text-ink-body">
              Times are Bangladesh time.
            </p>
          </div>
        </Reveal>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {CARDS.map((card, index) => (
            <Reveal key={card.type} delay={60 + index * 60}>
              <SaleCard type={card.type} title={card.title} now={now} live={live} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={180}>
          <div className="mt-4 flex flex-col gap-2 text-sm leading-relaxed text-ink-body sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <p className="flex max-w-[60ch] items-start gap-2 font-medium text-ink-strong">
              <CreditCard
                className="mt-0.5 h-4 w-4 shrink-0 text-accent-ink"
                aria-hidden="true"
              />
              Pay with {PAYMENT_METHODS} only.
            </p>
            <p className="max-w-[60ch]">
              Missed both? Pay per ticket at least an hour before a trip, if
              seats are available.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function SaleCard({
  type,
  title,
  now,
  live,
}: {
  type: TripType;
  title: string;
  now: number;
  live: number | null;
}) {
  const sale = TICKET_SALES[type];
  const status = getSaleStatus(sale.sessions!, now);
  const badge = BADGES[status.state];
  const parts =
    live !== null && status.target !== null ? splitDuration(status.target - live) : null;

  const caption =
    status.state === "upcoming"
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
    : `${title}: ${badge.label}`;

  return (
    <div className="flex h-full flex-col rounded-card border border-line bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${badge.className}`}
        >
          <badge.icon className="h-3.5 w-3.5" aria-hidden="true" />
          {badge.label}
        </span>
      </div>

      {status.state === "closed" ? (
        <p className="mt-3 text-sm leading-relaxed text-ink-body">
          This sale has ended. Check the portal in case seats were released.
        </p>
      ) : (
        <>
          <div
            role="timer"
            aria-label={spoken}
            className="mt-3 flex flex-wrap items-baseline gap-x-3 font-mono tabular-nums"
          >
            {UNITS.map((unit, i) => (
              <span key={unit.short} className="flex items-baseline" aria-hidden="true">
                <span className="text-3xl font-semibold text-ink">
                  {parts ? String(parts[i]).padStart(2, "0") : "--"}
                </span>
                <span className="ml-0.5 text-sm text-ink-muted">{unit.short}</span>
              </span>
            ))}
          </div>
          <p className="mt-1 text-xs text-ink-muted">{caption}</p>
        </>
      )}

      <p className="mt-auto pt-3 text-sm text-ink-strong">{sale.window}</p>
      {sale.note && <p className="mt-0.5 text-xs text-ink-muted">{sale.note}</p>}
    </div>
  );
}
