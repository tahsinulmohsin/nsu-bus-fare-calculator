# North South University (NSU) Bus Fare Calculator (v2.1.0)

Work out what the North South University student bus service costs you for the
**Fall 2026** semester, check pickup points and times across all six Dhaka
routes, and follow the Summer 2026 fare refund steps.

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

Round trip and one way tickets sell in two different windows, so the app shows
the one matching the trip type you picked.

| Trip type | Sale window |
|---|---|
| Round trip | 28 to 29 September 2026, 10:00 AM to 4:00 PM |
| One way | 30 September to 1 October 2026, 10:00 AM to 4:00 PM, seats permitting |
| Pay per ticket | At least 1 hour before the trip, seats permitting |

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

- **Fare calculator** for round trip, one way, and per day ad hoc trips, with a
  per weekday breakdown of how often each day falls in the semester.
- **Refund estimate** for days you expect the service to be suspended, shown
  alongside the amount charged at booking and your net cost.
- **Summer 2026 refund guide** with the suspended dates, the claim steps, the
  form deadline with a live countdown, and who to contact if something is wrong.
- **Route schedules** for all six routes (Uttara, Mirpur, Mohammadpur,
  Dhanmondi, Azimpur, Khilgaon), as a table on desktop and cards on mobile.
- **Light and dark themes**, both checked to WCAG AA contrast.
- **Motion that respects `prefers-reduced-motion`**, including the hero video,
  which never autoplays when reduced motion is requested and always has a
  visible play and pause control.

## Updating for a new semester

Almost everything lives in **`app/lib/semester.ts`**. Change the dates there and
the day counts recalculate themselves, so the header, the summary and the
weekday counts can never disagree with each other.

1. Set `SEMESTER_LABEL`, `SEMESTER_START`, `SEMESTER_END` and the two `Date`
   objects from the new academic calendar.
2. Set `TICKET_SALES` from the transport notice, one entry per trip type.
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

The hero video is committed at `public/video/hero.mp4`. To regenerate it from a
source file:

```bash
ffmpeg -i source.mkv -an -vf "scale=1152:-2,fps=25" -c:v libx264 -crf 31 -preset veryslow -pix_fmt yuv420p -movflags +faststart public/video/hero.mp4
```

## Deployment

Deployed on [Vercel](https://vercel.com). Pushes to `master` trigger a new
production deployment.

---

*Unofficial tool, not affiliated with North South University. Always confirm
routes, timings and fares on the [NSU Transport portal](https://transport.northsouth.edu/).*
