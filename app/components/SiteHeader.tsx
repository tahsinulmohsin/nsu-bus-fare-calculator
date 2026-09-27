"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import nsuLogo from "../assets/nsu-logo.png";
import { ArrowUpRight, ChevronRight, Menu, Moon, Sun, X } from "lucide-react";
import { BOOKING_URL, CALENDAR_URL, REFUND } from "../lib/semester";
import { useIsClient } from "../lib/useClient";

const SECTIONS = [
  { href: "#ticket-sale", label: "Ticket sale" },
  { href: "#calculator", label: "Fare calculator" },
  { href: "#routes", label: "Routes" },
  { href: "#faq", label: "FAQ" },
];

const OFFICIAL = [
  { href: BOOKING_URL, label: "NSU Transport portal" },
  { href: CALENDAR_URL, label: "Academic calendar" },
  { href: "https://www.northsouth.edu/", label: "northsouth.edu" },
];

/* Two tiers, as on northsouth.edu: an NSU-blue utility bar of official
   links over the deep navy main bar. The university's logo leads, at
   the owner's request, and the "Unofficial" tag sits right beside the
   tool's name so the page never passes as the university's own site. */
export function SiteHeader() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useIsClient();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const themeButton = mounted && (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label={resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="pressable flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-on-nav/25 text-on-nav hover:bg-on-nav/10"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="size-[1.125rem]" aria-hidden="true" />
      ) : (
        <Moon className="size-[1.125rem]" aria-hidden="true" />
      )}
    </button>
  );

  return (
    <header className="relative z-40">
      {/* Utility bar */}
      <div className="hidden bg-utility md:block">
        <div className="mx-auto flex h-11 max-w-7xl items-center justify-end px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center text-sm text-on-nav">
            {OFFICIAL.map((link) => (
              <li key={link.href} className="border-r border-on-nav/40 px-3 first:pl-0">
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 py-2 hover:underline"
                >
                  {link.label}
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
            <li className="pl-3">
              <a href="#refund" className="inline-block py-2 hover:underline">
                {REFUND.semester} refund
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Main bar */}
      <div className="bg-nav">
        <nav
          aria-label="Site"
          className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
        >
          <a href="#top" className="flex min-w-0 items-center gap-3 sm:gap-4">
            <Image
              src={nsuLogo}
              alt="North South University logo"
              loading="eager"
              sizes="70px"
              className="h-12 w-auto shrink-0 sm:h-14"
            />
            <span className="min-w-0">
              <span className="block text-[0.9375rem] leading-tight font-bold text-on-nav sm:text-lg">
                NSU Bus Fare Calculator
              </span>
              <span className="mt-1 flex min-w-0 items-center gap-2">
                <span className="shrink-0 rounded-tag border border-on-nav/50 px-1.5 py-px text-[0.6875rem] font-semibold tracking-wide text-on-nav uppercase">
                  Unofficial
                </span>
                <span className="hidden truncate text-xs text-on-nav-muted sm:inline">
                  For North South University students
                </span>
              </span>
            </span>
          </a>

          <div className="flex items-center gap-2">
            <ul className="hidden items-center lg:flex">
              {SECTIONS.map((section) => (
                <li key={section.href}>
                  <a
                    href={section.href}
                    className="inline-flex min-h-11 items-center px-3 text-base font-medium text-on-nav hover:underline"
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
            <span className="ml-3 hidden lg:block">{themeButton}</span>
            <button
              ref={menuButton}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="pressable flex size-11 cursor-pointer items-center justify-center border border-on-nav/40 text-on-nav hover:bg-on-nav/10 lg:hidden"
            >
              {menuOpen ? (
                <X className="size-6" aria-hidden="true" />
              ) : (
                <Menu className="size-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>

        {/* Phone and tablet menu */}
        <div
          id="site-menu"
          hidden={!menuOpen}
          className="swap absolute inset-x-0 top-full border-t border-on-nav/15 bg-nav shadow-[0_16px_32px_-16px_rgb(0_0_0/0.5)] lg:hidden"
        >
          <ul className="mx-auto max-w-7xl px-4 py-2 sm:px-6">
            {SECTIONS.map((section) => (
              <li key={section.href} className="border-b border-on-nav/10">
                <a
                  href={section.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-12 items-center justify-between text-base font-medium text-on-nav"
                >
                  {section.label}
                  <ChevronRight className="size-5 text-on-nav-muted" aria-hidden="true" />
                </a>
              </li>
            ))}
            <li className="border-b border-on-nav/10">
              <a
                href="#refund"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-12 items-center justify-between text-base font-medium text-on-nav"
              >
                {REFUND.semester} refund
                <ChevronRight className="size-5 text-on-nav-muted" aria-hidden="true" />
              </a>
            </li>
            {mounted && (
              <li className="border-b border-on-nav/10">
                <button
                  type="button"
                  onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                  className="flex min-h-12 w-full cursor-pointer items-center justify-between text-base font-medium text-on-nav"
                >
                  {resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
                  {resolvedTheme === "dark" ? (
                    <Sun className="size-5 text-on-nav-muted" aria-hidden="true" />
                  ) : (
                    <Moon className="size-5 text-on-nav-muted" aria-hidden="true" />
                  )}
                </button>
              </li>
            )}
            {OFFICIAL.map((link) => (
              <li key={link.href} className="border-b border-on-nav/10 last:border-0">
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-12 items-center justify-between text-sm text-on-nav-muted"
                >
                  {link.label}
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
