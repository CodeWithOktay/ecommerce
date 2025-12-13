// 'use client' ARTIK YOK! Burası bir Server Component.

import { prisma } from "@/lib/prisma-client"; // Senin dosya yapına göre import
import Image from "next/image";
import Link from "next/link";

// Bileşen Importları
import UserMenu from "./UserMenu";
import { SearchBar } from "@/components/forms/SearchBar";
import CartButton from "./CartButton"; // Az önce oluşturduğumuz buton
import CategoryHeader from "./category-nav/CategoryHeader"; // Senin yeni nav sistemi

export default async function Header() {
  // 1. VERİYİ ÇEKİYORUZ 🥩
  // Sadece ana kategorileri (babası olmayanları) getiriyoruz
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: { children: true },
    orderBy: { name: "asc" },
  });

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      {/* --- ÜST KATMAN (Logo, Search, User, Cart) --- */}
      <div className="container mx-auto flex justify-between items-center py-3 px-6 h-20">
        {/* Logo */}
        <Link
          href="/"
          className="flex-shrink-0 hover:opacity-90 transition-opacity"
        >
          <Image
            src="/kervanpazar-logo.png"
            alt="KervanPazar"
            width={180}
            height={40}
            className="object-contain h-10 w-auto"
            priority
          />
        </Link>

        {/* Arama (Desktop) */}
        <div className="hidden md:block flex-1 max-w-xl mx-8">
          <SearchBar />
        </div>

        {/* SAĞ TARAF */}
        <div className="flex items-center gap-3">
          {/* UserMenu (Masaüstü) */}
          <div className="hidden md:block">
            <UserMenu />
          </div>

          {/* Sepet Butonu (Client Component olarak ayrıldı) */}
          <CartButton />
        </div>
      </div>

      {/* --- ALT KATMAN (Kategori Navigasyonu) --- */}
      {/* Mobil menü ve masaüstü menü artık bu bileşenin içinde yönetiliyor */}
      <div className="border-t border-gray-100">
        <CategoryHeader categories={categories} />
      </div>

      {/* Mobil için Arama Çubuğu (Sadece mobilde görünür) */}
      <div className="md:hidden p-4 border-t border-gray-50">
        <SearchBar />
      </div>
    </header>
  );
}
