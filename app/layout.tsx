import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/others/AppProviders";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Nightfall — Elegant Clock Dashboard",
    template: "%s | Nightfall",
  },
  description:
    "A dark, animated time dashboard with multiple clock styles, weather, and rotating facts.",
  keywords: [
    "clock",
    "time",
    "dashboard",
    "gothic",
    "neon",
    "analog",
    "digital",
    "nextjs",
    "react",
  ],
  authors: [{ name: "Ranveer Soni" }],
  creator: "@ranveersoni98",
  openGraph: {
    title: "Nightfall — Elegant Clock Dashboard",
    description:
      "A dark, animated time dashboard with multiple clock styles, weather, and rotating facts.",
    siteName: "Nightfall",
    images: [
      { url: "/banner.png", width: 1200, height: 630, alt: "Nightfall" },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@ranveersoni98",
    site: "@ranveersoni98",
    title: "Nightfall — Elegant Clock Dashboard",
    description:
      "A dark, animated time dashboard with multiple clock styles, weather, and rotating facts.",
    images: ["/banner.png"],
  },
  icons: {
    icon: [
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      {
        url: "/icons/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icons/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      "/favicon.ico",
    ],
    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
  themeColor: "#0b0b10",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
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
        <AppProviders>
          <TooltipProvider>{children}</TooltipProvider>
        </AppProviders>
      </body>
    </html>
  );
}
