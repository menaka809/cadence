import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  email: z.string().min(1).pipe(z.email()),
});

const RESEND = "https://api.resend.com";
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, { count: number; ts: number }>();

// Best-effort rate limit; resets on cold start.
function isRateLimited(ip: string) {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.ts > WINDOW_MS) {
    hits.set(ip, { count: 1, ts: now });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_PER_WINDOW;
}

function authHeaders(apiKey: string) {
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
}

async function sendEmail(
  apiKey: string,
  payload: Record<string, unknown>,
  label: string
) {
  try {
    const res = await fetch(`${RESEND}/emails`, {
      method: "POST",
      headers: authHeaders(apiKey),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error(`[waitlist] ${label} failed`, res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[waitlist] ${label} threw`, err);
    return false;
  }
}

// Resend rejects properties it doesn't know, so fall back rather than lose the contact.
async function storeContact(apiKey: string, email: string) {
  const contact = { email, unsubscribed: false };
  const post = (payload: Record<string, unknown>) =>
    fetch(`${RESEND}/contacts`, {
      method: "POST",
      headers: authHeaders(apiKey),
      body: JSON.stringify(payload),
    });

  try {
    const enriched = await post({
      ...contact,
      properties: {
        source: "cadence-waitlist",
        signed_up_at: new Date().toISOString(),
      },
    });
    if (enriched.ok) return true;

    console.warn(
      "[waitlist] properties rejected, retrying without them",
      enriched.status,
      await enriched.text()
    );

    const plain = await post(contact);
    if (plain.ok) return true;

    console.error("[waitlist] contact store failed", plain.status, await plain.text());
    return false;
  } catch (err) {
    console.error("[waitlist] contact store threw", err);
    return false;
  }
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests — please try again shortly." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 422 }
    );
  }

  const email = parsed.data.email.trim().toLowerCase();
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.WAITLIST_TO || "malithmenaka96@gmail.com";
  const from = process.env.WAITLIST_FROM || "Cadence <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn(`[waitlist] RESEND_API_KEY not set — not stored: ${email}`);
    return NextResponse.json({ ok: true, stored: false, welcomed: false });
  }

  const stored = await storeContact(apiKey, email);

  const notified = await sendEmail(
    apiKey,
    {
      from,
      to,
      reply_to: email,
      subject: "New Cadence waitlist signup",
      text: `New waitlist signup: ${email}\n\nSaved to list: ${stored ? "yes" : "NO"}`,
    },
    "owner notification"
  );

  // Only reaches non-owner addresses once a domain is verified; never fails the signup.
  const welcomed = await sendEmail(
    apiKey,
    {
      from,
      to: email,
      subject: "You're on the Cadence waitlist",
      text: "You're on the list.\n\nThanks for joining the Cadence waitlist — you'll get one note from us when we open the doors. No spam, ever.\n\n— The Cadence team",
      html: `
        <div style="font-family:system-ui,-apple-system,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#1a1a1a">
          <h1 style="font-size:22px;margin:0 0 16px">You&rsquo;re on the list.</h1>
          <p style="font-size:15px;line-height:1.6;color:#555;margin:0 0 16px">
            Thanks for joining the <strong>Cadence</strong> waitlist — you&rsquo;ll get
            one note from us when we open the doors. No spam, ever.
          </p>
          <p style="font-size:13px;color:#888;margin:24px 0 0">— The Cadence team</p>
        </div>
      `,
    },
    "subscriber welcome"
  );

  if (!stored && !notified) {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, stored, welcomed });
}
