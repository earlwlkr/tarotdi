import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Tarotdi",
  description: "Daily tarot ritual with a single-card reveal, reflective guidance, and readings you can share.",
  metadataBase: new URL("https://tarotdi.vercel.app")
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
