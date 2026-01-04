import MainLayout from "@/components/layout/main-layout"; 
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
/**
 * Mağaza Düzeni (Shop Layout)
 * 
 * E-ticaret sayfaları için ortak düzen.
 * - Header (Üst Menü)
 * - Footer (Alt Bilgi)
 * - MainLayout (Genel yapı)
 */
export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayout>
      <Header />
      {children}
      <Footer />
    </MainLayout>
  );
}