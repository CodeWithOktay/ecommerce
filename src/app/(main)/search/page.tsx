'use client';

import { Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { ProductGrid } from '@/components/product/ProductGrid';
import { mockProducts } from '@/lib/data/mock-data';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  const filteredProducts = mockProducts.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {query && (
          <h6 className="text-xl font-semibold text-gray-800 mb-6">
            <span className="text-indigo-600">&quot;{query}&quot;</span>{' '}
            {' aramanızla eşleşen '}
            {filteredProducts.length} sonuç{' '}
            {filteredProducts.length === 0 ? 'bulundu.' : '   bulundu.'}
          </h6>
        )}

        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
            <Search size={48} className="mb-4 text-gray-400" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Ürün bulunamadı
            </h3>
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
