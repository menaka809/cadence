"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/** Room for the floating navbar when landing on a section. */
const NAV_OFFSET = -80;

type ScrollOptions = { offset?: number; immediate?: boolean };

type LenisContextValue = {
  /** Smoothly scroll to a selector or a page offset. Falls back to native. */
  scrollTo: (target: string | number, options?: ScrollOptions) => void;
  /**
   * Click handler for "/#section" links. On the home page it scrolls there
   * smoothly and moves keyboard focus to the section; elsewhere it lets the
   * link navigate normally.
   */
  onSectionLink: (href: string, after?: () => void) => (e: MouseEvent) => void;
};

const LenisContext = createContext<LenisContextValue>({
  scrollTo: () => {},
  onSectionLink: () => () => {},
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
  const pathname = usePathname();

  useEffect(() => {
    // With reduced motion we skip smooth scrolling entirely, but still let
    // ScrollTrigger work off the native scroller.
    if (prefersReducedMotion()) {
      ScrollTrigger.refresh();
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

    return () => {
      gsap.ticker.remove(raf);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
      lenisRef.current = null;
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const scrollTo = useCallback<LenisContextValue["scrollTo"]>((target, options) => {
    // Resolve selectors to a page offset from the live layout. Lenis' own
    // selector maths uses its cached position, which is stale right after a
    // route change or a native hash jump.
    let top: number;
    if (typeof target === "number") {
      top = target;
    } else {
      const el = document.querySelector(target);
      if (!el) return;
      top = el.getBoundingClientRect().top + window.scrollY + (options?.offset ?? 0);
    }
    top = Math.max(0, top);

    const lenis = lenisRef.current;
    if (lenis && !options?.immediate) {
      lenis.scrollTo(top, { duration: 1.2 });
      return;
    }
    // Instant jump (and the reduced-motion path). Lenis follows native scroll.
    window.scrollTo({ top, behavior: "instant" });
    lenis?.resize();
  }, []);

  const onSectionLink = useCallback<LenisContextValue["onSectionLink"]>(
    (href, after) => (e) => {
      after?.();
      const hash = href.slice(href.indexOf("#"));
      if (pathname !== "/" || !hash.startsWith("#")) return; // normal navigation
      const el = document.querySelector<HTMLElement>(hash);
      if (!el) return;
      e.preventDefault();
      scrollTo(hash, { offset: NAV_OFFSET });
      // Move keyboard focus with the view, without a native scroll jump.
      el.focus({ preventScroll: true });
    },
    [pathname, scrollTo]
  );

  // Arriving at "/#pricing" (fresh load or from /privacy): wait for the
  // pinned timeline to add its scroll distance, then land on the section.
  useEffect(() => {
    if (pathname !== "/" || !window.location.hash) return;
    const hash = window.location.hash;
    const id = window.setTimeout(() => {
      ScrollTrigger.refresh();
      if (document.querySelector(hash)) scrollTo(hash, { offset: NAV_OFFSET, immediate: true });
    }, 350);
    return () => window.clearTimeout(id);
  }, [pathname, scrollTo]);

  // Recalculate trigger positions once web fonts have settled.
  useEffect(() => {
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => ({ scrollTo, onSectionLink }), [scrollTo, onSectionLink]);

  return <LenisContext.Provider value={value}>{children}</LenisContext.Provider>;
}
