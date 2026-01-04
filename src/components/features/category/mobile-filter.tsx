"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";
import BrandFilter from "./brand-filter";

interface Brand {
  id: string;
  name: string;
  slug: string;
  count: number;
}

interface CategoryWithChildren {
  id: string;
  name: string;
  slug: string;
  children?: CategoryWithChildren[];
}

interface MobileFilterProps {
  category: CategoryWithChildren;
  brands: Brand[];
}

/**
 * Mobil Filtreleme Menüsü
 * 
 * Mobil cihazlarda filtreleri bir "Drawer" (çekmece) içinde gösterir.
 * - Kategoriler ve Markalar için filtreleme seçenekleri sunar.
 * - Overlay (Backdrop) ile dışarı tıklayınca kapanır.
 */
export default function MobileFilter({ category, brands }: MobileFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* MOBİL FİLTRE BUTONU */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
      >
        <Filter size={16} className="text-[#667EEA]" />
        Filtrele
      </button>

      {/* OVERLAY & DRAWER */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-xs h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Filtreler</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                aria-label="Kapat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-8">
              {/* Kategoriler */}
              {category.children && category.children.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">
                    Kategoriler
                  </h3>
                  <ul className="space-y-3">
                    {category.children.map((sub: { id: string; slug: string; name: string }) => (
                      <li key={sub.id}>
                        <a
                          href={`/category/${sub.slug}`}
                          className="block text-sm text-gray-600 hover:text-[#667EEA] py-1 transition-colors"
                        >
                          {sub.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <div className="my-6 border-b border-gray-100"></div>
                </div>
              )}

              {/* Markalar */}
              <BrandFilter brands={brands} />
            </div>

            {/* Footer / Actions */}
            <div className="p-5 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-3 bg-[#667EEA] hover:bg-[#5a6fd1] text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95"
              >
                Sonuçları Listele
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
