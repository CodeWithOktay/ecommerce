"use client";

import { ProductCard } from "@/components/ProductCard";
import { mockCategories } from "@/lib/categories";
import { mockProducts } from "@/lib/mockData";
import Link from "next/link";

type Params = {
  slug?: string[] | string;
};

export default function CategoryPage({ params }: { params: Params }) {
  const slugArr = Array.isArray(params?.slug)
    ? params.slug
    : typeof params?.slug === "string"
      ? params.slug.split("/").filter(Boolean)
      : [];

  const categoryId = slugArr[0]?.toLowerCase();
  const subCategoryId = slugArr[1]?.toLowerCase();

  if (!categoryId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Kategori Seçilmedi
          </h1>
          <Link
            href="/"
            className="bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-semibold"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  const currentCategory = mockCategories.find(
    (cat) => String(cat.id).toLowerCase() === categoryId
  );

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Kategori Bulunamadı
          </h1>
          <Link
            href="/"
            className="bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-semibold"
          >
            Tüm Kategoriler
          </Link>
        </div>
      </div>
    );
  }

  const subCategory = subCategoryId
    ? currentCategory.subCategories?.find(
        (sub) => String(sub.id).toLowerCase() === subCategoryId
      )
    : undefined;

  const filteredProducts = mockProducts.filter((product) => {
    const pCat = String(product.category_id ?? "").toLowerCase();
    const pSubId = String(product.subcategory_id ?? "").toLowerCase();
    const pSubName = String(product.subcategory_name ?? "").toLowerCase();

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
  });

  const title = subCategory
    ? `${currentCategory.name} > ${subCategory.name}`
    : currentCategory.name;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#667EEA] transition-colors">
              Ana Sayfa
            </Link>
            <span>/</span>
            <Link
              href={`/category/${currentCategory.id}`}
              className="hover:text-[#667EEA] transition-colors"
            >
              {currentCategory.name}
            </Link>
            {subCategory && (
              <>
                <span>/</span>
                <span className="text-[#667EEA] font-medium">
                  {subCategory.name}
                </span>
              </>
            )}
          </div>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#667EEA] to-[#764BA2] bg-clip-text text-transparent mb-4">
            {title}
          </h1>
          <p className="text-gray-600">
            {filteredProducts.length} ürün bulundu
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Ürün Bulunamadı
            </h2>
            <p className="text-gray-600 mb-6">
              Bu kategoride şu an için ürün bulunmamaktadır.
            </p>
            <Link
              href="/"
              className="bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-semibold"
            >
              Tüm Ürünleri Gör
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
