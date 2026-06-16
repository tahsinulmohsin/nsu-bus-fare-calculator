import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NSU Bus Fare Calculator | Summer 2026",
  description:
    "Calculate your semester bus fare and view pickup schedules for North South University Summer 2026 bus service. Covers 6 routes across Dhaka.",
  keywords: [
    "NSU",
    "North South University",
    "bus fare",
    "calculator",
    "Summer 2026",
    "transport",
    "schedule",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
