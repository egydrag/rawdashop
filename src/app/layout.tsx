import { Cairo } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "animate.css";
import { Header } from "@/components/Header";
import "./globals.css";

const cairo = Cairo({
  subsets: ["latin", "arabic"],
  variable: "--font-cairo",
  display: "swap", // أسرع للـ CLS
});

export const metadata = {
  title: "Rawda Accessories Shop | إكسسوارات الشعر والتوك",
  description:
    "توك وإكسسوارات شعر مميزة بأفضل الأسعار - اشترِ الآن مع شحن سريع!",
  keywords: "إكسسوارات, شعر, توك, متجر, Rawda Accessories",
  authors: [{ name: "Rawda Shop" }],
  openGraph: {
    title: "Rawda Accessories Shop",
    description: "توك وإكسسوارات شعر مميزة بأفضل الأسعار",
    type: "website",
    url: "https://rawdashop.com", // ضع رابط موقعك الفعلي
    images: [
      {
        url: "https://rawdashop.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Rawda Accessories Shop",
      },
    ],
  },
};

// 👇 خاصية Viewport منفصلة الآن
export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta
          name="google-site-verification"
          content="K_ia_fdAuYdnwaITlI-2Khh1EnbHbDojnvzzwHsbCDs"
        />
      </head>
      <body className={`bg-gray-50 text-gray-800 ${cairo.className}`}>
        <Header />
        <main className="container mx-auto p-4">{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
