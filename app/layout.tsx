import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: `NSU Bus Fare Calculator | ${SEMESTER_LABEL}`,
  description:
    `Work out your North South University (NSU) bus fare for ${SEMESTER_LABEL}, check pickup points and times across 6 routes in Dhaka, and follow the Summer 2026 fare refund steps.`,
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
