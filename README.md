# North South University (NSU) Bus Fare Calculator (v2.3.0)

Work out what the North South University student bus service costs you for the
**Fall 2026** semester, check pickup points and times across all six Dhaka
routes, and see who to contact about a Summer 2026 fare refund.

Live: <https://nsu-bus-fare-calculator.vercel.app>

All figures come from the official notice, *Sale of NSU Students' Bus Ticket -
Fall 2026*, issued by the Office of the Registrar.

## How the fare is worked out

NSU charges **৳100 per direction, per day**, and never charges for Fridays.
Every other day you sign up for is billed up front when you book.

If the bus does not run on a non-Friday, that day is **not** deducted at
booking. NSU refunds it to your bank account after the semester ends. The
calculator follows that rule: an expected suspension shows up as money coming
back, not as a discount, so the number you see is the number you actually pay.

### Fall 2026 figures

| | |
|---|---|
| Service period | 3 October 2026 to 28 December 2026 |
| Total days | 87 |
| Fridays excluded | 12 |
| Chargeable days | 75 |
| One way | Tk 100 |
| Round trip | Tk 200 |

### Ticket sale windows

Round trip and one way tickets sell in two different windows. The app shows a
separate live countdown for each, and the booking note in the calculator follows
the trip type you picked.

| Trip type | Sale window |
|---|---|
| Round trip | 28 to 29 September 2026, 10:00 AM to 4:00 PM |
| One way | 30 September to 1 October 2026, 10:00 AM to 4:00 PM, seats permitting |
| Pay per ticket | At least 1 hour before the trip, seats permitting |

The notice gives each window as a date range with 10:00 AM to 4:00 PM hours. The
app reads that as those hours on each day, so a countdown runs to the opening
time, then to that day's close, then to the next morning's reopening, and stops
once the last day closes.

### Timings

Every route reaches NSU at **7:40 AM, 2:20 PM and 5:45 PM**. Departures from NSU
differ by route:

| Departure | Routes |
|---|---|
| 11:20 AM | All |
| 2:40 PM | All |
| 6:30 PM | Uttara, Mirpur, Mohammadpur, Dhanmondi |
| 10:20 PM | Mirpur, Mohammadpur |

The notice lists stoppages without per-stoppage pickup times, and it
standardised the arrival times (Summer 2026 had a different afternoon or evening
arrival on four routes). The afternoon and evening pickup times were therefore
re-timed and have not been republished, so the app does not show them. Morning
pickup times are carried over from Summer 2026 and labelled indicative, since
the 7:40 AM arrival and the stoppage lists are identical in both notices.

## Features

- **Ticket sale countdowns**, one each for round trip and one way, that know
  whether a sale has not opened, is open, is paused overnight, or has closed.
  Once both sales are over the band shrinks to a single line pointing at pay
  per ticket.
- **Fare calculator** for round trip, one way, and pay per ticket, with a per
  weekday breakdown of how often each day falls in the semester and a
  "Select all" shortcut.
- **Refund estimate** for days you expect the service to be suspended, shown
  alongside the amount charged at booking and your net cost.
- **Booking guidance that follows the sale.** The note under the booking button
  says when the sale for your trip type opens, how long it has left, or that
  it has closed (with a one-tap switch to pay per ticket). Tickets are paid
  with bKash or a bank card only.
- **Shareable fares.** The trip type, route, days and suspended days live in
  the URL, and "Copy a link to this fare" copies it.
- **Phone fare bar.** On small screens a compact running total follows the
  controls, so the result is visible while you tap days.
- **Route schedules** for all six routes (Uttara, Mirpur, Mohammadpur,
  Dhanmondi, Azimpur, Khilgaon).
- **Summer 2026 refund note** at the end of the page, with the suspended
  dates and who to contact if your refund has not arrived. The claim form
  closed on 15 September 2026.
- **Light and dark themes** built on one set of semantic colour tokens. Every
  text and control colour is checked with axe-core to WCAG AA in both themes,
  in every ticket sale state.
- **Considerate hero video.** It downloads nothing until the hero is on
  screen, serves a 640px file (about 1 MB) to phones, and does not start by
  itself when reduced motion is requested, when the browser is in data saver
  mode, or on a slow connection. It pauses when scrolled away or when the tab
  is hidden, and the play and pause control always wins.

The visual system (tokens, type, components and rules) is documented in
[DESIGN.md](DESIGN.md).

## Updating for a new semester

Almost everything lives in **`app/lib/semester.ts`**. Change the dates there and
the day counts recalculate themselves, so the header, the summary and the
weekday counts can never disagree with each other.

1. Set `SEMESTER_LABEL`, `SEMESTER_START`, `SEMESTER_END` and the two `Date`
   objects from the new academic calendar.
2. Set `TICKET_SALES` from the transport notice, one entry per trip type, with
   one `sessions` entry per selling day. The countdowns read from it.
3. Set `NOTICE_PUBLISHED` to `false` while you are working from derived figures
   rather than a published notice. That shows a banner saying so, and back to
   `true` once the real notice is out.
4. Update `REFUND` when the next refund notice is issued.

Route timings live in `app/lib/routes.ts`.

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- [React 19](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Geist](https://vercel.com/font) via `next/font`
- [Lucide](https://lucide.dev/) icons
- [next-themes](https://github.com/pacocoursey/next-themes)

Scroll reveals use `IntersectionObserver` and animation runs in CSS, so there is
no animation library in the bundle and nothing runs on the scroll frame.

## Running locally

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

The hero video is committed in two sizes. To regenerate them from a source
file:

```bash
ffmpeg -i source.mkv -an -vf "scale=1152:-2,fps=24" -c:v libx264 -crf 35 -preset veryslow -pix_fmt yuv420p -movflags +faststart public/video/hero.mp4
```

```bash
ffmpeg -i source.mkv -an -vf "scale=640:-2,fps=24" -c:v libx264 -profile:v main -crf 39 -preset veryslow -pix_fmt yuv420p -movflags +faststart public/video/hero-mobile.mp4
```

## Deployment

Deployed on [Vercel](https://vercel.com). Pushes to `master` trigger a new
production deployment.

---

*Unofficial tool, not affiliated with North South University. Always confirm
routes, timings and fares on the [NSU Transport portal](https://transport.northsouth.edu/).*
