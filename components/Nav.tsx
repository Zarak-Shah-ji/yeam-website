"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

/* One list, rendered twice. The desktop row and the mobile panel drifted apart
   the last time these were written out separately — "How It Works" outlived the
   section it pointed at. Root-relative hashes, not bare ones: these links also
   render on /pricing and /architecture, where "#triage" would resolve to
   nothing on the current page. */
const LINKS = [
  { label: "Free worklist", href: "/#triage" },
  { label: "Pricing",       href: "/pricing" },
  { label: "Architecture",  href: "/architecture" },
  { label: "Contact",       href: "/#contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Escape closes, and so does crossing into desktop layout — otherwise the
  // panel survives a rotate into a viewport that no longer renders its trigger.
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const mq = window.matchMedia("(min-width: 768px)");
    const onDesktop = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onDesktop);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onDesktop);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // The bar is transparent until scroll. An open panel needs the solid
  // treatment at any scroll position or it hangs over the hero unbacked.
  const solid = scrolled || open;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        solid
          ? "bg-[#FFFFFF]/95 backdrop-blur-sm border-b border-[#E0E6F5] shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Image
            src="/logo.png"
            alt="Yeam.ai"
            width={36}
            height={36}
            className="rounded-lg"
            style={{ filter: "brightness(0) saturate(100%) invert(27%) sepia(100%) saturate(400%) hue-rotate(184deg) brightness(142%)" }}
          />
          <span className="font-semibold text-[#1C1C1C] text-lg">Yeam.ai</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[#4A5A7A] hover:text-[#1C1C1C] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/#triage"
            className="hidden sm:inline-flex px-4 py-2 bg-[#1A4FBF] text-white text-sm font-medium rounded-lg hover:bg-[#1540A0] transition-colors"
          >
            Get started
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="md:hidden -mr-2 p-2 rounded-lg text-[#1C1C1C] hover:bg-[#EBF0FA] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="md:hidden border-t border-[#E0E6F5] bg-[#FFFFFF] px-6 pb-5 pt-2"
        >
          <ul>
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base font-medium text-[#4A5A7A] hover:text-[#1C1C1C] transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/#triage"
            onClick={() => setOpen(false)}
            className="mt-3 block w-full px-4 py-3 bg-[#1A4FBF] text-white text-center text-sm font-semibold rounded-lg hover:bg-[#1540A0] transition-colors"
          >
            Get started
          </Link>
        </nav>
      )}
    </header>
  );
}
