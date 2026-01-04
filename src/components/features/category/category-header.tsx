"use client";

import { Category } from "@prisma/client";
import { MainNav } from "./main-nav";
import { SideMenu } from "./side-menu";
import { useState } from "react";
import { usePathname } from "next/navigation"; // 👈 EKLENDİ

type CategoryWithChildren = Category & {
  children: Category[];
};

interface CategoryHeaderProps {
  categories: CategoryWithChildren[];
}

/**
 * Kategori Üst Bilgisi (Header)
 * 
 * Tüm kategorilerin listelendiği ana navigasyon barıdır.
 * Sadece belirli sayfalarda (sepet, checkout hariç) görünür.
 */
export default function CategoryHeader({ categories }: CategoryHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname(); // 👈 Mevcut sayfayı öğreniyoruz

  // 🛑 GİZLENECEK SAYFALAR LİSTESİ
  // Buradaki mantığı PageLayout'tan buraya taşıdık
  const hideOnPaths = [
    "/cart",
    "/checkout",
    "/login",
    "/register",
    "/success",
    "/contact",
    "/faq",
    "/privacy",
    "/terms",
  ];

  // Eğer şu anki sayfa yasaklı listedeyse veya dinamik bir yasaklı sayfaysa (örn: /orders/...)
  // HİÇBİR ŞEY RENDER ETME (null dön)
  if (hideOnPaths.includes(pathname) || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <SideMenu
        categories={categories}
        isMenuOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
      <MainNav
        categories={categories}
        onShowAllClick={() => setIsMenuOpen(true)}
      />
    </>
  );
}
