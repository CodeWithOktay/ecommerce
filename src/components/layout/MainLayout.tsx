'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';
import Header from './Header';
import { PageLayout } from './PageLayout';

/**
 * Ana Layout Bileşeni
 * 
 * Uygulamanın ana layout yapısını yönetir.
 * Admin sayfaları için farklı, normal sayfalar için standart layout uygular.
 * 
 * @param children - İçeriği render edilecek React bileşenleri
 * @returns {JSX.Element} Layout yapısı
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Mevcut sayfa yolunu al
  const pathname = usePathname();
  
  // Admin sayfası kontrolü - '/admin' ile başlayan sayfalar
  const isAdminPage = pathname.startsWith('/admin');
  
  /**
   * Admin Sayfası Layout'u
   * 
   * Admin paneli sayfaları için header ve footer gösterilmez.
   * Sadece içerik (children) render edilir.
   * Bu sayede admin paneli temiz ve minimalist bir arayüze sahip olur.
   */
  if (isAdminPage) {
    return <>{children}</>;
  }

  /**
   * Normal Sayfa Layout'u
   * 
   * Standart kullanıcı sayfaları için tam layout yapısı:
   * - Header (üst navigasyon)
   * - PageLayout (içerik wrapper'ı)
   * - Footer (alt bilgi ve linkler)
   */
  return (
    <>
      {/* Üst Navigasyon - Logo, arama, sepet */}
      <Header />
      
      {/* Ana İçerik Alanı - Sayfa içeriğini saran layout */}
      <PageLayout>{children}</PageLayout>
      
      {/* Alt Bilgi - Marka bilgisi, linkler, sosyal medya */}
      <Footer />
    </>
  );
}