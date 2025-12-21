import MainLayout from "@/components/layout/main-layout"; 
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
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