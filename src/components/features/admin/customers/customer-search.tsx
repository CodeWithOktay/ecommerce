"use client";

import { Search } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

/**
 * Müşteri Arama Bileşeni
 * 
 * Müşteriler listesinde arama yapar.
 * - URL query parametrelerini kullanır (?q=...).
 * - Debounce (gecikmeli arama) özelliği ile performansı korur.
 * - Sayfa yenilenmeden filtreleme sağlar.
 */
export default function CustomerSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // URL'deki mevcut aramayı al
  const initialQuery = searchParams.get("q") || "";
  const [term, setTerm] = useState(initialQuery);

  useEffect(() => {
    // Kullanıcı yazmayı bitirene kadar 300ms bekle (Debounce)
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      
      if (term) {
        params.set("q", term);
      } else {
        params.delete("q");
      }

      // URL'i güncelle (Sayfa yenilenmeden veriyi filtreler)
      replace(`${pathname}?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [term, pathname, replace, searchParams]);

  const handleSearch = (term: string) => {
    setTerm(term);
  };

  return (
    <div className="relative w-full md:w-72">
      <input
        type="text"
        placeholder="Müşteri ara (isim veya email)..."
        defaultValue={searchParams.get("q")?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
        className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium"
      />
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
         <Search className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
}