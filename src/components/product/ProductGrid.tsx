'use client';

import { ListFilter, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Product } from '@/types/index';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const [sortOrder, setSortOrder] = useState('default');

  const sortedProducts = useMemo(() => {
    const tempProducts = [...products];

    switch (sortOrder) {
      case 'price-asc':
        tempProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        tempProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        tempProducts.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
        break;
      default:
        break;
    }

    return tempProducts;
  }, [products, sortOrder]);

  return (
    <div className="space-y-8">
      {/* Filtre ve Sıralama Alanı */}
      <div className="flex justify-end">
        <div className="relative w-64">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="appearance-none w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 bg-white shadow-sm text-gray-700 text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
            <option value="default">Önerilen Sıralama</option>
            <option value="price-asc">Fiyata Göre (Artan)</option>
            <option value="price-desc">Fiyata Göre (Azalan)</option>
            <option value="name-asc">İsme Göre (A-Z)</option>
          </select>

          <ListFilter
            size={20}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>
      </div>

      {/* Ürünler */}
      {sortedProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
          <Search size={48} className="mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Ürün bulunamadı
          </h3>
          <p className="max-w-xs">
            Arama kriterlerinize uygun ürün bulunamadı. Lütfen başka bir arama
            yapın veya filtreleri değiştirin.
          </p>
        </div>
      )}
    </div>
  );
}
