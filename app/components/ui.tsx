import { ArrowUpRight } from "lucide-react";

/* Small pieces of northsouth.edu's page grammar, shared by the server and
   client sections: centred indigo section titles, grey date tiles, yellow
   status tags, the cyan "NOTICE" title bar and cyan circular arrow links. */

export function SectionHeading({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h2
        id={id}
        className="text-3xl font-bold tracking-tight text-balance text-heading sm:text-[2.5rem] sm:leading-[1.15]"
      >
        {title}
      </h2>
      {children && (
        <p className="mt-3 text-base leading-relaxed text-pretty text-ink-body sm:text-lg">
          {children}
        </p>
      )}
    </div>
  );
}

type TileTone = "default" | "active" | "muted";

const TILE_TONES: Record<TileTone, string> = {
  default: "bg-tile text-heading",
  active: "bg-primary text-on-primary",
  muted: "bg-tile text-ink-muted",
};

/* The grey square that leads every notice row: a big day number over a
   small month and year. */
export function DateTile({
  day,
  month,
  tone = "default",
}: {
  day: string;
  month: string;
  tone?: TileTone;
}) {
  return (
    <span
      className={`flex size-16 shrink-0 flex-col items-center justify-center rounded-tile transition-colors duration-200 sm:size-[4.5rem] ${TILE_TONES[tone]}`}
    >
      <span className="text-2xl leading-none font-bold tabular-nums">{day}</span>
      <span className="mt-1 text-[0.6875rem] font-semibold uppercase">{month}</span>
    </span>
  );
}

export function Tag({
  children,
  tone = "yellow",
}: {
  children: React.ReactNode;
  tone?: "yellow" | "muted";
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-tag px-2 py-0.5 text-xs font-semibold ${
        tone === "yellow" ? "bg-tag text-on-tag" : "bg-tag-muted text-on-tag-muted"
      }`}
    >
      {children}
    </span>
  );
}

/* The cyan bar that heads a notice board. */
export function NoticeBar({ children }: { children: React.ReactNode }) {
  return (
    <p className="bg-notice px-5 py-2.5 text-center text-sm font-semibold tracking-wide text-on-notice uppercase">
      {children}
    </p>
  );
}

/* "All Notice" style link: a cyan circle with an arrow, then the label. */
export function ArrowLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group -my-1 inline-flex min-h-11 items-center gap-3 py-1 font-semibold text-accent hover:text-accent-hover"
    >
      <span className="pressable flex size-10 shrink-0 items-center justify-center rounded-full bg-notice text-on-notice group-hover:bg-notice-hover group-active:scale-[0.97]">
        <ArrowUpRight className="size-5" aria-hidden="true" />
      </span>
      {children}
      {external && <span className="sr-only">(opens in a new tab)</span>}
    </a>
  );
}
