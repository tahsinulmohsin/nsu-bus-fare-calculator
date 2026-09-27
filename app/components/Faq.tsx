import { ChevronDown } from "lucide-react";
import { FAQS } from "../lib/seo";

/* Common questions as native disclosure widgets: keyboard and screen
   reader support come from the browser, it works without JavaScript, and
   the answers are in the HTML whether a question is open or not. The
   same list feeds the FAQPage JSON-LD. */
export function Faq() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="scroll-mt-4 border-t border-line py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 id="faq-title" className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          NSU bus questions, answered
        </h2>
        <div className="mt-8 divide-y divide-line-soft rounded-card border border-line bg-surface">
          {FAQS.map((item) => (
            <details key={item.question} className="group">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 hover:bg-sunken [&::-webkit-details-marker]:hidden">
                <h3 className="text-base font-medium text-ink">{item.question}</h3>
                <ChevronDown
                  className="h-5 w-5 shrink-0 text-ink-muted transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </summary>
              <p className="max-w-[60ch] px-5 pb-5 leading-relaxed text-ink-body">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
