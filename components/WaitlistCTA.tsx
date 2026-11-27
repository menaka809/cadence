"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ArrowRight, Loader2, BellRing } from "lucide-react";
import TempoBar from "./TempoBar";
import Magnetic from "./Magnetic";
import { waitlistSchema, type WaitlistInput, type WaitlistResponse } from "@/lib/waitlist";

type Output = z.output<typeof waitlistSchema>;
type Done = "joined" | "duplicate";

const MESSAGES = {
  network: "Couldn't reach the server. Check your connection and try again.",
  fallback: "Something went wrong. Please try again.",
};

export default function WaitlistCTA() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<WaitlistInput, unknown, Output>({
    resolver: zodResolver(waitlistSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const [done, setDone] = useState<Done | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // Set when the user starts over, so the email field is focused once the
  // form has animated back in (AnimatePresence mounts it after the exit).
  const refocusEmail = useRef(false);

  // Focus the result heading the moment it mounts, so keyboard and
  // screen-reader users land on the outcome.
  const focusOnMount = useCallback((el: HTMLHeadingElement | null) => el?.focus(), []);

  const onSubmit = async (data: Output) => {
    setSubmitError(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => null)) as WaitlistResponse | null;
      if (!res.ok || !json || !json.ok) {
        setSubmitError(json && !json.ok ? json.error : MESSAGES.fallback);
        return; // keep what they typed so they can retry
      }
      setDone(json.status);
      reset();
    } catch {
      setSubmitError(MESSAGES.network);
    }
  };

  const startOver = () => {
    refocusEmail.current = true;
    setDone(null);
    setSubmitError(null);
  };

  const emailField = register("email", {
    onChange: () => submitError && setSubmitError(null),
  });
  const emailRef = (el: HTMLInputElement | null) => {
    emailField.ref(el);
    if (el && refocusEmail.current) {
      refocusEmail.current = false;
      el.focus();
    }
  };

  const message = errors.email?.message ?? submitError;

  return (
    <section
      id="waitlist"
      tabIndex={-1}
      aria-labelledby="waitlist-title"
      className="relative px-5 py-24 sm:px-6 sm:py-28"
    >
      <div className="mx-auto max-w-3xl">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-surface/50 px-5 py-12 text-center sm:px-14 sm:py-16">
          {/* Ambient accent */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-accent/8 blur-[100px]" />
            <div className="absolute inset-0 noise-overlay opacity-50" />
          </div>

          <div className="mb-6 flex justify-center sm:mb-8">
            <TempoBar bars={7} className="h-7 gap-1 sm:h-8" />
          </div>

          <h2
            id="waitlist-title"
            className="font-display text-3xl font-semibold leading-tight tracking-tight text-text-primary sm:text-4xl md:text-5xl"
          >
            Find your cadence.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-text-muted sm:text-base">
            Join the waitlist and be first to work in rhythm. No spam — just one
            note when we open the doors.
          </p>

          <div className="mx-auto mt-10 max-w-md">
            <AnimatePresence mode="wait" initial={false}>
              {done ? (
                <motion.div
                  key="done"
                  role="status"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center gap-3"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 14, delay: 0.05 }}
                    className={`flex h-14 w-14 items-center justify-center rounded-full ${
                      done === "joined" ? "bg-accent" : "border border-accent/40 bg-accent/10"
                    }`}
                  >
                    {done === "joined" ? (
                      <Check className="h-7 w-7 text-bg" strokeWidth={3} aria-hidden />
                    ) : (
                      <BellRing className="h-6 w-6 text-accent" aria-hidden />
                    )}
                  </motion.span>
                  <h3
                    ref={focusOnMount}
                    tabIndex={-1}
                    className="font-display text-lg font-medium text-text-primary"
                  >
                    {done === "joined" ? "You’re on the list." : "You’re already on the list."}
                  </h3>
                  <p className="text-sm text-text-muted">
                    {done === "joined"
                      ? "We’ll be in touch when the beat drops."
                      : "No need to sign up twice. We’ll email you when we open the doors."}
                  </p>
                  <button
                    type="button"
                    onClick={startOver}
                    className="mt-1 min-h-11 rounded-full px-4 text-sm text-text-muted underline-offset-4 transition-colors hover:text-text-primary hover:underline"
                  >
                    Use another email
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit(onSubmit)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  noValidate
                  aria-busy={isSubmitting}
                  className="relative text-left"
                >
                  <label htmlFor="waitlist-email" className="sr-only">
                    Email address
                  </label>
                  {/* Honeypot: off-screen and skipped by keyboard and screen readers */}
                  <div aria-hidden className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
                    <label htmlFor="waitlist-company">Company</label>
                    <input
                      id="waitlist-company"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      {...register("company")}
                    />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="flex-1">
                      <input
                        id="waitlist-email"
                        {...emailField}
                        ref={emailRef}
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        spellCheck={false}
                        placeholder="you@company.com"
                        readOnly={isSubmitting}
                        aria-invalid={!!errors.email}
                        aria-describedby={message ? "waitlist-message" : undefined}
                        className={`min-h-12 w-full rounded-full border bg-bg/60 px-5 py-3.5 text-sm text-text-primary outline-none transition-[border-color,box-shadow] placeholder:text-text-muted focus:border-accent/60 focus:ring-2 focus:ring-accent/25 ${
                          message ? "border-red-400/70" : "border-border"
                        }`}
                      />
                    </div>
                    <Magnetic className="sm:shrink-0">
                      <button
                        type="submit"
                        aria-disabled={isSubmitting}
                        onClick={(e) => isSubmitting && e.preventDefault()}
                        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-bg transition-transform hover:scale-[1.03] active:scale-95 aria-disabled:cursor-wait aria-disabled:opacity-80 aria-disabled:hover:scale-100 sm:min-w-32"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                            Joining…
                          </>
                        ) : (
                          <>
                            Join
                            <ArrowRight className="h-4 w-4" aria-hidden />
                          </>
                        )}
                      </button>
                    </Magnetic>
                  </div>
                  {/* Reserved line so an error doesn't push the layout down */}
                  <div className="mt-2 min-h-5 pl-5">
                    <AnimatePresence>
                      {message && (
                        <motion.p
                          id="waitlist-message"
                          role="alert"
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-xs text-red-400"
                        >
                          {message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <p className="mt-2 text-center text-xs text-text-muted">
                    Your email is only used for Cadence updates.{" "}
                    <Link
                      href="/privacy"
                      className="relative underline underline-offset-2 transition-colors after:absolute after:-inset-3.5 after:content-[''] hover:text-text-primary"
                    >
                      Privacy
                    </Link>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
