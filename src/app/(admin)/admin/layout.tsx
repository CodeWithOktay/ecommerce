// app/admin/layout.tsx

import { getSidebarStats } from "@/lib/actions/sidebar-actions"; // Önceki adımda yazdığımız action
import AdminLayoutClient from "@/components/admin/AdminLayoutClient"; // Yukarıdaki yeni bileşen

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Veritabanından canlı istatistikleri çek (Server-Side)
  // Login sayfasındaysak bile çekebiliriz, sorun olmaz.
  // Performans takıntın varsa pathname kontrolü burada yapılamaz (Layout statiktir),
  // ama veritabanı sorgusu çok hafif olduğu için sorun yok.
  const stats = await getSidebarStats();

  // 2. Client bileşeni render et ve veriyi gönder
  return <AdminLayoutClient stats={stats}>{children}</AdminLayoutClient>;
}
