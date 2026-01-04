"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AddToCartButton from "@/components/features/product/add-to-card-button";

// Ürün verisinin tipini tanımlayalım
interface ProductType {
  id: string;
  name: string;
  price: number;
  salePrice: number | null;
  images: { url: string; isMain: boolean }[];
  stock: number;
  categoryId: string; // 🟢 CategoryId eklendi
  category: { parentId: string | null };
}

interface CouponType {
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  categoryId: string | null;
  usageLimit?: number | null;
  usedCount?: number;
}

interface Props {
  products: ProductType[];
  coupons?: CouponType[]; // 🟢 Kuponlar eklendi
}

/**
 * İlgili Ürünler Kaydırıcısı (Carousel)
 * 
 * - Mouse ve dokunmatik ile kaydırılabilir yatay liste.
 * - Navigasyon okları ile kontrol edilebilir.
 * - "Sepete Ekle" butonu entegreli ürün kartları içerir.
 */
export default function RelatedProductsCarousel({ products, coupons = [] }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Kaydırma Fonksiyonu
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      // Bir seferde ne kadar kayacak? (Kart genişliği + gap) yaklaşık 250px
      const scrollAmount = 250;

      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative group/carousel">
      {/* SOL OK BUTONU */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-20 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-[#764BA2] hover:scale-110 transition-all opacity-0 group-hover/carousel:opacity-100 disabled:opacity-0"
        aria-label="Sola kaydır"
      >
        <ChevronLeft size={24} />
      </button>

      {/* SAĞ OK BUTONU */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-20 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-[#764BA2] hover:scale-110 transition-all opacity-0 group-hover/carousel:opacity-100 disabled:opacity-0"
        aria-label="Sağa kaydır"
      >
        <ChevronRight size={24} />
      </button>

      {/* LİSTE (Scroll Container) */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-1"
      >
        {products.map((item) => {
          const mainImg =
            item.images.find((img) => img.isMain) || item.images[0];

          // Fiyat Hesaplamaları
          const rawPrice = Number(item.price);
          const rawSalePrice = item.salePrice ? Number(item.salePrice) : null;
          const hasDiscount = rawSalePrice !== null && rawSalePrice < rawPrice;
          const displayPrice = hasDiscount ? rawSalePrice! : rawPrice;
          const oldPrice = hasDiscount ? rawPrice : null;
          const discountRate = hasDiscount
            ? Math.round(((rawPrice - rawSalePrice!) / rawPrice) * 100)
            : 0;

          // 🟢 Kupon Hesaplama (En iyisini bul)
          const validCoupon = coupons
             .filter(c => {
                 // 1. Limit Kontrolü
                 if (c.usageLimit && c.usageLimit > 0) {
                     if ((c.usedCount || 0) >= c.usageLimit) return false;
                 }
                 
                 // 2. Kategori ve Hiyerarşi Kontrolü
                 if (!c.categoryId) return true; // Genel kupon
                 
                 if (c.categoryId === item.categoryId) return true; // Direkt kategori
                 
                 if (item.category?.parentId && c.categoryId === item.category.parentId) return true; // Üst kategori
                 
                 return false;
             })
             .sort((a,b) => b.value - a.value)[0];

          // Sepete ekle butonu için veri
          const cartProductData = {
            id: item.id,
            name: item.name,
            price: displayPrice,
            imageUrl: mainImg?.url, // Hook için gerekli
            images: item.images.map((img) => ({
              url: img.url,
              isMain: img.isMain || false,
            })),
            stock: item.stock,
          };

          return (
            <div
              key={item.id}
              className="flex-shrink-0 w-48 sm:w-56 bg-white rounded-xl border border-gray-100 hover:shadow-xl hover:shadow-[#667EEA]/10 transition-all duration-300 overflow-hidden group"
            >
              {/* Resim Alanı */}
              <div className="relative aspect-square bg-gray-50 border-b overflow-hidden">
                <Link
                  href={`/products/${item.id}`}
                  className="block w-full h-full"
                >
                  <Image
                    src={mainImg?.url || "/placeholder.png"}
                    alt={item.name}
                    fill
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>

                {/* İndirim ve Kupon Rozeti */}
                <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                    {hasDiscount && (
                    <span className="bg-gradient-to-r from-[#764BA2] to-[#ff4757] text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-sm animate-pulse">
                        %{discountRate}
                    </span>
                    )}
                    
                    {/* 🟢 Kupon Badge */}
                    {validCoupon && (
                        <span className="bg-white/95 backdrop-blur-sm text-indigo-600 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md border border-indigo-100 border-dashed flex items-center gap-1">
                             <span>{validCoupon.code}</span>
                             <span className="text-[8px] opacity-80 border-l border-indigo-200 pl-1">
                                {validCoupon.type === "PERCENTAGE" ? `%${validCoupon.value}` : `-${validCoupon.value}₺`}
                             </span>
                        </span>
                    )}
                </div>
              </div>

              {/* Bilgi Alanı */}
              <div className="p-3 flex flex-col gap-2">
                <Link href={`/products/${item.id}`}>
                  <h3
                    className="text-xs font-bold text-gray-900 line-clamp-2 min-h-[2rem] hover:text-[#764BA2] transition-colors"
                    title={item.name}
                  >
                    {item.name}
                  </h3>
                </Link>

                <div className="flex flex-col mt-auto">
                  {oldPrice && (
                    <span className="text-[10px] text-gray-400 line-through">
                      {oldPrice.toLocaleString("tr-TR")} TL
                    </span>
                  )}
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#667EEA] to-[#764BA2]">
                      {displayPrice.toLocaleString("tr-TR")}
                    </span>
                    <span className="text-xs font-bold text-[#764BA2]">TL</span>
                  </div>
                </div>

                {/* Buton - Kompakt */}
                <div className="mt-1 h-9">
                  <AddToCartButton
                    product={cartProductData}
                    showText={true}
                    className="w-full h-full text-xs py-0" // Butonu buraya uydurmak için class gönderiyoruz
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
