import { Coupon } from "@prisma/client";
import { Lock, Star, Truck, AlertCircle } from "lucide-react";
import { prisma } from "@/lib/db";
import ProductCard from "@/components/features/product/product-card";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import HeroSlider from "@/components/features/banner/banner-slider"; // 🟢 1. Import HeroSlider

// Ensure the page fetches fresh data on every request
export const revalidate = 0;

/**
 * Ana Sayfa
 * 
 * Mağazanın açılış sayfası.
 * - Server Componenet olarak çalışır.
 * - Paralel veri çekme (Promise.all) ile performans optimize edilmiştir.
 * - Ürünler, bannerlar ve favoriler eş zamanlı yüklenir.
 */
export default async function HomePage() {
  // --- KULLANICI OTURUM KONTROLÜ ---
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  // --- PARALEL VERİ ÇEKME ---
  // Promise.all kullanarak ürünleri, bannerları ve favorileri aynı anda çekeriz.
  const [favorites, rawProducts, banners, rawCoupons] = await Promise.all([
    // 1. Favorileri Getir (Kullanıcı giriş yaptıysa)
    userId
      ? prisma.favorite.findMany({
          where: { userId: userId },
          select: { productId: true },
        })
      : Promise.resolve([]),

    // 2. Ürünleri Getir (Aktif ve arşivlenmemiş olanlar)
    prisma.product.findMany({
      where: {
        isActive: true,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        brand: true,
        variants: true,
        reviews: { select: { rating: true } }, // Yıldız oylaması için yorumlar
      },
      orderBy: {
        createdAt: "desc", // En yeniden eskiye
      },
      take: 12, // İlk 12 ürün
    }),

    // 3. 🟢 Fetch Active Banners
    prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),

    // 4. 🟢 Fetch Active Coupons
    prisma.coupon.findMany({
      where: {
        isActive: true,
        OR: [{ startDate: null }, { startDate: { lte: new Date() } }],
        AND: [{ OR: [{ endDate: null }, { endDate: { gte: new Date() } }] }],
      },
      orderBy: { value: "desc" },
    }),
  ]);

  // Favori ID'lerini listeye çevir
  const favoriteIds = favorites.map((fav) => fav.productId);

  // 🟢 Kupon verilerini dönüştür (Decimal -> Number)
  const activeCoupons = (rawCoupons || []).map((c: Coupon) => ({
    ...c,
    value: Number(c.value),
    minAmount: Number(c.minAmount),
    usageLimit: c.usageLimit ? Number(c.usageLimit) : null,
    usedCount: c.usedCount || 0
  }));

  // 4. Veri Dönüştürme (Decimal -> Number)
  // Prisma Decimal tiplerini frontend'de kullanmak için number'a çeviriyoruz.
  const products = rawProducts.map((product) => ({
    ...product,
    price: Number(product.price),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
    variants: product.variants.map((v) => ({
      ...v,
      price: v.price ? Number(v.price) : 0,
      salePrice: v.salePrice ? Number(v.salePrice) : null,
    })),
  }));

  return (
    <main className="min-h-screen bg-white">
      {/* 🟢 5. HERO SLIDER SECTION */}
      {/* Only render if there are banners */}
      {banners.length > 0 && (
        <div className="max-w-[1400px] mx-auto px-4 mt-6 mb-10">
          <HeroSlider banners={banners} />
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Product Grid Section */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Öne Çıkan Ürünler
            </h2>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => {
                const isFav = favoriteIds.includes(product.id);

                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isFavorited={isFav}
                    coupons={activeCoupons} // 🟢 Kuponlar gönderiliyor
                  />
                );
              })}
            </div>
          ) : (
            // Empty State
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

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Fast Delivery */}
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

          {/* Secure Payment */}
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

          {/* Satisfaction Guarantee */}
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
