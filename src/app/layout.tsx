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
  title: "Leland Hackathon Club",
  description:
    "A club at Leland High School that trains you to win hackathons, goes to them as a team, and hosts Almaden Hacks at the end of the year.",
  keywords: [
    "hackathon club",
    "leland high school",
    "almaden hacks",
    "san jose hackathon",
    "high school hackathon",
    "usaai",
  ],
  openGraph: {
    title: "Leland Hackathon Club",
    description: "Learn to win hackathons. Then host one.",
    siteName: "Leland Hackathon Club",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Leland Hackathon Club",
    description: "Learn to win hackathons. Then host one.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
