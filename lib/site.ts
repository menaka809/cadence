// Site-wide identity for metadata, share images, sitemap and robots.

export const SITE_NAME = "Cadence";
export const SITE_TAGLINE = "Work in rhythm, not in chaos";
export const SITE_DESCRIPTION =
  "Cadence is a focus app that turns your workday into a rhythm: Tempo Blocks for time-boxed focus, flow-state detection that protects your best hours, and a silent mode that actually stays silent. Join the waitlist.";

/** Who to contact about data held from the waitlist (shown on /privacy). */
export const CONTACT_EMAIL = "malithmenaka96@gmail.com";
export const REPO_URL = "https://github.com/menaka809/cadence";
export const LEGAL_UPDATED = "27 November 2026";
export const LEGAL_UPDATED_ISO = "2026-11-27";

const PRODUCTION_URL = "https://cadence-xi-three.vercel.app";

/**
 * Absolute base URL for metadata (Open Graph images, sitemap, robots).
 * Set NEXT_PUBLIC_SITE_URL for a custom domain. Otherwise Vercel's production
 * URL is used, falling back to the known live deployment.
 */
export function siteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return new URL(explicit || (vercel ? `https://${vercel}` : PRODUCTION_URL));
}
