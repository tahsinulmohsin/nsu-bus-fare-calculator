import { ChevronRight } from "lucide-react";
import { FAQS } from "../lib/seo";
import { SectionHeading } from "./ui";

/* Common questions as native disclosure widgets: keyboard and screen
   reader support come from the browser, it works without JavaScript, and
   the answers are in the HTML whether a question is open or not. The
   same list feeds the FAQPage JSON-LD. */
export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-4 bg-band py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="faq-title" title="NSU bus questions, answered" />
        <div className="mt-10 divide-y divide-line-soft overflow-hidden rounded-card bg-surface shadow-card ring-1 ring-line sm:mt-12">
          {FAQS.map((item) => (
            <details key={item.question}>
              <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-sunken sm:px-6 sm:py-5">
                <h3 className="text-base font-bold text-heading sm:text-lg">{item.question}</h3>
                <ChevronRight className="chevron size-5 shrink-0 text-accent" aria-hidden="true" />
              </summary>
              <p className="max-w-[65ch] px-5 pb-5 leading-relaxed text-ink-body sm:px-6">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
