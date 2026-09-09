# North South University (NSU) Bus Fare Calculator (v2.0.1)

Work out what the North South University student bus service costs you for the
**Fall 2026** semester, check pickup points and times across all six Dhaka
routes, and follow the Summer 2026 fare refund steps.

Live: <https://nsu-bus-fare-calculator.vercel.app>

> **Fall 2026 notice not published yet.** NSU has not released the official
> Fall 2026 bus service notice. The service dates, booking window and fares in
> this app are derived from the Fall 2026 academic calendar and the pattern the
> Summer 2026 semester followed. The app says so on screen, and everything
> provisional is flagged in `app/lib/semester.ts`. Update it when the notice
> lands.

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
| One way | ৳100 |
| Round trip | ৳200 |

Dates come from the tentative Fall 2026 academic calendar (published
31 Aug 2026). Service starts on the first Saturday after the last day of course
drop with 100% refund (Mon 28 Sep 2026, so Sat 3 Oct 2026) and runs to the last
day of final exams. The same rule reproduces the Summer 2026 dates exactly,
which is why it is used here.

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
2. Set `BOOKING_WINDOW` and `BOOKING_DEADLINE_ISO` from the transport notice.
3. Set `NOTICE_PUBLISHED` to `true` once the official notice is out. That hides
   the provisional banner.
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
