# Changelog

All notable changes to the NSU Bus Fare Calculator. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html). Every version is a
git tag and a [GitHub release](https://github.com/tahsinulmohsin/nsu-bus-fare-calculator/releases).

## [2.4.4] - 2026-09-27

### Added

- A photo of an NSU student bus beside "How the NSU student bus works",
  filling the empty space on the right on desktop and sitting below the text
  on phones. It loads lazily as WebP with descriptive alt text.

## [2.4.3] - 2026-09-27

### Added

- MIT license for the source code. The hero footage and university material
  are not covered; see the License section in the README.

## [2.4.2] - 2026-09-27

### Documentation

- Rewrote the README: contents, requirements and scripts, project layout,
  deployment, and how versions and releases work.
- Added this changelog, a GitHub release for every version, and a
  `production` tag marking the commit that is live.

## [2.4.1] - 2026-09-27

### Changed

- The canonical address is now <https://nsu-bus.tahsinulmohsin.me>. The
  sitemap, robots.txt, canonical tag, social cards and structured data all use
  it.
- <https://nsu-bus-fare-calculator.vercel.app> now redirects permanently (301)
  to the subdomain, keeping the path and any shared fare in the query string.

## [2.4.0] - 2026-09-27

### Added

- `robots.txt`, `sitemap.xml`, a web manifest and an Apple touch icon.
- Structured data (JSON-LD) for the site, North South University, the
  calculator as a free web application, and the FAQ.
- A plain-language guide to how the NSU student bus works, and an
  eight-question FAQ built from the notice data.
- Self-hosting with Docker: standalone build, multi-stage `Dockerfile` and
  `docker-compose.yml`.
- ESLint configuration, so `npm run lint` works.

### Changed

- Title, description and a single `<h1>` built around the searches students
  use ("NSU student bus fare", "NSU bus routes").
- Routes rebuilt as expandable rows with every stop, the trips back and the
  fare, all in the page HTML so search engines can read them.
- The calculator's choices now live in the URL as an external store, which
  also fixed six React hooks lint errors.

### Fixed

- The notice's "Agargoan" typo now reads Agargaon.

## [2.3.2] - 2026-09-27

### Fixed

- Empty space under the controls on desktop. The reference facts moved to a
  full-width strip, so the controls and the fare card now line up.
- The fare summary was meant to stay in view while scrolling but never did.
  It now sticks.

## [2.3.1] - 2026-09-27

### Fixed

- The phone fare bar sat outside every page landmark when it appeared.

## [2.3.0] - 2026-09-27

### Added

- "Pay with bKash or a bank card only", and a note that refunds go to a bank
  account even if you paid with bKash.
- A fare bar on phones that shows the running total while you pick days.
- Shareable fares: the trip, route, days and suspended days live in the URL,
  with a "Copy a link to this fare" button and a "Select all" days shortcut.
- A social preview image, Open Graph and Twitter tags.
- Semantic colour tokens for both themes, documented in `DESIGN.md`.

### Changed

- The ticket sale band is a third shorter on phones and collapses to one line
  once both sales close.
- The booking button and its note follow the sale for the chosen trip type.
- Removed the two timing selects, which never affected the fare.
- The hero video serves a 0.95 MB file to phones and downloads nothing until
  the hero is on screen.

### Fixed

- The hero video autoplayed even when reduced motion was requested.
- The video's pause button could not be clicked, and the video did not resume
  after switching tabs.
- Text contrast below WCAG AA on the refund amount, route numbers and selected
  options.
- Content outside page landmarks, an invalid definition list, keyboard focus
  order, and sideways scrolling at 200% text size.

## [2.2.1] - 2026-09-27

### Changed

- The Summer 2026 refund form has closed, so the section now points anyone
  still waiting to the Accounts Officer instead of asking them to claim.

## [2.2.0] - 2026-09-27

### Added

- Separate live countdowns for the round trip and one way ticket sales.

### Changed

- The Summer 2026 refund section moved to the end of the page.

## [2.1.0] - 2026-09-20

### Changed

- Replaced the provisional Fall 2026 figures with the official notice: service
  from 3 October to 28 December 2026, separate round trip and one way sale
  windows, arrivals standardised at 7:40 AM, 2:20 PM and 5:45 PM, and evening
  departures listed per route.
- Stoppage names follow the notice. Morning pickup times are marked as
  indicative because the notice does not list them.

## [2.0.1] - 2026-09-09

### Changed

- The page now spells out North South University instead of only "NSU".

## [2.0.0] - 2026-09-09

### Changed

- Updated for the Fall 2026 semester, with dates worked out from the academic
  calendar until the official notice was published.
- The fare is charged up front for every day except Fridays, and suspended
  days show as an expected refund rather than a discount.
- Rebuilt the interface: a background video in the hero, a Summer 2026 refund
  section, Geist type, and motion that respects reduced motion.

### Fixed

- The academic calendar link returned a 404.

Also included: a bus favicon and Poppins font fixes from the previous version.

## [1.1.1] - 2026-06-16

### Changed

- Switched the font to Poppins.

## [1.1.0] - 2026-06-16

### Added

- An image slideshow in the hero.

### Fixed

- Dark mode hydration and the Tailwind CSS v4 configuration.

## [1.0.0] - 2026-06-16

### Added

- First release, for the Summer 2026 semester: fare calculator for round trip,
  one way and per day trips, schedules for six routes, and the booking window.

[2.4.4]: https://github.com/tahsinulmohsin/nsu-bus-fare-calculator/compare/v2.4.3...v2.4.4
[2.4.3]: https://github.com/tahsinulmohsin/nsu-bus-fare-calculator/compare/v2.4.2...v2.4.3
[2.4.2]: https://github.com/tahsinulmohsin/nsu-bus-fare-calculator/compare/v2.4.1...v2.4.2
[2.4.1]: https://github.com/tahsinulmohsin/nsu-bus-fare-calculator/compare/v2.4.0...v2.4.1
[2.4.0]: https://github.com/tahsinulmohsin/nsu-bus-fare-calculator/compare/v2.3.2...v2.4.0
[2.3.2]: https://github.com/tahsinulmohsin/nsu-bus-fare-calculator/compare/v2.3.1...v2.3.2
[2.3.1]: https://github.com/tahsinulmohsin/nsu-bus-fare-calculator/compare/v2.3.0...v2.3.1
[2.3.0]: https://github.com/tahsinulmohsin/nsu-bus-fare-calculator/compare/v2.2.1...v2.3.0
[2.2.1]: https://github.com/tahsinulmohsin/nsu-bus-fare-calculator/compare/v2.2.0...v2.2.1
[2.2.0]: https://github.com/tahsinulmohsin/nsu-bus-fare-calculator/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/tahsinulmohsin/nsu-bus-fare-calculator/compare/v2.0.1...v2.1.0
[2.0.1]: https://github.com/tahsinulmohsin/nsu-bus-fare-calculator/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/tahsinulmohsin/nsu-bus-fare-calculator/compare/v1.1.1...v2.0.0
[1.1.1]: https://github.com/tahsinulmohsin/nsu-bus-fare-calculator/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/tahsinulmohsin/nsu-bus-fare-calculator/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/tahsinulmohsin/nsu-bus-fare-calculator/releases/tag/v1.0.0
