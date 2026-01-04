import { getDashboardData } from "@/lib/actions/dashboard";
import DashboardClient from "./dashboard-client";

/**
 * Admin Dashboard Sayfası
 * 
 * Sistemin genel durumunu gösteren ana panel.
 * - `getDashboardData` ile satışlar, siparişler, müşteri sayıları ve gelir grafikleri gibi
 *   tüm kritik verileri sunucu tarafında çeker.
 * - `DashboardClient` bileşenine ileterek görselleştirmeyi sağlar.
 */
export default async function DashboardPage() {
  // Veritabanından gerçek verileri çekiyoruz
  const dashboardData = await getDashboardData();

  return (
    // Verileri props olarak client component'e gönderiyoruz
    <DashboardClient data={dashboardData} />
  );
}
