"use client";

import CategoryHeader from "@/components/shared/CategoryHeader";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

/**
 * Sayfa Layout Bileşeni
 *
 * Sayfa içeriğini saran ana layout bileşeni.
 * Kategori header'ını koşullu olarak gösterir ve ana içeriği wrapper'lar.
 *
 * @param children - Sayfa içeriği olarak render edilecek React bileşenleri
 */
export function PageLayout({ children }: { children: ReactNode }) {
  // Mevcut sayfa yolunu al
  const pathname = usePathname();

  // Kategori header'ının gizleneceği sayfa yolları
  const hideCategoryHeaderOn = [
    "/faq",
    "/contact",
    "/terms",
    "/privacy",
    "/privacy-policy",
    "/cookies",
    "/returns",
    "/shipping-returns",
    "/cart", // Sepet sayfası
    "/about", // Hakkımızda sayfası
  ];

  // Kategori header'ının gösterilip gösterilmeyeceğini belirle
  const shouldShowCategoryHeader = !hideCategoryHeaderOn.includes(pathname);

  return (
    <>
      {/* Koşullu Kategori Header - belirli sayfalarda gizlenir */}
      {shouldShowCategoryHeader && <CategoryHeader />}

      {/* Ana İçerik Alanı - container ile merkezileştirilmiş */}
      <main className="flex-grow container mx-auto p-4">{children}</main>
    </>
  );
}
