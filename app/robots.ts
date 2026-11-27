import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The waitlist endpoint isn't a page to index.
      disallow: ["/api/"],
    },
    sitemap: new URL("/sitemap.xml", siteUrl()).toString(),
  };
}
