import { z } from "zod";

/** Shared by the form (client-side hints) and the API route (the real check). */
export const waitlistSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Enter your email")
    .max(254, "That email is too long")
    .pipe(z.email("That doesn't look like an email address"))
    .transform((v) => v.toLowerCase()),
  /**
   * Honeypot. Hidden from people, so only bots fill it in. It's checked
   * before the schema runs; any value here means "silently accept".
   */
  company: z.string().max(200).optional(),
});

export type WaitlistInput = z.input<typeof waitlistSchema>;

export type WaitlistResponse =
  | { ok: true; status: "joined" | "duplicate" }
  | { ok: false; error: string };
