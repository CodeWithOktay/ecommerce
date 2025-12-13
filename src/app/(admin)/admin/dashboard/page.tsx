import { getDashboardData } from "@/lib/actions/dashboard-actions";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
  // Veritabanından gerçek verileri çekiyoruz
  const dashboardData = await getDashboardData();

  return (
    // Verileri props olarak client component'e gönderiyoruz
    <DashboardClient data={dashboardData} />
  );
}
