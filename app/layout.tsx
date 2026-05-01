import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yeam.ai - AI Medical Workforce for Clinics",
  description:
    "Yeam deploys a full team of AI agents into your clinic, handling reception, documentation, coding, and billing, so your human staff can focus entirely on patients.",
  openGraph: {
    title: "Yeam.ai - AI Medical Workforce for Clinics",
    description:
      "Hire AI medical employees, not software. Yeam deploys AI Receptionist, Scribe, Coder, and Billing agents that work 24/7 in your clinic.",
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
