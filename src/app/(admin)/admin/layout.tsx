'use client';
// Client Component: Admin paneli için layout bileşeni

// Komponent importları
import AdminFooter from '@/components/admin/AdminFooter';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
// Next.js ve authentication hook'ları
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
// React state ve effect hook'ları
import { useEffect, useState } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // State'ler
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar açık/kapalı durumu
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // Auth kontrolü yüklenme durumu

  // Hook'lar
  const { data: session, status } = useSession(); // Kullanıcı oturum bilgisi
  const router = useRouter(); // Yönlendirme için router
  const pathname = usePathname(); // Mevcut sayfa yolu

  // Authentication kontrolü effect'i
  useEffect(() => {
    // Session yükleniyorsa bekle
    if (status === 'loading') return;

    // Login sayfasında mıyız kontrol et
    const isLoginPage = pathname === '/admin/login';

    // Eğer oturum yoksa ve login sayfasında değilsek, login sayfasına yönlendir
    if (!session && !isLoginPage) {
      router.push('/admin/login');
      return;
    }

    // Eğer kullanıcı ADMIN rolüne sahip değilse ve login sayfasında değilsek, yetkisiz sayfasına yönlendir
    if (session?.user?.role !== 'ADMIN' && !isLoginPage) {
      router.push('/admin/unauthorized');
      return;
    }

    // Auth kontrolü tamamlandı
    setIsCheckingAuth(false);
  }, [session, status, router, pathname]);

  // Yüklenme durumunda loading spinner göster
  if (status === 'loading' || isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Login sayfası için özel layout (sidebar ve header olmadan)
  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  // Oturum yoksa veya kullanıcı ADMIN değilse loading göster
  if (!session || session.user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Ana admin layout'u - sidebar, header, main content ve footer içerir
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Yan menü - mobilde açılır/kapanır, desktop'ta sabit */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Ana içerik alanı */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Üst menü - kullanıcı bilgisi ve menu toggle butonu */}
        <AdminHeader
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          user={session?.user}
        />

        {/* Sayfa içeriği */}
        <main className="flex-1 p-6">{children}</main>

        {/* Alt bilgi */}
        <AdminFooter />
      </div>
    </div>
  );
}
