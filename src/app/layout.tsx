import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trendyol Karlılık Hesaplayıcı",
  description:
    "Trendyol komisyonu, kargo, KDV ve ürün maliyetini hesaplayarak net kazancını öğren.",
  applicationName: "Trendyol Karlılık Hesaplayıcı",
  keywords: [
    "Trendyol karlılık hesaplayıcı",
    "Trendyol komisyon hesaplama",
    "e-ticaret kar hesaplama",
    "Trendyol kar marjı",
  ],
  openGraph: {
    title: "Trendyol Karlılık Hesaplayıcı",
    description:
      "Trendyol komisyonu, kargo, KDV ve ürün maliyetini hesaplayarak net kazancını öğren.",
    siteName: "Trendyol Karlılık Hesaplayıcı",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trendyol Karlılık Hesaplayıcı",
    description:
      "Trendyol komisyonu, kargo, KDV ve ürün maliyetini hesaplayarak net kazancını öğren.",
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
