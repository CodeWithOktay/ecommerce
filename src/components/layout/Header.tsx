'use client';

import UserMenu from "./UserMenu";
import { SearchBar } from '@/components/forms/SearchBar';
import { useCart } from '@/context/cart/index';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-3 px-6 h-20">
        
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 hover:opacity-90 transition-opacity">
          <Image
            src="/kervanpazar-logo.png"
            alt="KervanPazar"
            width={180}
            height={40}
            className="object-contain h-10 w-auto"
            priority
          />
        </Link>

        {/* Arama */}
        <div className="hidden md:block flex-1 max-w-xl mx-8">
           <SearchBar />
        </div>

        {/* SAĞ TARAF: UserMenu ve Sepet */}
        <div className="flex items-center gap-3">
          
          {/* UserMenu (Masaüstü) - Wrapper kaldırıldı */}
          <div className="hidden md:block">
            <UserMenu />
          </div>

          {/* Sepet Butonu */}
          <Link
            href="/cart"
            className="flex items-center gap-2 bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:opacity-95 transition-all font-semibold text-sm"
          >
            <ShoppingCart size={20} />
            <span className="hidden sm:inline">Sepetim</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold min-w-[20px] text-center">
              {totalItems}
            </span>
          </Link>
        </div>
      </div>

      {/* Mobil Menü */}
      <div className="md:hidden bg-white border-t border-gray-50">
        <div className="p-4"><SearchBar /></div>
        <div className="px-6 pb-4 flex flex-col gap-4">
           <div className="flex justify-center border-b pb-4"><UserMenu /></div>
           <div className="flex justify-between text-sm font-medium text-gray-600 overflow-x-auto gap-4">
              {['elektronik', 'giyim', 'ev-yasam', 'kozmetik'].map((cat) => (
                <Link key={cat} href={`/category/${cat}`} className="capitalize whitespace-nowrap hover:text-[#667EEA]">
                  {cat.replace('-', ' ')}
                </Link>
              ))}
           </div>
        </div>
      </div>
    </header>
  );
}
