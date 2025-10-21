'use client';

import { ChevronRight, Search, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Category } from '@/types/index';

interface SideMenuProps {
  categories: Category[];
  isMenuOpen: boolean;
  onClose: () => void;
}

export function SideMenu({ categories, isMenuOpen, onClose }: SideMenuProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.subCategories?.some((sub) =>
        sub.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible delay-300'
      }`}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100' : 'opacity-0'
        }`}
      ></div>

      {/* Side Menu */}
      <div
        className={`relative z-10 h-full w-full max-w-md bg-gradient-to-b from-white to-gray-50/80 shadow-2xl transform transition-all duration-500 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Kategoriler</h2>
              <p className="text-sm text-gray-500">
                {categories.length} kategori
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 hover:scale-110 group"
          >
            <X size={20} className="text-gray-600 group-hover:text-gray-900" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100 bg-white/50">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Kategori ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-100/80 border border-transparent rounded-xl focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 outline-none"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="overflow-y-auto h-[calc(100vh-140px)] custom-scrollbar">
          <div className="p-4 space-y-2">
            {filteredCategories.map((category) => (
              <div key={category.id} className="group">
                {/* Main Category */}
                <div
                  className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                    activeCategory === category.id
                      ? 'bg-indigo-50 border border-indigo-200 shadow-sm'
                      : 'bg-white hover:bg-gray-50 border border-transparent hover:border-gray-200'
                  }`}
                  onClick={() =>
                    setActiveCategory(
                      activeCategory === category.id ? null : category.id
                    )
                  }
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        activeCategory === category.id
                          ? 'bg-indigo-600 scale-150'
                          : 'bg-gray-300 group-hover:bg-indigo-400'
                      }`}
                    />
                    <span
                      className={`font-semibold transition-colors ${
                        activeCategory === category.id
                          ? 'text-indigo-700'
                          : 'text-gray-700 group-hover:text-gray-900'
                      }`}
                    >
                      {category.name}
                    </span>
                    {category.subCategories && (
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                        {category.subCategories.length}
                      </span>
                    )}
                  </div>
                  <ChevronRight
                    size={16}
                    className={`text-gray-400 transition-transform duration-300 ${
                      activeCategory === category.id
                        ? 'rotate-90 text-indigo-600'
                        : 'group-hover:text-gray-600'
                    }`}
                  />
                </div>

                {/* Subcategories */}
                {activeCategory === category.id && category.subCategories && (
                  <div className="ml-6 mt-2 space-y-1 animate-fadeIn">
                    {category.subCategories.map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/category/${category.id}/${sub.id}`}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 group/sub"
                        onClick={onClose}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover/sub:bg-indigo-400 transition-colors" />
                        <span className="text-sm">{sub.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Empty State */}
            {filteredCategories.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">Kategori bulunamadı</p>
                <p className="text-gray-400 text-sm mt-1">
                  Arama teriminizi değiştirmeyi deneyin
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
