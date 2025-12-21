"use client";

import { ShoppingCart, Check, PackageX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import useCart from "@/hooks/use-cart";
import FavoriteButton from "./favorite-button";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    salePrice?: number | null;
    stock: number;
    images: {
      url: string;
      isMain: boolean;
    }[];
  };
  isFavorited?: boolean;
}

export default function ProductCard({
  product,
  isFavorited = false,
}: ProductCardProps) {
  const cart = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const mainImageObj =
    product.images?.find((img) => img.isMain) || product.images?.[0];
  const imageUrl = mainImageObj ? mainImageObj.url : "/placeholder.png";

  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const currentPrice = hasDiscount ? product.salePrice! : product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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
    <div className="group relative flex flex-col h-full bg-white rounded-2xl border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all overflow-hidden">
      {/* IMAGE */}
      <div className="relative aspect-[3/4] bg-gray-50 border-b overflow-hidden">
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className={`object-contain p-6 transition-transform duration-500 group-hover:scale-105 ${
              product.stock <= 0 ? "opacity-60 grayscale" : ""
            }`}
          />
        </Link>

        {/* LEFT BADGES */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1">
          <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded">
            PREMIUM
          </span>
          <span className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded">
            9 TAKSİT
          </span>
        </div>

        {/* FAVORITE */}
        <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition">
          <FavoriteButton
            productId={product.id}
            initialIsFavorite={isFavorited}
          />
        </div>

        {/* CARGO */}
        <div className="absolute bottom-3 left-3 bg-white/90 text-gray-700 text-[10px] px-2 py-1 rounded shadow">
          🚚 Yarın kargoda
        </div>

        {/* OUT OF STOCK */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-10">
            <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg text-red-600 font-bold text-xs">
              <PackageX size={14} /> Tükendi
            </span>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex flex-col flex-1 p-5">
        <Link href={`/products/${product.id}`} className="space-y-2">
          <h3 className="font-bold text-gray-900 text-sm line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-2 min-h-[32px]">
            {product.description || "Ürün detayları için tıklayınız."}
          </p>
        </Link>

        {/* PRICE */}
        <div className="mt-4 pt-4 border-t space-y-3">
          <div className="flex items-end gap-2">
            <span className="text-2xl font-extrabold text-gray-900">
              {currentPrice.toLocaleString("tr-TR", {
                minimumFractionDigits: 2,
              })}
            </span>
            <span className="text-xs font-semibold text-gray-500">TL</span>

            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through ml-auto">
                {product.price.toLocaleString("tr-TR")} TL
              </span>
            )}
          </div>

          {/* BUTTON */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition
              ${
                product.stock > 0
                  ? isAdded
                    ? "bg-green-500 text-white"
                    : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            {product.stock > 0 ? (
              isAdded ? (
                <>
                  <Check size={16} /> Eklendi
                </>
              ) : (
                <>
                  <ShoppingCart size={16} /> Sepete Ekle
                </>
              )
            ) : (
              "Stok Yok"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
