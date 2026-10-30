import type { Metadata } from "next";
import { Inter, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

// Same three faces as rishithc.com: a neutral grotesque for the UI, a mono
// for labels and facts, and Instrument Serif for the words that carry the
// identity.
const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://almadenhacks.vercel.app"),
  title: "Almaden Hacks",
  description:
    "A student-built high school hackathon from the heart of Almaden Valley. Presented by Leland High School. May–June, San Jose.",
  keywords: [
    "hackathon club",
    "leland high school",
    "almaden hacks",
    "san jose hackathon",
    "high school hackathon",
    "usaai",
  ],
  openGraph: {
    title: "Almaden Hacks",
    description: "Big ideas. A little wild ambition. A high school hackathon from the heart of Almaden.",
    siteName: "Almaden Hacks",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Almaden Hacks",
    description: "Big ideas. A little wild ambition. A high school hackathon from the heart of Almaden.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
