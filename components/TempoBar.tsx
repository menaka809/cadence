"use client";

/**
 * A live "tempo bar" — a row of bars that pulse continuously on a staggered
 * delay to read like a metronome / audio waveform. Pure CSS animation
 * (see .animate-tempo in globals.css), so it's cheap and respects
 * prefers-reduced-motion automatically.
 */
export default function TempoBar({
  bars = 7,
  className = "",
  barClassName = "",
}: {
  bars?: number;
  className?: string;
  barClassName?: string;
}) {
  return (
    <div
      className={`flex items-end gap-[3px] ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className={`animate-tempo block w-[3px] rounded-full bg-accent ${barClassName}`}
          style={{
            height: "100%",
            animationDelay: `${(i % bars) * 0.12}s`,
            animationDuration: `${1.1 + (i % 3) * 0.25}s`,
          }}
        />
      ))}
    </div>
  );
}
