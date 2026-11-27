"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Menu, X } from "lucide-react";
import TempoBar from "./TempoBar";
import Magnetic from "./Magnetic";
import SectionLink from "./SectionLink";
import { SECTIONS, WAITLIST_HREF } from "@/lib/nav";

const panel: Variants = {
  hidden: { opacity: 0, y: -8, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.05 },
  },
  exit: { opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.18 } },
};

const item: Variants = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0 },
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    // Pick up a restored scroll position (reload mid-page) on the next frame.
    const raf = requestAnimationFrame(onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Close the mobile menu once the viewport grows to the desktop layout.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // While the menu is open: Escape closes it and returns focus to the toggle;
  // focus starts on the first link so keyboard users land inside the menu.
  useEffect(() => {
    if (!open) return;
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="enter-nav fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="w-full max-w-5xl">
        <nav
          aria-label="Main"
          className={`flex w-full items-center justify-between rounded-full border px-4 py-1 transition-all duration-500 sm:px-5 sm:py-1.5 ${
            scrolled || open
              ? "border-border bg-surface/70 backdrop-blur-xl"
              : "border-transparent bg-transparent"
          }`}
        >
          <SectionLink
            href="/#top"
            onNavigate={close}
            className="group flex min-h-11 items-center gap-2.5 rounded-full"
            aria-label="Cadence, back to top"
          >
            <TempoBar bars={4} className="h-4 w-5" />
            <span className="font-display text-lg font-semibold tracking-tight text-text-primary">
              Cadence
            </span>
          </SectionLink>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 md:flex">
            {SECTIONS.map((l) => (
              <li key={l.href}>
                <SectionLink
                  href={l.href}
                  className="flex min-h-11 items-center rounded-full px-4 text-sm text-text-muted transition-colors hover:text-text-primary"
                >
                  {l.label}
                </SectionLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1.5">
            {/* Shown at every width: the one call to action that never hides */}
            <Magnetic>
              <SectionLink
                href={WAITLIST_HREF}
                className="flex min-h-11 items-center rounded-full bg-accent px-4 text-sm font-medium text-bg transition-transform hover:scale-[1.03] active:scale-95"
              >
                Join waitlist
              </SectionLink>
            </Magnetic>

            {/* Mobile hamburger */}
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls={open ? "mobile-menu" : undefined}
              className="-mr-1.5 flex h-11 w-11 items-center justify-center rounded-full text-text-primary transition-colors hover:bg-surface-2 md:hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? "x" : "menu"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </nav>

        {/* Mobile dropdown menu */}
        <AnimatePresence>
          {open && (
            <>
              {/* Tap-outside backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={close}
                aria-hidden
                className="fixed inset-0 -z-10 md:hidden"
              />
              <motion.div
                ref={menuRef}
                id="mobile-menu"
                variants={panel}
                initial="hidden"
                animate="show"
                exit="exit"
                className="mt-2 origin-top overflow-hidden rounded-3xl border border-border bg-surface/95 p-2 backdrop-blur-xl md:hidden"
              >
                <ul>
                  {SECTIONS.map((l) => (
                    <motion.li key={l.href} variants={item}>
                      <SectionLink
                        href={l.href}
                        onNavigate={close}
                        className="flex min-h-12 items-center rounded-2xl px-4 text-sm text-text-muted transition-colors hover:bg-surface-2 hover:text-text-primary"
                      >
                        {l.label}
                      </SectionLink>
                    </motion.li>
                  ))}
                  <motion.li variants={item}>
                    <SectionLink
                      href={WAITLIST_HREF}
                      onNavigate={close}
                      className="mt-1 flex min-h-12 items-center justify-center rounded-2xl bg-accent px-4 text-sm font-medium text-bg transition-transform active:scale-95"
                    >
                      Join waitlist
                    </SectionLink>
                  </motion.li>
                </ul>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
