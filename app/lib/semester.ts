/* ═══════════════════════════════════════════════════════════════
   Semester configuration and NSU bus service data.

   Source: "Sale of NSU Students' Bus Ticket - Fall 2026", Office of the
   Registrar. Service period, ticket prices and both ticket sale windows
   below are quoted from that notice.

   ─── UPDATING FOR A NEW SEMESTER ───
   Edit the values in this file only. Every day count is derived from
   the dates, so the numbers shown in the UI can never drift out of sync
   with the configured range.
   ═══════════════════════════════════════════════════════════════ */

export const SEMESTER_LABEL = "Fall 2026";

/* The official Fall 2026 notice is out, so nothing here is provisional. */
export const NOTICE_PUBLISHED = true;

export const SEMESTER_START = "October 3, 2026";
export const SEMESTER_END = "December 28, 2026";
export const SEMESTER_START_DATE = new Date(2026, 9, 3); // months are 0-indexed
export const SEMESTER_END_DATE = new Date(2026, 11, 28);

export const FARE_PER_TRIP = 100; // BDT per direction, per day

/* How tickets are paid for. Refunds go the other way and are bank
   transfer only (see REFUND), so the two are always stated separately. */
export const PAYMENT_METHODS = "bKash or a bank card";

/* Round trip and one way tickets go on sale in two different windows,
   and a pay per ticket trip is bought on the day. */
/* The notice gives each sale as a date range with 10:00 AM to 4:00 PM
   hours. That is read as those hours on each day, so the sale pauses
   overnight and the countdown targets whichever boundary comes next. */
export interface SaleSession {
  opens: string; // ISO timestamp, Bangladesh time
  closes: string;
}

export interface TicketSale {
  window: string;
  /* Pay per ticket is bought on the day, so it has no sessions. */
  sessions?: SaleSession[];
  note?: string;
}

export const TICKET_SALES: Record<TripType, TicketSale> = {
  round: {
    window: "28 to 29 September 2026, 10:00 AM to 4:00 PM each day",
    sessions: [
      { opens: "2026-09-28T10:00:00+06:00", closes: "2026-09-28T16:00:00+06:00" },
      { opens: "2026-09-29T10:00:00+06:00", closes: "2026-09-29T16:00:00+06:00" },
    ],
  },
  "one-way": {
    window: "30 September to 1 October 2026, 10:00 AM to 4:00 PM each day",
    sessions: [
      { opens: "2026-09-30T10:00:00+06:00", closes: "2026-09-30T16:00:00+06:00" },
      { opens: "2026-10-01T10:00:00+06:00", closes: "2026-10-01T16:00:00+06:00" },
    ],
    note: "Sold only if seats are still available.",
  },
  "per-day": {
    window: "Buy at least 1 hour before the trip starts",
    note: "Sold only if seats are still available.",
  },
};

export type SaleState = "upcoming" | "open" | "paused" | "closed";

export interface SaleStatus {
  state: SaleState;
  /* Timestamp the countdown runs to, or null once the sale is over. */
  target: number | null;
  /* True while the final day's session is open. */
  lastDay: boolean;
}

export function getSaleStatus(sessions: SaleSession[], now: number): SaleStatus {
  for (let i = 0; i < sessions.length; i++) {
    const opens = Date.parse(sessions[i].opens);
    const closes = Date.parse(sessions[i].closes);
    const lastDay = i === sessions.length - 1;
    if (now < opens) {
      return { state: i === 0 ? "upcoming" : "paused", target: opens, lastDay };
    }
    if (now < closes) return { state: "open", target: closes, lastDay };
  }
  return { state: "closed", target: null, lastDay: true };
}

/* True once both the round trip and one way sales are over. */
export function allSalesClosed(now: number): boolean {
  return (["round", "one-way"] as const).every(
    (type) => getSaleStatus(TICKET_SALES[type].sessions!, now).state === "closed"
  );
}

/* Dates and times are always shown in Bangladesh time, whatever the
   visitor's device is set to, because that is what the notice uses. */
function bdParts(ms: number) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Dhaka",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).formatToParts(ms);
  return Object.fromEntries(parts.map((p) => [p.type, p.value]));
}

/* "4:00 PM" */
export function formatBdTime(ms: number): string {
  const p = bdParts(ms);
  return `${p.hour}:${p.minute} ${p.dayPeriod}`;
}

/* "28 Sep at 10:00 AM" */
export function formatBdDateTime(ms: number): string {
  const p = bdParts(ms);
  return `${p.day} ${p.month} at ${p.hour}:${p.minute} ${p.dayPeriod}`;
}

/* Parts for a notice date tile: { day: "28", month: "Sep 26" }. */
export function bdTileParts(ms: number): { day: string; month: string } {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Dhaka",
      day: "numeric",
      month: "short",
      year: "2-digit",
    })
      .formatToParts(ms)
      .map((p) => [p.type, p.value])
  );
  return { day: parts.day, month: `${parts.month} ${parts.year}` };
}

export const BOOKING_URL = "https://transport.northsouth.edu/";
export const CALENDAR_URL = "https://www.northsouth.edu/academic/academic-calendar/";

/* ─── Derived day counts. Do not hand-edit. ─── */
const MS_PER_DAY = 86_400_000;

export function countDaysInRange(start: Date, end: Date): number {
  return Math.floor((end.getTime() - start.getTime()) / MS_PER_DAY) + 1;
}

export function countWeekdayInRange(
  weekday: number,
  start: Date,
  end: Date
): number {
  const totalDays = countDaysInRange(start, end);
  const offset = ((weekday - start.getDay()) % 7 + 7) % 7;
  if (offset >= totalDays) return 0;
  return Math.floor((totalDays - offset - 1) / 7) + 1;
}

export const TOTAL_DAYS = countDaysInRange(SEMESTER_START_DATE, SEMESTER_END_DATE);
export const FRIDAYS = countWeekdayInRange(5, SEMESTER_START_DATE, SEMESTER_END_DATE);
export const CHARGEABLE_DAYS = TOTAL_DAYS - FRIDAYS;

/* ─── NSU week runs Saturday to Thursday. Friday is never charged. ─── */
export const WEEKDAYS = [
  { key: 6, short: "Sat", full: "Saturday" },
  { key: 0, short: "Sun", full: "Sunday" },
  { key: 1, short: "Mon", full: "Monday" },
  { key: 2, short: "Tue", full: "Tuesday" },
  { key: 3, short: "Wed", full: "Wednesday" },
  { key: 4, short: "Thu", full: "Thursday" },
] as const;

export const TRIP_LABELS = ["Morning", "Afternoon", "Evening"];

export type TripType = "round" | "one-way" | "per-day";

/* ═══════════════════════════════════════════════════════════════
   Summer 2026 fare refund (official notice from the NSU Registrar)
   ═══════════════════════════════════════════════════════════════ */
export const REFUND = {
  semester: "Summer 2026",
  formDeadline: "15 September 2026",
  payoutBy: "26 September 2026",
  suspendedDays: [
    { date: "12 and 13 July 2026", reason: "Heavy rainfall" },
    {
      date: "1 August 2026",
      reason: "Admission Test. The 10:20 PM trip still ran.",
    },
    { date: "5 August 2026", reason: "July Uprising Day" },
    {
      date: "26 August 2026",
      reason: "Government holiday for Eid-e-Miladunnabi",
    },
  ],
  /* The claim form has closed. Anyone whose refund has not arrived is
     directed to the Accounts Officer, per the Registrar's notice. */
  accountsContact: {
    person: "Mostafizur Rahman Chowdhury",
    role: "Accounts Officer, Department of Finance and Accounts",
  },
} as const;
