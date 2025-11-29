'use client';

import { Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { ProductGrid } from '@/components/product/ProductGrid';
import { mockProducts } from '@/lib/data/mock-data';

/**
 * Arama Sayfası Bileşeni
 * 
 * Kullanıcıların arama sorgularına göre filtrelenmiş ürünleri
 * gösterdiği sayfa. Ürün bulunamazsa boş durum gösterir.
 */
export default function SearchPage() {
  // URL'den arama parametrelerini al
  const searchParams = useSearchParams();
  // Query parametresini al veya boş string kullan
  const query = searchParams.get('query') || '';

  /**
   * Ürünleri arama sorgusuna göre filtrele
   * Ürün adında case-insensitive arama yapar
   */
  const filteredProducts = mockProducts.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* ✅ Arama Sonuçları Başlığı - Sadece query varsa göster */}
        {query && (
          <h6 className="text-xl font-semibold text-gray-800 mb-6">
            {/* Vurgulanan arama terimi */}
            <span className="text-indigo-600">&quot;{query}&quot;</span>{' '}
            {' aramanızla eşleşen '}
            {/* Sonuç sayısı */}
            {filteredProducts.length} sonuç{' '}
            {/* Duruma göre farklı metin */}
            {filteredProducts.length === 0 ? 'bulundu.' : '   bulundu.'}
          </h6>
        )}

        {/* ✅ Ürün Grid veya Boş Durum */}
        {filteredProducts.length > 0 ? (
          // Ürünler bulunduysa grid göster
          <ProductGrid products={filteredProducts} />
        ) : (
          // Ürün bulunamadıysa boş durum göster
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
            {/* Boş durum ikonu */}
            <Search size={48} className="mb-4 text-gray-400" />
            {/* Başlık */}
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Ürün bulunamadı
            </h3>
            {/* Açıklama metni */}
            <p className="max-w-xs">
              Arama kriterlerinize uygun ürün bulunamadı. Lütfen başka bir ürün
              arayın veya filtreleri değiştirin.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}