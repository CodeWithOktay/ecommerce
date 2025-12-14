import { Lock, Star, Truck, AlertCircle } from "lucide-react";
import Image from "next/image";
import { prisma } from "@/lib/prisma-client"; // { prisma } süslü parantez ile import etmek genelde daha güvenlidir
import ProductCard from "@/components/product/ProductCard";

// Sayfanın her istekte güncel veri çekmesini sağlar
export const revalidate = 0;

export default async function HomePage() {
  // 1. Veritabanından Ham Veriyi Çek
  const rawProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      isArchived: false,
    },
    include: {
      images: true, // 🟢 Görselleri getir
      category: true, // 🟢 Kategoriyi getir
      brand: true, // 🟢 Markayı getir
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 12,
  });

  // 2. Decimal -> Number Dönüşümü (Serialization)
  const products = rawProducts.map((product) => ({
    ...product,
    price: Number(product.price),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
  }));

  return (
    <main className="min-h-screen bg-white">
      {/* Ana Container */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Ürün Grid Bölümü */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Öne Çıkan Ürünler
            </h2>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            // Ürün Yoksa Gösterilecek State
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <AlertCircle className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Henüz Ürün Eklenmedi
              </h3>
              <p className="text-gray-500 mt-2">
                Çok yakında yeni ürünlerimizle buradayız.
              </p>
            </div>
          )}
        </div>

        {/* Özellikler Bölümü (Features) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Hızlı Teslimat */}
          <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-blue-50 border border-blue-100 transition-transform hover:-translate-y-1 duration-300">
            <div className="w-14 h-14 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
              <Truck size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Hızlı Teslimat
            </h3>
            <p className="text-gray-600">
              Siparişleriniz aynı gün kargoya verilir, en kısa sürede kapınıza
              ulaşır.
            </p>
          </div>

          {/* Güvenli Ödeme */}
          <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-green-50 border border-green-100 transition-transform hover:-translate-y-1 duration-300">
            <div className="w-14 h-14 bg-green-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-green-200">
              <Lock size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Güvenli Ödeme
            </h3>
            <p className="text-gray-600">
              256-bit SSL sertifikası ve 3D Secure ile ödemeleriniz %100
              güvende.
            </p>
          </div>

          {/* Kalite Garantisi */}
          <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-amber-50 border border-amber-100 transition-transform hover:-translate-y-1 duration-300">
            <div className="w-14 h-14 bg-amber-500 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-amber-200">
              <Star size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Müşteri Memnuniyeti
            </h3>
            <p className="text-gray-600">
              Koşulsuz iade garantisi ve 7/24 müşteri desteği ile yanınızdayız.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
