import { ImageResponse } from "next/og";
import { BRAND, TempoMark } from "@/lib/brand";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon: the tempo-bar mark on the site's dark background. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: BRAND.bg,
        }}
      >
        <TempoMark size={132} />
      </div>
    ),
    size
  );
}
