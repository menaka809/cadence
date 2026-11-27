"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import SmoothScroll from "./SmoothScroll";

/**
 * Client-side providers. MotionConfig makes every framer-motion animation
 * honour the OS "reduce motion" setting: transforms are skipped and only
 * opacity/colour changes remain.
 */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>{children}</SmoothScroll>
    </MotionConfig>
  );
}
