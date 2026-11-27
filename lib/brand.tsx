// Brand values shared by the generated images (icon, Open Graph card).
// next/og renders outside the page, so it can't read Tailwind tokens.

export const BRAND = {
  bg: "#0B0B0D",
  surface: "#141418",
  border: "#26262e",
  fg: "#F5F5F7",
  muted: "#8A8A94",
  accent: "#C6FF3D",
  violet: "#6E56CF",
};

/** The tempo-bar mark: four rounded bars of staggered height (see app/icon.svg). */
export function TempoMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <g fill={BRAND.accent}>
        <rect x="6" y="15" width="3.5" height="10" rx="1.75" />
        <rect x="11.5" y="8" width="3.5" height="17" rx="1.75" />
        <rect x="17" y="12" width="3.5" height="13" rx="1.75" />
        <rect x="22.5" y="6" width="3.5" height="19" rx="1.75" />
      </g>
    </svg>
  );
}
