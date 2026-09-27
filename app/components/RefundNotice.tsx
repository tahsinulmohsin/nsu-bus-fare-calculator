import {
  Banknote,
  CalendarClock,
  CircleUser,
  CloudRain,
  Info,
} from "lucide-react";
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
      className="border-t border-slate-200 bg-slate-50 py-16 sm:py-20 dark:border-slate-800 dark:bg-slate-900/40"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50">
              {REFUND.semester} fare refund
            </h2>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
              Form closed
            </span>
          </div>
          <p className="mt-3 max-w-[65ch] leading-relaxed text-slate-600 dark:text-slate-300">
            NSU suspended the student bus service on a few days last semester
            and refunded students who had bought tickets for them. Claims were
            made through a form that has now closed.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-5">
          {/* Suspended days */}
          <Reveal delay={60} className="lg:col-span-3">
            <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-5 flex items-center gap-2.5">
                <CloudRain
                  className="h-5 w-5 text-blue-600 dark:text-blue-400"
                  aria-hidden="true"
                />
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  Days the service did not run
                </h3>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {REFUND.suspendedDays.map((day) => (
                  <li
                    key={day.date}
                    className="rounded-[10px] bg-slate-50 p-4 dark:bg-slate-800/60"
                  >
                    <p className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {day.date}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {day.reason}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Still waiting */}
          <Reveal delay={120} className="lg:col-span-2">
            <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                Still waiting for your refund?
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                The claim form closed on {REFUND.formDeadline}, and refunds were
                due by {REFUND.payoutBy}. If you submitted the form and the
                money has not reached your bank account, contact the Accounts
                Officer.
              </p>

              <div className="mt-5 flex gap-3 rounded-[10px] bg-slate-50 p-4 dark:bg-slate-800/60">
                <CircleUser
                  className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {contact.person}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {contact.role}
                  </p>
                </div>
              </div>

              <p className="mt-auto flex items-start gap-2 pt-5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                <Banknote className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                Refunds are paid by bank transfer only, never through bKash or
                any other mobile wallet, so check your bank account.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={180}>
          <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Details are quoted from the Registrar&apos;s notice on the{" "}
            {REFUND.semester} bus fare refund.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
