"use client";

import TempoBar from "./TempoBar";

const COLUMNS = [
  {
    title: "Product",
    links: ["Flow", "Features", "Pricing", "Changelog"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Manifesto", "Press"],
  },
  {
    title: "Resources",
    links: ["Blog", "Help center", "Community", "Status"],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-border px-5 pb-10 pt-14 sm:px-6 sm:pt-16">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between md:gap-12">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <TempoBar bars={4} className="h-4 w-5" />
              <span className="font-display text-lg font-semibold tracking-tight text-text-primary">
                Cadence
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-text-muted">
              Work in rhythm, not in chaos. A focus app that turns your day into
              a tempo you can feel.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h4 className="mb-3 text-sm font-medium text-text-primary">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        className="text-sm text-text-muted transition-colors hover:text-text-primary"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-text-muted">
            © {2026} Cadence Labs. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-text-muted hover:text-text-primary">
              Privacy
            </a>
            <a href="#" className="text-xs text-text-muted hover:text-text-primary">
              Terms
            </a>
            <a href="#" className="text-xs text-text-muted hover:text-text-primary">
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
