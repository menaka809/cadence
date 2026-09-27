"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ArrowRight, Loader2 } from "lucide-react";
import TempoBar from "./TempoBar";
import Magnetic from "./Magnetic";

const schema = z.object({
  email: z
    .string()
    .min(1, "Enter your email")
    .pipe(z.email("That doesn't look right")),
});

type FormValues = z.infer<typeof schema>;

export default function WaitlistCTA() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: FormValues) => {
    setSubmitError(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.ok === false) {
        setSubmitError(
          json?.error || "Something went wrong. Please try again."
        );
        return;
      }
      setSent(true);
      reset();
    } catch {
      setSubmitError(
        "Network error — please check your connection and try again."
      );
    }
  };

  return (
    <section id="waitlist" className="relative px-5 py-24 sm:px-6 sm:py-32 md:py-44">
      <div className="mx-auto max-w-3xl">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-surface/50 px-5 py-12 text-center sm:px-14 sm:py-16">
          {/* Ambient accent */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-accent/[0.08] blur-[100px]" />
            <div className="absolute inset-0 noise-overlay opacity-50" />
          </div>

          <div className="mb-6 flex justify-center sm:mb-8">
            <TempoBar bars={7} className="h-7 gap-[4px] sm:h-8" />
          </div>

          <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-text-primary sm:text-4xl md:text-5xl">
            Find your cadence.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-text-muted sm:text-base">
            Join the waitlist and be first to work in rhythm. No spam — just one
            note when we open the doors.
          </p>

          <div className="mx-auto mt-10 max-w-md">
            <AnimatePresence mode="wait" initial={false}>
              {sent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center gap-3"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 14,
                      delay: 0.05,
                    }}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-accent"
                  >
                    <motion.span
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                    >
                      <Check className="h-7 w-7 text-bg" strokeWidth={3} />
                    </motion.span>
                  </motion.span>
                  <p className="font-display text-lg font-medium text-text-primary">
                    You&rsquo;re on the list.
                  </p>
                  <p className="text-sm text-text-muted">
                    We&rsquo;ll be in touch when the beat drops.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit(onSubmit)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  noValidate
                  className="text-left"
                >
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="flex-1">
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="you@company.com"
                        aria-label="Email address"
                        aria-invalid={!!errors.email}
                        className={`w-full rounded-full border bg-bg/60 px-5 py-3.5 text-sm text-text-primary placeholder:text-text-muted/60 outline-none transition-colors focus:border-accent/60 ${
                          errors.email ? "border-red-500/60" : "border-border"
                        }`}
                      />
                    </div>
                    <Magnetic>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-bg transition-transform hover:scale-[1.03] active:scale-95 disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            Join
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </Magnetic>
                  </div>
                  <AnimatePresence>
                    {(errors.email || submitError) && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-2 pl-5 text-xs text-red-400"
                      >
                        {errors.email?.message ?? submitError}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
