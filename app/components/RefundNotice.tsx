import { Banknote, CalendarClock, CircleUser, CloudRain, Info } from "lucide-react";
import { REFUND } from "../lib/semester";
import { Reveal } from "./Reveal";

/* Summer 2026 fare refund, from the Registrar's notice.

   The claim form closed on 15 September 2026 and refunds were due by
   26 September 2026, so the section no longer asks anyone to claim. It
   keeps the suspended dates, so students can check what they were owed,
   and points anyone still waiting to the Accounts Officer. */
export function RefundNotice() {
  const contact = REFUND.accountsContact;

  return (
    <section
      id="refund"
      aria-labelledby="refund-title"
      className="border-t border-line bg-band py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-wrap items-center gap-3">
            <h2
              id="refund-title"
              className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
            >
              {REFUND.semester} fare refund
            </h2>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-soft px-3 py-1 text-xs font-semibold text-neutral-ink">
              <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
              Form closed
            </span>
          </div>
          <p className="mt-3 max-w-[60ch] leading-relaxed text-ink-body">
            NSU suspended the student bus service on a few days last semester
            and refunded students who had bought tickets for them. Claims were
            made through a form that has now closed.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-5">
          {/* Suspended days: a plain list, not tiles inside a card. */}
          <Reveal delay={60} className="min-w-0 lg:col-span-3">
            <div className="h-full rounded-card border border-line bg-surface p-6">
              <div className="mb-2 flex items-center gap-2.5">
                <CloudRain className="h-5 w-5 text-accent-ink" aria-hidden="true" />
                <h3 className="font-semibold text-ink">Days the service did not run</h3>
              </div>
              <ul className="grid sm:grid-cols-2 sm:gap-x-8">
                {REFUND.suspendedDays.map((day) => (
                  <li key={day.date} className="border-b border-line-soft py-3.5 last:border-0 sm:[&:nth-last-child(2)]:border-0">
                    <p className="font-mono text-sm font-semibold text-ink">{day.date}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-ink-body">{day.reason}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Still waiting */}
          <Reveal delay={120} className="min-w-0 lg:col-span-2">
            <div className="flex h-full flex-col rounded-card border border-line bg-surface p-6">
              <h3 className="font-semibold text-ink">Still waiting for your refund?</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-body">
                The claim form closed on {REFUND.formDeadline}, and refunds were
                due by {REFUND.payoutBy}. If you submitted the form and the
                money has not reached your bank account, contact the Accounts
                Officer.
              </p>

              <div className="mt-5 flex gap-3 border-t border-line-soft pt-5">
                <CircleUser
                  className="mt-0.5 h-5 w-5 shrink-0 text-accent-ink"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-medium text-ink">{contact.person}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-ink-body">{contact.role}</p>
                </div>
              </div>

              <p className="mt-auto flex items-start gap-2 pt-5 text-xs leading-relaxed text-ink-body">
                <Banknote className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                Refunds go to a bank account only, even if you paid for your
                ticket with bKash. They are never sent to bKash or any other
                mobile wallet.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={180}>
          <p className="mt-6 flex max-w-[60ch] items-start gap-2 text-xs leading-relaxed text-ink-body">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Details are quoted from the Registrar&apos;s notice on the{" "}
            {REFUND.semester} bus fare refund.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
