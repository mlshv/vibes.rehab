import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

import "@react95/core/GlobalStyle";
import "@react95/core/themes/win95.css";
import { ContextProviders } from "./context-providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const title = "vibes.rehab";
const description = "Vibe coding addiction is real. Get help.";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL("https://vibes.rehab"),
  openGraph: {
    title,
    description,
    url: "https://vibes.rehab",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ContextProviders>{children}</ContextProviders>
      </body>
    </html>
  );
}
