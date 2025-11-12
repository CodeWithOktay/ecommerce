'use client';

import { SearchBar } from '@/components/forms/SearchBar';
import { useCart } from '@/context/cart/index';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Header Bileşeni
 *
 * E-ticaret sitesinin üst navigasyon bölümü.
 * Logo, arama çubuğu, sepet butonu ve mobil menü içerir.
 * Sticky header özelliği ile sayfa kaydırıldığında sabit kalır.
 */
export default function Header() {
  // Sepet context'inden toplam ürün adedini al
  const { totalItems } = useCart();

  return (
    <header className="bg-white/93 backdrop-blur-md border-b border-white sticky top-0 z-50 transition-none">
      {/* Ana navigasyon container'ı */}
      <div className="container mx-auto flex justify-between items-center py-3 px-6">
        {/* ✅ Logo Bölümü */}
        <Link
          href="/"
          className="flex items-center gap-3 group hover:opacity-90 transition-opacity"
          aria-label="KervanPazar Ana Sayfa"
        >
          <Image
            src="/kervanpazar-logo.png"
            alt="KervanPazar Logo"
            width={250}
            height={10}
            className="object-contain group-hover:scale-105 transition-transform"
            priority // Öncelikli yükleme için
          />
        </Link>

        {/* ✅ Arama Çubuğu */}
        <SearchBar />

        {/* ✅ Sepet Butonu */}
        <Link
          href="/cart"
          className="bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold flex items-center gap-2 group"
          aria-label={`Sepetim - ${totalItems} ürün`}
        >
          {/* Sepet ikonu */}
          <span className="group-hover:scale-110 transition-transform">
            <ShoppingCart size={20} />
          </span>
          {/* Sepet metni */}
          Sepetim
          {/* Sepet ürün sayısı badge'i */}
          <span className="bg-white/20 px-2 py-1 rounded-full text-xs min-w-[24px] text-center">
            {totalItems}
          </span>
        </Link>
      </div>

      {/* ✅ Mobil Menü - Sadece mobil cihazlarda görünür */}
      <div className="md:hidden bg-white border-t border-white">
        <div className="container mx-auto px-6 py-3 flex justify-between text-sm text-gray-700">
          {/* Mobil kategori linkleri */}
          {['elektronik', 'giyim', 'ev-yasam', 'kozmetik'].map((category) => (
            <Link
              key={category}
              href={`/category/${category}`}
              className="hover:text-[#667EEA] transition-colors capitalize"
            >
              {/* Kategori ismini formatla (tireleri boşlukla değiştir) */}
              {category.replace('-', ' ')}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
  