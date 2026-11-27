import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { BRAND, TempoMark } from "@/lib/brand";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const alt = `${SITE_NAME}: ${SITE_TAGLINE}. A focus app landing page.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// A frozen frame of the hero's 48-bar tempo strip: a gentle wave of heights.
const BARS = Array.from({ length: 48 }, (_, i) => {
  const wave = Math.sin(i * 0.55) * 0.5 + Math.sin(i * 0.21 + 1) * 0.5;
  return 0.3 + ((wave + 1) / 2) * 0.7; // 0.3–1.0 of the strip height
});

/** Link-preview card (LinkedIn, Slack, X…) in the site's look. */
export default async function OpenGraphImage() {
  // Same Clash Display file the site self-hosts (satori needs woff, not woff2).
  const clash = await readFile(
    join(process.cwd(), "app/fonts/clash-display/ClashDisplay-600.woff")
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "52px 64px 0",
          color: BRAND.fg,
          background: `radial-gradient(620px 420px at 50% 34%, rgba(110,86,207,0.30), transparent 70%), radial-gradient(700px 260px at 50% 100%, rgba(198,255,61,0.10), transparent 70%), ${BRAND.bg}`,
        }}
      >
        {/* Brand row */}
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <TempoMark size={52} />
            <span style={{ fontFamily: "Clash Display", fontSize: 34, letterSpacing: -0.5 }}>
              {SITE_NAME}
            </span>
          </div>
          <span
            style={{
              fontSize: 22,
              color: BRAND.muted,
              border: `1px solid ${BRAND.border}`,
              background: "rgba(20,20,24,0.7)",
              borderRadius: 999,
              padding: "9px 20px",
            }}
          >
            Now in private beta
          </span>
        </div>

        {/* Headline, as in the hero */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 44,
            fontFamily: "Clash Display",
            fontSize: 112,
            lineHeight: 0.98,
            letterSpacing: -3,
          }}
        >
          <div style={{ display: "flex", gap: 26 }}>
            <span>Work</span>
            <span>in</span>
            <span style={{ color: BRAND.accent }}>rhythm,</span>
          </div>
          <div style={{ display: "flex", gap: 26 }}>
            <span>not</span>
            <span>in</span>
            <span>chaos.</span>
          </div>
        </div>

        <span style={{ marginTop: 30, fontSize: 28, color: BRAND.muted }}>
          A focus app that turns your workday into a tempo you can feel.
        </span>

        {/* Tempo strip along the bottom edge */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 7,
            height: 96,
            marginTop: "auto",
            marginBottom: 40,
          }}
        >
          {BARS.map((h, i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: Math.round(96 * h),
                borderRadius: 3,
                background: BRAND.accent,
                opacity: 0.45 + h * 0.55,
              }}
            />
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Clash Display", data: clash, weight: 600, style: "normal" }],
    }
  );
}
