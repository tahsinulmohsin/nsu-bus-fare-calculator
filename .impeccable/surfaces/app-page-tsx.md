---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: []
---

# Surface brief: home page (app/page.tsx)

Scope: the single public page. Mode: Operate (a fare calculator and schedule
students use in a hurry), with Read sections (guide, FAQ, refund notice).

Audience and job: current NSU students on phones, new students, and parents.
They need the semester fare for their days, when tickets go on sale, their
route's stops and times, and how refunds work. Proof is the notice data in
app/lib; no invented claims.

Constraints: hero bus video, bus photo, light and dark themes, the name "NSU
Bus Fare Calculator", visibly unofficial (the owner asked for the NSU logo
and seal in the header and footer; the "Unofficial" tag stays beside it), every
existing feature and the search engine setup preserved.

Memorable moment: the ticket sale rendered as an NSU notice list, date tiles
and all, with live countdowns in the rows.

## Direction contract

THESIS: The page a student would expect NSU itself to publish about the bus,
at full craft; it refuses the generic slate-card tool page it replaces.

OWN-WORLD: northsouth.edu's identity: deep navy (#061742) main nav under an
NSU-blue (#183F78) utility bar, Geist throughout, bold white hero type over
footage, square navy and pale buttons, grey (#F5F5F5) bands with centred
indigo (#211E53) section titles, a cyan "NOTICE" title bar over rows led by
grey date tiles, yellow status tags, chevron list rows, cyan circular arrow
links, a navy band holding a white message card, and a photo footer with a
rounded cyan link panel. Amended at the finish review: no campus photograph
can honestly be used (none is supplied, and northsouth.edu's are not ours to
take), so the footer photo is a frame of the owner's footage showing the
"North South University" lettering on a bus side, echoing the lettered
building in NSU's own footer.

STORY: A student sees NSU's own visual language, reads the sale dates as
notices, works out their fare in the calculator card, finds their route in
the chevron list, and leaves knowing what to pay, when, and how.

FIRST VIEWPORT: Utility bar, then navy nav with the NSU logo (owner's
request), the wordmark and an Unofficial tag at left and section links at
right. Full-bleed bus footage below with the
H1 "NSU student bus fare calculator" bold white at left, one line of subtext,
and two square buttons: navy "Work out my fare" and pale "See bus routes".

FORM: NSU Notice Board, played straight; candidate 1 of 7 on the ordered list,
chosen by the owner over the assigned candidate 3; seed key de5e3864.
Signature interaction: sale rows whose tiles and yellow tags change with the
live countdown. Motion grammar: NSU-quiet; rows shade on hover, chevrons turn
in 200ms ease-out, buttons press to 97%, the hero headline rises once, and
nothing loops but the countdown digits and the hero footage, which plays the
owner's three credited clips in turn with a crossfade (owner's request).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
