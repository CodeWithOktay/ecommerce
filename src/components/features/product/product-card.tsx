"use client";

import { Check, PackageX, ArrowRight, Star, Ticket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
// Cart hook
import useCart from "@/hooks/use-cart";
import FavoriteButton from "./favorite-button";
import { useRouter } from "next/navigation";
import { GiShoppingCart } from "react-icons/gi";
import { useSession } from "next-auth/react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    categoryId: string; // 🟢 CategoryId eklendi
    category?: { parentId: string | null }; // 🟢 Hierarchy için
    salePrice?: number | null;
    stock: number;
    images: {
      url: string;
      isMain: boolean;
    }[];
    variants?: { id: string }[];
    reviews?: { rating: number }[];
  };
  isFavorited?: boolean;
  coupons?: { // 🟢 Kuponlar prop'u
    code: string;
    type: "PERCENTAGE" | "FIXED";
    value: number;
    categoryId: string | null;
    usageLimit?: number | null;
    usedCount?: number;
  }[];
}

/**
 * Ürün Kartı Bileşeni
 * 
 * Ürün listelerinde (Grid, Slider) kullanılan temel kart.
 * Özellikler:
 * - İndirim ve Kargo Bedava rozetleri.
 * - Stok kontrolü ve "Tükendi" overlay'i.
 * - Varyant varsa ürün detayına, yoksa doğrudan sepete ekleme.
 * - Hızlı favoriye ekleme butonu.
 * - 🟢 Kupon Gösterimi
 */
export default function ProductCard({
  product,
  isFavorited = false,
  coupons = [],
}: ProductCardProps) {
  const cart = useCart();
  const router = useRouter();
  const [isAdded, setIsAdded] = useState(false);

  const mainImageObj =
    product.images?.find((img) => img.isMain) || product.images?.[0];
  const imageUrl = mainImageObj ? mainImageObj.url : "/placeholder.png";

  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const currentPrice = hasDiscount ? product.salePrice! : product.price;

  // 🟢 İNDİRİM YÜZDESİ HESAPLAMA
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  const hasVariants = product.variants && product.variants.length > 0;

  const reviews = product.reviews || [];
  const reviewCount = reviews.length;
  const avgRating =
    reviewCount > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
      : 0;

  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN";

  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAdmin) return;

    if (hasVariants) {
      router.push(`/products/${product.id}`);
      return;
    }

    cart.addItem({
      id: product.id,
      name: product.name,
      price: currentPrice,
      imageUrl,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="group relative flex flex-col h-full bg-white rounded-xl border border-gray-100 hover:shadow-xl hover:shadow-[#667EEA]/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* IMAGE SECTION - KARE FORMAT (Daha kısa) */}
      <div className="relative aspect-square bg-gray-50 border-b overflow-hidden">
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className={`object-contain p-4 transition-transform duration-500 group-hover:scale-105 ${
              product.stock <= 0 ? "opacity-60 grayscale" : ""
            }`}
          />
        </Link>

        {/* BADGES - Biraz daha yukarı alındı */}
        <div className="absolute top-2 left-2 z-20 flex flex-col gap-1.5">
          {hasDiscount && (
            <span className="bg-gradient-to-r from-[#764BA2] to-[#ff4757] text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-lg flex items-center gap-1 animate-pulse">
              %{discountPercentage} İNDİRİM
            </span>
          )}
          
          {/* 🟢 KUPON BADGE */}
          {(() => {
             // En avantajlı kuponu bul
             const validCoupon = coupons
                .filter(c => {
                    // 1. Limit Kontrolü
                    if (c.usageLimit && c.usageLimit > 0) {
                        if ((c.usedCount || 0) >= c.usageLimit) return false;
                    }
                    
                    // 2. Kategori ve Hiyerarşi Kontrolü
                    if (!c.categoryId) return true; // Genel kupon
                    
                    if (c.categoryId === product.categoryId) return true; // Direkt kategori
                    
                    if (product.category?.parentId && c.categoryId === product.category.parentId) return true; // Üst kategori
                    
                    return false;
                })
                .sort((a,b) => b.value - a.value)[0]; // En yüksek değerliyi al
                
             if (validCoupon) {
                 return (
                    <span className="bg-white/90 backdrop-blur-sm text-indigo-600 text-[9px] font-bold px-2 py-0.5 rounded shadow-md border border-indigo-100 flex items-center gap-1">
                        <Ticket size={10} className="fill-indigo-600" />
                        <span>{validCoupon.code}</span>
                        <span className="text-[8px] opacity-80 border-l border-indigo-200 pl-1 ml-0.5">
                            {validCoupon.type === "PERCENTAGE" ? `%${validCoupon.value}` : `-${validCoupon.value}₺`}
                        </span>
                    </span>
                 );
             }
             return null;
          })()}

          <span className="bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-md">
            KARGO BEDAVA
          </span>
        </div>

        {/* FAVORITE */}
        <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition duration-300 transform translate-x-2 group-hover:translate-x-0">
          <FavoriteButton
            productId={product.id}
            initialIsFavorite={isFavorited}
          />
        </div>

        {/* OUT OF STOCK OVERLAY */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px] z-10">
            <span className="flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-lg text-red-600 font-bold text-xs border border-red-100 shadow-sm">
              <PackageX size={14} /> Tükendi
            </span>
          </div>
        )}
      </div>

      {/* CONTENT SECTION - Padding azaltıldı */}
      <div className="flex flex-col flex-1 p-4">
        <Link href={`/products/${product.id}`} className="space-y-1.5">
          <h3 className="font-bold text-gray-900 text-sm line-clamp-2 min-h-[2.5rem] group-hover:text-[#764BA2] transition-colors leading-snug">
            {product.name}
          </h3>

          {/* RATING */}
          <div className="flex items-center gap-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={12}
                  className={`${
                    star <= Math.round(avgRating)
                      ? "text-[#FFD700] fill-[#FFD700]"
                      : "text-gray-200 fill-gray-100"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-gray-400 font-semibold">
              ({reviewCount})
            </span>
          </div>
        </Link>

        {/* PRICE SECTION - Boşluklar sıkılaştırıldı */}
        <div className="mt-auto pt-3 space-y-3">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-[10px] text-gray-400 line-through font-medium mb-0.5">
                {product.price.toLocaleString("tr-TR")} TL
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#667EEA] to-[#764BA2]">
                {currentPrice.toLocaleString("tr-TR", {
                  minimumFractionDigits: 2,
                })}
              </span>
              <span className="text-xs font-bold text-[#764BA2] ">TL</span>
            </div>
          </div>

          {/* ACTION BUTTON - Yükseklik azaltıldı */}
          <button
            onClick={handleAction}
            disabled={product.stock <= 0 || isAdmin}
            className={`w-full py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden group/btn
              ${
                isAdmin 
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : product.stock > 0
                    ? isAdded
                      ? "bg-green-500 text-white shadow-md shadow-green-200"
                      : "bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white shadow-md shadow-[#667EEA]/30 hover:shadow-[#667EEA]/50 hover:-translate-y-0.5 active:scale-95"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            {isAdmin ? (
               "YÖNETİCİ" 
            ) : product.stock > 0 ? (
              isAdded ? (
                <>
                  <Check size={16} /> Eklendi
                </>
              ) : hasVariants ? (
                <>
                  <span className="tracking-wide">Ürüne Git</span>
                  <ArrowRight
                    size={16}
                    className="group-hover/btn:translate-x-1 transition-transform"
                  />
                </>
              ) : (
                <>
                  <GiShoppingCart size={16} /> SEPETE EKLE
                </>
              )
            ) : (
              "TÜKENDİ"
            )}

            {/* SHIMMER EFFECT */}
            {product.stock > 0 && !isAdded && !isAdmin && (
              <div className="absolute inset-0 -translate-x-full group-hover/btn:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
