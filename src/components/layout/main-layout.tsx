"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

/**
 * Ana Layout Bileşeni (Birleştirilmiş Versiyon)
 *
 * Hem sayfa yapısını (padding, container) hem de
 * Admin/User ayrımını tek bir dosyada yönetir.
 */
export default function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isAdminPage = pathname.startsWith("/admin");

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto p-4 md:p-6 min-h-[60vh]">
        {children}
      </main>
    </div>
  );
}
