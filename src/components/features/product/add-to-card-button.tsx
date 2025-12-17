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
        flex items-center justify-center gap-2 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition active:scale-95
        ${showText ? "py-3 px-6 w-full" : "p-3 w-10 h-10"}
      `}
    >
      <ShoppingCart size={20} />
      {showText && <span>Sepete Ekle</span>}
    </button>
  );
}
