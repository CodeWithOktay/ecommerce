"use client";

import { ShoppingCart, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import useCart from "@/hooks/use-cart";

// ✅ DÜZELTME 1: Tip Tanımı
// Prisma'dan gelen ham Product tipi yerine, sayfanın gönderdiği
// gerçek veri yapısını tanımlıyoruz.
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string | null;
    price: number; // Decimal değil number geliyor artık
    stock: number;
    // Resim dizisinin yapısını tanıtıyoruz
    images: {
      url: string;
      isMain: boolean;
    }[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const cart = useCart();
  const [isAdded, setIsAdded] = useState(false);

  // ✅ DÜZELTME 2: Resim URL'ini Doğru Alma
  // Önce "Ana Görsel" (isMain=true) var mı bak, yoksa ilk resmi al.
  const mainImageObj =
    product.images?.find((img) => img.isMain) || product.images?.[0];

  // Obje varsa URL'ini al, yoksa placeholder koy.
  const imageUrl = mainImageObj ? mainImageObj.url : "/placeholder.png";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    cart.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: imageUrl, // ✅ Düzeltilmiş URL
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-4 border border-gray-100 hover:border-indigo-100 relative overflow-hidden h-full flex flex-col">
      {/* Resim Alanı */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl mb-3 bg-gray-50">
        <Link href={`/products/${product.id}`}>
          <Image
            src={imageUrl} // ✅ String URL kullanıyoruz
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>

        {/* Stok Rozeti */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider transform -rotate-12 shadow-md">
              Tükendi
            </span>
          </div>
        )}
      </div>

      {/* İçerik Alanı */}
      <div className="flex flex-col flex-1">
        <Link href={`/products/${product.id}`} className="flex-1">
          <h3 className="font-semibold text-gray-900 truncate mb-1 text-lg group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mb-3 min-h-[40px]">
            {product.description || "Açıklama bulunmuyor."}
          </p>
        </Link>

        {/* Fiyat */}
        <div className="mb-4">
          <p className="text-xl font-bold text-gray-900 flex items-center gap-1">
            {product.price.toLocaleString("tr-TR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            <span className="text-xs font-medium text-gray-500 relative top-0.5">
              TL
            </span>
          </p>
        </div>

        {/* Sepet Butonu */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className={`
            w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200
            ${
              product.stock > 0
                ? isAdded
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-black text-white hover:bg-gray-800 hover:shadow-lg active:scale-95"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          {product.stock > 0 ? (
            isAdded ? (
              <>
                <Check size={18} className="animate-bounce" />
                Eklendi
              </>
            ) : (
              <>
                <ShoppingCart size={18} />
                Sepete Ekle
              </>
            )
          ) : (
            "Stokta Yok"
          )}
        </button>
      </div>
    </div>
  );
}
