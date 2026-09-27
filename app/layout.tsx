import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers";
import { ROUTE_LIST } from "./lib/routes";
import { SEMESTER_LABEL } from "./lib/semester";
import { SEO_DESCRIPTION, SEO_TITLE, SITE_NAME, SITE_URL } from "./lib/seo";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SEO_TITLE,
  description: SEO_DESCRIPTION,
  applicationName: SITE_NAME,
  category: "education",
  keywords: [
    "NSU student bus",
    "NSU bus fare",
    "NSU bus routes",
    "North South University bus fare calculator",
    "North South University transport",
    "NSU shuttle",
    ...ROUTE_LIST.map((r) => `${r.label} to NSU bus`),
    SEMESTER_LABEL,
  ],
  alternates: { canonical: `${SITE_URL}/` },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/`,
    siteName: SITE_NAME,
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#061742" },
    { media: "(prefers-color-scheme: dark)", color: "#020a1f" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geist.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
        {/* Vercel Web Analytics: cookieless page view counts. Only rendered
            on Vercel, where /_vercel/insights exists; a self-hosted build
            would otherwise request a script that 404s on every page. */}
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
