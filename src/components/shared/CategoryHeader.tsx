'use client';

import { MainNav } from '@/components/layout/category-nav/MainNav';
import { SideMenu } from '@/components/layout/category-nav/SideMenu';
import { mockCategories } from '@/lib/constants/categories'; // Kategori verinizin yolunu doğrulayın
import { useState } from 'react';

/**
 * Kategori Header Bileşeni
 *
 * Ana kategori navigasyonunu yöneten container bileşeni.
 * Desktop'ta yatay menü, mobile'da slide-in menü sağlar.
 * State yönetimi ile iki bileşen arasında senkronizasyon kurar.
 */
export default function CategoryHeader() {
  // Yan menünün açık/kapalı durumunu yöneten state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* ✅ Ana Navigasyon - Desktop'ta görünen yatay menü */}
      <MainNav
        categories={mockCategories}
        onShowAllClick={() => setIsMenuOpen(true)} // "Tüm Kategoriler" tıklandığında yan menüyü açar
      />

      {/* ✅ Yan Menü - Mobile'da slide-in, desktop'ta hover ile açılan menü */}
      <SideMenu
        categories={mockCategories}
        isMenuOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)} // Menü kapatma fonksiyonu
      />
    </>
  );
}
