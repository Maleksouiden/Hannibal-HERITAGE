import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hannibal HERITAGE",
  description:
    "Artisan e-commerce for Hannibal HERITAGE — Sejnane and olive wood catalogs.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-clip bg-[#f7f3ec] font-sans text-[#1c1917]">
        <SiteHeader />
        {/* Spacer for fixed header; home hero pulls under with negative margin. */}
        <div
          className="h-14 shrink-0 sm:h-[4.25rem]"
          aria-hidden
        />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
