import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SkipToContent from "@/components/SkipToContent";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Professional Tax Services | TEAMBASED Tax Services",
    template: "%s | TEAMBASED Tax Services",
  },
  description:
    "Complete individual and business tax services in Germantown, MD. Smart tax solutions, personalized service, and guaranteed accuracy for Maryland and the DMV area.",
  keywords: [
    "tax preparation",
    "bookkeeping",
    "IRS representation",
    "Germantown MD",
    "business tax consulting",
    "retirement planning",
  ],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full scroll-smooth`}>
      <body className="flex min-h-full flex-col overflow-x-hidden antialiased">
        <SkipToContent />
        <Header />
        <main id="main-content" className="flex-1" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <AccessibilityWidget />
      </body>
    </html>
  );
}
