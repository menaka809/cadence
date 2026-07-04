"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useLenis } from "./SmoothScroll";
import {
  MorningMock,
  DeepWorkMock,
  BreakMock,
  ShippedMock,
} from "./flow/PhaseMockups";

const PHASES = [
  {
    key: "morning",
    time: "09:00",
    title: "Morning",
    copy: "Lay out the day as Tempo Blocks. Cadence sets the beat before the noise starts.",
    Mock: MorningMock,
  },
  {
    key: "deep",
    time: "10:15",
    title: "Deep Work",
    copy: "Flow-state detection kicks in. The timer breathes, distractions fall away.",
    Mock: DeepWorkMock,
  },
  {
    key: "break",
    time: "12:30",
    title: "Break",
    copy: "The tempo eases. Silent mode holds the line so rest actually rests.",
    Mock: BreakMock,
  },
  {
    key: "shipped",
    time: "18:00",
    title: "Shipped",
    copy: "The day closes in rhythm — a clean recap of everything you moved.",
    Mock: ShippedMock,
  },
] as const;

export default function FlowTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  // The main pinned ScrollTrigger (real page-scroll coords) + panel elements,
  // used to compute where to jump when a stepper dot is clicked.
  const mainStRef = useRef<ScrollTrigger | null>(null);
  const panelElsRef = useRef<HTMLElement[]>([]);
  // -1 = the intro panel is centered (no phase yet); 0..n = that phase.
  const [active, setActive] = useState(-1);
  // Default to the stacked layout so SSR and the first client render match
  // (no hydration mismatch) and small screens never flash the horizontal
  // track. Upgraded to "horizontal" on tablet/desktop with motion allowed.
  const [mode, setMode] = useState<"stacked" | "horizontal">("stacked");
  const { scrollTo } = useLenis();

  // Scroll so the clicked phase sits centered within the pinned timeline.
  // The horizontal translate maps linearly to the pin's scroll range, so we
  // convert the panel's centered position into a page-scroll offset.
  const jumpToPhase = (i: number) => {
    const st = mainStRef.current;
    const panel = panelElsRef.current[i];
    const track = trackRef.current;
    if (!st || !panel || !track) return;

    const distance = track.scrollWidth - window.innerWidth;
    if (distance <= 0) return;

    // offsetLeft ignores the live transform, giving the panel's layout x.
    const panelCenter = panel.offsetLeft + panel.offsetWidth / 2;
    const progress = Math.min(
      1,
      Math.max(0, (panelCenter - window.innerWidth / 2) / distance)
    );
    scrollTo(st.start + progress * (st.end - st.start));
  };

  // Choose the layout from viewport size + motion preference, and keep it in
  // sync on resize / orientation change. The scroll-jack needs both enough
  // width and enough height, so landscape phones fall back to the stack.
  useEffect(() => {
    const sizeMq = window.matchMedia("(min-width: 768px) and (min-height: 600px)");
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () =>
      setMode(sizeMq.matches && !motionMq.matches ? "horizontal" : "stacked");
    update();
    sizeMq.addEventListener("change", update);
    motionMq.addEventListener("change", update);
    return () => {
      sizeMq.removeEventListener("change", update);
      motionMq.removeEventListener("change", update);
    };
  }, []);

  // Horizontal scroll-jack — wired up only in horizontal mode, torn down
  // cleanly when switching to the stack.
  useEffect(() => {
    if (mode !== "horizontal") return;

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const getDistance = () =>
        Math.max(0, track.scrollWidth - window.innerWidth);

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + getDistance(),
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      mainStRef.current = tween.scrollTrigger ?? null;

      // Reset the tracker to its intro state whenever the intro is centered,
      // so it doesn't claim "Morning" before the Morning card enters.
      const intro = section.querySelector<HTMLElement>("[data-intro]");
      if (intro) {
        ScrollTrigger.create({
          trigger: intro,
          containerAnimation: tween,
          start: "left center",
          end: "right center",
          onToggle: (self) => {
            if (self.isActive) setActive(-1);
          },
        });
      }

      // Per-panel clip-path reveal, driven by the horizontal container animation.
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]");
      panelElsRef.current = panels;
      panels.forEach((panel, i) => {
        // Drive the phase tracker off the panel that's actually centered,
        // so it can't say "Morning" while the intro is still on screen.
        ScrollTrigger.create({
          trigger: panel,
          containerAnimation: tween,
          start: "left center",
          end: "right center",
          onToggle: (self) => {
            if (self.isActive) setActive(i);
          },
        });

        const reveal = panel.querySelectorAll<HTMLElement>("[data-reveal]");
        gsap.set(reveal, {
          clipPath: "inset(0 100% 0 0)",
          opacity: 0,
          y: 24,
        });
        gsap.to(reveal, {
          clipPath: "inset(0 0% 0 0)",
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: panel,
            containerAnimation: tween,
            start: "left 65%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, section);

    return () => {
      ctx.revert();
      mainStRef.current = null;
      panelElsRef.current = [];
    };
  }, [mode]);

  // ---- Mobile / short / reduced-motion: a clean vertical stack ----
  if (mode === "stacked") {
    return (
      <section id="flow" className="px-5 py-20 sm:px-6 sm:py-28">
        <FlowHeader stacked />
        <div className="mx-auto mt-10 grid max-w-5xl gap-5 sm:mt-14 sm:gap-8 md:grid-cols-2">
          {PHASES.map((p) => (
            <div
              key={p.key}
              className="rounded-2xl border border-border bg-surface/40 p-6 sm:p-8"
            >
              <PhaseLabel time={p.time} title={p.title} copy={p.copy} />
              <div className="mt-7 flex justify-center sm:mt-8">
                <p.Mock />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="flow"
      className="relative h-screen overflow-hidden"
    >
      {/* Horizontal track */}
      <div
        ref={trackRef}
        className="flex h-full items-center will-change-transform"
      >
        {/* Intro panel — kept just above the reveal threshold so the first
            phase (Morning) begins entering almost immediately, no dead space.
            paddingLeft matches the site's centered container gutter so the
            heading lines up with the other sections. */}
        <div
          data-intro
          className="flex h-full w-[74vw] flex-shrink-0 flex-col justify-center pr-6 lg:w-[70vw]"
          style={{ paddingLeft: "max(1.5rem, calc((100vw - 64rem) / 2))" }}
        >
          <FlowHeader />
        </div>

        {PHASES.map((p, i) => {
          const Mock = p.Mock;
          return (
            <div
              key={p.key}
              data-panel
              className="relative flex h-full w-[76vw] flex-shrink-0 items-center gap-8 px-8 sm:w-[70vw] sm:px-12 lg:w-[58vw]"
            >
              {/* Pulse divider between phases */}
              {i > 0 && <PulseDivider />}

              {/* Centered label + mock group so they sit close together
                  instead of being pushed to opposite edges of a wide panel. */}
              <div className="flex w-full flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-center lg:gap-14">
                <div data-reveal className="w-full lg:w-auto lg:shrink-0">
                  <PhaseLabel time={p.time} title={p.title} copy={p.copy} />
                </div>
                <div
                  data-reveal
                  className="flex w-full justify-center lg:w-[27rem] lg:shrink-0"
                >
                  <Mock />
                </div>
              </div>
            </div>
          );
        })}

        {/* Tail spacing */}
        <div className="h-full w-[5vw] flex-shrink-0" />
      </div>

      <PhaseTracker active={active} onJump={jumpToPhase} />
    </section>
  );
}

/**
 * "Day timeline" tracker — a prominent, animated time + phase readout above a
 * dot stepper whose connectors fill as you advance through the day.
 */
function PhaseTracker({
  active,
  onJump,
}: {
  active: number;
  onJump: (i: number) => void;
}) {
  const isIntro = active < 0;
  const current = PHASES[active];
  return (
    <div className="pointer-events-none absolute bottom-7 left-1/2 z-10 w-[min(92vw,340px)] -translate-x-1/2">
      <div className="rounded-2xl border border-border bg-surface/70 px-6 py-4 backdrop-blur-xl">
        {/* Active phase readout (intro state until the first phase centers) */}
        <div className="mb-3 flex items-center justify-center gap-2.5 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={isIntro ? "intro" : current.key}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2.5"
            >
              {isIntro ? (
                <span className="flex items-center gap-2.5">
                  <span className="font-display text-sm font-medium text-text-muted">
                    A day in Cadence
                  </span>
                  <span className="relative flex h-5 w-8 items-center overflow-hidden rounded-full bg-accent/15">
                    <span className="animate-nudge-x flex w-full items-center justify-center text-accent">
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                    </span>
                  </span>
                </span>
              ) : (
                <>
                  <span className="font-display text-sm tabular-nums text-accent">
                    {current.time}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-text-muted/50" />
                  <span className="font-display text-sm font-medium text-text-primary">
                    {current.title}
                  </span>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dot stepper — dots are clickable to jump to a phase */}
        <div className="pointer-events-auto flex items-center">
          {PHASES.map((p, i) => (
            <Fragment key={p.key}>
              {i > 0 && (
                <div className="relative mx-1.5 h-px flex-1 bg-border">
                  <div
                    className="absolute inset-0 origin-left bg-accent transition-transform duration-500 ease-out"
                    style={{ transform: `scaleX(${i <= active ? 1 : 0})` }}
                  />
                </div>
              )}
              <button
                type="button"
                onClick={() => onJump(i)}
                aria-label={`Jump to ${p.title}`}
                aria-current={i === active ? "step" : undefined}
                className="group relative flex h-6 w-6 items-center justify-center"
              >
                {i === active && (
                  <span className="absolute h-3.5 w-3.5 rounded-full bg-accent/25 animate-heartbeat" />
                )}
                <span
                  className={`h-2.5 w-2.5 rounded-full transition-all duration-500 group-hover:scale-125 ${
                    i === active
                      ? "bg-accent"
                      : i < active
                      ? "bg-accent/50 group-hover:bg-accent/80"
                      : "bg-text-muted/30 group-hover:bg-text-muted/60"
                  }`}
                />
              </button>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

function FlowHeader({ stacked = false }: { stacked?: boolean }) {
  return (
    <div className="max-w-xl">
      <p className="mb-4 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-accent sm:mb-5 sm:text-sm">
        <span className="h-px w-8 bg-accent/50" />
        A day in Cadence
      </p>
      <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight text-text-primary sm:text-5xl md:text-6xl">
        One continuous
        <br />
        <span className="text-accent">flow.</span>
      </h2>
      <p className="mt-5 text-base text-text-muted sm:mt-6 sm:text-lg">
        A full workday — from first light to shipped. Every phase moves to the
        same beat.
      </p>
      <p className="mt-4 text-xs text-text-muted/70">
        {stacked
          ? "↓ scroll on — one phase at a time"
          : "↓ keep scrolling — the day unfolds sideways"}
      </p>
    </div>
  );
}

function PhaseLabel({
  time,
  title,
  copy,
}: {
  time: string;
  title: string;
  copy: string;
}) {
  return (
    <div>
      <span className="font-display text-sm tabular-nums text-accent">
        {time}
      </span>
      <h3 className="mt-2 font-display text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
        {title}
      </h3>
      <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-muted">
        {copy}
      </p>
    </div>
  );
}

function PulseDivider() {
  return (
    <div className="absolute left-0 top-1/2 flex h-40 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center">
      <span className="h-full w-px bg-gradient-to-b from-transparent via-border to-transparent" />
      <span className="animate-heartbeat absolute h-3 w-3 rounded-full bg-accent shadow-[0_0_18px_4px_rgba(198,255,61,0.5)]" />
    </div>
  );
}
