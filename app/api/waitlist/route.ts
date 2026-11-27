import { NextResponse } from "next/server";
import { waitlistSchema, type WaitlistResponse } from "@/lib/waitlist";

const RESEND = "https://api.resend.com";
const MAX_BODY_BYTES = 2048;
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

// Privacy rule for this file: never log, echo or return the email address.
// Logs carry only a label, an HTTP status and Resend's error name.

// ---- Rate limit ----------------------------------------------------------
// Best-effort and per instance (it resets on a cold start), which is enough
// to stop casual abuse of a marketing form without adding infrastructure.
const hits = new Map<string, { count: number; start: number }>();

function rateLimit(key: string): number | null {
  const now = Date.now();
  // Prune expired windows so the map can't grow without bound.
  if (hits.size > 500) {
    for (const [k, v] of hits) if (now - v.start > WINDOW_MS) hits.delete(k);
  }
  const rec = hits.get(key);
  if (!rec || now - rec.start > WINDOW_MS) {
    hits.set(key, { count: 1, start: now });
    return null;
  }
  rec.count += 1;
  if (rec.count <= MAX_PER_WINDOW) return null;
  return Math.ceil((rec.start + WINDOW_MS - now) / 1000); // seconds to wait
}

// ---- Helpers ---------------------------------------------------------------
const reply = (body: WaitlistResponse, status = 200, headers?: HeadersInit) =>
  NextResponse.json(body, { status, headers });

const fail = (error: string, status: number, headers?: HeadersInit) =>
  reply({ ok: false, error }, status, headers);

function authHeaders(apiKey: string) {
  return { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
}

/** Log a failed Resend call without its body (bodies can echo the address). */
async function logFailure(label: string, res: Response) {
  let name = "unknown";
  try {
    const data = (await res.json()) as { name?: unknown };
    if (typeof data?.name === "string") name = data.name;
  } catch {
    // Non-JSON error body: status alone is enough.
  }
  console.error(`[waitlist] ${label} failed`, res.status, name);
}

function logThrown(label: string, err: unknown) {
  console.error(`[waitlist] ${label} threw`, err instanceof Error ? err.name : "error");
}

async function resend(apiKey: string, path: string, init?: { method?: string; body?: unknown }) {
  return fetch(`${RESEND}${path}`, {
    method: init?.method ?? "GET",
    headers: authHeaders(apiKey),
    body: init?.body === undefined ? undefined : JSON.stringify(init.body),
    cache: "no-store",
  });
}

/** true = already a contact, false = not found, null = couldn't tell. */
async function contactExists(apiKey: string, email: string): Promise<boolean | null> {
  try {
    const res = await resend(apiKey, `/contacts/${encodeURIComponent(email)}`);
    if (res.ok) return true;
    if (res.status === 404) return false;
    await logFailure("contact lookup", res);
    return null;
  } catch (err) {
    logThrown("contact lookup", err);
    return null;
  }
}

// Resend rejects properties it doesn't know, so fall back rather than lose the contact.
async function storeContact(apiKey: string, email: string) {
  const contact = { email, unsubscribed: false };
  try {
    const enriched = await resend(apiKey, "/contacts", {
      method: "POST",
      body: {
        ...contact,
        properties: { source: "cadence-waitlist", signed_up_at: new Date().toISOString() },
      },
    });
    if (enriched.ok) return true;
    await logFailure("contact store (with properties)", enriched);

    const plain = await resend(apiKey, "/contacts", { method: "POST", body: contact });
    if (plain.ok) return true;
    await logFailure("contact store", plain);
    return false;
  } catch (err) {
    logThrown("contact store", err);
    return false;
  }
}

async function sendEmail(apiKey: string, payload: Record<string, unknown>, label: string) {
  try {
    const res = await resend(apiKey, "/emails", { method: "POST", body: payload });
    if (res.ok) return true;
    await logFailure(label, res);
    return false;
  } catch (err) {
    logThrown(label, err);
    return false;
  }
}

const WELCOME_TEXT =
  "You're on the list.\n\nThanks for joining the Cadence waitlist — you'll get one note from us when we open the doors. No spam, ever.\n\n— The Cadence team";

const WELCOME_HTML = `
  <div style="font-family:system-ui,-apple-system,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#1a1a1a">
    <h1 style="font-size:22px;margin:0 0 16px">You&rsquo;re on the list.</h1>
    <p style="font-size:15px;line-height:1.6;color:#555;margin:0 0 16px">
      Thanks for joining the <strong>Cadence</strong> waitlist — you&rsquo;ll get
      one note from us when we open the doors. No spam, ever.
    </p>
    <p style="font-size:13px;color:#888;margin:24px 0 0">— The Cadence team</p>
  </div>
`;

// ---- Route -----------------------------------------------------------------
export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const wait = rateLimit(ip);
  if (wait !== null) {
    return fail("Too many tries. Please wait a minute and try again.", 429, {
      "Retry-After": String(wait),
    });
  }

  // Refuse oversized payloads before and after reading (the header can lie).
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return fail("Invalid request.", 413);
  }
  const raw = await req.text().catch(() => "");
  if (raw.length > MAX_BODY_BYTES) return fail("Invalid request.", 413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return fail("Invalid request.", 400);
  }

  // Honeypot: bots get a normal-looking success and nothing happens.
  const trap = (body as { company?: unknown } | null)?.company;
  if (typeof trap === "string" && trap.trim() !== "") {
    return reply({ ok: true, status: "joined" });
  }

  const parsed = waitlistSchema.safeParse(body);
  if (!parsed.success) return fail("Please enter a valid email address.", 422);
  const { email } = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      // Local development without Resend: accept so the UI can be exercised.
      console.warn("[waitlist] RESEND_API_KEY not set; signup accepted but not stored");
      return reply({ ok: true, status: "joined" });
    }
    console.error("[waitlist] RESEND_API_KEY not set in production");
    return fail("The waitlist is unavailable right now. Please try again later.", 503);
  }

  // Already on the list: say so, and don't send duplicate emails.
  if ((await contactExists(apiKey, email)) === true) {
    return reply({ ok: true, status: "duplicate" });
  }

  const from = process.env.WAITLIST_FROM || "Cadence <onboarding@resend.dev>";
  const ownerInbox = process.env.WAITLIST_TO;

  const stored = await storeContact(apiKey, email);

  let notified = false;
  if (ownerInbox) {
    notified = await sendEmail(
      apiKey,
      {
        from,
        to: ownerInbox,
        reply_to: email,
        subject: "New Cadence waitlist signup",
        text: `New waitlist signup: ${email}\n\nSaved to contacts: ${stored ? "yes" : "NO, add it manually"}`,
      },
      "owner notification"
    );
  } else {
    console.warn("[waitlist] WAITLIST_TO not set; skipping owner notification");
  }

  // Only reaches non-owner addresses once a domain is verified; never fails the signup.
  await sendEmail(
    apiKey,
    {
      from,
      to: email,
      // Replies (e.g. "please remove me") reach a real inbox, as /privacy promises.
      ...(ownerInbox ? { reply_to: ownerInbox } : {}),
      subject: "You're on the Cadence waitlist",
      text: WELCOME_TEXT,
      html: WELCOME_HTML,
    },
    "subscriber welcome"
  );

  // The signup is only lost if it was neither stored nor forwarded to the owner.
  if (!stored && !notified) {
    return fail("Something went wrong on our side. Please try again.", 502);
  }

  return reply({ ok: true, status: "joined" });
}
