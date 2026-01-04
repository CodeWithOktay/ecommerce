"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils/utils";

interface ProductImage {
  id: string;
  url: string;
  isMain: boolean;
}

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
  hasDiscount?: boolean;
  discountRate?: number;
}

/**
 * Ürün Galeri Bileşeni
 * 
 * - Ana görsel ve küçük resimler (thumbnails).
 * - Zoom özelliği (mouse üzerine gelince).
 * - Klavye ve buton ile resim değiştirme.
 * - İndirim oranını köşe rozetinde gösterir.
 */
export default function ProductGallery({
  images,
  productName,
  hasDiscount,
  discountRate,
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Ana görseli ilk açılışta isMain olana ayarla, yoksa ilkini al
  // Ancak state'de index tuttuğumuz için, props değiştiğinde bunu handle etmek gerekebilir
  // Basitlik için sortedImages mantığı kullanıp 0. indexi varsayıyoruz.
  
  const sortedImages = [...images].sort((a, b) =>
    a.isMain === b.isMain ? 0 : a.isMain ? -1 : 1
  );

  const activeImage = sortedImages[selectedIndex];

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % sortedImages.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + sortedImages.length) % sortedImages.length);
  };

  return (
    <div className="flex flex-col gap-4 select-none">
      {/* --- ANA GÖRSEL ALANI --- */}
      <div 
        className="relative aspect-square w-full bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm group"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
      >
        {/* İndirim Rozeti */}
        {hasDiscount && (
          <div className="absolute top-4 right-4 z-20 bg-rose-600 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg shadow-rose-200 animate-in fade-in zoom-in duration-300">
            %{discountRate} İndirim
          </div>
        )}

        {/* Ana Resim */}
        <div className="relative w-full h-full">
           <Image
            src={activeImage?.url || "/placeholder.png"}
            alt={productName}
            fill
            className={cn(
              "object-contain transition-transform duration-500 ease-out",
              isZoomed ? "scale-110" : "scale-100"
            )}
            priority
          />
        </div>

        {/* Navigasyon Okları (Sadece birden fazla resim varsa) */}
        {sortedImages.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 active:scale-95 z-10"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 active:scale-95 z-10"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Zoom İkonu */}
        <div className="absolute bottom-4 right-4 p-2 bg-white/90 rounded-lg shadow-sm text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
           <Maximize2 size={16} />
        </div>
      </div>

      {/* --- THUMBNAILS (Alt Liste) --- */}
      {sortedImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
          {sortedImages.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                "relative w-20 h-20 flex-shrink-0 bg-white rounded-xl border-2 overflow-hidden transition-all snap-start",
                selectedIndex === idx
                  ? "border-indigo-600 ring-2 ring-indigo-100 ring-offset-2"
                  : "border-gray-100 hover:border-gray-300 opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={img.url}
                alt={`${productName} - ${idx + 1}`}
                fill
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
