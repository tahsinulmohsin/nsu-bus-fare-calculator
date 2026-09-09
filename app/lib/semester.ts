/* ═══════════════════════════════════════════════════════════════
   Semester configuration and NSU bus service data.

   ─── UPDATING FOR A NEW SEMESTER ───
   Edit the values in this file only. Every day count is derived
   from the dates, so the numbers shown in the UI can never drift
   out of sync with the configured range.

   How the Fall 2026 dates are derived (NSU Academic Calendar,
   tentative, published 31 Aug 2026):
   • Bus service starts on the first Saturday AFTER the last day of
     course drop with 100% refund. For Fall 2026 that deadline is
     Mon 28 Sep 2026, so service begins Sat 3 Oct 2026. The same
     rule reproduces the Summer 2026 dates exactly (drop deadline
     Tue 16 Jun 2026, service start Sat 20 Jun 2026).
   • Service runs through the last day of final exams, Mon 28 Dec 2026.
   • Booking opens on the drop deadline and closes the next day at
     4:00 PM.

   IMPORTANT: NSU has not published the official Fall 2026 bus
   service notice yet. Everything below marked PROVISIONAL is
   derived from the academic calendar and the Summer 2026 pattern,
   not from an official transport notice. Replace it as soon as the
   notice is out.
   ═══════════════════════════════════════════════════════════════ */

export const SEMESTER_LABEL = "Fall 2026";

/* PROVISIONAL until the official notice is published. */
export const NOTICE_PUBLISHED = false;

export const SEMESTER_START = "October 3, 2026";
export const SEMESTER_END = "December 28, 2026";
export const SEMESTER_START_DATE = new Date(2026, 9, 3); // months are 0-indexed
export const SEMESTER_END_DATE = new Date(2026, 11, 28);

/* PROVISIONAL booking window. Confirm on the NSU Transport portal. */
export const BOOKING_WINDOW =
  "28 September 2026 to 29 September 2026, 10:00 AM to 4:00 PM";
export const BOOKING_DEADLINE_ISO = "2026-09-29T16:00:00+06:00"; // 4:00 PM Bangladesh time

export const FARE_PER_TRIP = 100; // BDT per direction, per day

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
