---
name: NSU Bus Fare Calculator
description: A quiet fare board for North South University students working out what the semester bus costs.
colors:
  canvas: "oklch(100% 0 0)"
  canvas-dark: "oklch(12.9% 0.042 264.695)"
  band: "oklch(98.4% 0.003 247.858)"
  surface: "oklch(100% 0 0)"
  surface-dark: "oklch(20.8% 0.042 265.755)"
  sunken: "oklch(98.4% 0.003 247.858)"
  line: "oklch(92.9% 0.013 255.508)"
  line-dark: "oklch(27.9% 0.041 260.031)"
  ink: "oklch(20.8% 0.042 265.755)"
  ink-dark: "oklch(98.4% 0.003 247.858)"
  ink-body: "oklch(44.6% 0.043 257.281)"
  ink-body-dark: "oklch(86.9% 0.022 252.894)"
  ink-muted: "oklch(55.4% 0.046 257.417)"
  ink-muted-dark: "oklch(70.4% 0.04 256.788)"
  accent: "oklch(54.6% 0.245 262.881)"
  accent-ink-dark: "oklch(70.7% 0.165 254.624)"
  accent-hover-dark: "oklch(62.3% 0.214 259.815)"
  accent-soft: "oklch(97% 0.014 254.604)"
  on-accent: "oklch(100% 0 0)"
  cta: "oklch(55.3% 0.195 38.402)"
  cta-hover: "oklch(47% 0.157 37.304)"
  positive: "oklch(50.8% 0.118 165.612)"
  positive-dark: "oklch(76.5% 0.177 163.223)"
  positive-tint-dark: "oklch(69.6% 0.17 162.48)"
  caution-tint-dark: "oklch(76.9% 0.188 70.08)"
  caution-ink: "oklch(47.3% 0.137 46.201)"
  danger: "oklch(50.5% 0.213 27.518)"
  inverse: "oklch(20.8% 0.042 265.755)"
  media: "oklch(12.9% 0.042 264.695)"
typography:
  display:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.5
  body:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.43
  caption:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.625
  figure:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.1
    fontFeature: "tnum"
rounded:
  control: "10px"
  card: "16px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "80px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.control}"
    padding: "14px 24px"
    height: "44px"
  button-cta:
    backgroundColor: "{colors.cta}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.control}"
    padding: "14px 20px"
    height: "44px"
  button-cta-hover:
    backgroundColor: "{colors.cta-hover}"
  option-toggle:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "12px 16px"
    height: "44px"
  option-toggle-selected:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent}"
  route-chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
    height: "44px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    padding: "24px"
  fare-panel:
    backgroundColor: "{colors.inverse}"
    textColor: "{colors.on-accent}"
    typography: "{typography.figure}"
    padding: "28px 24px"
---

# Design System: NSU Bus Fare Calculator

## Overview

**Creative North Star: "The Fare Board"**

The page behaves like the fare board at a bus counter: the numbers are the headline and everything around them stays quiet. Slate neutrals and generous spacing carry the structure, one blue accent marks what can be chosen, and the only warm colour on the page is the orange button that sends a student to book. Every price, count, date and countdown is set in Geist Mono with tabular figures, so figures line up and never shift as they change.

The hero is the one expressive moment: real footage of NSU students and the bus, under a dark scrim, with the headline set directly on it. Below the hero the page is a tool and behaves like one.

**Key Characteristics:**
- Figures first: money and time in tabular mono, labels in quiet sans.
- One accent, one booking colour, status colours only with words.
- Flat and bordered, with a single inverse panel for the running total.
- Every date and time in Bangladesh time, whatever the device says.
- Light and dark themes share one token set; only the values swap.

## Colors

All colours are semantic tokens defined in `app/globals.css` and swapped for the dark theme on `.dark`. Components never name a palette colour directly.

### Primary
- **Counter Blue** (`accent`): selected trip types and days, route chips, links, focus rings and the hero button. In dark mode links and icons lift to a lighter blue (`accent-ink-dark`) for contrast.
- **Selection Wash** (`accent-soft`): the background of a selected option, always paired with a blue border and blue label.

### Secondary
- **Ticket Orange** (`cta`, hover `cta-hover`): the booking button and nothing else.

In dark mode the soft status backgrounds are mixed from a brighter base (`positive-tint-dark`, `caution-tint-dark`, and `accent-hover-dark` for the selection wash) at 12 to 15% over the surface.

### Neutral
- **Paper** (`canvas`, `surface`): page and card backgrounds in light mode; deep navy slate in dark mode.
- **Band** (`band`, `sunken`): the tinted band behind the ticket sale and refund sections, and quiet inset rows.
- **Rule** (`line`): card borders and dividers.
- **Ink** (`ink`, `ink-body`, `ink-muted`): headings, body copy and secondary text. `ink-muted` is the lightest colour allowed for text; the fainter `ink-faint` in the code is for decorative icons only.
- **Night Panel** (`inverse`): the running total panel, in both themes.
- **Footage Dark** (`media`): the hero scrim. Hero colours do not change with the theme because the hero always sits on video.

**The One Booking Button Rule.** Orange appears exactly once on the page, on the button that goes to the NSU Transport portal. Nothing else may use it.

**The Status Needs Words Rule.** `positive`, `caution-ink` and `danger` only mark state (on sale, paused, closed, refund amount) and always travel with an icon or a word. Colour is never the only signal.

## Typography

**Display Font:** Geist (with system-ui fallback)
**Body Font:** Geist
**Figure Font:** Geist Mono, tabular figures

**Character:** Geist is a neutral, slightly technical sans that reads well at small sizes on a phone; Geist Mono gives the fares and countdowns the steady rhythm of a departure board.

### Hierarchy
- **Display** (600, 36px to 60px by viewport, 1.1): the hero headline only.
- **Headline** (600, 24px to 30px, 1.2): section titles such as "Your fare" and "Routes and timings".
- **Title** (600, 14px to 16px): card titles.
- **Body** (400, 16px, 1.625): introductions, capped at 60ch.
- **Label** (500, 14px): form labels and option names.
- **Caption** (400, 12px, 1.625): helper text under controls, capped at 60ch.
- **Figure** (Geist Mono 600, 30px to 36px, tabular): the fare total and countdown digits.

**The Tabular Money Rule.** Every price, day count, time and countdown uses Geist Mono with tabular figures. A number that changes must never change width.

## Layout

A single column that becomes a 3:2 split on large screens: controls on the left, the fare summary on the right, sticky while you scroll. Only the live result sits beside the controls, so both columns start at the same height; the static reference facts run as a full-width strip beneath them. On a phone the order is controls, fare, facts. Content sits in a 1152px (72rem) container with 16px to 32px side padding. Sections are separated by 64px to 80px, groups inside a section by 32px, and fields inside a group by 8px to 12px.

On phones the summary falls below the controls, so a fixed fare bar at the bottom of the screen shows the running total while the controls are on screen and hides when the full summary is visible. Scroll padding keeps keyboard focus clear of it.

The page order follows the student's task: when to buy (ticket sale), what it costs (calculator), where the bus goes (routes), and last semester's refund. Once both ticket sales close, the ticket sale band collapses to a single line.

**The Matched Columns Rule.** Beside the controls goes only what changes as they change. Anything static moves below both columns, so neither side is left with a hole.

**The Calculator First Rule.** Nothing above the calculator may take more than one phone screen. When something new needs to sit above it, something else gets smaller.

## Elevation & Depth

Flat and bordered. Hierarchy comes from borders, tinted bands and the one inverse panel, not from shadows. The only shadow is on the phone fare bar, which floats over content: a soft upward shadow tinted with ink (`0 -8px 24px -12px`).

**The No Card In Card Rule.** A card never contains another card. Lists inside a card use dividers; a contact inside a card uses a top rule.

## Shapes

Softly rounded throughout: cards at 16px, controls and buttons at 10px, chips, badges and icon buttons fully round. Borders are 1px.

## Components

### Buttons
- **Primary** (Counter Blue, white label, 10px radius, 44px minimum height): the hero's "Work out my fare".
- **Booking** (Ticket Orange, white label): the one booking action. Its label follows the sale: "Book on the NSU portal" while tickets are on sale, "Open the NSU portal" before and after.
- **Secondary** (1px rule border, ink label): "Copy a link to this fare".
- **Text buttons** ("Select all", "Switch to pay per ticket"): blue text with 44px of vertical padding and negative margins, so the hit area is full size without taking up layout space.
- All pressable elements scale to 97% on press and ease back in 160ms.

### Chips
- **Route chip**: fully round, 1px border, a small mono route number before the name. Selected chips fill with Counter Blue.
- **Status badge**: fully round, tinted background, icon plus word ("On sale now", "Paused until 10 AM", "Sale closed").

### Cards / Containers
- **Corner Style:** 16px radius.
- **Background:** `surface`, on the page canvas or a tinted band.
- **Border:** 1px `line`.
- **Internal Padding:** 20px to 24px.

### Inputs / Fields
- **Style:** 1px `line-control` border, 10px radius, 44px minimum height, labels above.
- **Focus:** a 2px blue outline with 2px offset on every focusable element.
- **Option toggles:** trip types and weekdays are buttons with `aria-pressed`; selected ones get the Selection Wash, a blue border and a blue label.

### Navigation
A single-line bar inside the hero: the bus mark and name on the left, the theme toggle on the right, 72px tall. A skip link to the calculator appears on first Tab.

### Disclosures
Routes and FAQ answers use native `<details>`: a 16px-radius bordered surface, a full-width summary row (44px minimum, tinted on hover) and a chevron that turns when open. Content stays in the HTML while closed, so it is readable by search engines and works without JavaScript. The route picked in the calculator opens itself and gets a blue border and a "Your route" badge.

### The Fare Panel
The inverse block at the top of the summary card holds the total in 36px Geist Mono. Under it: the expected refund and net cost when there are suspended days, the booking button, the sale note, and the payment line ("Pay with bKash or a bank card only").

## Do's and Don'ts

### Do:
- **Do** put every new colour through a semantic token in `app/globals.css` with a value for both themes.
- **Do** set money, counts and times in Geist Mono with tabular figures.
- **Do** pair every status colour with an icon or a word.
- **Do** state dates and times in Bangladesh time.
- **Do** keep text at `ink-muted` or darker; check 4.5:1 contrast in both themes.
- **Do** keep touch targets at 44px, using padding and negative margins for text buttons.
- **Do** keep payment (bKash or a bank card) and refunds (bank transfer only) stated separately.

### Don't:
- **Don't** use orange for anything but the booking button.
- **Don't** nest a card inside a card.
- **Don't** add `dark:` variants in components; change the token instead.
- **Don't** use `ink-faint` for text.
- **Don't** add small uppercase labels above headings or number the sections.
- **Don't** autoplay motion when the visitor has asked for reduced motion or is saving data.
