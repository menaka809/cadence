import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/components/Providers";
import ScrollProgress from "@/components/ScrollProgress";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, siteUrl } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Self-hosted Clash Display (fetched by scripts/fetch-fonts.mjs at build time).
// next/font generates a size-matched fallback so the swap doesn't shift text.
const clash = localFont({
  variable: "--font-clash",
  display: "swap",
  src: [
    { path: "./fonts/clash-display/ClashDisplay-400.woff2", weight: "400" },
    { path: "./fonts/clash-display/ClashDisplay-500.woff2", weight: "500" },
    { path: "./fonts/clash-display/ClashDisplay-600.woff2", weight: "600" },
  ],
  fallback: ["system-ui", "sans-serif"],
});

const TITLE = `${SITE_NAME} — ${SITE_TAGLINE}`;

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: {
    default: TITLE,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0D",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${clash.variable}`}>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only rounded-full bg-accent px-5 py-3 text-sm font-semibold text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]"
        >
          Skip to content
        </a>
        <Providers>
          <ScrollProgress />
          <Navbar />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
