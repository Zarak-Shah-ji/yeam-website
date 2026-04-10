import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yeam.ai — AI-Powered EHR for Small & Mid-Size Clinics",
  description:
    "Yeam is the AI-embedded EHR that gives clinics full visibility from patient visit to insurance claim — slashing denial rates and protecting revenue at every step.",
  openGraph: {
    title: "Yeam.ai — AI-Powered EHR for Small & Mid-Size Clinics",
    description:
      "Stop losing revenue to denied claims. Yeam embeds AI across your entire billing cycle — from patient visit to claim appeal.",
    url: "https://yeam.ai",
    siteName: "Yeam.ai",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
