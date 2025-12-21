import { prisma } from "@/lib/db";
import {
  Check,
  Shield,
  Star,
  Truck,
  ChevronRight,
  Store,
  Gift,
  CreditCard,
  Info,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import AddToCartButton from "@/components/features/product/add-to-card-button";
import FavoriteButton from "@/components/features/product/favorite-button";
import RelatedProducts from "@/components/features/product/related-products";
import ProductTabs from "@/components/features/product/product-tabs";
import ShareButton from "@/components/features/product/share-button";

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession();

  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      brand: true,
      images: true,
      attributeValues: { include: { attribute: true } },
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

  // 🟢 YORUM VE PUAN MANTIĞI
  const reviews = product.reviews || [];
  const reviewCount = reviews.length;
  const hasReviews = reviewCount > 0;

  const avgRating = hasReviews
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
    : 0;

  const displayRating = avgRating.toLocaleString("tr-TR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  // SATIN ALMA KONTROLÜ
  const hasBought = session?.user
    ? await prisma.order.findFirst({
        where: {
          userId: session.user.id,
          status: "DELIVERED",
          items: { some: { productId: product.id } },
        },
      })
    : null;

  // FİYAT HESAPLAMALARI
  const rawPrice = Number(product.price);
  const rawSalePrice = product.salePrice ? Number(product.salePrice) : null;
  const hasDiscount = rawSalePrice !== null && rawSalePrice < rawPrice;
  const displayPrice = hasDiscount ? rawSalePrice! : rawPrice;
  const oldPrice = hasDiscount ? rawPrice : null;
  const discountRate = hasDiscount
    ? Math.round(((rawPrice - rawSalePrice!) / rawPrice) * 100)
    : 0;

  const mainImage =
    product.images.find((img) => img.isMain) || product.images[0];
  const cartProductData = {
    id: product.id,
    name: product.name,
    price: displayPrice,
    imageUrl: mainImage?.url,
    images: product.images.map((img) => ({ url: img.url, isMain: img.isMain })),
    stock: product.stock,
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-24 lg:pb-10 font-sans">
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
          {/* SOL KOLON */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-4">
              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-white mb-4 group">
                {hasDiscount && (
                  <div className="absolute top-3 right-3 z-10 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
                    %{discountRate} İndirim
                  </div>
                )}
                <Image
                  src={mainImage?.url || "/placeholder.png"}
                  alt={product.name}
                  fill
                  className="object-contain hover:scale-105 transition-transform duration-500"
                  priority
                />
                <div className="absolute top-3 right-3 z-10">
                  <FavoriteButton productId={product.id} />
                </div>
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {product.images.map((img) => (
                    <div
                      key={img.id}
                      className="relative w-16 h-16 flex-shrink-0 border rounded-lg overflow-hidden border-gray-200"
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

          {/* SAĞ KOLON */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <Link
                    href={`/brand/${product.brand?.id}`}
                    className="text-indigo-600 text-sm font-bold hover:underline mb-1 inline-block"
                  >
                    {product.brand?.name}
                  </Link>
                  <h1 className="text-2xl md:text-3xl font-normal text-gray-900 leading-tight mb-3">
                    {product.name}
                  </h1>
                </div>
                <ShareButton />
              </div>

              {/* PUAN VE YILDIZ ALANI */}
              <div className="flex items-center gap-4 border-b border-gray-100 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={18}
                        fill={
                          hasReviews && s <= Math.round(avgRating)
                            ? "currentColor"
                            : "none"
                        }
                        className={
                          hasReviews && s <= Math.round(avgRating)
                            ? ""
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-gray-700">
                    {hasReviews ? displayRating : "0.0"}
                  </span>
                </div>
                <span className="text-sm text-gray-500 border-l pl-4 border-gray-200">
                  {hasReviews ? (
                    `(${reviewCount} Değerlendirme)`
                  ) : (
                    <span className="text-indigo-600 font-medium italic">
                      Bu ürünü ilk değerlendiren siz olun! 🚀
                    </span>
                  )}
                </span>
              </div>

              <div className="flex items-end gap-3 mb-2">
                <span className="text-4xl font-bold text-gray-900">
                  {displayPrice.toLocaleString("tr-TR", {
                    minimumFractionDigits: 2,
                  })}{" "}
                  <span className="text-2xl">TL</span>
                </span>
                {hasDiscount && (
                  <div className="flex flex-col mb-1">
                    <span className="text-sm text-gray-400 line-through">
                      {oldPrice?.toLocaleString("tr-TR")} TL
                    </span>
                    <span className="text-xs text-green-600 font-bold">
                      Sepette Ek İndirim
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-100 p-3 rounded-lg flex items-center gap-3">
                <div className="bg-white p-2 rounded-full text-green-600 shadow-sm">
                  <Truck size={20} />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">
                    Kargo Bedava
                  </div>
                  <div className="text-xs text-gray-500">Hızlı teslimat</div>
                </div>
              </div>
              <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg flex items-center gap-3">
                <div className="bg-white p-2 rounded-full text-orange-600 shadow-sm">
                  <Gift size={20} />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">
                    Hediye Çeki
                  </div>
                  <div className="text-xs text-gray-500">Kullanıma hazır</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg relative overflow-hidden">
              <div className="flex flex-col gap-4">
                {product.stock > 0 ? (
                  <div className="text-xs font-bold text-green-600 flex items-center gap-1">
                    <Check size={14} /> Stokta Var
                  </div>
                ) : (
                  <div className="text-xs font-bold text-red-600">
                    Stok Tükendi
                  </div>
                )}
                <AddToCartButton product={cartProductData} />
                <div className="grid grid-cols-3 gap-2 mt-2 pt-4 border-t border-gray-100 text-center">
                  <div className="flex flex-col items-center gap-1 text-gray-400">
                    <CreditCard size={18} />
                    <span className="text-[10px] text-gray-500 font-medium">
                      Taksit
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-gray-400">
                    <Truck size={18} />
                    <span className="text-[10px] text-gray-500 font-medium">
                      Hızlı Kargo
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-gray-400">
                    <Info size={18} />
                    <span className="text-[10px] text-gray-500 font-medium">
                      İade
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
