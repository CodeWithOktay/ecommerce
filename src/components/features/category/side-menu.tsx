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

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
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

  // 🟢 ÇÖZÜM BURADA: Sadece URL değiştiğinde çalışması için path'i takip eden bir ref
  const lastPathnameRef = useRef(pathname);
  // 🟢 Veri ilk yüklendiğinde bir kereye mahsus URL'i kontrol etmek için flag
  const isInitialSyncDone = useRef(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 150);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) onClose();
    };
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        isMenuOpen
      ) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, onClose]);

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

  // 🟢 Tıklama fonksiyonunu izole ettik
  const handleCategoryClick = useCallback(
    (categoryId: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setActiveCategory((prev) => (prev === categoryId ? null : categoryId));
    },
    []
  );

  // 🟢 🟢 🟢 KRİTİK DÜZELTME: URL SENKRONİZASYONU 🟢 🟢 🟢
  useEffect(() => {
    // 1. Durum: URL gerçekten değiştiyse (Navigasyon)
    const isPathChanged = pathname !== lastPathnameRef.current;

    // 2. Durum: İlk yükleme henüz yapılmadıysa ve veri geldiyse
    const isFirstLoad = !isInitialSyncDone.current && categories.length > 0;

    // Eğer ne URL değişti ne de ilk yükleme ise, HİÇBİR ŞEY YAPMA.
    // Bu sayede veri güncellendiğinde senin açtığın menü kapanmaz.
    if (!isPathChanged && !isFirstLoad) return;

    // Eğer URL değiştiyse veya ilk yüklemeyse, URL'e uygun kategoriyi bul ve aç
    if (pathname && pathname.startsWith("/category/")) {
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

    // Flagleri güncelle
    if (isFirstLoad) isInitialSyncDone.current = true;
    if (isPathChanged) lastPathnameRef.current = pathname;
  }, [pathname, categories]); // categories buraya ekli ama yukarıdaki if bloğu gereksiz çalışmayı engeller.

  const totalSubcategories = useMemo(
    () =>
      categories.reduce(
        (total, category) => total + (category.children?.length || 0),
        0
      ),
    [categories]
  );

  const allCategoriesLink = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    return `/categories?${params.toString()}`;
  }, [searchParams]);

  const handleClearSearch = () => {
    setSearchTerm("");
    searchInputRef.current?.focus();
  };

  if (!mounted) return null;

  return createPortal(
    <>
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        aria-hidden="true"
      >
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0"}`}
        />
      </div>

      <div
        ref={menuRef}
        className={`fixed top-0 left-0 h-full z-50 w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#667EEA] to-[#764BA2] rounded-lg flex items-center justify-center shadow-md text-white">
              <Layers size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Kategoriler</h2>
              <p className="text-xs text-gray-500">
                {categories.length} Ana • {totalSubcategories} Alt
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* SEARCH */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Hızlı kategori ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* LIST */}
        <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-200">
          {filteredCategories.length > 0 ? (
            <div className="space-y-1">
              {filteredCategories.map((category) => {
                const hasChildren =
                  category.children && category.children.length > 0;
                const isActive = activeCategory === category.id;

                return (
                  <div key={category.id} className="select-none">
                    {/* ANA KATEGORİ */}
                    <div
                      onClick={(e) => handleCategoryClick(category.id, e)}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-1.5 h-1.5 rounded-full transition-colors ${isActive ? "bg-indigo-600" : "bg-gray-300 group-hover:bg-indigo-300"}`}
                        />
                        <span className="font-medium text-sm">
                          {category.name}
                        </span>
                      </div>

                      {hasChildren && (
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${isActive ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-500"}`}
                          >
                            {category.children.length}
                          </span>
                          <ChevronRight
                            size={16}
                            className={`transition-transform duration-300 ${isActive ? "rotate-90 text-indigo-600" : "text-gray-400"}`}
                          />
                        </div>
                      )}
                    </div>

                    {/* ALT KATEGORİLER (CSS Transition ile) */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isActive && hasChildren
                          ? "max-h-[500px] opacity-100 mt-1"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="ml-4 pl-4 border-l-2 border-indigo-100 space-y-1 py-1">
                        {category.children.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/category/${sub.slug}`}
                            onClick={onClose}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                              pathname === `/category/${sub.slug}`
                                ? "bg-indigo-50 text-indigo-700 font-medium"
                                : "text-gray-500 hover:text-indigo-600 hover:bg-gray-50"
                            }`}
                          >
                            <Hash size={12} className="opacity-50" />
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500">
              <Search size={32} className="text-gray-200 mb-2" />
              <p className="text-sm">Sonuç bulunamadı.</p>
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}
