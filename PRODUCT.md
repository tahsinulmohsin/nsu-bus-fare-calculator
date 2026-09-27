# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Current NSU students on their phones.** They open it on the move or during
  ticket sale week to work out what the semester bus will cost, check when
  tickets go on sale, and look up their route's stops and trip times.
- **New students.** First-semester students who do not yet know how the NSU
  student bus works (routes, how tickets are bought, why Fridays are free,
  how refunds work) and need it explained plainly.
- **Parents and guardians.** The people who often pay the fare and want to see
  the semester cost up front, and what could come back.

## Product Purpose

An unofficial calculator and guide for the North South University student bus
service. It turns the Registrar's notices into answers: what a semester of bus
travel costs for the days a student actually travels, when round trip and one
way tickets go on sale, where each of the six routes stops and when buses leave
campus, and how refunds for suspended days work. Success is a student booking
with the right expectation of the cost and the timings, without reading the
notice PDFs.

## Positioning

The official NSU Transport portal only sells tickets. This tool is the one place
that works out the semester total for a chosen set of weekdays, shows the
expected refund for suspended days separately from what is charged at booking,
counts down to both ticket sales, and lists every route's stops, all derived
from the published notices and kept in step with them each semester.

## Operating Context

- Tickets are bought on the NSU Transport portal
  (https://transport.northsouth.edu/) and paid with bKash or a bank card only.
- Round trip and one way tickets sell in separate windows; pay per ticket is
  bought at least an hour before a trip, seats permitting.
- Fares: Tk 100 per direction per day on every route. Fridays are never
  charged. Days the service is suspended (other than Fridays) are refunded to a
  bank account after the semester, never to bKash.
- Six routes to the Bashundhara campus: Uttara, Mirpur, Mohammadpur, Dhanmondi,
  Azimpur, Khilgaon. All reach campus at 7:40 AM, 2:20 PM and 5:45 PM; evening
  departures differ by route.
- Dates and times are Bangladesh time. Figures change every semester from new
  notices (academic calendar, bus ticket sale notice, refund notices).
- Students share fares with each other; a fare can be shared as a link.

## Capabilities and Constraints

- Semester fare calculator (round trip, one way, pay per ticket) with weekday
  counts, expected refund and net cost; state lives in the URL.
- Live countdowns for the round trip and one way ticket sales, aware of opening,
  overnight pauses and closing.
- Route list with every stop, indicative morning pickup times, trips back and
  fare; FAQ and a plain-language guide; Summer 2026 refund note.
- Next.js 16 on Vercel at https://nsu-bus.tahsinulmohsin.me (the old vercel.app
  address redirects), with a Docker self-hosting path. Search engine setup
  (metadata, JSON-LD, sitemap) must survive any redesign.
- Every figure comes from `app/lib/semester.ts`, `app/lib/routes.ts` and
  `app/lib/seo.ts`; the interface never hard-codes a fact.

## Brand Commitments

- Name: **NSU Bus Fare Calculator**.
- Visual reference (owner's direction, September 2026): the site should look
  like northsouth.edu, NSU's official website, and must not look generic,
  AI-made, corporate or cold.
- It is unofficial and must always say so. It shares northsouth.edu's
  institutional look and, at the owner's request (September 2026), the North
  South University logo and seal, but must never claim to be the official
  site: the "Unofficial" label sits beside the logo in the header, and the
  footer says it is not run by North South University.
- Binding assets: the hero footage of the NSU AC bus (`public/video/`), the
  photo of a white NSU minibus (`app/assets/nsu-student-bus.jpg`), and both a
  light and a dark theme with a toggle.

## Evidence on Hand

- The Fall 2026 bus ticket sale notice, the Fall 2026 academic calendar and the
  Summer 2026 refund notice (data already encoded in `app/lib/`).
- Hero video and bus photo (third-party; not covered by the MIT license).
- No testimonials, usage numbers or endorsements exist. Do not invent them.

## Product Principles

1. **The number you see is the number you pay.** Charges at booking and money
   coming back are always shown separately.
2. **Every fact traces to a notice.** Nothing is typed into the interface that
   is not derived from the data files.
3. **Phone first, in a hurry.** The answer must be reachable in seconds on a
   phone during sale week.
4. **Plain enough for a first-semester student and a parent.**
5. **Honest about being unofficial**, and always pointing to the portal for the
   final word.

## Accessibility & Inclusion

WCAG 2.2 AA in both themes, full keyboard use, reduced motion respected
(including the hero video), and light data use on mobile connections.
