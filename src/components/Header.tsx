"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { totalItems } = useCart();
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo with Gradient */}
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-[#667EEA] to-[#764BA2] bg-clip-text text-transparent hover:opacity-90 transition-opacity"
        >
          KervanPazar
        </Link>

        {/* Sepet with Gradient */}
        <Link
          href="/cart"
          className="bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold flex items-center gap-2 group"
        >
          <span className="group-hover:scale-110 transition-transform">🛒</span>
          Sepetim
          <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
            {totalItems}
          </span>
        </Link>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 py-3 flex justify-between">
          <Link
            href="/category/elektronik"
            className="text-sm text-gray-600 hover:text-[#667EEA] transition-colors"
          >
            Elektronik
          </Link>
          <Link
            href="/category/giyim"
            className="text-sm text-gray-600 hover:text-[#667EEA] transition-colors"
          >
            Giyim
          </Link>
          <Link
            href="/category/ev-yasam"
            className="text-sm text-gray-600 hover:text-[#667EEA] transition-colors"
          >
            Ev & Yaşam
          </Link>
          <Link
            href="/category/kozmetik"
            className="text-sm text-gray-600 hover:text-[#667EEA] transition-colors"
          >
            Kozmetik
          </Link>
        </div>
      </div>
    </header>
  );
}
