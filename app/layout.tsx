import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const TITLE = "Yeam — denial recovery for medical billing";
const DESCRIPTION =
  "Yeam sorts your denied-claims export into what is still worth working, tracks the filing deadline on each one, and drafts the response. The worklist is free and runs in your browser.";

// Icons and the share image come from file conventions in this directory:
// app/icon.png, app/apple-icon.png, app/opengraph-image.png and
// app/twitter-image.png. Next wires the <link>/<meta> tags automatically, so no
// manual `icons` block is needed here.
export const metadata: Metadata = {
  // Absolute base so the file-based OG/Twitter images resolve to the production
  // host in shared links, not localhost.
  metadataBase: new URL("https://yeam.ai"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://yeam.ai",
    siteName: "Yeam",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${plusJakartaSans.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full">
        <script
          dangerouslySetInnerHTML={{
            // Light is the default. Dark applies only when the visitor picked it
            // via the footer toggle (persisted in localStorage); the OS
            // prefers-color-scheme is deliberately ignored so a first load is
            // always light.
            __html:
              "(function(){try{if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark');}catch(e){}})();",
          }}
        />
        {children}
      </body>
    </html>
  );
}
