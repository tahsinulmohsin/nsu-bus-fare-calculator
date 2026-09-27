"use client";

import Image from "next/image";
import { CreditCard } from "lucide-react";
import nsuSeal from "../assets/nsu-seal.png";
import {
  BOOKING_URL,
  PAYMENT_METHODS,
  SEMESTER_LABEL,
  SEMESTER_START_DATE,
  TICKET_SALES,
  allSalesClosed,
  bdTileParts,
  formatBdDateTime,
  formatBdTime,
  getSaleStatus,
  type SaleState,
  type TripType,
} from "../lib/semester";
import { useNow } from "../lib/useNow";
import { ArrowLink, DateTile, NoticeBar, Tag } from "./ui";

const SALE_ROWS: { type: TripType; title: string }[] = [
  { type: "round", title: "Round trip tickets" },
  { type: "one-way", title: "One way tickets" },
];

/* Status is carried by a word as well as the tag and tile colour. */
const TAGS: Record<SaleState, string> = {
  upcoming: "Upcoming",
  open: "On sale now",
  paused: "Paused overnight",
  closed: "Sale closed",
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/* Built from the local date parts on purpose, so the server and the
   browser agree whatever the visitor's time zone. */
const serviceStartTile = {
  day: String(SEMESTER_START_DATE.getDate()),
  month: `${MONTHS[SEMESTER_START_DATE.getMonth()]} ${String(SEMESTER_START_DATE.getFullYear()).slice(2)}`,
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

/* The ticket sale, set out as northsouth.edu sets out its notices: a
   photo card on the left, and on the right a board under a cyan NOTICE
   bar whose rows each lead with a date tile.

   The rows are live. Each tile shows the day the countdown is running
   to, turns navy while that sale is open and greys out once it closes,
   and the yellow tag names the state in words.

   `renderedAt` is when the server rendered the page. It decides the
   state that ships in the HTML, so nothing jumps after load; the ticking
   digits appear once the browser knows the real time. */
export function TicketSaleCountdowns({ renderedAt }: { renderedAt: number }) {
  const live = useNow(1_000);
  const now = live ?? renderedAt;

  if (allSalesClosed(now)) {
    return (
      <section id="ticket-sale" aria-labelledby="ticket-sale-title" className="bg-canvas py-10 sm:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-card bg-surface shadow-card ring-1 ring-line">
            <NoticeBar>Notice</NoticeBar>
            <div className="flex gap-4 px-5 py-5 sm:px-6">
              <DateTile {...serviceStartTile} />
              <div className="min-w-0">
                <h2 id="ticket-sale-title" className="text-lg font-bold text-heading">
                  Round trip and one way ticket sales have closed
                </h2>
                <p className="mt-1 max-w-[60ch] text-sm leading-relaxed text-ink-body">
                  You can still pay per ticket at least an hour before a trip,
                  if seats are available. Pay with {PAYMENT_METHODS} only.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="ticket-sale" aria-labelledby="ticket-sale-title" className="scroll-mt-4 bg-canvas py-14 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
        {/* ─── Photo card ─── */}
        <div className="relative isolate overflow-hidden rounded-card bg-media lg:col-span-5">
          <Image
            src="/video/hero-poster.webp"
            alt=""
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="-z-10 object-cover"
          />
          <div
            className="absolute inset-0 -z-10 bg-gradient-to-b from-media/95 via-media/80 to-utility/70"
            aria-hidden="true"
          />
          <div className="flex h-full flex-col p-6 sm:p-8">
            <Image
              src={nsuSeal}
              alt="North South University seal"
              sizes="48px"
              className="mb-5 h-12 w-auto self-start"
            />
            <h2
              id="ticket-sale-title"
              className="text-2xl font-bold tracking-tight text-balance text-on-media sm:text-3xl"
            >
              {SEMESTER_LABEL} bus tickets
            </h2>
            <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-on-media-muted sm:text-base">
              Round trip and one way tickets sell in separate windows on the
              NSU Transport portal. Every time on this board is Bangladesh
              time.
            </p>

            <div className="mt-6 rounded-card border border-on-media/15 bg-media/60 p-5 lg:mt-auto">
              <p className="flex items-start gap-2 text-sm font-semibold text-on-media">
                <CreditCard className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                Pay with {PAYMENT_METHODS} only.
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-on-media-muted">
                Missed both sales? Pay per ticket at least an hour before a
                trip, if seats are available.
              </p>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="pressable mt-4 flex min-h-12 items-center justify-center bg-notice px-5 text-sm font-semibold text-on-notice hover:bg-notice-hover"
              >
                Open the NSU Transport portal
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </div>
        </div>

        {/* ─── Notice board ─── */}
        <div className="flex flex-col overflow-hidden rounded-card bg-surface shadow-card ring-1 ring-line lg:col-span-7">
          <NoticeBar>Ticket sale notice</NoticeBar>
          <ul className="divide-y divide-line-soft">
            {SALE_ROWS.map((row) => (
              <SaleRow key={row.type} type={row.type} title={row.title} now={now} live={live} />
            ))}
            <li className="flex gap-4 bg-sunken/60 px-5 py-5 sm:px-6">
              <DateTile {...serviceStartTile} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <h3 className="text-lg font-bold text-heading">Pay per ticket</h3>
                  <Tag tone="muted">From the first day</Tag>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-ink-body">
                  {TICKET_SALES["per-day"].window}, from the first day of
                  service. {TICKET_SALES["per-day"].note}
                </p>
              </div>
            </li>
          </ul>
          <div className="mt-auto flex justify-center border-t border-line-soft px-5 py-4">
            <ArrowLink href="#calculator">Work out what you will pay</ArrowLink>
          </div>
        </div>
      </div>
    </section>
  );
}

function SaleRow({
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
  const sessions = sale.sessions!;
  const status = getSaleStatus(sessions, now);
  const parts =
    live !== null && status.target !== null ? splitDuration(status.target - live) : null;

  const tile = bdTileParts(status.target ?? Date.parse(sessions[sessions.length - 1].closes));
  const tone = status.state === "open" ? "active" : status.state === "closed" ? "muted" : "default";

  const caption =
    status.state === "upcoming"
      ? `until the sale opens on ${formatBdDateTime(status.target!)}`
      : status.state === "paused"
        ? `until the sale reopens on ${formatBdDateTime(status.target!)}`
        : status.state === "open"
          ? status.lastDay
            ? `until the sale closes for good at ${formatBdTime(status.target!)}`
            : `until today's sale closes at ${formatBdTime(status.target!)}`
          : "";

  const spoken = parts
    ? `${title}: ${parts[0]} days, ${parts[1]} hours, ${parts[2]} minutes ${caption}`
    : `${title}: ${TAGS[status.state]}`;

  return (
    <li className={`flex gap-4 px-5 py-5 sm:px-6 ${status.state === "open" ? "bg-accent-soft" : ""}`}>
      <DateTile {...tile} tone={tone} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <h3 className="text-lg font-bold text-heading">{title}</h3>
          <Tag tone={status.state === "closed" ? "muted" : "yellow"}>{TAGS[status.state]}</Tag>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-ink-body">{sale.window}</p>

        {status.state === "closed" ? (
          <p className="mt-2 text-sm leading-relaxed text-ink-body">
            This sale has ended. Check the portal in case seats were released.
          </p>
        ) : (
          <div className="mt-2.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <div
              role="timer"
              aria-label={spoken}
              className="flex items-baseline gap-x-2.5 tabular-nums"
            >
              {UNITS.map((unit, i) => (
                <span key={unit.short} className="flex items-baseline" aria-hidden="true">
                  <span className="text-2xl font-bold text-ink">
                    {parts ? String(parts[i]).padStart(2, "0") : "--"}
                  </span>
                  <span className="ml-0.5 text-sm font-medium text-ink-muted">{unit.short}</span>
                </span>
              ))}
            </div>
            <p className="text-xs text-ink-muted">{caption}</p>
          </div>
        )}
        {sale.note && status.state !== "closed" && (
          <p className="mt-1.5 text-xs text-ink-muted">{sale.note}</p>
        )}
      </div>
    </li>
  );
}
