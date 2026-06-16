import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
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
      <body className={`${poppins.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
