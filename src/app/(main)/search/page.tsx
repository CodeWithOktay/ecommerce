"use client";

import { Search, Loader2, PackageX } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { ProductGrid } from "@/components/product/ProductGrid";
import { useEffect } from "react";
import { useSearchStore } from "@/hooks/use-search-store";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  // Zustand Store'dan state ve fonksiyonu çek
  const { products, isLoading, search } = useSearchStore();

  // URL'deki query değişince aramayı tetikle
  useEffect(() => {
    search(query);
  }, [query, search]); // query her değiştiğinde çalışır

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* --- BAŞLIK ALANI --- */}
        <div className="mb-8">
          {query ? (
            <h1 className="text-2xl font-bold text-gray-900">
              <span className="text-indigo-600">&quot;{query}&quot;</span> için
              arama sonuçları
            </h1>
          ) : (
            <h1 className="text-2xl font-bold text-gray-900">Tüm Ürünler</h1>
          )}
        </div>

        {/* --- YÜKLENİYOR DURUMU --- */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={48} className="animate-spin text-indigo-600 mb-4" />
            <p className="text-gray-500">Ürünler aranıyor...</p>
          </div>
        ) : (
          <>
            {/* --- SONUÇLAR VEYA BOŞ DURUM --- */}
            {products.length > 0 ? (
              <>
                <p className="text-sm text-gray-500 mb-6">
                  Toplam {products.length} ürün bulundu.
                </p>
                {/* Store'dan gelen gerçek veriyi grid'e veriyoruz */}
                <ProductGrid products={products} />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <PackageX size={40} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Sonuç Bulunamadı
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  <span className="font-semibold text-gray-900">"{query}"</span>{" "}
                  aramasıyla eşleşen bir ürün bulamadık. Yazım hatası yapmış
                  olabilir misiniz?
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
