---
name: NSU Bus Fare Calculator
description: An unofficial fare calculator and guide for the North South University student bus, set in northsouth.edu's own institutional style.
colors:
  navy: "#061742"
  navy-hover: "#183f78"
  nsu-blue: "#183f78"
  on-navy: "#ffffff"
  on-navy-muted: "#c9d4e8"
  pale: "#f3f6f8"
  pale-hover: "#e3e9ef"
  notice-cyan: "#0877ad"
  notice-cyan-hover: "#06648f"
  accent-soft: "#e6f2f9"
  status-yellow: "#ffe14d"
  tag-muted: "#e5e7eb"
  on-tag-muted: "#374151"
  heading-indigo: "#211e53"
  ink: "#0c2b4b"
  ink-body: "#555555"
  ink-muted: "#666666"
  ink-faint: "#9aa3ae"
  canvas: "#ffffff"
  band: "#f5f5f5"
  surface: "#ffffff"
  sunken: "#f5f5f5"
  tile: "#ececef"
  line: "#e5e7eb"
  line-soft: "#eeeeee"
  line-control: "#cfd5de"
  line-hover: "#9aa6b8"
  on-inverse-subtle: "#9fb0cc"
  on-media-muted: "#dde5f1"
  positive: "#0a7a4a"
  danger: "#b42318"
  canvas-dark: "#030b21"
  band-dark: "#061742"
  surface-dark: "#0a1d4a"
  sunken-dark: "#0e2657"
  tile-dark: "#132e66"
  line-dark: "#1c3872"
  line-soft-dark: "#152d63"
  line-control-dark: "#2a4a8a"
  line-hover-dark: "#4a6db0"
  ink-dark: "#f3f6f8"
  heading-dark: "#ffffff"
  ink-strong-dark: "#e3e9f4"
  ink-body-dark: "#c3cee2"
  ink-muted-dark: "#a3b2cd"
  ink-faint-dark: "#6f83a8"
  accent-dark: "#5cc0f2"
  accent-hover-dark: "#8ad3f7"
  accent-soft-dark: "#0f2e5e"
  nav-dark: "#020a1f"
  utility-dark: "#0d2757"
  pale-dark: "#14306a"
  pale-hover-dark: "#1c3c7e"
  tag-muted-dark: "#1f3a73"
  on-tag-muted-dark: "#d6def0"
  positive-dark: "#4ade9a"
  danger-dark: "#ff8a80"
typography:
  display:
    fontFamily: "Geist, system-ui, -apple-system, sans-serif"
    fontSize: "2.5rem (phone), 3.75rem (sm), 4rem (lg)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Geist, system-ui, -apple-system, sans-serif"
    fontSize: "1.875rem (phone), 2.5rem (sm)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  figure:
    fontFamily: "Geist, system-ui, -apple-system, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.025em"
    fontFeature: "tnum"
  title-lg:
    fontFamily: "Geist, system-ui, -apple-system, sans-serif"
    fontSize: "1.5rem (phone), 1.875rem (sm)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Geist, system-ui, -apple-system, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.55
  wordmark:
    fontFamily: "Geist, system-ui, -apple-system, sans-serif"
    fontSize: "0.9375rem (phone), 1.125rem (sm)"
    fontWeight: 700
    lineHeight: 1.25
  body-lg:
    fontFamily: "Geist, system-ui, -apple-system, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
  body:
    fontFamily: "Geist, system-ui, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  body-sm:
    fontFamily: "Geist, system-ui, -apple-system, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.625
  label-bar:
    fontFamily: "Geist, system-ui, -apple-system, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.43
    letterSpacing: "0.025em"
  label-tag:
    fontFamily: "Geist, system-ui, -apple-system, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.33
  label-tile:
    fontFamily: "Geist, system-ui, -apple-system, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.2
  label-micro:
    fontFamily: "Geist, system-ui, -apple-system, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 600
    lineHeight: 1.2
rounded:
  none: "0px"
  tag: "4px"
  input: "8px"
  tile: "12px"
  card: "16px"
  panel: "32px"
  full: "9999px"
spacing:
  gutter-phone: "16px"
  gutter-tablet: "24px"
  gutter-desktop: "32px"
  row-x: "20px"
  row-y: "20px"
  card-phone: "20px"
  card-desktop: "32px"
  grid-gap: "24px"
  grid-gap-lg: "32px"
  section-phone: "64px"
  section-desktop: "96px"
  container: "80rem"
components:
  button-hero-navy:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.on-navy}"
    rounded: "{rounded.none}"
    padding: "0 32px"
    height: "56px"
    typography: "{typography.body}"
  button-hero-navy-hover:
    backgroundColor: "{colors.nsu-blue}"
  button-hero-pale:
    backgroundColor: "{colors.on-navy}"
    textColor: "{colors.navy}"
    rounded: "{rounded.none}"
    padding: "0 32px"
    height: "56px"
  button-hero-pale-hover:
    backgroundColor: "{colors.on-media-muted}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.navy}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "44px"
    typography: "{typography.label-bar}"
  button-outline-hover:
    backgroundColor: "{colors.pale}"
  button-notice:
    backgroundColor: "{colors.notice-cyan}"
    textColor: "{colors.on-navy}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "48px"
  button-notice-hover:
    backgroundColor: "{colors.notice-cyan-hover}"
  choice-segment:
    backgroundColor: "{colors.pale}"
    textColor: "{colors.navy}"
    rounded: "{rounded.none}"
    padding: "12px 16px"
    height: "56px"
  choice-segment-hover:
    backgroundColor: "{colors.pale-hover}"
  choice-segment-active:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.on-navy}"
  input-select:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.input}"
    padding: "0 44px 0 16px"
    height: "48px"
  date-tile:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.heading-indigo}"
    rounded: "{rounded.tile}"
    size: "64px (phone), 72px (sm)"
  date-tile-active:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.on-navy}"
  tag-status:
    backgroundColor: "{colors.status-yellow}"
    textColor: "{colors.navy}"
    rounded: "{rounded.tag}"
    padding: "2px 8px"
    typography: "{typography.label-tag}"
  tag-muted:
    backgroundColor: "{colors.tag-muted}"
    textColor: "{colors.on-tag-muted}"
    rounded: "{rounded.tag}"
    padding: "2px 8px"
  notice-bar:
    backgroundColor: "{colors.notice-cyan}"
    textColor: "{colors.on-navy}"
    rounded: "{rounded.none}"
    padding: "10px 20px"
    typography: "{typography.label-bar}"
  arrow-link-disc:
    backgroundColor: "{colors.notice-cyan}"
    textColor: "{colors.on-navy}"
    rounded: "{rounded.full}"
    size: "40px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    padding: "20px (phone), 32px (sm)"
  total-panel:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.on-navy}"
    padding: "28px 24px"
    typography: "{typography.figure}"
  nav-bar:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.on-navy}"
    height: "80px"
  utility-bar:
    backgroundColor: "{colors.nsu-blue}"
    textColor: "{colors.on-navy}"
    height: "44px"
  footer-panel:
    backgroundColor: "{colors.notice-cyan}"
    textColor: "{colors.on-navy}"
    rounded: "{rounded.panel}"
    padding: "40px 24px 32px"
---

# Design System: NSU Bus Fare Calculator

## Overview

**Creative North Star: "The NSU Notice Board, Played Straight"**

The page looks like something North South University itself would publish about its bus, built to the standard of northsouth.edu and no looser. It borrows the university's institutional grammar rather than inventing a product look: a two-tier navy header, bold white type over campus footage, grey bands with centred indigo section titles, cyan "notice" title bars over rows led by grey date tiles, yellow status tags, chevron list rows, a navy band holding a white message card, a grey photo band of the actual buses, and a campus-photo footer with a rounded cyan link panel.

Density is moderate and civic: generous section padding (64px on phones, 96px from 640px), white cards on grey bands, and lists that read like a notice board rather than a dashboard. Everything is set in one family, Geist, with hierarchy carried by weight and size. Depth is one soft navy-tinted card shadow; there is no layered glass and no ornament. Motion is deliberately NSU-quiet.

The site is unofficial and says so at every point the university's marks appear. At the owner's request it carries the North South University logo in the header and the seal in the footer and on the ticket card, and the "Unofficial" tag always sits beside the tool's name. Imagery is real: the hero plays three credited clips in turn (channel marks cropped out, the playing clip credited on screen), and the gallery and footer use the owner's photos of NSU buses. Provenance for every shipping raster and clip lives in the README's "Media and credits" table.

**Key Characteristics:**
- northsouth.edu's institutional identity: deep navy, NSU blue, cyan notices, yellow status tags, indigo titles on grey bands.
- One typeface (Geist) at bold and semibold weights; no display face, no mono in use.
- Square buttons, rounded containers, circular icon controls.
- One soft card shadow; tonal bands carry the rest of the depth.
- Real, credited media only; the NSU logo and seal always travel with an "Unofficial" tag or disclaimer.
- NSU-quiet motion: one headline rise, chevron turns, a 97% press, and nothing that loops except countdown digits and the hero footage.

## Colors

A navy-led institutional palette: deep navy for authority, NSU blue for the utility tier, cyan for notices and links, yellow reserved for status, on white and cool-grey paper. Light values live on `:root`, dark values on `.dark`; components use only the semantic names, never raw hex.

### Primary
- **Deep NSU Navy** (navy): the main nav bar, the hero's first button, active choice segments and date tiles, the fare total panel, the hero and footer media shade, the outline button's stroke and text. In the dark theme the primary role inverts: active controls become Pale Paper (#f3f6f8, the ink-dark value) with navy text, so they read light-on-dark.
- **NSU Blue** (nsu-blue): the utility bar above the nav, the hover state of navy buttons, and the lower stop of the About band's navy-to-blue gradient.

### Secondary
- **Notice Cyan** (notice-cyan): notice title bars, the circular arrow-link discs, the booking button, the scroll-to-top disc, the footer link panel, text links and chevrons. It is also the focus ring colour. In dark mode the link/accent role lifts to Sky Cyan (accent-dark) while notice surfaces stay Notice Cyan.
- **Notice Wash** (accent-soft): the background of a sale row whose sale is open now.

### Tertiary
- **Status Yellow** (status-yellow): status tags on notice rows and the provisional-notice strip under the hero, always with navy text.

### Neutral
- **Indigo Heading** (heading-indigo): every section title and row title. Pure white in dark mode.
- **Ink Navy** (ink): default text and form values.
- **Body Grey** (ink-body) and **Muted Grey** (ink-muted): paragraphs and secondary captions.
- **Faint Grey** (ink-faint): decorative icons only, never text.
- **White Canvas** (canvas, surface) and **Band Grey** (band, sunken): the alternating section bands and the row hover shade.
- **Tile Grey** (tile): the date and weekday tiles.
- **Rule Greys** (line, line-soft, line-control, line-hover): card rings, row dividers, control strokes, and control hover strokes.
- **Positive Green** (positive) and **Alert Red** (danger): refund and error states only.

### Named Rules
**The Yellow Is Status Rule.** Status Yellow appears only as a status tag or the provisional-notice strip, always with navy text. It is never a button, a highlight, or decoration.

**The Semantic Names Rule.** Components reference role names (primary, notice, tag, band, heading), never hex. Light and dark are two palettes behind the same names, and some roles invert (primary) rather than darken.

## Typography

**Display Font:** Geist (with system-ui, -apple-system, sans-serif)
**Body Font:** Geist (same stack)

**Character:** One sturdy grotesque, as on northsouth.edu. Bold (700) for titles and figures, semibold (600) for labels and tags, medium (500) for nav and hero buttons, regular for reading text.

### Hierarchy
- **Display** (700, 2.5rem phone / 3.75rem sm / 4rem lg, 1.08, -0.025em): the hero H1 only, white over footage, balanced, max width 48rem.
- **Headline** (700, 1.875rem phone / 2.5rem sm, 1.15, -0.025em): centred indigo section titles, with an optional 1rem to 1.125rem body-grey lede beneath.
- **Figure** (700, 3rem, tabular numerals): the fare total in the navy panel. Countdown digits use 1.5rem bold tabular.
- **Title Large** (700, 1.5rem phone / 1.875rem sm): card and footer headings (ticket card, About card, footer name).
- **Title** (700, 1.125rem): notice rows, route rows, FAQ questions, refund card heading (1.25rem).
- **Wordmark** (700, 0.9375rem phone / 1.125rem sm): the tool's name in the nav bar.
- **Body** (400, 1rem / 1.125rem lead, line-height 1.625): reading text, capped at 60 to 65ch.
- **Body Small** (400, 0.875rem, 1.625): row descriptions, help text, captions, footer links.
- **Label Bar** (600, 0.875rem, 0.025em, uppercase): notice title bars only.
- **Label Tag** (600, 0.75rem): status tags.
- **Label Tile** (600, 0.6875rem, uppercase): month and day-count labels inside tiles, and the "Unofficial" tag.
- **Label Micro** (600, 0.625rem, uppercase): the "Route" label inside route number tiles.

These steps (2.5rem and 4rem display, 0.6875rem and 0.625rem tile and tag labels, 0.9375rem phone wordmark) are intentional parts of this ramp.

### Named Rules
**The One Family Rule.** Geist sets everything. Hierarchy comes from weight and size, never from a second face.

**The Centred Title Rule.** A section opens with its centred indigo headline and at most one lede line. Nothing sits above the title.

## Layout

Content sits in an 80rem container with 16px, 24px and 32px gutters at phone, 640px and 1024px. Full-width bands alternate white canvas and grey band (calculator, gallery, FAQ on grey; ticket sale, routes, refund on white), padded 64px on phones and 96px from 640px (the ticket-sale band uses 56px / 80px). Two-panel sections use a 12-column grid split 7/5 at 1024px with 24px / 32px gaps; the calculator's fare summary sticks at 24px from the top on desktop, and on phones a navy fare bar docks to the bottom edge instead. Rows inside cards pad 20px horizontally (24px from 640px) and 16px to 20px vertically, divided by soft rules. The gallery is a 2-column grid of square photos, 4 columns at 1024px. Every interactive target is at least 44px tall; primary choices and hero buttons are 56px.

## Elevation & Depth

Mostly flat and tonal. Grey bands separate sections; white cards sit on them with a 1px ring and one soft, navy-tinted shadow. Floating overlays (the phone menu, the phone fare bar, the scroll-to-top disc) get their own directional shadows because they sit over content. Photos behind text are shaded with navy gradients, not blurred.

### Shadow Vocabulary
- **Card** (`box-shadow: 0 6px 24px -8px rgb(6 23 66 / 0.14), 0 1px 3px rgb(6 23 66 / 0.06)`): every white card, the About message card, and gallery photos.
- **Overlays** (menu `0 16px 32px -16px rgb(0 0 0 / 0.5)`, fare bar `0 -8px 24px -12px rgb(6 23 66 / 0.5)`, scroll-top `0 8px 20px -6px rgb(6 23 66 / 0.45)`): floating elements only.

### Named Rules
**The One Card Shadow Rule.** Resting surfaces use the single card shadow or none. Stronger shadows belong only to elements that float over the page.

## Shapes

Shape follows northsouth.edu's split: buttons and choice segments are square (0), status tags 4px, inputs 8px, date and weekday tiles 12px, cards and gallery photos 16px, the footer link panel 32px on its top corners only, and icon buttons, arrow-link discs and the seal avatar fully round. Notice bars run square across the top of their card, clipped by the card's radius.

### Named Rules
**The Square Button Rule.** A labelled button is square. Rounding belongs to containers and tiles; circles belong to icon-only controls.

## Components

### Buttons
- **Shape:** square corners (0).
- **Hero pair:** navy with a faint white inset ring ("Work out my fare") and white with navy text ("See bus routes"), 56px tall, 32px side padding, 1rem medium. Navy hovers to NSU Blue; white hovers to Media Mist (on-media-muted).
- **Outline:** 1px primary stroke, navy semibold 0.875rem text, 44px to 48px tall; hovers to Pale Paper.
- **Notice:** cyan fill, white semibold text, 48px; hovers to the deeper cyan. Used for the booking link.
- **Press:** every button scales to 0.97 on press over 160ms ease-out; reduced motion keeps the colour change and drops the scale.

### Chips
- **Status Tag:** Status Yellow with navy 0.75rem semibold text, 4px radius, 2px by 8px. A muted grey variant marks closed or past states.
- **Unofficial Tag:** 1px translucent white stroke on the navy bar, 0.6875rem semibold uppercase. Always beside the tool's name.

### Cards / Containers
- **Corner Style:** 16px.
- **Background:** white surface on a grey band, 1px line ring.
- **Shadow Strategy:** the card shadow (see Elevation & Depth).
- **Internal Padding:** 20px on phones, 32px from 640px; list cards pad per row instead.
- **Message card:** in the About section, a white card inside a navy-to-NSU-blue gradient band, padded 24px / 40px / 48px.

### Inputs / Fields
- **Style:** 48px tall, white surface, 1px control stroke, 8px radius, 1rem ink text; the stroke darkens on hover.
- **Steppers and segments:** square Pale Paper blocks with an inset control ring; the active segment turns navy with a check icon.
- **Focus:** a 2px Notice Cyan outline, offset 2px, site-wide (Sky Cyan in dark).
- **Disabled:** 40% opacity, not-allowed cursor.

### Navigation
- **Utility bar:** 44px, NSU Blue, 0.875rem white official links split by thin white rules, underline on hover; hidden below 768px.
- **Main bar:** 80px, deep navy, NSU logo (48px, 56px from 640px) then wordmark and Unofficial tag at left, section links (1rem medium white, underline on hover) and a round theme toggle at right from 1024px.
- **Phone menu:** a square navy toggle opens a full-width navy sheet of 48px chevron rows that settles in; Escape closes it and returns focus.

### Notice Board (signature)
A card headed by a cyan uppercase notice bar, then rows each led by a grey 64px (72px from 640px) date tile with a big bold day over a tiny uppercase month, an indigo title, a yellow status tag and a body-small line. Tiles and tags change with the live countdown: an open sale's row takes the Notice Wash and its tile turns navy. The board ends with a centred arrow link: a 40px cyan disc holding an arrow, then a cyan semibold label.

### Chevron Rows
Route and FAQ disclosures: 44px minimum rows that shade to Band Grey on hover over 200ms, with a cyan chevron that turns 90° in 200ms ease-out when open. Route rows lead with a numbered tile that turns navy for the chosen route.

### Fare Total
A navy panel at the top of the summary card: muted label, 3rem bold tabular figure, subtle detail line, then a soft-ruled breakdown list below. On phones a navy fare bar slides up from the bottom edge (240ms in, 160ms out) once the total scrolls away.

### Media Frames
The hero is full-bleed footage shaded navy (a flat 70% veil on phones, a left-to-right gradient from 640px), with the credit for the playing clip in a small navy chip beside a round play/pause control at bottom right; clips crossfade over 500ms. The footer is the owner's campus bus photo under a navy gradient, carrying the seal, the name and a cyan link panel with 32px top corners.

### Motion
Motion uses one curve, `cubic-bezier(0.23, 1, 0.32, 1)`. The H1 rises 12px once over 600ms, transform only and visible from the first frame. Swapped content settles in over 280ms (6px and opacity). Everything else is state feedback: the press, the chevron turn, the fare bar slide and row shading.

**The NSU-Quiet Rule.** The hero headline's rise is the only authored entrance. Nothing loops except the countdown digits and the hero footage, and reduced motion keeps every state change while dropping the movement.

## Do's and Don'ts

### Do:
- **Do** open every section with a centred indigo headline on a white or grey band, alternating bands down the page.
- **Do** lead dated rows with a grey date tile and mark status with a yellow tag carrying navy text.
- **Do** keep labelled buttons square and at least 44px tall (56px for primary choices and hero actions).
- **Do** put the "Unofficial" tag beside the tool's name wherever the NSU logo appears, and keep the footer's statement that the site is not run by North South University.
- **Do** credit every clip and photo on screen or in the README's "Media and credits" table, and crop third-party channel marks out of footage.
- **Do** shade photos behind text with navy gradients so white type holds its contrast.
- **Do** reference colours by role name so both themes follow.

### Don't:
- **Don't** round labelled buttons or add a second card shadow to resting surfaces.
- **Don't** use Status Yellow for anything but status.
- **Don't** set text in Faint Grey; it is for decorative icons only.
- **Don't** add a second typeface or put a label above a section title.
- **Don't** add entrance animations beyond the hero headline's rise, or anything that loops besides the countdown and the footage.
- **Don't** show the NSU logo or seal without the unofficial label or disclaimer nearby.
