/* Search and sharing copy, plus the FAQ. The FAQ is rendered on the page
   and in the JSON-LD from this one list, so the two can never disagree,
   and every answer is built from the semester and route data rather
   than typed as separate facts. */

import { ARRIVALS, ROUTES, ROUTE_LIST } from "./routes";
import {
  BOOKING_URL,
  CHARGEABLE_DAYS,
  FARE_PER_TRIP,
  PAYMENT_METHODS,
  SEMESTER_END,
  SEMESTER_LABEL,
  SEMESTER_START,
  TICKET_SALES,
  TOTAL_DAYS,
} from "./semester";

/* The canonical address. No trailing slash; build absolute URLs with
   `new URL(path, SITE_URL)`. A self-hosted copy keeps pointing its
   canonical, sitemap and structured data here, so search engines treat
   the Vercel address as the one real page. Set NEXT_PUBLIC_SITE_URL at
   build time only if another address should become the canonical one. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://nsu-bus-fare-calculator.vercel.app"
).replace(/\/$/, "");
export const SITE_NAME = "NSU Bus Fare Calculator";

/* 51 characters. Leads with the terms people search ("NSU", "student
   bus", "fare", "routes") and keeps the semester for freshness. It avoids
   a "| North South University" suffix, which would read as the
   university's own site. */
export const SEO_TITLE = `NSU Student Bus Fare Calculator & Routes, ${SEMESTER_LABEL}`;

/* 149 characters, under Google's ~155 character snippet width. */
export const SEO_DESCRIPTION = `Free NSU student bus fare calculator for ${SEMESTER_LABEL}: Tk ${FARE_PER_TRIP} one way, Tk ${
  FARE_PER_TRIP * 2
} round trip. All 6 North South University bus routes, stops and trip times.`;

const listJoin = (items: string[]) =>
  items.length <= 1
    ? items.join("")
    : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

const taka = (n: number) => `Tk ${n.toLocaleString("en-US")}`;

const routeNames = ROUTE_LIST.map((r) => r.label);

const routesDepartingAt = (time: string) =>
  ROUTE_LIST.filter((r) => ROUTES[r.key].departures.includes(time)).map((r) => r.label);

const departuresForAll = ["11:20 AM", "2:40 PM"].filter(
  (t) => routesDepartingAt(t).length === ROUTE_LIST.length
);

const stopCounts = ROUTE_LIST.map((r) => ROUTES[r.key].pickups.length);

/* First stop per route. When it is named after the route itself
   ("Mohammadpur (Japan Garden City)"), use the landmark instead. */
const exampleStops = ROUTE_LIST.map((r) => {
  const [place, landmark] = ROUTES[r.key].pickups[0].point.split(" (");
  return place === r.label && landmark ? landmark.replace(/\)$/, "") : place;
});

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    question: "How much is the NSU student bus fare?",
    answer: `For ${SEMESTER_LABEL}, a one way trip costs ${taka(FARE_PER_TRIP)} and a round trip costs ${taka(
      FARE_PER_TRIP * 2
    )} a day, on every route. When you book for the semester you pay up front for every day you pick, and Fridays are never charged. A round trip on all ${CHARGEABLE_DAYS} chargeable days comes to ${taka(
      FARE_PER_TRIP * 2 * CHARGEABLE_DAYS
    )}.`,
  },
  {
    question: "How do I pay for an NSU bus ticket?",
    answer: `Buy tickets on the NSU Transport portal (${BOOKING_URL.replace(
      /^https:\/\/|\/$/g,
      ""
    )}) and pay with ${PAYMENT_METHODS}. No other payment method is accepted.`,
  },
  {
    question: `When can I buy ${SEMESTER_LABEL} NSU bus tickets?`,
    answer: `Round trip tickets are on sale ${TICKET_SALES.round.window}. One way tickets are on sale ${TICKET_SALES["one-way"].window}, if seats are still available. After that you can pay per ticket at least an hour before a trip, again only if seats are available.`,
  },
  {
    question: `When does the NSU bus service run in ${SEMESTER_LABEL}?`,
    answer: `From ${SEMESTER_START} to ${SEMESTER_END}, the last day of final exams. That is ${TOTAL_DAYS} days, of which ${CHARGEABLE_DAYS} are chargeable because Fridays are excluded.`,
  },
  {
    question: "Which areas do NSU student buses cover?",
    answer: `There are ${ROUTE_LIST.length} routes: ${listJoin(
      routeNames
    )}. Each picks students up at ${Math.min(...stopCounts)} to ${Math.max(
      ...stopCounts
    )} stops on the way to the Bashundhara campus. The first stops are ${listJoin(
      exampleStops.map((stop, i) => `${stop} (${routeNames[i]})`)
    )}.`,
  },
  {
    question: "What time does the NSU bus reach campus and leave?",
    answer: `Every route reaches NSU at ${listJoin(ARRIVALS)}. Buses leave NSU at ${listJoin(
      departuresForAll
    )} on all routes, at 6:30 PM for ${listJoin(
      routesDepartingAt("6:30 PM")
    )}, and at 10:20 PM for ${listJoin(routesDepartingAt("10:20 PM"))} only.`,
  },
  {
    question: "Do I get money back if the bus does not run?",
    answer:
      "Yes. If the service is suspended on any day other than a Friday, NSU refunds that day after the semester ends. Refunds are paid into a bank account only, never to bKash, even if you paid for the ticket with bKash.",
  },
  {
    question: "Is this the official NSU transport website?",
    answer:
      "No. This is an unofficial calculator built from the notices North South University publishes. Always confirm routes, times and fares on the NSU Transport portal before you rely on them.",
  },
];
