import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maliyet Hesaplayıcı — 3D Baskı & Trendyol Karlılık",
  description:
    "3D yazıcı filament maliyeti, elektrik, işçilik ve paketleme giderlerini hesapla. Trendyol komisyonu, KDV ve kargo dahil net kazancını öğren.",
  applicationName: "Maliyet Hesaplayıcı",
  keywords: [
    "3D baskı maliyet hesaplayıcı",
    "filament maliyet hesaplama",
    "Trendyol karlılık hesaplayıcı",
    "Trendyol komisyon hesaplama",
    "e-ticaret kar hesaplama",
    "3D yazıcı maliyet",
  ],
  openGraph: {
    title: "Maliyet Hesaplayıcı — 3D Baskı & Trendyol Karlılık",
    description:
      "3D yazıcı filament maliyeti, elektrik, işçilik ve paketleme giderlerini hesapla. Trendyol komisyonu, KDV ve kargo dahil net kazancını öğren.",
    siteName: "Maliyet Hesaplayıcı",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maliyet Hesaplayıcı — 3D Baskı & Trendyol Karlılık",
    description:
      "3D yazıcı filament maliyeti, elektrik, işçilik ve paketleme giderlerini hesapla. Trendyol komisyonu, KDV ve kargo dahil net kazancını öğren.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#07111f" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
