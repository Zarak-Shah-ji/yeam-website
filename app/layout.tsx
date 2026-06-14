import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Yeam.ai - AI Medical Workforce for Clinics",
  description:
    "Yeam deploys a full team of AI agents into your clinic, handling reception, documentation, coding, and billing, so your human staff can focus entirely on patients.",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
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
    <html lang="en" className={`${plusJakartaSans.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
