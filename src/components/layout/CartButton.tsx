"use client";

import useCart from "@/hooks/use-cart";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartButton() {
  const { getTotalItems } = useCart();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cartCount = isMounted ? getTotalItems() : 0;

  return (
    <Link
      href="/cart"
      className="flex items-center gap-2 bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:opacity-95 transition-all font-semibold text-sm"
    >
      <ShoppingCart size={20} />
      <span className="hidden sm:inline">Sepetim</span>
      <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold min-w-[20px] text-center">
        {cartCount}
      </span>
    </Link>
  );
}
