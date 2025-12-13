"use client";

import { ReactNode } from "react";

/**
 * Sayfa Layout Bileşeni
 *
 * Sadece sayfa içeriğini merkeze alan ve padding veren basit bir wrapper.
 * Navbar kontrolü artık CategoryHeader'ın kendi içinde yapılıyor.
 */
export function PageLayout({ children }: { children: ReactNode }) {
  return (
    // Ana İçerik Alanı - container ile merkezileştirilmiş
    <main className="flex-grow container mx-auto p-4 md:p-6 min-h-[60vh]">
      {children}
    </main>
  );
}
