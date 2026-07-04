"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
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
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setReduced(true);
      return;
    }

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
          onUpdate: (self) => {
            const idx = Math.min(
              PHASES.length - 1,
              Math.round(self.progress * (PHASES.length - 1))
            );
            setActive(idx);
          },
        },
      });

      // Per-panel clip-path reveal, driven by the horizontal container animation.
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]");
      panels.forEach((panel) => {
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

    return () => ctx.revert();
  }, []);

  // ---- Reduced-motion / fallback: a clean vertical stack, no scroll-jack ----
  if (reduced) {
    return (
      <section id="flow" className="px-6 py-28">
        <FlowHeader />
        <div className="mx-auto mt-14 grid max-w-5xl gap-8 md:grid-cols-2">
          {PHASES.map((p) => (
            <div
              key={p.key}
              className="rounded-2xl border border-border bg-surface/40 p-8"
            >
              <PhaseLabel time={p.time} title={p.title} copy={p.copy} />
              <div className="mt-8 flex justify-center">
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
        {/* Intro panel */}
        <div className="flex h-full w-screen flex-shrink-0 flex-col justify-center px-6 sm:px-16">
          <FlowHeader />
        </div>

        {PHASES.map((p, i) => {
          const Mock = p.Mock;
          return (
            <div
              key={p.key}
              data-panel
              className="relative flex h-full w-[92vw] flex-shrink-0 items-center gap-8 px-6 sm:w-[70vw] sm:px-12 lg:w-[58vw]"
            >
              {/* Pulse divider between phases */}
              {i > 0 && <PulseDivider />}

              <div className="grid w-full items-center gap-10 md:grid-cols-2">
                <div data-reveal>
                  <PhaseLabel time={p.time} title={p.title} copy={p.copy} />
                </div>
                <div data-reveal className="flex justify-center md:justify-end">
                  <Mock />
                </div>
              </div>
            </div>
          );
        })}

        {/* Tail spacing */}
        <div className="h-full w-[10vw] flex-shrink-0" />
      </div>

      {/* Progress tracker (pinned overlay) */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 rounded-full border border-border bg-surface/70 px-4 py-2.5 backdrop-blur-xl">
        {PHASES.map((p, i) => (
          <div key={p.key} className="flex items-center gap-2">
            <span
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === active
                  ? "w-7 bg-accent"
                  : i < active
                  ? "w-1.5 bg-accent/40"
                  : "w-1.5 bg-text-muted/30"
              }`}
            />
            <span
              className={`text-[11px] transition-colors duration-500 ${
                i === active ? "text-text-primary" : "text-text-muted"
              }`}
            >
              {p.title}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function FlowHeader() {
  return (
    <div className="max-w-xl">
      <p className="mb-5 flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-accent">
        <span className="h-px w-8 bg-accent/50" />
        A day in Cadence
      </p>
      <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight text-text-primary sm:text-5xl md:text-6xl">
        One continuous
        <br />
        <span className="text-accent">flow.</span>
      </h2>
      <p className="mt-6 text-base text-text-muted sm:text-lg">
        Scroll through a full workday — from first light to shipped. Every phase
        moves to the same beat.
      </p>
      <p className="mt-4 text-xs text-text-muted/70">
        ↓ keep scrolling — the day moves sideways
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
