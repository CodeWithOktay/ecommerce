// src/app/(user)/layout.tsx
import Header from "@/components/layout/Header"; // Header her yerde olsun
import Link from "next/link";
import { User, Package, MapPin, LogOut, Heart } from "lucide-react";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header /> {/* Üst menü sabit kalsın */}
      <div className="bg-gray-50 min-h-[calc(100vh-80px)] py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row gap-6">
          {/* 👈 SOL SIDEBAR (MENÜ) */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="p-4 bg-gray-50 border-b border-gray-100">
                <h2 className="font-bold text-gray-800">Hesabım</h2>
              </div>

              <nav className="flex flex-col p-2 gap-1">
                <Link
                  href="/account/orders"
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-purple-50 hover:text-[#764BA2] transition-colors"
                >
                  <Package size={18} />
                  Siparişlerim
                </Link>

                <Link
                  href="/account/profile"
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-purple-50 hover:text-[#764BA2] transition-colors"
                >
                  <User size={18} />
                  Kullanıcı Bilgilerim
                </Link>

                <Link
                  href="/account/favorites"
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-purple-50 hover:text-[#764BA2] transition-colors"
                >
                  <Heart size={18} />
                  Favorilerim
                </Link>
                <Link
                  href="/account/addresses"
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-purple-50 hover:text-[#764BA2] transition-colors"
                >
                  <MapPin size={18} />
                  Adreslerim
                </Link>
              </nav>
            </div>
          </aside>

          {/* 👉 SAĞ İÇERİK ALANI (Sayfalar buraya render olacak) */}
          <main className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[500px]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
