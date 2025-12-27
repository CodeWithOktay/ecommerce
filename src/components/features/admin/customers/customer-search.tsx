"use client";

import { Search } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

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

  return (
    <div className="relative w-full md:w-72">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <input
        type="text"
        placeholder="Ad, Soyad veya Email ara..."
        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
    </div>
  );
}