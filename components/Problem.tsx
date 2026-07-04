"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

const TEXT =
  "Most tools bury you in checklists and notifications. Every ping fractures your attention, and the day dissolves into busywork. Cadence works differently — it gives your focus a beat to move to.";

export default function Problem() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const words = Array.from(
      root.querySelectorAll<HTMLElement>("[data-word]")
    );
    if (!words.length) return;

    if (prefersReducedMotion()) {
      gsap.set(words, { opacity: 1, filter: "blur(0px)", y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(words, { opacity: 0.08, filter: "blur(8px)", y: 10 });

      gsap.to(words, {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        ease: "none",
        stagger: 0.5,
        scrollTrigger: {
          trigger: root,
          start: "top 75%",
          end: "bottom 60%",
          scrub: 0.6,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const highlight = new Set(["Cadence", "beat", "focus"]);

  return (
    <section id="problem" className="relative px-5 py-24 sm:px-6 sm:py-32 md:py-44">
      <div ref={rootRef} className="mx-auto max-w-4xl">
        <p className="mb-8 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-accent sm:mb-10 sm:text-sm">
          <span className="h-px w-8 bg-accent/50" />
          The problem
        </p>
        <p className="font-display text-[1.75rem] font-medium leading-snug tracking-tight text-text-primary sm:text-4xl sm:leading-[1.35] md:text-[2.75rem] md:leading-[1.3]">
          {TEXT.split(" ").map((w, i) => {
            const clean = w.replace(/[^a-zA-Z]/g, "");
            return (
              <span
                key={i}
                data-word
                className={`inline-block ${
                  highlight.has(clean) ? "text-accent" : ""
                }`}
              >
                {w}
                {" "}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}
