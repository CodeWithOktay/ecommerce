// components/features/product/related-products.tsx
import Link from "next/link";
import Image from "next/image";
import AddToCartButton from "@/components/features/product/add-to-card-button";
import { prisma } from "@/lib/db"; // Prisma import yolun doğru olsun

interface Props {
  categoryId: string;
  currentProductId: string;
}

async function getRootCategory(categoryId: string): Promise<string> {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true, parentId: true },
  });

  // Eğer bir üst kategorisi varsa, ona çık
  if (category?.parentId) {
    return getRootCategory(category.parentId);
  }

  // Üst kategorisi yoksa, demek ki en tepedeki (Root) bu
  return category?.id || categoryId;
}

export default async function RelatedProducts({
  categoryId,
  currentProductId,
}: Props) {
  const rootCategoryId = await getRootCategory(categoryId);

  const relatedCategories = await prisma.category.findMany({
    where: {
      OR: [
        { id: rootCategoryId }, // Ana kategori
        { parentId: rootCategoryId }, // Ana kategorinin çocukları
        { parent: { parentId: rootCategoryId } }, // Ana kategorinin torunları
      ],
    },
    select: { id: true },
  });
  const categoryIds = relatedCategories.map((c) => c.id);
  // Veriyi burada çekiyoruz (Server Component gücü)
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: { in: categoryIds }, // Aynı kategoridekiler
      isArchived: false, // Yayında olanlar
      id: { not: currentProductId }, // Kendisi hariç
    },
    include: { images: true },
    orderBy: { createdAt: "desc" },
    take: 10, // Max 10 ürün
  });

  // Eğer benzer ürün yoksa boş dönelim (hiçbir şey render etmesin)
  if (relatedProducts.length === 0) return null;

  return (
    <div className="container mx-auto px-4 py-12 border-t border-gray-100 mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Bu ürünü alanlar bunları da aldı
      </h2>

      {/* Carousel Wrapper */}
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4">
          {relatedProducts.map((item) => {
            const mainImg =
              item.images.find((img) => img.isMain) || item.images[0];

            // Fiyat Hesaplamaları
            const rawPrice = Number(item.price);
            const rawSalePrice = item.salePrice ? Number(item.salePrice) : null;
            const hasDiscount =
              rawSalePrice !== null && rawSalePrice < rawPrice;
            const displayPrice = hasDiscount ? rawSalePrice! : rawPrice;
            const oldPrice = hasDiscount ? rawPrice : null;
            const discountRate = hasDiscount
              ? Math.round(((rawPrice - rawSalePrice!) / rawPrice) * 100)
              : 0;

            const cartProductData = {
              id: item.id,
              name: item.name,
              price: displayPrice,
              images: item.images.map((img) => img.url),
              stock: item.stock,
            };

            return (
              <div
                key={item.id}
                className="snap-start flex-shrink-0 w-48 sm:w-56 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                {/* İndirim Rozeti */}
                {hasDiscount && (
                  <span className="absolute top-2 left-2 bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white text-[10px] font-bold px-2 py-1 rounded-lg z-10 shadow-sm">
                    %{discountRate}
                  </span>
                )}

                {/* Görsel */}
                <Link
                  href={`/product/${item.id}`}
                  className="relative w-full aspect-[4/5] block bg-gray-50"
                >
                  <Image
                    src={mainImg?.url || "/placeholder.png"}
                    alt={item.name}
                    fill
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>

                {/* Bilgi & Fiyat */}
                <div className="p-4 flex flex-col gap-2">
                  <h3
                    className="text-sm font-semibold text-gray-900 truncate"
                    title={item.name}
                  >
                    {item.name}
                  </h3>

                  <div className="flex items-center gap-2 mt-auto">
                    <span className="text-lg font-bold text-[#667EEA]">
                      {displayPrice.toLocaleString("tr-TR")} ₺
                    </span>
                    {oldPrice && (
                      <span className="text-xs text-gray-400 line-through decoration-red-300">
                        {oldPrice.toLocaleString("tr-TR")}
                      </span>
                    )}
                  </div>

                  {/* Sepete Ekle - Sadece ikon */}
                  <div className="mt-2">
                    <AddToCartButton
                      product={cartProductData}
                      showText={true} // İster true yap "Sepete Ekle" yazsın, ister false yap ikon kalsın
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
