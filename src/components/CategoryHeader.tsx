"use client";

import Link from "next/link";
import { mockCategories } from "../lib/categories";
import { useState, useRef } from "react";

export default function CategoryHeader() {
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (catId: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveCat(catId);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveCat(null), 300);
  };

  return (
    <nav className="bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 shadow-sm sticky top-[73px] z-40 backdrop-blur-sm">
      <div className="container mx-auto flex justify-center gap-8 py-4 px-6">
        {mockCategories.map((cat) => (
          <div
            key={cat.id}
            className="relative group"
            onMouseEnter={() => handleMouseEnter(cat.id)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Main Category Link */}
            <Link
              href={`/category/${cat.id}/${cat.subCategories?.[0]?.id}`}
              className="text-gray-700 font-semibold hover:text-[#667EEA] transition-colors duration-200 relative py-2"
            >
              {cat.name}
              {/* Active Indicator */}
              <span
                className={`absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#667EEA] to-[#764BA2] transition-all duration-300 group-hover:w-full ${
                  activeCat === cat.id ? "w-full" : ""
                }`}
              ></span>
            </Link>

            {/* Dropdown Menu */}
            <div
              className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-3 bg-white/95 backdrop-blur-md shadow-xl rounded-2xl min-w-[200px] z-50 transition-all duration-300 border border-gray-100 overflow-hidden
                ${activeCat === cat.id ? "opacity-100 scale-100 visible translate-y-0" : "opacity-0 scale-95 invisible -translate-y-2"}
              `}
            >
              {/* Dropdown Header */}
              <div className="bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white px-4 py-3">
                <h3 className="font-bold text-sm">{cat.name}</h3>
              </div>

              {/* Subcategories */}
              <div className="p-2">
                {cat.subCategories?.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/category/${cat.id}/${sub.id}`}
                    className="block px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-[#667EEA]/5 hover:to-[#764BA2]/5 hover:text-[#667EEA] rounded-lg transition-all duration-200 group/sub relative"
                  >
                    <span className="relative z-10">{sub.name}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#667EEA] to-[#764BA2] opacity-0 group-hover/sub:opacity-5 transition-opacity duration-200 rounded-lg"></div>
                  </Link>
                ))}
              </div>

              {/* Dropdown Arrow */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-t border-l border-gray-200"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Category Menu (Optional) */}
      <div className="lg:hidden border-t border-gray-200 bg-white">
        <div className="container mx-auto px-6 py-3 overflow-x-auto">
          <div className="flex gap-4 min-w-max">
            {mockCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.id}/${cat.subCategories?.[0]?.id}`}
                className="text-sm text-gray-600 hover:text-[#667EEA] transition-colors whitespace-nowrap font-medium"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
