// src/app/(main)/layout.tsx
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { PageLayout } from "@/components/layout/PageLayout";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <PageLayout>{children}</PageLayout>
      <Footer />
    </>
  );
}
