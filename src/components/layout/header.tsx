import { prisma } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";

// Bileşen Importları
import UserMenu from "../features/auth/user-menu";
import { SearchBar } from "@/components/features/search/search-bar";
import CartButton from "../features/cart/cart-button";
import CategoryHeader from "../features/category/category-header";
import { Heart } from "lucide-react";

/**
 * Web Sitesi Üst Bilgisi (Header)
 * 
 * - Logo
 * - Arama Çubuğu
 * - Kullanıcı Menüsü
 * - Sepet Butonu
 * - Kategori Navigasyonu (Alt Katman)
 * 
 * Veritabanından ana kategorileri çeker ve CategoryHeader'a iletir.
 */
export default async function Header() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: { children: true },
    orderBy: { name: "asc" },
  });

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 ">
      <div className="container mx-auto flex justify-between items-center py-3 px-6 h-20">
        <Link
          href="/"
          className="flex-shrink-0 hover:opacity-90 transition-opacity"
        >
          <Image
            src="/kervanpazar-logo.png"
            alt="KervanPazar"
            width={180}
            height={40}
            className="object-contain h-auto w-auto"
            priority
          />
        </Link>

        <div className="hidden md:block flex-1 max-w-xl mx-8">
          <SearchBar />
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <UserMenu />
          </div>
          <div className="hidden md:block">
            <Link
              href="/account/favorites"
              className="group flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-red-50 transition-all duration-300"
              title="Favorilerim"
            >
              <Heart
                size={20}
                className="text-gray-500 group-hover:text-red-500 group-hover:fill-current transition-all duration-300"
              />

              <span className="text-sm font-bold text-gray-600 group-hover:text-red-600 transition-colors">
                Favorilerim
              </span>
            </Link>
          </div>
          <CartButton />
        </div>
      </div>

      {/* --- ALT KATMAN (Kategori Navigasyonu) --- */}
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
