"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Product,
  ProductVariant,
  ProductImage,
  Category,
  Coupon,
} from "@prisma/client";
import {
  Star,
  Truck,
  Check,
  CreditCard,
  Info,
  Ticket,
  Copy,
} from "lucide-react";
import AddToCartButton from "@/components/features/product/add-to-card-button";
import ShareButton from "@/components/features/product/share-button";
import { cn } from "@/lib/utils/utils";
import toast from "react-hot-toast";
import FavoriteButton from "@/components/features/product/favorite-button";

type CleanCoupon = Omit<Coupon, "value" | "minAmount"> & {
  value: number;
  minAmount: number | null;
};
interface ProductMainSectionProps {
  product: Omit<Product, "price" | "salePrice"> & {
    price: number;
    salePrice: number | null;
    defaultColor?: string | null;
    defaultSize?: string | null;
    category: Category;
    brand: { id: string; name: string } | null;
    images: ProductImage[];
    variants: (Omit<ProductVariant, "price" | "salePrice"> & {
      price: number;
      salePrice: number | null;
    })[];
  };
  reviewStats: {
    avgRating: number;
    reviewCount: number;
  };
  availableCoupons?: CleanCoupon[]; // 👈 Burayı CleanCoupon yaptık
  isFavorited: boolean;
}

export default function ProductMainSection({
  product,
  reviewStats,
  availableCoupons = [],
  isFavorited,
}: ProductMainSectionProps) {
  // --- KUPON KOPYALAMA ---
  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Kupon kodu kopyalandı: ${code}`);
  };

  // --- 1. TÜM VARYANTLARI TOPLA ---
  const allVariants = useMemo(() => {
    const mainProductAsVariant = {
      id: "main-product",
      productId: product.id,
      name: product.name,
      color: product.defaultColor || null,
      size: product.defaultSize || null,
      price: product.price,
      salePrice: product.salePrice,
      stock: product.stock,
      image: null,
    };

    if (mainProductAsVariant.color || mainProductAsVariant.size) {
      return [mainProductAsVariant, ...product.variants];
    }
    return product.variants;
  }, [product]);

  // --- STATE ---
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [currentVariant, setCurrentVariant] = useState<
    (typeof allVariants)[0] | null
  >(null);

  // --- HESAPLAMALAR ---
  const labels = useMemo(() => {
    const catName = product.category.name.toLowerCase();
    if (catName.includes("ayakkabı") || catName.includes("bot")) {
      return { color: "Renk", size: "Numara", hasColor: true, hasSize: true };
    } else if (catName.includes("telefon") || catName.includes("elektronik")) {
      return { color: "Renk", size: "Kapasite", hasColor: true, hasSize: true };
    } else if (catName.includes("kitap")) {
      return { color: "Cilt", size: "Baskı", hasColor: false, hasSize: false };
    }
    return { color: "Renk", size: "Beden", hasColor: true, hasSize: true };
  }, [product.category.name]);

  const uniqueColors = useMemo(() => {
    return Array.from(
      new Set(allVariants.map((v) => v.color).filter(Boolean))
    ) as string[];
  }, [allVariants]);

  const uniqueSizes = useMemo(() => {
    return Array.from(
      new Set(allVariants.map((v) => v.size).filter(Boolean))
    ) as string[];
  }, [allVariants]);

  const hasActualSizes = labels.hasSize && uniqueSizes.length > 0;
  const hasActualColors = labels.hasColor && uniqueColors.length > 0;

  useEffect(() => {
    if (selectedColor && selectedSize && hasActualSizes) {
      const isValidCombo = allVariants.some(
        (v) =>
          v.color === selectedColor && v.size === selectedSize && v.stock > 0
      );
      if (!isValidCombo) setSelectedSize(null);
    }
  }, [selectedColor, allVariants, selectedSize, hasActualSizes]);

  useEffect(() => {
    if (allVariants.length === 0) return;
    const variant = allVariants.find((v) => {
      const matchColor = hasActualColors ? v.color === selectedColor : true;
      const matchSize = hasActualSizes ? v.size === selectedSize : true;
      return matchColor && matchSize;
    });
    setCurrentVariant(variant || null);
  }, [
    selectedColor,
    selectedSize,
    allVariants,
    hasActualColors,
    hasActualSizes,
  ]);

  useEffect(() => {
    if (!selectedColor && product.defaultColor && hasActualColors) {
      setSelectedColor(product.defaultColor);
    }
    if (!selectedSize && uniqueSizes.length === 1 && hasActualSizes) {
      setSelectedSize(uniqueSizes[0]);
    }
  }, [
    selectedColor,
    product.defaultColor,
    hasActualColors,
    selectedSize,
    uniqueSizes,
    hasActualSizes,
    setSelectedColor,
    setSelectedSize,
  ]);

  const activeData = currentVariant || product;
  const currentPrice = activeData.price;
  const currentSalePrice = activeData.salePrice;
  const currentStock = activeData.stock;

  const hasDiscount =
    currentSalePrice !== null && currentSalePrice < currentPrice;
  const displayPrice = hasDiscount ? currentSalePrice : currentPrice;
  const oldPrice = hasDiscount ? currentPrice : null;
  const discountRate = hasDiscount
    ? Math.round(((currentPrice - currentSalePrice) / currentPrice) * 100)
    : 0;

  const isOutOfStock = currentStock <= 0;

  const mainImage =
    product.images.find((img) => img.isMain) || product.images[0];
  const cartProductData = {
    id: product.id,
    variantId:
      currentVariant?.id === "main-product" ? undefined : currentVariant?.id,
    name: product.name,
    price: displayPrice,
    imageUrl: mainImage?.url,
    images: product.images.map((img) => ({ url: img.url, isMain: img.isMain })),
    stock: currentStock,
    color: currentVariant?.color || undefined,
    size: currentVariant?.size || undefined,
  };

  const isColorSelected = hasActualColors ? !!selectedColor : true;
  const isSizeSelected = hasActualSizes ? !!selectedSize : true;
  const isSelectionComplete =
    allVariants.length > 0 ? isColorSelected && isSizeSelected : true;

  return (
    <div className="space-y-5">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-indigo-600 text-lg font-bold mb-1 inline-block">
              {product.brand?.name}
            </span>

            <h1 className="text-2xl md:text-3xl font-normal text-gray-900 leading-tight mb-3">
              {product.name}
            </h1>
          </div>

          <ShareButton />
        </div>

        <div className="flex items-center gap-4 border-b border-gray-100 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={18}
                  fill={
                    reviewStats.reviewCount > 0 &&
                    s <= Math.round(reviewStats.avgRating)
                      ? "currentColor"
                      : "none"
                  }
                  className={
                    reviewStats.reviewCount > 0 &&
                    s <= Math.round(reviewStats.avgRating)
                      ? ""
                      : "text-gray-300"
                  }
                />
              ))}
            </div>

            <span className="text-sm font-bold text-gray-700">
              {reviewStats.reviewCount > 0
                ? reviewStats.avgRating.toFixed(1)
                : "0.0"}
            </span>
          </div>

          <span className="text-sm text-gray-500 border-l pl-4 border-gray-200">
            {reviewStats.reviewCount > 0
              ? `(${reviewStats.reviewCount} Değerlendirme)`
              : "Henüz değerlendirilmedi"}
          </span>
        </div>

        <div className="flex items-end gap-3 mb-2">
          <span className="text-4xl font-bold text-gray-900">
            {displayPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}{" "}
            <span className="text-2xl">TL</span>
          </span>

          {hasDiscount && (
            <div className="flex flex-col mb-1">
              <span className="text-sm text-gray-400 line-through">
                {oldPrice?.toLocaleString("tr-TR")} TL
              </span>

              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                %{discountRate} İndirim
              </span>
            </div>
          )}
        </div>

        {/* 🟢 KUPONLAR ALANI (YENİ EKLENDİ) */}

        {availableCoupons.length > 0 && (
          <div className="mt-4 pt-4 border-t border-dashed border-gray-200 space-y-2">
            <div className="text-sm font-bold text-indigo-900 flex items-center gap-2">
              <Ticket size={16} className="text-indigo-600" />
              Fırsat Kuponları
            </div>

            <div className="grid grid-cols-1 gap-2">
              {availableCoupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-lg p-2.5"
                >
                  <div className="flex flex-col">
                    <span className="font-mono font-bold text-indigo-700 tracking-wide text-sm">
                      {coupon.code}
                    </span>

                    <span className="text-[10px] text-indigo-500">
                      {coupon.type === "PERCENTAGE"
                        ? `%${coupon.value} İndirim`
                        : `₺${coupon.value} İndirim`}

                      {Number(coupon.minAmount) > 0 &&
                        ` (Min ₺${coupon.minAmount})`}
                    </span>
                  </div>

                  <button
                    onClick={() => copyCoupon(coupon.code)}
                    className="text-xs flex items-center gap-1 bg-white border border-indigo-200 text-indigo-600 px-2 py-1 rounded shadow-sm hover:bg-indigo-600 hover:text-white transition-all"
                  >
                    <Copy size={12} /> Kopyala
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {(hasActualColors || hasActualSizes) && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          {hasActualColors && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                {labels.color}:{" "}
                <span className="text-indigo-600 font-bold">
                  {selectedColor || "Seçiniz"}
                </span>
              </h3>

              <div className="flex flex-wrap gap-3">
                {uniqueColors.map((color) => {
                  const isAvailable = allVariants.some(
                    (v) => v.color === color && v.stock > 0
                  );

                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "px-4 py-2 border rounded-lg text-sm font-medium transition-all",

                        selectedColor === color
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600"
                          : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50",

                        !isAvailable &&
                          "opacity-50 cursor-not-allowed bg-gray-50 decoration-slice line-through"
                      )}
                      disabled={!isAvailable}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {hasActualSizes && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                {labels.size}:{" "}
                <span className="text-indigo-600 font-bold">
                  {selectedSize || "Seçiniz"}
                </span>
              </h3>

              <div className="flex flex-wrap gap-3">
                {uniqueSizes.map((size) => {
                  const isAvailable = selectedColor
                    ? allVariants.some(
                        (v) =>
                          v.color === selectedColor &&
                          v.size === size &&
                          v.stock > 0
                      )
                    : allVariants.some((v) => v.size === size && v.stock > 0);

                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      disabled={!isAvailable}
                      className={cn(
                        "h-10 min-w-[3rem] px-3 border rounded-lg text-sm font-medium transition-all flex items-center justify-center relative overflow-hidden",

                        selectedSize === size
                          ? "border-indigo-600 bg-indigo-600 text-white shadow-md"
                          : "border-gray-200 text-gray-700 hover:border-indigo-300",

                        !isAvailable &&
                          "opacity-40 cursor-not-allowed bg-gray-100 text-gray-400 border-gray-100"
                      )}
                    >
                      {size}

                      {!isAvailable && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-[1px] bg-gray-400 rotate-45 transform origin-center"></div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedColor && !selectedSize && uniqueSizes.length > 0 && (
                <p className="text-[10px] text-indigo-500 mt-2 animate-pulse">
                  * Lütfen uygun bir {labels.size.toLowerCase()} seçiniz.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="bg-green-50 border border-green-100 p-3 rounded-lg flex items-center gap-3">
        <div className="bg-white p-2 rounded-full text-green-600 shadow-sm">
          <Truck size={20} />
        </div>

        <div>
          <div className="text-sm font-bold text-gray-900">Kargo Bedava</div>

          <div className="text-xs text-gray-500">Hızlı teslimat</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg relative overflow-hidden">
        <div className="flex flex-col gap-10">
          {!isOutOfStock ? (
            <div className="text-xs font-bold text-green-600 flex items-center gap-1">
              <Check size={14} /> Stokta Var{" "}
              <span className="text-gray-500 font-normal ml-1">
                ({currentStock} adet)
              </span>
            </div>
          ) : (
            <div className="text-xs font-bold text-red-600">Stok Tükendi</div>
          )}

          <div className="flex items-center gap-6">
            {/* SEPETE EKLE BUTONU (SOL TARAFTA GENİŞ) */}

            <div
              className={cn(
                "flex-5", // Kalan tüm alanı kapla

                !isSelectionComplete &&
                  "opacity-50 pointer-events-none grayscale"
              )}
            >
              <AddToCartButton product={cartProductData} />
            </div>

            {/* FAVORİ BUTONU (SAĞ TARAFTA KARE) */}

            <div className="flex-shrink-0">
              <FavoriteButton
                productId={product.id}
                initialIsFavorite={isFavorited}
              />
            </div>
          </div>

          {!isSelectionComplete && (
            <p className="text-xs text-red-500 text-center font-medium bg-red-50 p-2 rounded-lg">
              Lütfen geçerli seçenekleri belirleyiniz.
            </p>
          )}

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
  );
}
