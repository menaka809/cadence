"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import RollingNumber from "./RollingNumber";
import { useLenis } from "./SmoothScroll";

type Plan = {
  name: string;
  monthly: number;
  annual: number; // per-month price when billed annually
  blurb: string;
  features: string[];
  featured?: boolean;
};

const PLANS: Plan[] = [
  {
    name: "Free",
    monthly: 0,
    annual: 0,
    blurb: "For finding your rhythm.",
    features: ["3 Tempo Blocks / day", "Basic silent mode", "Daily recap"],
  },
  {
    name: "Pro",
    monthly: 12,
    annual: 10,
    blurb: "For individuals in deep work.",
    features: [
      "Unlimited Tempo Blocks",
      "Flow-state detection",
      "Full silent mode",
      "Weekly rhythm insights",
    ],
    featured: true,
  },
  {
    name: "Team",
    monthly: 29,
    annual: 24,
    blurb: "For teams that ship together.",
    features: [
      "Everything in Pro",
      "Shared team tempo",
      "Focus-time analytics",
      "Priority support",
    ],
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(false);
  const { scrollTo } = useLenis();

  return (
    <section id="pricing" className="relative px-6 py-28 md:py-36">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 flex flex-col items-center text-center">
          <p className="mb-5 flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-accent">
            <span className="h-px w-8 bg-accent/50" />
            Pricing
          </p>
          <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight text-text-primary sm:text-5xl">
            Priced to keep pace.
          </h2>

          {/* Toggle */}
          <div className="mt-10 flex items-center gap-4">
            <span
              className={`text-sm transition-colors ${
                !annual ? "text-text-primary" : "text-text-muted"
              }`}
            >
              Monthly
            </span>
            <button
              role="switch"
              aria-checked={annual}
              onClick={() => setAnnual((v) => !v)}
              className="relative h-7 w-13 rounded-full border border-border bg-surface p-1 transition-colors"
              style={{ width: "3.25rem" }}
            >
              <motion.span
                layout
                transition={{ type: "spring", stiffness: 500, damping: 32 }}
                className={`block h-5 w-5 rounded-full bg-accent ${
                  annual ? "ml-auto" : ""
                }`}
              />
            </button>
            <span
              className={`flex items-center gap-2 text-sm transition-colors ${
                annual ? "text-text-primary" : "text-text-muted"
              }`}
            >
              Annual
              <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {PLANS.map((plan, i) => {
            const price = annual ? plan.annual : plan.monthly;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.09,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`relative flex flex-col rounded-2xl border p-7 ${
                  plan.featured
                    ? "border-accent/40 bg-surface"
                    : "border-border bg-surface/40"
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-7 rounded-full bg-accent px-3 py-1 text-[11px] font-semibold text-bg">
                    Most popular
                  </span>
                )}

                <h3 className="font-display text-lg font-semibold text-text-primary">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-text-muted">{plan.blurb}</p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="inline-flex items-baseline font-display text-5xl font-semibold leading-none text-text-primary">
                    $
                    <RollingNumber value={price} />
                  </span>
                  <span className="text-sm text-text-muted">
                    {price === 0 ? "forever" : "/mo"}
                  </span>
                </div>
                {/* Always reserve this line so cards don't resize on toggle */}
                <span className="mt-2 block h-4 text-xs text-text-muted">
                  {annual && price > 0 ? `billed $${price * 12}/year` : ""}
                </span>

                <button
                  onClick={() => scrollTo("#waitlist", { offset: -40 })}
                  className={`mt-7 rounded-full px-5 py-3 text-sm font-medium transition-transform hover:scale-[1.02] active:scale-95 ${
                    plan.featured
                      ? "bg-accent text-bg"
                      : "border border-border bg-bg/40 text-text-primary hover:border-text-muted/40"
                  }`}
                >
                  {plan.monthly === 0 ? "Start free" : "Join waitlist"}
                </button>

                <ul className="mt-7 space-y-3 border-t border-border pt-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                      <span className="text-text-muted">{f}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
