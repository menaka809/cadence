import type { CSSProperties } from "react";
import { ArrowDown } from "lucide-react";
import TempoBar from "./TempoBar";
import Magnetic from "./Magnetic";
import SectionLink from "./SectionLink";
import { WAITLIST_HREF } from "@/lib/nav";

const LINE_ONE = ["Work", "in", "rhythm,"];
const LINE_TWO = ["not", "in", "chaos."];

// Entrance choreography: one stagger across badge → words → copy → CTAs.
// It runs in CSS (see .enter-* in globals.css), so the hero animates straight
// from the server HTML instead of waiting for JavaScript to hydrate.
const START = 0.05;
const STAGGER = 0.07;
const delay = (step: number) => ({ "--d": `${START + step * STAGGER}s` }) as CSSProperties;
const WORDS = LINE_ONE.length + LINE_TWO.length;

export default function Hero() {
  return (
    <section
      id="top"
      tabIndex={-1}
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 pt-28 pb-16"
    >
      {/* Ambient background wash */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-violet/20 blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[700px] -translate-x-1/2 rounded-full bg-accent/[0.06] blur-[120px]" />
        <div className="absolute inset-0 noise-overlay opacity-60" />
      </div>

      <div className="flex flex-col items-center text-center">
        <div
          style={delay(0)}
          className="enter-fade-up mb-7 flex items-center gap-2.5 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs text-text-muted backdrop-blur-sm"
        >
          <TempoBar bars={3} className="h-3 w-3.5" />
          <span>Now in private beta</span>
        </div>

        <h1 className="font-display text-[clamp(2.25rem,10.5vw,7.5rem)] font-semibold leading-[0.95] tracking-tight text-text-primary">
          {[LINE_ONE, LINE_TWO].map((line, li) => (
            <span key={li} className="block overflow-hidden pb-[0.05em]">
              <span className="flex justify-center gap-[0.22em]">
                {line.map((w, wi) => (
                  <span key={`${li}-${wi}`} className="inline-block overflow-hidden">
                    <span
                      style={delay(1 + li * LINE_ONE.length + wi)}
                      className={`enter-rise inline-block ${w === "rhythm," ? "text-accent" : ""}`}
                    >
                      {w}
                    </span>
                  </span>
                ))}
              </span>
            </span>
          ))}
        </h1>

        <p
          style={delay(1 + WORDS)}
          className="enter-fade-up mt-8 max-w-xl text-balance text-base text-text-muted sm:text-lg"
        >
          Cadence turns your workday into a tempo you can feel. Time-boxed focus,
          flow-state detection, and silence that actually stays silent.
        </p>

        <div
          style={delay(2 + WORDS)}
          className="enter-fade-up mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Magnetic>
            <SectionLink
              href={WAITLIST_HREF}
              className="block rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-bg transition-transform hover:scale-[1.03] active:scale-95"
            >
              Join the waitlist
            </SectionLink>
          </Magnetic>
          <SectionLink
            href="/#flow"
            className="block rounded-full border border-border bg-surface/40 px-7 py-3.5 text-sm font-medium text-text-primary backdrop-blur-sm transition-colors hover:border-text-muted/40"
          >
            See how it flows
          </SectionLink>
        </div>
      </div>

      {/* Continuous tempo bar visual — clipped to the viewport on small
          screens so the 48 bars never force horizontal overflow. */}
      <div
        style={{ "--d": "0.7s" } as CSSProperties}
        className="enter-fade-up mt-12 flex h-12 w-full max-w-2xl items-end justify-center overflow-hidden px-4 sm:mt-16 sm:h-16"
      >
        <TempoBar
          bars={48}
          className="h-12 gap-[3px] sm:h-16 sm:gap-[4px]"
          barClassName="w-[3px]"
        />
      </div>

      <SectionLink
        href="/#problem"
        aria-label="Scroll to the next section"
        style={{ "--d": "1s" } as CSSProperties}
        className="enter-fade absolute bottom-3 left-1/2 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full text-text-muted transition-colors hover:text-text-primary"
      >
        <ArrowDown className="h-5 w-5 animate-bounce" aria-hidden />
      </SectionLink>
    </section>
  );
}
