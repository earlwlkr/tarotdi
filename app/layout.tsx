import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Tarot of the Day",
  description: "A polished tarot-of-the-day reading with a shareable daily card reveal.",
  metadataBase: new URL("https://tarotdi.vercel.app")
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
