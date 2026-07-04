"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

type LenisContextValue = {
  /** Smoothly scroll to a target (selector or offset). Falls back to native. */
  scrollTo: (target: string | number, options?: { offset?: number }) => void;
};

const LenisContext = createContext<LenisContextValue>({
  scrollTo: () => {},
});

export const useLenis = () => useContext(LenisContext);

/**
 * Lenis smooth-scroll foundation, wired into a single GSAP RAF loop so that
 * ScrollTrigger stays perfectly synced (including on resize + touch).
 *
 * Cleans up fully on unmount to avoid leaked RAF loops / ScrollTriggers when
 * the App Router swaps the tree.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduced = prefersReducedMotion();

    // With reduced motion we skip smooth scrolling entirely, but still let
    // ScrollTrigger drive scroll-linked reveals off the native scroller.
    if (reduced) {
      ScrollTrigger.refresh();
      setReady(true);
      return () => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3), // ease-out cubic — buttery, no snap
      smoothWheel: true,
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
    });
    lenisRef.current = lenis;

    // Keep ScrollTrigger in lockstep with Lenis' scroll position.
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker so both share one RAF loop.
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Recalculate trigger positions once fonts/layout settle.
    const refresh = () => ScrollTrigger.refresh();
    const settle = window.setTimeout(refresh, 300);

    setReady(true);

    return () => {
      window.clearTimeout(settle);
      gsap.ticker.remove(raf);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
      lenisRef.current = null;
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const scrollTo: LenisContextValue["scrollTo"] = (target, options) => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target, { offset: options?.offset ?? 0, duration: 1.2 });
      return;
    }
    // Reduced-motion / not-ready fallback.
    if (typeof target === "string") {
      const el = document.querySelector(target);
      el?.scrollIntoView({ behavior: "auto", block: "start" });
    } else if (typeof window !== "undefined") {
      window.scrollTo({ top: target, behavior: "auto" });
    }
  };

  return (
    <LenisContext.Provider value={{ scrollTo }}>
      {children}
      {/* ready gates nothing visually; kept for potential entrance choreography */}
      <span hidden data-scroll-ready={ready} />
    </LenisContext.Provider>
  );
}
