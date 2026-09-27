"use client";

import { useSyncExternalStore } from "react";
import { ArrowUp } from "lucide-react";

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange);
  return () => {
    window.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
  };
}

const pastHero = () => window.scrollY > window.innerHeight;

/* northsouth.edu's cyan scroll-to-top circle. Desktop only: on a phone
   the running fare bar owns the bottom edge. It appears once the hero is
   out of view. */
export function ScrollTopButton() {
  const visible = useSyncExternalStore(subscribe, pastHero, () => false);

  return (
    <a
      href="#top"
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? undefined : -1}
      data-visible={visible}
      className="pressable fixed right-6 bottom-6 z-30 hidden size-14 items-center justify-center rounded-full bg-notice text-on-notice shadow-[0_8px_20px_-6px_rgb(6_23_66/0.45)] hover:bg-notice-hover data-[visible=false]:pointer-events-none data-[visible=false]:translate-y-3 data-[visible=false]:opacity-0 lg:flex"
    >
      <ArrowUp className="size-6" aria-hidden="true" />
    </a>
  );
}
