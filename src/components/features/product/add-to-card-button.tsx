"use client";

// Cart hook
import useCart, { Product } from "@/hooks/use-cart";
import { ShoppingCart } from "lucide-react";
import { MouseEventHandler } from "react";
import { cn } from "@/lib/utils/utils";

interface AddToCartButtonProps {
  product: Product;
  showText?: boolean;
  className?: string;
}

/**
 * Sepete Ekle Butonu
 * 
 * Basit ama şık bir buton bileşeni.
 * - Opsiyonel metin gösterimi (showText).
 * - Dışarıdan className ile stil özelleştirme.
 * - useCart hook'u ile sepete ürün ekler.
 */
export default function AddToCartButton({
  product,
  showText = true,
  className,
}: AddToCartButtonProps) {
  const cart = useCart();

  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    cart.addItem(product);
  };

  return (
    <button
      onClick={onAddToCart}
      className={cn(
        `relative flex items-center justify-center gap-32
        rounded-lg font-bold overflow-hidden
        text-white transition-all duration-300
        active:scale-100
        bg-gradient-to-r from-[#667EEA] to-[#764BA2]
        shadow-lg shadow-[#667EEA]/30
        hover:shadow-xl hover:shadow-[#667EEA]/50
        disabled:opacity-50 disabled:cursor-not-allowed
        `,
        // Eğer dışarıdan className gelmezse varsayılan boyutlar:
        !className &&
          (showText ? " gap-32 py-4 px-20 w-full" : "gap-32 py-4 px-20 w-full"),
        // Dışarıdan gelen className (boyut vb.) en sona eklenir:
        className
      )}
    >
      {/* Hafif Parlama Efekti (Renk değiştirmeden sadece parlaklık verir) */}
      <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"></span>

      {/* İçerik */}
      <span className="relative flex items-center gap-6 z-10">
        <ShoppingCart size={18} />
        {showText && <span className="text-sm">Sepete Ekle</span>}
      </span>
    </button>
  );
}
