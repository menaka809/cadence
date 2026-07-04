import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cadence — Work in rhythm, not in chaos",
  description:
    "Cadence is a focus and deep-work app that turns your workday into a rhythm, not a checklist. Tempo Blocks, flow-state detection, and silence that actually stays silent.",
  metadataBase: new URL("https://cadence.app"),
  openGraph: {
    title: "Cadence — Work in rhythm, not in chaos",
    description:
      "A focus and deep-work app that turns your workday into a rhythm, not a checklist.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={inter.variable}
      style={{ ["--font-clash" as string]: '"Clash Display"' }}
    >
      <head>
        {/* Clash Display via Fontshare — not available on Google Fonts */}
        <link
          rel="preconnect"
          href="https://api.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700,500,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <SmoothScroll>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
