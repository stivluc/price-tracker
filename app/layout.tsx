import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { SidebarProvider } from "@/components/ui/sidebar";

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
    default: "Demo - Price Tracker",
    template: "%s | Demo - Price Tracker"
  },
  description: "Price reconciliation tool. Monitor and resolve price discrepancies across different data flows.",
  keywords: ["price reconciliation", "price monitoring", "price discrepancies", "internal tool", "castorama", "price tracker"],
  authors: [{ name: "Steven Lucas" }],
  creator: "Steven Lucas",
  publisher: "Steven Lucas",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://price-tracker.stivluc.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://price-tracker.stivluc.com',
    title: 'Demo - Price Tracker',
    description: 'Price reconciliation tool. Monitor and resolve price discrepancies across different data flows.',
    siteName: 'Demo - Price Tracker',
    images: [
      {
        url: '/images/op-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Demo -Price Tracker',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Demo - Price Tracker',
    description: 'Price reconciliation tool. Monitor and resolve price discrepancies across different data flows.',
    images: ['/images/op-image.jpg'],
    creator: '@stivluc',
  },
  icons: {
    icon: [
      { url: '/icons/favicon.ico' },
      { url: '/icons/icon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-icon.png' },
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/icons/apple-touch-icon-precomposed.png',
      },
    ],
  },
  manifest: '/manifest.json',
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
        <AuthProvider>
          <SidebarProvider>
              {children}
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
