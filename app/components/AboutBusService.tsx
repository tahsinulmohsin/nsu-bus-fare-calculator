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

const linkClass = "font-semibold text-accent underline hover:text-accent-hover";

/* A plain-language description of the service, rendered on the server.
   It answers what a first-time visitor (and a search engine) needs before
   the numbers mean anything: who runs the bus, where it goes, what it
   costs and how paying works.

   Set the way northsouth.edu sets its Vice-Chancellor's message: a white
   card on a navy band, a rounded photo with its caption on one side and
   the text with an outlined button on the other. */
export function AboutBusService() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="bg-gradient-to-b from-nav to-utility py-12 sm:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 bg-surface p-6 shadow-card sm:p-10 lg:grid-cols-12 lg:items-center lg:gap-12 lg:p-12">
          {/* The source is a 480x640 thumbnail, so it is capped at 20rem
              wide to stay reasonably sharp on high-density screens. */}
          <figure className="mx-auto w-full max-w-xs lg:col-span-4">
            <Image
              src={busPhoto}
              alt="A white North South University minibus with NSU on the front, parked on a brick path under trees"
              sizes="(min-width: 640px) 320px, 100vw"
              placeholder="blur"
              className="h-auto w-full rounded-[1.75rem]"
            />
            <figcaption className="mt-4 text-center text-lg font-bold text-heading">
              An NSU student minibus
            </figcaption>
          </figure>

          <div className="min-w-0 lg:col-span-8">
            <h2
              id="about-title"
              className="text-2xl font-bold tracking-tight text-heading sm:text-3xl"
            >
              How the NSU student bus works
            </h2>
            <div className="mt-5 max-w-[65ch] space-y-4 leading-relaxed text-ink-body">
              <p>
                North South University runs a student bus service on{" "}
                {inWords(ROUTE_LIST.length)} routes across Dhaka:{" "}
                {listJoin(ROUTE_LIST.map((r) => r.label))}. For {SEMESTER_LABEL}{" "}
                the buses run from {SEMESTER_START} to {SEMESTER_END}, the last
                day of final exams. Every route reaches the Bashundhara campus
                at {listJoin(ARRIVALS)}, and buses head back at 11:20 AM and
                2:40 PM, with later trips on some routes.
              </p>
              <p>
                Tickets are sold on the{" "}
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  NSU Transport portal
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>{" "}
                and paid with {PAYMENT_METHODS} only. A one way trip costs Tk{" "}
                {FARE_PER_TRIP} and a round trip Tk {FARE_PER_TRIP * 2} a day.
                Booking for the semester means paying up front for every day
                you pick, except Fridays. If the service is suspended on
                another day, NSU refunds that day to your bank account after
                the semester.
              </p>
              <p>
                The calculator above does that sum: pick your trip type and
                days, then add any days you expect the bus not to run to see
                what comes back. Stops and times and{" "}
                <a href="#faq" className={linkClass}>
                  common questions
                </a>{" "}
                follow below.
              </p>
            </div>
            <a
              href="#routes"
              className="pressable mt-7 inline-flex min-h-11 items-center border border-primary px-5 text-sm font-semibold text-primary hover:bg-pale"
            >
              See bus routes
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
