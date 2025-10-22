'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';
import Header from './Header';
import { PageLayout } from './PageLayout';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const isAdminPage = pathname.startsWith('/admin');
  
  // Admin sayfası ise sadece children göster
  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <PageLayout>{children}</PageLayout>
      <Footer />
    </>
  );
}