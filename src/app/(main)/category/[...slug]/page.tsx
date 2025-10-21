'use client';

import { ProductCard } from '@/components/product/ProductCard';
import { mockCategories } from '@/lib/constants/categories';
import { mockProducts } from '@/lib/data/mock-data';
import { ChevronRight, Home, Search } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { SortDropdown } from '@/components/forms/SortDropdown';

type Params = {
  slug?: string[] | string;
};

export default function CategoryPage({ params }: { params: Params }) {
  const [sortOption, setSortOption] = useState('recommended');

  const slugArr = Array.isArray(params?.slug)
    ? params.slug
    : typeof params?.slug === 'string'
      ? params.slug.split('/').filter(Boolean)
      : [];

  const categoryId = slugArr[0]?.toLowerCase();
  const subCategoryId = slugArr[1]?.toLowerCase();

  // Tüm hook'ları early return'lerden ÖNCE çağır
  const { currentCategory, subCategory, filteredProducts, sortedProducts } = useMemo(() => {
    const currentCategory = mockCategories.find(
      (cat) => String(cat.id).toLowerCase() === categoryId
    );

    const subCategory = subCategoryId && currentCategory
      ? currentCategory.subCategories?.find(
          (sub) => String(sub.id).toLowerCase() === subCategoryId
        )
      : undefined;

    const filteredProducts = currentCategory
      ? mockProducts.filter((product) => {
          const pCat = String(product.category_id ?? '').toLowerCase();
          const pSubId = String(product.subcategory_id ?? '').toLowerCase();
          const pSubName = String(product.subcategory_name ?? '').toLowerCase();

          if (subCategory) {
            if (pSubId) {
              return (
                pCat === currentCategory.id.toLowerCase() &&
                pSubId === subCategory.id.toLowerCase()
              );
            }
            return (
              pCat === currentCategory.id.toLowerCase() &&
              pSubName === subCategory.name.toLowerCase()
            );
          }

          return pCat === currentCategory.id.toLowerCase();
        })
      : [];

    const sortedProducts = [...filteredProducts];
    switch (sortOption) {
      case 'newest':
        return {
          currentCategory,
          subCategory,
          filteredProducts,
          sortedProducts: sortedProducts.sort(
            (a, b) =>
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
        };
      case 'price-asc':
        return {
          currentCategory,
          subCategory,
          filteredProducts,
          sortedProducts: sortedProducts.sort((a, b) => a.price - b.price)
        };
      case 'price-desc':
        return {
          currentCategory,
          subCategory,
          filteredProducts,
          sortedProducts: sortedProducts.sort((a, b) => b.price - a.price)
        };
      case 'recommended':
      default:
        return {
          currentCategory,
          subCategory,
          filteredProducts,
          sortedProducts: filteredProducts
        };
    }
  }, [categoryId, subCategoryId, sortOption]);

  // Early return'ler hook'lardan SONRA
  if (!categoryId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/20">
            <Search className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Kategori Seçilmedi
          </h1>
          <p className="text-gray-300 mb-8 text-lg">
            Lütfen bir kategori seçerek alışveriş deneyiminize başlayın.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-2xl hover:scale-105 transition-all duration-300 font-semibold shadow-2xl"
          >
            <Home size={20} />
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-red-500/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-500/30">
            <div className="text-2xl">❌</div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Kategori Bulunamadı
          </h1>
          <p className="text-gray-300 mb-8 text-lg">
            Aradığınız kategori mevcut değil veya taşınmış olabilir.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-2xl hover:scale-105 transition-all duration-300 font-semibold shadow-2xl"
          >
            Tüm Kategorileri Gör
          </Link>
        </div>
      </div>
    );
  }

  const title = subCategory
    ? `${currentCategory.name} - ${subCategory.name}`
    : currentCategory.name;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link 
                href="/" 
                className="flex items-center gap-1 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                <Home size={16} />
                Ana Sayfa
              </Link>
              <ChevronRight size={16} className="text-gray-400" />
              <Link
                href={`/category/${currentCategory.id}`}
                className="hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                {currentCategory.name}
              </Link>
              {subCategory && (
                <>
                  <ChevronRight size={16} className="text-gray-400" />
                  <span className="text-blue-600 font-semibold">
                    {subCategory.name}
                  </span>
                </>
              )}
            </div>
          </nav>

          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent mb-3">
                {title}
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-gray-600 text-lg">
                  <span className="font-semibold text-slate-800">{sortedProducts.length}</span> ürün listeleniyor
                </p>
                <div className="w-px h-6 bg-gray-300"></div>
                <p className="text-gray-500 text-sm">
                  {subCategory ? 'Alt Kategori' : 'Ana Kategori'}
                </p>
              </div>
            </div>
            
            <div className="w-full lg:w-80">
              <SortDropdown value={sortOption} onChange={setSortOption} />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Sub Categories Grid */}
        {!subCategoryId && currentCategory.subCategories && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-800">
                Alt Kategoriler
              </h2>
              <div className="text-sm text-gray-500">
                {currentCategory.subCategories.length} alt kategori
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentCategory.subCategories.map((subCat, index) => (
                <Link
                  key={subCat.id}
                  href={`/category/${currentCategory.id}/${subCat.id}`}
                  className="group relative bg-white rounded-2xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="text-slate-800 font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {subCat.name}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 group-hover:text-blue-500 transition-colors duration-300">
                        Ürünleri gör
                      </span>
                      <ChevronRight 
                        size={16} 
                        className="text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" 
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Products Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-800">
              {subCategory ? 'Ürünler' : 'Tüm Ürünler'}
            </h2>
            <div className="text-sm text-gray-500 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border">
              {sortedProducts.length} ürün
            </div>
          </div>

          {/* Products Grid */}
          {sortedProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-white/80 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 border border-gray-200 shadow-2xl">
                <div className="text-4xl">📦</div>
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">
                Ürün Bulunamadı
              </h2>
              <p className="text-gray-600 mb-10 max-w-md mx-auto text-lg">
                Bu kategoride henüz ürün bulunmuyor. 
                Farklı kategorileri keşfederek alışverişe başlayabilirsiniz.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl hover:bg-blue-700 hover:scale-105 transition-all duration-300 font-semibold shadow-2xl"
                >
                  Ana Sayfaya Dön
                </Link>
                <Link
                  href="/categories"
                  className="inline-flex items-center gap-3 border border-gray-300 text-slate-700 px-8 py-4 rounded-2xl hover:border-blue-300 hover:scale-105 transition-all duration-300 font-semibold"
                >
                  Tüm Kategoriler
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {sortedProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="group hover:-translate-y-3 transition-all duration-500"
                >
                  <div className="relative bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                    <ProductCard product={product} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}