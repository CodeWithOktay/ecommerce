import { prisma } from "@/lib/db";
import RelatedProductsCarousel from "./related-products-carousel"; // 🟢 Yeni component'i import et

interface Props {
  categoryId: string;
  currentProductId: string;
}

// Kategori hiyerarşisini bulan yardımcı fonksiyon (Aynı kalıyor)
async function getRootCategory(categoryId: string): Promise<string> {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true, parentId: true },
  });

  if (category?.parentId) {
    return getRootCategory(category.parentId);
  }

  return category?.id || categoryId;
}

/**
 * İlgili Ürünler Konteyneri (Server Component)
 * 
 * 1. Mevcut ürünün ana kategorisini (root category) bulur.
 * 2. O kategoriye ve alt kategorilerine ait diğer ürünleri çeker.
 * 3. Mevcut ürünü listeden hariç tutar.
 * 4. Veriyi formatlayıp (Decimal -> Number) Carousel bileşenine iletir.
 */
export default async function RelatedProducts({
  categoryId,
  currentProductId,
}: Props) {
  const rootCategoryId = await getRootCategory(categoryId);

  // İlgili kategorileri bul
  const relatedCategories = await prisma.category.findMany({
    where: {
      OR: [
        { id: rootCategoryId },
        { parentId: rootCategoryId },
        { parent: { parentId: rootCategoryId } },
      ],
    },
    select: { id: true },
  });

  const categoryIds = relatedCategories.map((c) => c.id);

  // Ürünleri çek
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: { in: categoryIds },
      isArchived: false,
      id: { not: currentProductId },
    },
    select: {
      // 🟢 Client component'e sadece lazım olan veriyi gönderiyoruz
      id: true,
      name: true,
      categoryId: true, // 🟢 Kupon eşleşmesi için gerekli
      category: { select: { parentId: true } }, // 🟢 Hiyerarşi için
      price: true,
      salePrice: true,
      stock: true,
      images: {
        select: {
          url: true,
          isMain: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  if (relatedProducts.length === 0) return null;

  // Veri dönüşümü (Decimal -> Number)
  const formattedProducts = relatedProducts.map((p) => ({
    ...p,
    price: Number(p.price),
    salePrice: p.salePrice ? Number(p.salePrice) : null,
  }));

  // 🟢 Kuponları çek
  const activeCoupons = await prisma.coupon.findMany({
      where: {
        isActive: true,
        OR: [{ startDate: null }, { startDate: { lte: new Date() } }],
        AND: [{ OR: [{ endDate: null }, { endDate: { gte: new Date() } }] }],
      },
      orderBy: { value: "desc" },
    });

  const formattedCoupons = activeCoupons.map(c => ({
      ...c,
      value: Number(c.value),
      minAmount: Number(c.minAmount),
      usageLimit: c.usageLimit ? Number(c.usageLimit) : null,
      usedCount: c.usedCount
  }));


  return (
    <div className="container mx-auto px-4 py-12 border-t border-gray-100 mt-10">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-gradient-to-b from-[#667EEA] to-[#764BA2] rounded-full block"></span>
        Bu ürünü alanlar bunları da aldı
      </h2>

      {/* Client Component'i Çağır */}
      <RelatedProductsCarousel products={formattedProducts} coupons={formattedCoupons} />
    </div>
  );
}
