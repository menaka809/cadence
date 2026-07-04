"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Menu, X } from "lucide-react";
import TempoBar from "./TempoBar";
import { useLenis } from "./SmoothScroll";

const LINKS = [
  { label: "Flow", href: "#flow" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
];

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
  const { scrollTo } = useLenis();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu once the viewport grows to the desktop layout.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    scrollTo(href, { offset: -80 });
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4"
    >
      <div className="w-full max-w-5xl">
        <nav
          className={`flex w-full items-center justify-between rounded-full border px-4 py-2 transition-all duration-500 sm:px-5 sm:py-2.5 ${
            scrolled || open
              ? "border-border bg-surface/70 backdrop-blur-xl"
              : "border-transparent bg-transparent"
          }`}
        >
          <a
            href="#top"
            onClick={go("#top")}
            className="group flex items-center gap-2.5"
          >
            <TempoBar bars={4} className="h-4 w-5" />
            <span className="font-display text-lg font-semibold tracking-tight text-text-primary">
              Cadence
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={go(l.href)}
                className="rounded-full px-4 py-1.5 text-sm text-text-muted transition-colors hover:text-text-primary"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href="#waitlist"
              onClick={go("#waitlist")}
              className="hidden rounded-full bg-accent px-4 py-2 text-sm font-medium text-bg transition-transform hover:scale-[1.03] active:scale-95 md:block"
            >
              Join waitlist
            </a>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="flex h-9 w-9 items-center justify-center rounded-full text-text-primary transition-colors hover:bg-surface-2 md:hidden"
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
                onClick={() => setOpen(false)}
                className="fixed inset-0 -z-10 md:hidden"
              />
              <motion.div
                id="mobile-menu"
                variants={panel}
                initial="hidden"
                animate="show"
                exit="exit"
                className="mt-2 origin-top overflow-hidden rounded-3xl border border-border bg-surface/90 p-2 backdrop-blur-xl md:hidden"
              >
                {LINKS.map((l) => (
                  <motion.a
                    key={l.href}
                    variants={item}
                    href={l.href}
                    onClick={go(l.href)}
                    className="block rounded-2xl px-4 py-3 text-sm text-text-muted transition-colors hover:bg-surface-2 hover:text-text-primary"
                  >
                    {l.label}
                  </motion.a>
                ))}
                <motion.a
                  variants={item}
                  href="#waitlist"
                  onClick={go("#waitlist")}
                  className="mt-1 block rounded-2xl bg-accent px-4 py-3 text-center text-sm font-medium text-bg transition-transform active:scale-95"
                >
                  Join waitlist
                </motion.a>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
