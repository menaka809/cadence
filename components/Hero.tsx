"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowDown } from "lucide-react";
import TempoBar from "./TempoBar";
import Magnetic from "./Magnetic";
import { useLenis } from "./SmoothScroll";

const LINE_ONE = ["Work", "in", "rhythm,"];
const LINE_TWO = ["not", "in", "chaos."];

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.35 },
  },
};

const word: Variants = {
  hidden: { y: "110%", opacity: 0 },
  show: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

const fade: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function Hero() {
  const { scrollTo } = useLenis();

  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-28 pb-16"
    >
      {/* Ambient background wash */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-violet/20 blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[700px] -translate-x-1/2 rounded-full bg-accent/[0.06] blur-[120px]" />
        <div className="absolute inset-0 noise-overlay opacity-60" />
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="flex flex-col items-center text-center"
      >
        <motion.div
          variants={fade}
          className="mb-7 flex items-center gap-2.5 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs text-text-muted backdrop-blur-sm"
        >
          <TempoBar bars={3} className="h-3 w-3.5" />
          <span>Now in private beta</span>
        </motion.div>

        <h1 className="font-display text-[clamp(2.25rem,10.5vw,7.5rem)] font-semibold leading-[0.95] tracking-tight text-text-primary">
          {[LINE_ONE, LINE_TWO].map((line, li) => (
            <span key={li} className="block overflow-hidden pb-[0.05em]">
              <span className="flex justify-center gap-[0.22em]">
                {line.map((w, wi) => (
                  <span key={`${li}-${wi}`} className="inline-block overflow-hidden">
                    <motion.span
                      variants={word}
                      className={`inline-block ${
                        w === "rhythm," ? "text-accent" : ""
                      }`}
                    >
                      {w}
                    </motion.span>
                  </span>
                ))}
              </span>
            </span>
          ))}
        </h1>

        <motion.p
          variants={fade}
          className="mt-8 max-w-xl text-balance text-base text-text-muted sm:text-lg"
        >
          Cadence turns your workday into a tempo you can feel. Time-boxed focus,
          flow-state detection, and silence that actually stays silent.
        </motion.p>

        <motion.div
          variants={fade}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Magnetic>
            <button
              onClick={() => scrollTo("#waitlist", { offset: -40 })}
              className="rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-bg transition-transform hover:scale-[1.03] active:scale-95"
            >
              Join the waitlist
            </button>
          </Magnetic>
          <button
            onClick={() => scrollTo("#flow", { offset: -20 })}
            className="rounded-full border border-border bg-surface/40 px-7 py-3.5 text-sm font-medium text-text-primary backdrop-blur-sm transition-colors hover:border-text-muted/40"
          >
            See how it flows
          </button>
        </motion.div>
      </motion.div>

      {/* Continuous tempo bar visual — clipped to the viewport on small
          screens so the 48 bars never force horizontal overflow. */}
      <motion.div
        variants={fade}
        initial="hidden"
        animate="show"
        transition={{ delay: 1.1 }}
        className="mt-12 flex h-12 w-full max-w-2xl items-end justify-center overflow-hidden px-4 sm:mt-16 sm:h-16"
      >
        <TempoBar
          bars={48}
          className="h-12 gap-[3px] sm:h-16 sm:gap-[4px]"
          barClassName="w-[3px]"
        />
      </motion.div>

      <motion.button
        onClick={() => scrollTo("#problem", { offset: -20 })}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-text-muted"
        aria-label="Scroll down"
      >
        <ArrowDown className="h-5 w-5 animate-bounce" />
      </motion.button>
    </section>
  );
}
