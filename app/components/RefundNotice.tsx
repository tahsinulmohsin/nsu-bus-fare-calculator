import { Banknote, CircleUser } from "lucide-react";
import { REFUND } from "../lib/semester";
import { DateTile, NoticeBar, SectionHeading, Tag } from "./ui";

const MONTH =
  /(January|February|March|April|May|June|July|August|September|October|November|December) (\d{4})/;

/* Tile for a notice date such as "12 and 13 July 2026": the first day,
   then the month and year. */
function tileFor(date: string) {
  const day = date.match(/\d{1,2}/)?.[0] ?? "";
  const [, month = "", year = ""] = date.match(MONTH) ?? [];
  return { day, month: `${month.slice(0, 3)} ${year.slice(2)}` };
}

/* Summer 2026 fare refund, from the Registrar's notice.

   The claim form closed on 15 September 2026 and refunds were due by
   26 September 2026, so the section no longer asks anyone to claim. It
   keeps the suspended dates, so students can check what they were owed,
   and points anyone still waiting to the Accounts Officer. */
export function RefundNotice() {
  const contact = REFUND.accountsContact;

  return (
    <section id="refund" aria-labelledby="refund-title" className="scroll-mt-4 bg-canvas py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="refund-title" title={`${REFUND.semester} fare refund`}>
          NSU suspended the student bus on a few days last semester and
          refunded students who had bought tickets for them. Claims were made
          through a form that has now closed.
        </SectionHeading>

        <div className="mt-10 grid gap-6 sm:mt-12 lg:grid-cols-12 lg:items-start lg:gap-8">
          <div className="min-w-0 overflow-hidden rounded-card bg-surface shadow-card ring-1 ring-line lg:col-span-7">
            <NoticeBar>Days the service did not run</NoticeBar>
            <ul className="divide-y divide-line-soft">
              {REFUND.suspendedDays.map((day) => (
                <li key={day.date} className="flex items-center gap-4 px-5 py-4 even:bg-sunken/60 sm:px-6">
                  <DateTile {...tileFor(day.date)} />
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-heading sm:text-lg">{day.date}</h3>
                    <p className="mt-0.5 text-sm leading-relaxed text-ink-body">{day.reason}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0 rounded-card bg-surface p-6 shadow-card ring-1 ring-line sm:p-8 lg:col-span-5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <h3 className="text-xl font-bold text-heading">Still waiting for your refund?</h3>
              <Tag tone="muted">Form closed</Tag>
            </div>
            <p className="mt-3 leading-relaxed text-ink-body">
              The claim form closed on {REFUND.formDeadline}, and refunds were
              due by {REFUND.payoutBy}. If you submitted the form and the money
              has not reached your bank account, contact the Accounts Officer.
            </p>

            <div className="mt-6 flex items-center gap-4 bg-sunken p-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary">
                <CircleUser className="size-6" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="font-bold text-heading">{contact.person}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-ink-body">{contact.role}</p>
              </div>
            </div>

            <p className="mt-6 flex items-start gap-2 text-sm leading-relaxed text-ink-body">
              <Banknote className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              Refunds go to a bank account only, even if you paid for your
              ticket with bKash. They are never sent to bKash or any other
              mobile wallet.
            </p>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-[65ch] text-center text-sm leading-relaxed text-ink-body">
          Details are quoted from the Registrar&apos;s notice on the{" "}
          {REFUND.semester} bus fare refund.
        </p>
      </div>
    </section>
  );
}
