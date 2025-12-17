"use client";

import { ListFilter, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Product } from "@prisma/client";
import ProductCard from "./product-card";

// Props interface'i - ürün grid bileşeninin alacağı props'lar
type ProductWithImages = Product & {
  images: {
    id: string;
    url: string;
    isMain: boolean;
  }[];
};

interface ProductGridProps {
  products: ProductWithImages[]; // Gösterilecek ürün listesi
}

export function ProductGrid({ products }: ProductGridProps) {
  // Sıralama seçeneği state'i
  const [sortOrder, setSortOrder] = useState("default");

  const sortedProducts = useMemo(() => {
    const tempProducts = [...products];

    switch (sortOrder) {
      case "price-asc":
        tempProducts.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-desc":
        tempProducts.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "name-asc":
        tempProducts.sort((a, b) => a.name.localeCompare(b.name, "tr"));
        break;
      default:
        break;
    }

    return tempProducts;
  }, [products, sortOrder]);

  return (
    <div className="space-y-8">
      {/* ✅ Filtre ve Sıralama Alanı */}
      <div className="flex justify-end">
        <div className="relative w-64">
          {/* Sıralama Dropdown */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="appearance-none w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 bg-white shadow-sm text-gray-700 text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            aria-label="Ürün sıralama seçenekleri"
          >
            <option value="default">Önerilen Sıralama</option>
            <option value="price-asc">Fiyata Göre (Artan)</option>
            <option value="price-desc">Fiyata Göre (Azalan)</option>
            <option value="name-asc">İsme Göre (A-Z)</option>
          </select>

          <ListFilter
            size={20}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 pointer-events-none"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* ✅ Ürün Grid veya Boş Durum */}
      {sortedProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  price: Number(product.price),
                  salePrice: product.salePrice
                    ? Number(product.salePrice)
                    : null,
                  images: product.images || [],
                }}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
          <Search size={48} className="mb-4 text-gray-400" aria-hidden="true" />
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
