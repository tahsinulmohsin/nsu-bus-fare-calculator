"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  Banknote,
  CalendarClock,
  CircleUser,
  CloudRain,
} from "lucide-react";
import { REFUND } from "../lib/semester";
import { Reveal } from "./Reveal";

/* Summer 2026 fare refund, from the Registrar's notice.

   The form has a hard deadline, so the section leads with how much
   time is left rather than burying it in prose. */
export function RefundNotice() {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    const deadline = new Date(REFUND.formDeadlineISO).getTime();
    const remaining = Math.ceil((deadline - Date.now()) / 86_400_000);
    setDaysLeft(remaining);
  }, []);

  const closed = daysLeft !== null && daysLeft < 0;
  const urgent = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;

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
            {daysLeft !== null && (
              <span
                className={`swap inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-semibold ${
                  closed
                    ? "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    : urgent
                      ? "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
                }`}
              >
                <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                {closed
                  ? "Form closed"
                  : daysLeft === 0
                    ? "Closes today"
                    : `${daysLeft} ${daysLeft === 1 ? "day" : "days"} left`}
              </span>
            )}
          </div>
          <p className="mt-3 max-w-[65ch] leading-relaxed text-slate-600 dark:text-slate-300">
            NSU suspended the student bus service on a few days last semester.
            If you had bought tickets for those days, you are owed a refund and
            you have to claim it with a form.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-5">
          {/* Suspended days */}
          <Reveal delay={60} className="lg:col-span-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
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

          {/* How to claim */}
          <Reveal delay={120} className="lg:col-span-2">
            <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-5 font-semibold text-slate-900 dark:text-slate-100">
                How to claim
              </h3>
              <ol className="flex-1 space-y-4">
                {[
                  "Open the form while signed in to your NSU email. It will not open on a personal account.",
                  "Fill in your details, including the bank account the refund should go to.",
                  `Submit before ${REFUND.formDeadline}. Refunds land by ${REFUND.payoutBy}.`,
                ].map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 font-mono text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>

              <a
                href={REFUND.formUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pressable mt-6 flex items-center justify-center gap-2 rounded-[10px] bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Open the refund form
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>

              <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                <Banknote className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                Bank transfer only. Refunds cannot be sent through bKash or any
                other mobile wallet.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Who to contact */}
        <Reveal delay={180}>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {REFUND.contacts.map((contact) => (
              <div
                key={contact.person}
                className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
              >
                <CircleUser
                  className="mt-0.5 h-5 w-5 shrink-0 text-slate-400"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {contact.issue}
                  </p>
                  <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
                    {contact.person}
                  </p>
                  <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {contact.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={240}>
          <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Only students who bought tickets for those dates can open the form.
            Details are quoted from the Registrar&apos;s notice on the{" "}
            {REFUND.semester} bus fare refund.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
