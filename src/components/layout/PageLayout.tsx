'use client';

import CategoryHeader from '@/components/shared/CategoryHeader';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export function PageLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const hideCategoryHeaderOn = [
    '/cart',
    '/admin/dashboard',
    '/admin/login',
    '/uyelik-sozlesmesi',
    '/kvkk',
    '/hakkimizda',
  ];

  const shouldShowCategoryHeader = !hideCategoryHeaderOn.includes(pathname);
  return (
    <>
      {shouldShowCategoryHeader && <CategoryHeader />}
      <main className="flex-grow container mx-auto p-4">{children}</main>
    </>
  );
}
