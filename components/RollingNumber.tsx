"use client";

import { motion } from "framer-motion";

/**
 * Odometer-style number roll. Each digit is a vertical column 0–9 that
 * translates to the target digit, giving a smooth mechanical "roll" when the
 * value changes (e.g. monthly ↔ annual price).
 *
 * The digit window is intentionally taller than 1em (--roll-h) so display
 * fonts with tall metrics (Clash Display) aren't clipped top/bottom, and each
 * digit is sized to its natural width via an invisible spacer so wide glyphs
 * aren't clipped left/right. A single line-height keeps every rolled digit on
 * the same baseline as the surrounding text (e.g. the "$").
 */
export default function RollingNumber({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  const digits = String(value).split("");

  return (
    <span
      className={`inline-flex tabular-nums ${className}`}
      style={{ ["--roll-h" as string]: "1.25em" }}
      aria-label={String(value)}
    >
      {digits.map((d, i) => {
        const n = Number(d);
        if (Number.isNaN(n)) {
          return (
            <span key={i} aria-hidden>
              {d}
            </span>
          );
        }
        return (
          <span
            key={i}
            aria-hidden
            className="relative inline-block overflow-hidden align-baseline"
            style={{ height: "var(--roll-h)", lineHeight: "var(--roll-h)" }}
          >
            {/* Invisible spacer: sets the natural width + baseline of the cell */}
            <span className="invisible px-[0.02em]">0</span>

            <motion.span
              className="absolute inset-x-0 top-0 flex flex-col"
              animate={{ y: `${-n * 10}%` }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            >
              {Array.from({ length: 10 }).map((_, k) => (
                <span
                  key={k}
                  className="block text-center"
                  style={{
                    height: "var(--roll-h)",
                    lineHeight: "var(--roll-h)",
                  }}
                >
                  {k}
                </span>
              ))}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}
