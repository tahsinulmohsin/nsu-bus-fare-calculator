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

/* Round trip and one way tickets go on sale in two different windows,
   and a pay per ticket trip is bought on the day. */
export interface TicketSale {
  window: string;
  /* When the window closes, for the countdown. Pay per ticket has no
     fixed deadline, so it has none. */
  deadlineISO?: string;
  note?: string;
}

export const TICKET_SALES: Record<TripType, TicketSale> = {
  round: {
    window: "28 to 29 September 2026, 10:00 AM to 4:00 PM",
    deadlineISO: "2026-09-29T16:00:00+06:00",
  },
  "one-way": {
    window: "30 September to 1 October 2026, 10:00 AM to 4:00 PM",
    deadlineISO: "2026-10-01T16:00:00+06:00",
    note: "Sold only if seats are still available.",
  },
  "per-day": {
    window: "Buy at least 1 hour before the trip starts",
    note: "Sold only if seats are still available.",
  },
};

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
  formUrl: "https://forms.gle/X6GfZJgXwmL5SmjC6",
  formDeadline: "15 September 2026",
  formDeadlineISO: "2026-09-15T23:59:59+06:00",
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
  contacts: [
    {
      issue: "Cannot open the form even though you bought a ticket",
      person: "Md. Shah Alam Amin",
      role: "Administrative Officer, Department of Administration",
    },
    {
      issue: "Refund has not arrived by the payout date",
      person: "Mostafizur Rahman Chowdhury",
      role: "Accounts Officer, Department of Finance and Accounts",
    },
  ],
} as const;
