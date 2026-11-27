// In-page sections, shared by the navbar and footer. Hrefs start with "/" so
// they also work from /privacy (they navigate home, then scroll).

export const SECTIONS = [
  { label: "Flow", href: "/#flow" },
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/#pricing" },
] as const;

export const WAITLIST_HREF = "/#waitlist";
