import type { Metadata } from "next";
import Link from "next/link";
import TempoBar from "@/components/TempoBar";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section className="flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
      <TempoBar bars={7} className="mb-2 h-8 gap-1" />
      <p className="font-display text-sm tabular-nums text-accent">404</p>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
        This page is off-beat.
      </h1>
      <p className="max-w-sm text-sm text-text-muted">
        The link may be broken, or the page may have moved.
      </p>
      <Link
        href="/"
        className="mt-3 inline-flex min-h-11 items-center rounded-full bg-accent px-6 text-sm font-semibold text-bg transition-transform hover:scale-[1.03] active:scale-95"
      >
        Back to Cadence
      </Link>
    </section>
  );
}
