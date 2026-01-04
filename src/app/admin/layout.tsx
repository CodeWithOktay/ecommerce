// app/admin/layout.tsx

import { getSidebarStats } from "@/lib/actions/sidebar"; 
import AdminLayoutClient from "@/components/features/admin/admin-layout-client"; 
import { getAdminSession } from "@/lib/auth/session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminSession = await getAdminSession();
  
  if (!adminSession?.user) {
    // Session is handled by middleware but if it slips through or for data safety:
    return null; // Or redirect
  }

  // Since middleware protects this, we might not need strict checks here, 
  // but keeping stats fetching logic.
  const stats = await getSidebarStats();

  return (
      <AdminLayoutClient stats={stats}>{children}</AdminLayoutClient>
  );
}
