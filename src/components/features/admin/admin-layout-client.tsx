"use client";

import AdminFooter from "@/components/layout/admin-footer";
import AdminHeader from "@/components/layout/admin-header";
import AdminSidebar from "@/components/layout/admin-sidebar";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ToastProvider from "@/components/providers/toast-provider";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  stats: {
    pendingOrders: number;
    lowStockProducts: number;
    totalUsers: number;
    totalAdmins: number;
    totalCategories: number;
  };
}

export default function AdminLayoutClient({
  children,
  stats,
}: AdminLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // İstisna sayfalarını tanımlıyoruz
  const isLoginPage = pathname === "/login";
  const isUnauthorizedPage = pathname === "/unauthorized"; // <--- YENİ EKLENEN

  useEffect(() => {
    if (status === "loading") return;

    // Eğer Login veya Unauthorized sayfasındaysak KONTROL YAPMA (Döngüyü kırmak için)
    if (isLoginPage || isUnauthorizedPage) return;

    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.replace("/unauthorized");
    }
  }, [session, status, router, pathname, isLoginPage, isUnauthorizedPage]);

  // 1. Yükleniyor
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 2. İstisna Sayfaları (Layout OLMADAN render et)
  if (isLoginPage || isUnauthorizedPage) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  // 3. Yetkisiz Kullanıcı Koruması (Beyaz ekranı önlemek için ekstra güvenlik)
  if (
    status === "unauthenticated" ||
    (session && session.user?.role !== "ADMIN")
  ) {
    return null;
  }

  // 4. Normal Admin Arayüzü
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        stats={stats}
      />

      <div className="flex-1 flex flex-col lg:ml-0 min-w-0">
        {session?.user && (
          <AdminHeader
            onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
            user={session.user}
          />
        )}

        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">{children}</main>
        <ToastProvider />

        <AdminFooter />
      </div>
    </div>
  );
}
