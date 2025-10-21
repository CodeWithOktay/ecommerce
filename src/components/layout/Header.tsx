"use client";

import Link from "next/link";
import { useCart } from "@/context/cart/index";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { SearchBar } from "@/components/forms/SearchBar";

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="bg-white/93 backdrop-blur-md border-b border-white sticky top-0 z-50 transition-none">
      <div className="container mx-auto flex justify-between items-center py-3 px-6">
        {/* ✅ Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group hover:opacity-90 transition-opacity"
        >
          <Image
            src="/kervanpazar-logo.png"
            alt="KervanPazar Logo"
            width={250}
            height={10}
            className="object-contain group-hover:scale-105 transition-transform"
            priority
          />
        </Link>
        <SearchBar />

        {/* ✅ Sepet Butonu */}
        <Link
          href="/cart"
          className="bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold flex items-center gap-2 group"
        >
          <span className="group-hover:scale-110 transition-transform">
            <ShoppingCart />
          </span>
          Sepetim
          <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
            {totalItems}
          </span>
        </Link>
      </div>

      {/* ✅ Mobil Menü */}
      <div className="md:hidden bg-white border-t border-white">
        <div className="container mx-auto px-6 py-3 flex justify-between text-sm text-gray-700">
          {["elektronik", "giyim", "ev-yasam", "kozmetik"].map((cat) => (
            <Link
              key={cat}
              href={`/category/${cat}`}
              className="hover:text-[#667EEA] transition-colors capitalize"
            >
              {cat.replace("-", " ")}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
