"use client";

import useCart, { Product } from "@/hooks/use-cart"; // Zustand hook'u
import { ShoppingCart } from "lucide-react";
import { MouseEventHandler } from "react";

interface AddToCartButtonProps {
  product: Product;
  showText?: boolean; // Sadece ikon mu, yazılı mı?
}

export default function AddToCartButton({
  product,
  showText = true,
}: AddToCartButtonProps) {
  const cart = useCart();

  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation(); // Tıklama olayının karta yayılmasını engeller (Link'e gitmesin diye)
    cart.addItem(product);
  };

  return (
    <button
      onClick={onAddToCart}
      className={`
    relative flex items-center justify-center gap-2
    rounded-full font-bold overflow-hidden
    text-white transition-all duration-300
    active:scale-95
    bg-gradient-to-r from-[#667EEA] to-[#764BA2]
    shadow-lg shadow-[#667EEA]/30
    hover:shadow-xl hover:shadow-[#667EEA]/50

    ${showText ? "py-3 px-6 w-full" : "p-3 w-10 h-10"}
  `}
    >
      {/* Glow Effect (v3 uyumlu, pseudo yerine absolute) */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#667EEA] to-[#764BA2] opacity-30 blur-xl pointer-events-none"></span>

      {/* İçerik */}
      <span className="relative flex items-center gap-2 z-10">
        <ShoppingCart size={20} />
        {showText && <span>Sepete Ekle</span>}
      </span>
    </button>
  );
}
