import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers";
import { SEMESTER_LABEL } from "./lib/semester";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const DESCRIPTION = `Work out your North South University (NSU) bus fare for ${SEMESTER_LABEL}, check pickup points and times across 6 routes in Dhaka, and see who to contact about a Summer 2026 fare refund.`;

export const metadata: Metadata = {
  metadataBase: new URL("https://nsu-bus-fare-calculator.vercel.app"),
  title: `NSU Bus Fare Calculator | ${SEMESTER_LABEL}`,
  description: DESCRIPTION,
  keywords: [
    "NSU",
    "North South University",
    "bus fare",
    "calculator",
    SEMESTER_LABEL,
    "transport",
    "schedule",
    "fare refund",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "NSU Bus Fare Calculator",
    title: `NSU Bus Fare Calculator | ${SEMESTER_LABEL}`,
    description: DESCRIPTION,
    locale: "en_BD",
  },
  twitter: {
    card: "summary_large_image",
    title: `NSU Bus Fare Calculator | ${SEMESTER_LABEL}`,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#020618" },
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
        className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
