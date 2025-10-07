import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import CategoryHeader from "@/components/CategoryHeader";
import Footer from "@/components/Footer";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "İpek Yolu'nun Dijital Hali",
  description: "İpek Yolu'nun Dijital Hali",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={`${geist.variable}`}>
        <CartProvider>
          <Header />
          <CategoryHeader />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
