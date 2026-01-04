import { prisma } from "@/lib/db";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import RelatedProducts from "@/components/features/product/related-products";
import ProductTabs from "@/components/features/product/product-tabs";
import ProductMainSection from "@/components/features/product/product-main-section";
import { authOptions } from "@/lib/auth/options";

/**
 * Ürün Detay Sayfası
 * 
 * Dinamik olarak tek bir ürünün detaylarını gösterir.
 * - Server Component olarak çalışır.
 * - Prisma ile ilişkisel veri (Kategori, Marka, Yorumlar, Varyantlar) çekilir.
 * - Kullanıcı oturumu varsa favori durumu ve satın alma geçmişi kontrol edilir.
 * - Ürüne özel aktif kuponları listeler.
 */
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  // 1. ÜRÜN VERİSİNİ ÇEK
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      brand: true,
      images: true,
      attributeValues: { include: { attribute: true } },
      variants: true,
      reviews: {
        where: { isApproved: true },
        include: {
          user: { select: { firstName: true, lastName: true, image: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product || product.isArchived) notFound();

  // 🟢 2. Favori durumunu kontrol et
  let isFavorited = false;
  if (session?.user?.id) {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: product.id,
        },
      },
    });
    isFavorited = !!favorite;
  }

  // 3. KUPONLARI ÇEK (YENİ EKLENDİ)
  // Ürün kategorisine özel veya genel aktif kuponları bul.
  // Tarih, aktiflik ve stok kontrolü yapılır.
  
  // Kategori hiyerarşisini kontrol et (Parent ID varsa onu da ekle)
  const categoryIds = [product.categoryId];
  if (product.category.parentId) {
    categoryIds.push(product.category.parentId);
  }

  const now = new Date();
  const rawCoupons = await prisma.coupon.findMany({
    where: {
      isActive: true,
      OR: [{ startDate: null }, { startDate: { lte: now } }],
      AND: [
        { OR: [{ endDate: null }, { endDate: { gte: now } }] },
        { 
          OR: [
            { categoryId: null }, 
            { categoryId: { in: categoryIds } } // 🟢 Hiyerarşik kontrol
          ] 
        },
      ],
    },
    orderBy: { value: "desc" }, // En yüksek indirim en üstte
  });

  // Decimal objelerini Number'a çeviriyoruz ve limiti kontrol ediyoruz
  const availableCoupons = rawCoupons
    .filter(c => {
       // 🟢 Kullanım limiti kontrolü
       if (c.usageLimit && c.usageLimit > 0) {
          return c.usedCount < c.usageLimit;
       }
       return true;
    })
    .map((coupon) => ({
    ...coupon,
    value: Number(coupon.value),
    minAmount: Number(coupon.minAmount),
    // Tarihleri string'e çevirmek de bazen hydration hatasını önler:
    startDate: coupon.startDate,
    endDate: coupon.endDate,
    createdAt: coupon.createdAt,
    updatedAt: coupon.updatedAt,
  }));

  // 3. FAVORİ KONTROLÜ

  // 4. YORUM İSTATİSTİKLERİ
  const reviews = product.reviews || [];
  const reviewCount = reviews.length;
  const avgRating =
    reviewCount > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
      : 0;

  // 5. SATIN ALMA KONTROLÜ
  // Kullanıcı bu ürünü daha önce satın almış mı?
  // Bu bilgi, yorum yapma yetkisi veya "Satın aldınız" rozeti için kullanılır.
  const hasBought = session?.user?.email
    ? await prisma.order.findFirst({
        where: {
          user: { email: session.user.email },
          status: "DELIVERED",
          items: { some: { productId: product.id } },
        },
      })
    : null;

  const mainImage =
    product.images.find((img) => img.isMain) || product.images[0];

  // 6. İNDİRİM ROZETİ HESAPLAMA
  const rawPrice = Number(product.price);
  const rawSalePrice = product.salePrice ? Number(product.salePrice) : null;
  const hasDiscount = rawSalePrice !== null && rawSalePrice < rawPrice;
  const discountRate = hasDiscount
    ? Math.round(((rawPrice - rawSalePrice!) / rawPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-24 lg:pb-10 font-sans">
      {/* HEADER / BREADCRUMB */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center text-xs text-gray-500 gap-2 overflow-hidden whitespace-nowrap">
            <Link href="/" className="hover:text-orange-600">
              Ana Sayfa
            </Link>
            <ChevronRight size={12} className="text-gray-300" />
            <Link
              href={`/category/${product.category.slug}`}
              className="text-indigo-600 font-medium"
            >
              {product.category.name}
            </Link>
            <ChevronRight size={12} className="text-gray-300" />
            <span className="font-semibold text-gray-800 truncate">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* --- SOL KOLON (Görseller) --- */}
          <div className="lg:col-span-12 xl:col-span-5">
            <div className="sticky top-6">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white/50 border-2 border-white shadow-2xl shadow-indigo-100/50 group">
                {/* İNDİRİM ROZETİ */}
                {hasDiscount && (
                  <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur text-red-600 border border-red-100 text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
                    %{discountRate} İndirim
                  </div>
                )}

                {/* Ana Görsel */}
                <Image
                  src={mainImage?.url || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-contain p-8 hover:scale-105 transition-transform duration-700 ease-in-out"
                  priority
                />
              </div>

              {/* KÜÇÜK RESİMLER */}
              {product.images.length > 1 && (
                <div className="flex gap-4 mt-6 overflow-x-auto pb-4 scrollbar-hide justify-center">
                  {product.images.map((img) => (
                    <div
                      key={img.id}
                      className="relative w-20 h-20 flex-shrink-0 border-2 border-white bg-white rounded-xl overflow-hidden shadow-md cursor-pointer hover:border-indigo-400 transition-colors"
                    >
                      <Image
                        src={img.url}
                        alt="thumb"
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* --- SAĞ KOLON (Client Component) --- */}
          <div className="lg:col-span-7">
            <ProductMainSection
              product={{
                ...product,
                price: Number(product.price),
                salePrice: product.salePrice ? Number(product.salePrice) : null,
                variants:
                  product.variants?.map((v) => ({
                    ...v,
                    price: Number(v.price),
                    salePrice: v.salePrice ? Number(v.salePrice) : null,
                  })) || [],
              }}
              reviewStats={{
                avgRating,
                reviewCount: product.reviews.length,
              }}
              // 🟢 Sadece değişkeni gönder, yukarıda zaten temizlemiştin:
              availableCoupons={availableCoupons}
              isFavorited={isFavorited}
            />
          </div>
        </div>

        {/* --- ALT KISIM --- */}
        <div className="justify-center lg:grid-cols-12 gap-9 mt-6">
          <div className="lg:col-span-9">
            <ProductTabs
              description={product.description}
              attributes={product.attributeValues}
              reviews={product.reviews}
              isUserBought={!!hasBought}
            />
          </div>
        </div>

        <RelatedProducts
          categoryId={product.categoryId}
          currentProductId={product.id}
        />
      </div>
    </div>
  );
}
