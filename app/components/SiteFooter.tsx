import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import footerBus from "../assets/footer-bus.webp";
import nsuSeal from "../assets/nsu-seal.png";
import {
  BOOKING_URL,
  CALENDAR_URL,
  FARE_PER_TRIP,
  PAYMENT_METHODS,
  REFUND,
  SEMESTER_END,
  SEMESTER_LABEL,
  SEMESTER_START,
} from "../lib/semester";

const REPO_URL = "https://github.com/tahsinulmohsin/nsu-bus-fare-calculator";

const ON_THIS_PAGE = [
  { href: "#ticket-sale", label: "Ticket sale" },
  { href: "#calculator", label: "Fare calculator" },
  { href: "#about", label: "How the bus works" },
  { href: "#routes", label: "Routes and stops" },
  { href: "#faq", label: "Questions" },
  { href: "#refund", label: `${REFUND.semester} refund` },
];

const OFFICIAL = [
  { href: BOOKING_URL, label: "NSU Transport portal" },
  { href: CALENDAR_URL, label: "Academic calendar" },
  { href: "https://www.northsouth.edu/", label: "northsouth.edu" },
];

const headingClass = "text-lg font-bold text-on-notice";
const linkClass = "inline-flex min-h-9 items-center gap-1 text-sm text-on-notice hover:underline";

/* northsouth.edu's footer: a photo band with the seal and name over it
   (here the NSU lettering on a bus, as no campus photograph is on hand),
   then a cyan panel with rounded top corners holding four link columns.
   The name is this tool's, and the last column and the closing line say
   plainly that it is not the university's site. */
export function SiteFooter() {
  return (
    <footer className="relative isolate overflow-hidden bg-media">
      <Image
        src={footerBus}
        alt=""
        fill
        placeholder="blur"
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-media/85 via-media/60 to-media/40" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 sm:pt-20 lg:px-8">
        <Image
          src={nsuSeal}
          alt="North South University seal"
          sizes="64px"
          className="h-16 w-auto"
        />
        <p className="mt-4 text-2xl font-bold tracking-tight text-on-media sm:text-3xl">
          NSU Bus Fare Calculator
        </p>
        <p className="mt-1 text-base text-on-media-muted sm:text-lg">
          The {SEMESTER_LABEL} student bus, worked out for North South University students
        </p>

        <div className="mt-10 rounded-t-[2rem] bg-notice px-6 pt-10 pb-8 sm:mt-14 sm:px-10">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            <nav aria-labelledby="footer-page">
              <h2 id="footer-page" className={headingClass}>
                On this page
              </h2>
              <ul className="mt-4 space-y-1">
                {ON_THIS_PAGE.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className={linkClass}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-labelledby="footer-official">
              <h2 id="footer-official" className={headingClass}>
                Official NSU links
              </h2>
              <ul className="mt-4 space-y-1">
                {OFFICIAL.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      {link.label}
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className={headingClass}>{SEMESTER_LABEL}</h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-on-notice">
                <li>
                  Buses run from {SEMESTER_START} to {SEMESTER_END}.
                </li>
                <li>
                  Tk {FARE_PER_TRIP} one way, Tk {FARE_PER_TRIP * 2} round trip, every
                  route.
                </li>
                <li>Pay with {PAYMENT_METHODS} only.</li>
              </ul>
            </div>

            <div>
              <h2 className={headingClass}>About this site</h2>
              <p className="mt-4 text-sm leading-relaxed text-on-notice">
                An unofficial tool. It is not run by North South University.
                Always check the NSU Transport portal before you rely on these
                numbers.
              </p>
              <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className={`${linkClass} mt-2 font-semibold underline`}>
                Source code on GitHub
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </div>

          <p className="mt-10 border-t border-on-notice/30 pt-6 text-sm text-on-notice">
            NSU Bus Fare Calculator, {SEMESTER_LABEL}. Unofficial, and not
            affiliated with North South University.
          </p>
        </div>
      </div>
    </footer>
  );
}
