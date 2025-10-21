'use client';

import { mockCategories } from '@/lib/constants/categories'; // Kategori verinizin yolunu doğrulayın
import { useState } from 'react';
import { MainNav } from '@/components/layout/category-nav/MainNav';
import { SideMenu } from '@/components/layout/category-nav/SideMenu';

export default function CategoryHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <MainNav
        categories={mockCategories}
        onShowAllClick={() => setIsMenuOpen(true)}
      />
      <SideMenu
        categories={mockCategories}
        isMenuOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
}
