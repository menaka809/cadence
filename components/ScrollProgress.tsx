"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * A thin "tempo line" at the very top of the viewport that fills as you scroll.
 * Progress is computed manually and clamped to [0, 1] so it reliably reaches
 * 100% at the bottom (framer's useScroll can top out just below 1 under Lenis),
 * then spring-smoothed so it eases like everything else in Cadence.
 */
export default function ScrollProgress() {
  const progress = useMotionValue(0);
  const scaleX = useSpring(progress, {
    stiffness: 140,
    damping: 30,
    mass: 0.3,
    // Without a tiny restDelta the spring settles ~1% short of the target,
    // leaving a visible gap at the end of the bar. Force it to reach 100%.
    restDelta: 0.0002,
  });

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      progress.set(Math.min(1, Math.max(0, p)));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [progress]);

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-accent shadow-[0_0_12px_rgba(198,255,61,0.55)]"
    />
  );
}
