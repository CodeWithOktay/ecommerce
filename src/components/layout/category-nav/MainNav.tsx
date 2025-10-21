'use client';

import { Category } from '@/types';
import { ChevronDown, Menu, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface MainNavProps {
  categories: Category[];
  onShowAllClick: () => void;
}

export function MainNav({ categories, onShowAllClick }: MainNavProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const visibleCategoryCount = 7;

  return (
    <div className="bg-gradient-to-r from-white to-gray-50/80 border-b border-gray-100 backdrop-blur-sm">
      <div className="container mx-auto">
        <div className="flex items-center justify-between px-6">
          {/* Tüm Kategoriler Butonu */}
          <button
            onClick={onShowAllClick}
            onMouseEnter={() => setHoveredCategory('all')}
            onMouseLeave={() => setHoveredCategory(null)}
            className="group flex items-center gap-3 font-bold text-gray-700 whitespace-nowrap px-4 py-3 rounded-xl hover:bg-white hover:shadow-lg border border-transparent hover:border-gray-200 transition-all duration-300 relative"
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <Menu
                  size={20}
                  className="text-indigo-600 group-hover:scale-110 transition-transform"
                />
                <Sparkles
                  size={12}
                  className="absolute -top-1 -right-1 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  fill="currentColor"
                />
              </div>
              <span>Tüm Kategoriler</span>
            </div>
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform duration-300 ${
                hoveredCategory === 'all' ? 'rotate-180' : ''
              }`}
            />

            {/* Hover efekti */}
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300"></div>
          </button>

          {/* Ayraç */}
          <div className="h-8 border-l border-gray-200 mx-2"></div>

          {/* Kategoriler */}
          <div className="flex items-center space-x-1 flex-1 overflow-x-auto scrollbar-hide">
            {categories.slice(0, visibleCategoryCount).map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
                className="group relative px-4 py-3 rounded-lg transition-all duration-300 hover:bg-white hover:shadow-md"
              >
                <span
                  className={`font-semibold transition-all duration-300 ${
                    hoveredCategory === category.id
                      ? 'text-indigo-600 scale-105'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {category.name}
                </span>

                {/* Nokta indikatörü */}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
