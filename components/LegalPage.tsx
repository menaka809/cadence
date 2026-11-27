import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { LEGAL_UPDATED } from "@/lib/site";

/** Reading layout for long-form pages such as /privacy. */
export default function LegalPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <article className="px-5 pb-24 pt-32 sm:px-6 sm:pt-40">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 rounded-full text-sm text-text-muted transition-colors hover:text-text-primary"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to Cadence
        </Link>
        <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-text-muted">Last updated {LEGAL_UPDATED}</p>
        <p className="mt-8 text-base leading-relaxed text-text-primary/90">{intro}</p>
        <div className="legal mt-2">{children}</div>
      </div>
    </article>
  );
}
