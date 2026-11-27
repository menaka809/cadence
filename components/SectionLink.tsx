"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useLenis } from "./SmoothScroll";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  /** An in-page section such as "/#pricing". */
  href: string;
  /** Runs before scrolling, e.g. to close the mobile menu. */
  onNavigate?: () => void;
};

/**
 * A real link to a home-page section. Works before hydration and from other
 * pages; on the home page it scrolls smoothly and moves focus to the section.
 */
export default function SectionLink({ href, onNavigate, onClick, ...rest }: Props) {
  const { onSectionLink } = useLenis();
  return (
    <Link
      href={href}
      onClick={(e) => {
        onClick?.(e);
        onSectionLink(href, onNavigate)(e);
      }}
      {...rest}
    />
  );
}
