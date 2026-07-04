"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

/**
 * Wraps an interactive element and gently pulls it toward the cursor — the
 * Cuberto-style "magnetic" effect. The child keeps its own semantics/styling;
 * only this wrapper translates. Disabled under reduced-motion and harmless on
 * touch (no pointer movement to react to).
 */
export default function Magnetic({
  children,
  strength = 0.35,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const cfg = { stiffness: 220, damping: 16, mass: 0.3 };
  const sx = useSpring(x, cfg);
  const sy = useSpring(y, cfg);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: reduced ? 0 : sx, y: reduced ? 0 : sy }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
