import Image from "next/image";
import busPhoto from "../assets/nsu-student-bus.jpg";
import { ARRIVALS, ROUTE_LIST } from "../lib/routes";
import {
  BOOKING_URL,
  FARE_PER_TRIP,
  PAYMENT_METHODS,
  SEMESTER_END,
  SEMESTER_LABEL,
  SEMESTER_START,
} from "../lib/semester";

const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
const inWords = (n: number) => WORDS[n] ?? String(n);

const listJoin = (items: string[]) =>
  `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

/* A plain-language description of the service, rendered on the server.
   It answers what a first-time visitor (and a search engine) needs before
   the numbers mean anything: who runs the bus, where it goes, what it
   costs and how paying works. */
export function AboutBusService() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="border-t border-line py-16 sm:py-20"
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:items-center lg:gap-12 lg:px-8">
        <div className="min-w-0 lg:col-span-7">
          <h2 id="about-title" className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            How the NSU student bus works
          </h2>
          <div className="mt-5 max-w-[60ch] space-y-4 leading-relaxed text-ink-body">
            <p>
              North South University runs a student bus service on{" "}
              {inWords(ROUTE_LIST.length)} routes across Dhaka:{" "}
              {listJoin(ROUTE_LIST.map((r) => r.label))}. For {SEMESTER_LABEL} the
              buses run from {SEMESTER_START} to {SEMESTER_END}, the last day of
              final exams. Every route reaches the Bashundhara campus at{" "}
              {listJoin(ARRIVALS)}, and buses head back at 11:20 AM and 2:40 PM,
              with later trips on some routes.
            </p>
            <p>
              Tickets are sold on the{" "}
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent-ink underline hover:text-accent-strong"
              >
                NSU Transport portal
              </a>{" "}
              and paid with {PAYMENT_METHODS} only. A one way trip costs Tk{" "}
              {FARE_PER_TRIP} and a round trip Tk {FARE_PER_TRIP * 2} a day.
              Booking for the semester means paying up front for every day you
              pick, except Fridays. If the service is suspended on
              another day, NSU refunds that day to your bank account after the
              semester.
            </p>
            <p>
              The calculator above does that sum: pick your trip type and days,
              then add any days you expect the bus not to run to see what comes
              back.{" "}
              <a
                href="#routes"
                className="font-medium text-accent-ink underline hover:text-accent-strong"
              >
                Stops and times
              </a>{" "}
              and{" "}
              <a
                href="#faq"
                className="font-medium text-accent-ink underline hover:text-accent-strong"
              >
                common questions
              </a>{" "}
              follow below.
            </p>
          </div>
        </div>

        {/* The source is a 480x640 thumbnail, so it is capped at 24rem wide
            to stay reasonably sharp on high-density screens. */}
        <figure className="w-full max-w-sm lg:col-span-5 lg:justify-self-end">
          <Image
            src={busPhoto}
            alt="A white North South University minibus with NSU on the front, parked on a brick path under trees"
            sizes="(min-width: 640px) 384px, 100vw"
            placeholder="blur"
            className="h-auto w-full rounded-card border border-line"
          />
        </figure>
      </div>
    </section>
  );
}
