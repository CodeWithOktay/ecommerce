"use client";

import { ChevronRight, Search, Sparkles, X, Hash, Layers } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { Category } from "@prisma/client";

type CategoryWithChildren = Category & {
  children: Category[];
};

interface SideMenuProps {
  categories?: CategoryWithChildren[];
  isMenuOpen: boolean;
  onClose: () => void;
}

// Debounce hook'u
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function SideMenu({
  categories = [],
  isMenuOpen,
  onClose,
}: SideMenuProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 150);

  // Portal için sayfanın yüklendiğinden emin ol
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Body scroll lock
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // ESC tuşu ile kapatma
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        onClose();
      }

      // Ctrl/Cmd + K ile arama odaklama
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isMenuOpen) {
          searchInputRef.current?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen, onClose]);

  // Dış tıklamada kapatma
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        isMenuOpen
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, onClose]);

  // Arama filtresi
  const filteredCategories = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return categories;

    const term = debouncedSearchTerm.toLowerCase();
    return categories.filter((category) => {
      const matchesCategory = category.name.toLowerCase().includes(term);
      const matchesChildren = category.children?.some((child) =>
        child.name.toLowerCase().includes(term)
      );
      return matchesCategory || matchesChildren;
    });
  }, [categories, debouncedSearchTerm]);

  // Arama temizleme
  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
    searchInputRef.current?.focus();
  }, []);

  // Kategori tıklama
  const handleCategoryClick = useCallback(
    (categoryId: string) => {
      setActiveCategory(activeCategory === categoryId ? null : categoryId);
    },
    [activeCategory]
  );

  // URL'e göre aktif kategoriyi belirle
  useEffect(() => {
    if (!pathname || !categories.length) return;

    if (pathname.startsWith("/category/")) {
      const categorySlug = pathname.split("/category/")[1];
      const foundCategory = categories.find(
        (cat) =>
          cat.slug === categorySlug ||
          cat.children?.some((child) => child.slug === categorySlug)
      );

      if (foundCategory) {
        setActiveCategory(foundCategory.id);
      }
    }
  }, [pathname, categories]);

  // Alt kategori toplam sayısı
  const totalSubcategories = useMemo(
    () =>
      categories.reduce(
        (total, category) => total + (category.children?.length || 0),
        0
      ),
    [categories]
  );

  // Tüm kategoriler linki
  const allCategoriesLink = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    return `/categories?${params.toString()}`;
  }, [searchParams]);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
        aria-hidden="true"
      >
        <div
          className={`absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300 ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      {/* Side Menu */}
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 h-full z-50 w-full max-w-sm bg-white shadow-xl transition-transform duration-300 ease-out flex flex-col ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Kategoriler Menüsü"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Kategoriler</h2>
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-blue-600">
                  {categories.length}
                </span>{" "}
                ana •{" "}
                <span className="font-semibold text-indigo-600">
                  {totalSubcategories}
                </span>{" "}
                alt
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
            aria-label="Menüyü kapat"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Arama */}
        <div className="p-4 border-b border-gray-100 bg-white flex-shrink-0">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Kategorilerde ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm outline-none font-medium text-gray-700 transition-all"
              aria-label="Kategori arama"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Aramayı temizle"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {searchTerm && (
            <div className="mt-2 px-1">
              <p className="text-xs text-gray-500">
                <span className="font-medium text-gray-700">
                  {filteredCategories.length}
                </span>{" "}
                kategori bulundu
              </p>
            </div>
          )}
        </div>

        {/* Liste */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="p-4 space-y-1">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => {
                const hasChildren =
                  category.children && category.children.length > 0;
                const isActive = activeCategory === category.id;

                return (
                  <div key={category.id} className="group">
                    {/* Ana Kategori */}
                    <div
                      className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                        isActive
                          ? "bg-blue-50 border border-blue-200"
                          : "bg-white hover:bg-gray-50 border border-transparent hover:border-gray-200"
                      }`}
                      onClick={() => handleCategoryClick(category.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleCategoryClick(category.id)
                      }
                      aria-expanded={isActive}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                          className={`w-2 h-2 rounded-full transition-all duration-200 ${
                            isActive
                              ? "bg-blue-600"
                              : "bg-gray-300 group-hover:bg-blue-400"
                          }`}
                        />

                        <div className="flex-1 min-w-0">
                          <span
                            className={`font-semibold text-sm truncate block ${
                              isActive
                                ? "text-blue-700"
                                : "text-gray-700 group-hover:text-gray-900"
                            }`}
                          >
                            {category.name}
                          </span>
                          {hasChildren && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {category.children.length} alt kategori
                            </p>
                          )}
                        </div>
                      </div>

                      {hasChildren && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                            {category.children.length}
                          </span>
                          <ChevronRight
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isActive
                                ? "rotate-90 text-blue-600"
                                : "text-gray-400 group-hover:text-gray-600"
                            }`}
                          />
                        </div>
                      )}
                    </div>

                    {/* Alt Kategoriler */}
                    {isActive && hasChildren && (
                      <div className="ml-6 mt-2 space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                        {category.children.map((sub, index) => (
                          <Link
                            key={sub.id}
                            href={`/category/${sub.slug}`}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 ${
                              pathname === `/category/${sub.slug}`
                                ? "bg-blue-50 text-blue-600"
                                : ""
                            }`}
                            onClick={onClose}
                            style={{
                              animationDelay: `${index * 30}ms`,
                              animationFillMode: "backwards",
                            }}
                          >
                            <Hash className="w-3 h-3 text-gray-400" />
                            <span className="text-sm flex-1 truncate">
                              {sub.name}
                            </span>
                            {pathname === `/category/${sub.slug}` && (
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              // Boş durum
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Kategori bulunamadı
                </h3>
                <p className="text-gray-500 text-sm max-w-xs">
                  &quot;{searchTerm}&ldquo; araması ile eşleşen kategori
                  bulunamadı.
                </p>
                {searchTerm && (
                  <button
                    onClick={handleClearSearch}
                    className="mt-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium text-sm transition-colors duration-200"
                  >
                    Aramayı Temizle
                  </button>
                )}
              </div>
            )}

            {/* Footer Link */}
            {filteredCategories.length > 0 && !searchTerm && (
              <div className="pt-6 mt-4 border-t border-gray-100">
                <Link
                  href={allCategoriesLink}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors duration-200"
                  onClick={onClose}
                >
                  <Sparkles className="w-4 h-4 text-gray-400" />
                  <span>Tüm Kategorileri Görüntüle</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #94a3b8;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </>,
    document.body
  );
}
