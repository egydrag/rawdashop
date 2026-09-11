import { IBM_Plex_Sans_Arabic } from "next/font/google";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { Header } from "@/components/Header";
import "./globals.css";

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const SITE_URL = "https://rawdashop.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "روضة للإكسسوارات | إكسسوارات شعر وتوك",
    template: "%s | روضة للإكسسوارات",
  },
  description:
    "توك وإكسسوارات شعر مميزة بأفضل الأسعار — اطلبي بسهولة عبر WhatsApp مع شحن سريع!",
  keywords: "إكسسوارات, شعر, توك, متجر, روضة, Rawda Accessories",
  authors: [{ name: "روضة للإكسسوارات" }],
  metadataBase: new URL(SITE_URL),
  verification: {
    google: "K_ia_fdAuYdnwaITlI-2Khh1EnbHbDojnvzzwHsbCDs",
  },
  other: {
    "google-adsense-account": "ca-pub-4683128936517413",
  },
  openGraph: {
    title: "روضة للإكسسوارات",
    description: "توك وإكسسوارات شعر مميزة بأفضل الأسعار",
    type: "website",
    url: SITE_URL,
    locale: "ar_EG",
    siteName: "روضة للإكسسوارات",
  },
  twitter: {
    card: "summary_large_image",
    title: "روضة للإكسسوارات",
    description: "توك وإكسسوارات شعر مميزة بأفضل الأسعار",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  themeColor: "#fff1f2",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`bg-stone-50 text-stone-900 ${ibmPlexArabic.className}`}>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4683128936517413"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Header />
        <main className="container mx-auto px-4 py-6 max-w-5xl">
          {children}
        </main>
        <footer className="border-t border-stone-100 mt-16 py-6 text-center text-xs text-stone-400">
          <p>روضة للإكسسوارات © {new Date().getFullYear()}</p>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
