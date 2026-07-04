"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TempoBar from "./TempoBar";
import { useLenis } from "./SmoothScroll";

const LINKS = [
  { label: "Flow", href: "#flow" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const { scrollTo } = useLenis();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollTo(href, { offset: -80 });
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav
        className={`flex w-full max-w-5xl items-center justify-between rounded-full border px-5 py-2.5 transition-all duration-500 ${
          scrolled
            ? "border-border bg-surface/70 backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <a
          href="#top"
          onClick={go("#top")}
          className="flex items-center gap-2.5 group"
        >
          <TempoBar bars={4} className="h-4 w-5" />
          <span className="font-display text-lg font-semibold tracking-tight text-text-primary">
            Cadence
          </span>
        </a>

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

        <a
          href="#waitlist"
          onClick={go("#waitlist")}
          className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-bg transition-transform hover:scale-[1.03] active:scale-95"
        >
          Join waitlist
        </a>
      </nav>
    </motion.header>
  );
}
