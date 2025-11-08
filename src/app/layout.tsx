import { Cairo } from "next/font/google";
import { Header } from "@/components/Header";
import "./globals.css";

const cairo = Cairo({
  subsets: ["latin"],
  variable: "--font-cairo",
  display: "swap", // أسرع للـ CLS
});

export const metadata = {
  title: "Rawda Accessories Shop",
  description: "توك وإكسسوارات شعر مميزة بأفضل الأسعار",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`bg-gray-50 text-gray-800 ${cairo.className}`}>
        <Header />
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
