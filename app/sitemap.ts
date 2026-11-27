import type { MetadataRoute } from "next";
import { LEGAL_UPDATED_ISO, siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const legal = new Date(LEGAL_UPDATED_ISO);

  return [
    { url: new URL("/", base).toString(), lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: new URL("/privacy", base).toString(), lastModified: legal, changeFrequency: "yearly", priority: 0.3 },
  ];
}
