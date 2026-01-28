import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://spotfly.app"), // change if needed

  title: {
    default: "SpotFly — Smart Flight Search Engine",
    template: "%s | SpotFly",
  },

  description:
    "SpotFly is a modern flight search engine to compare airlines, discover cheap flights, and plan routes instantly. Find the best fares worldwide with fast, simple, and reliable travel search.",

  keywords: [
    "flight search engine",
    "cheap flights",
    "compare airlines",
    "book flights online",
    "airfare deals",
    "travel planner",
    "SpotFly",
    "international flights",
    "air ticket booking",
  ],

  authors: [{ name: "Spotter Labs" }],
  creator: "Spotter Labs",
  applicationName: "SpotFly",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://spotfly.app",
    siteName: "SpotFly",
    title: "SpotFly — Smart Flight Search Engine",
    description:
      "Compare airlines, find cheap flights, and plan routes instantly with SpotFly — a fast, modern flight search engine.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SpotFly Flight Search",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "SpotFly — Smart Flight Search Engine",
    description:
      "Discover cheap flights and compare airlines worldwide with SpotFly.",
    images: ["/og-image.png"],
    creator: "@spotfly",
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  category: "travel",
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
        <Providers>{children}</Providers>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
