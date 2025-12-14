"use client";

import useCart from "@/hooks/use-cart";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NavbarCartActions() {
  const [isMounted, setIsMounted] = useState(false);
  const cart = useCart();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Sunucuda render edilirken boş dön (Hata önleyici)
  }

  return (
    <div className="ml-auto flex items-center gap-x-4">
      <Link
        href="/cart"
        className="flex items-center gap-x-2 bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white p-2 px-4 rounded-full hover:opacity-75 transition"
      >
        <ShoppingBag size={20} />
        <span className="text-sm font-medium text-white">
          {cart.items.length}
        </span>
      </Link>
    </div>
  );
}
