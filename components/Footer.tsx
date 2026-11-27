import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import TempoBar from "./TempoBar";
import SectionLink from "./SectionLink";
import { SECTIONS, WAITLIST_HREF } from "@/lib/nav";
import { REPO_URL } from "@/lib/site";

// Tall enough for a 44px tap target without changing the visual rhythm.
const LINK =
  "inline-flex min-h-11 min-w-11 items-center rounded-md text-text-muted xl:min-h-9 transition-colors hover:text-text-primary";

export default function Footer() {
  return (
    <footer className="relative border-t border-border px-5 pb-8 pt-14 sm:px-6 sm:pt-16">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between md:gap-12">
          <div className="max-w-xs">
            <Link href="/" className="inline-flex min-h-11 items-center gap-2.5 rounded-md">
              <TempoBar bars={4} className="h-4 w-5" />
              <span className="font-display text-lg font-semibold tracking-tight text-text-primary">
                Cadence
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-text-muted">
              Work in rhythm, not in chaos. A focus app that turns your day into
              a tempo you can feel.
            </p>
          </div>

          <nav aria-labelledby="footer-product" className="md:min-w-40">
            <h2 id="footer-product" className="mb-1 text-sm font-medium text-text-primary">
              Product
            </h2>
            <ul className="grid grid-cols-2 gap-x-10 md:grid-cols-1">
              {SECTIONS.map((s) => (
                <li key={s.href}>
                  <SectionLink href={s.href} className={`${LINK} text-sm`}>
                    {s.label}
                  </SectionLink>
                </li>
              ))}
              <li>
                <SectionLink href={WAITLIST_HREF} className={`${LINK} text-sm`}>
                  Join waitlist
                </SectionLink>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-text-muted">© 2026 Cadence. A concept product.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className={`${LINK} text-xs`}>
              Privacy
            </Link>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${LINK} gap-1 text-xs`}
            >
              Source on GitHub
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
