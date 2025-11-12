'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

/**
 * Sıralama seçenekleri dizisi
 * Ürün listelerinde kullanılacak sıralama kriterleri
 */
const sortOptions = [
  { value: 'recommended', label: 'Önerilen Sıralama' },
  { value: 'newest', label: 'En Yeniler' },
  { value: 'price-asc', label: 'Fiyata Göre (Artan)' },
  { value: 'price-desc', label: 'Fiyata Göre (Azalan)' },
];

// Props interface'i - sıralama dropdown bileşeninin alacağı props'lar
interface SortDropdownProps {
  value: string; // Seçili sıralama değeri
  onChange: (value: string) => void; // Sıralama değişikliği handler'ı
}

/**
 * Sıralama Dropdown Bileşeni
 *
 * Ürün listelerinde sıralama kriteri seçmek için kullanılan dropdown.
 * Desktop'ta native select, mobile'da custom dropdown kullanır.
 * Responsive tasarım ile her cihazda optimize edilmiştir.
 */
export function SortDropdown({ value, onChange }: SortDropdownProps) {
  // Dropdown açık/kapalı state'i (sadece mobile'da kullanılır)
  const [isOpen, setIsOpen] = useState(false);

  // Seçili olan sıralama seçeneğini bul
  const selectedOption =
    sortOptions.find((option) => option.value === value) || sortOptions[0];

  return (
    <div className="relative">
      {/* ✅ Desktop Versiyonu - Native Select Element */}
      <div className="hidden sm:block">
        <div className="flex items-center gap-3">
          {/* Sıralama etiketi */}
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Sırala:
          </span>

          {/* Select Container */}
          <div className="relative">
            {/* Native Select Element */}
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-xl pl-4 pr-10 py-3 text-sm font-medium text-gray-900 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 cursor-pointer min-w-[200px]"
              aria-label="Sıralama seçenekleri"
            >
              {/* Sıralama seçenekleri */}
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Custom Dropdown Ok İkonu */}
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {/* ✅ Mobile Versiyonu - Custom Dropdown */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between gap-3">
          {/* Sıralama etiketi */}
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Sırala:
          </span>

          {/* Dropdown Container */}
          <div className="relative flex-1">
            {/* Dropdown Trigger Butonu */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 flex items-center justify-between"
              aria-haspopup="true"
              aria-expanded={isOpen}
            >
              <span>{selectedOption.label}</span>
              <ChevronDown
                size={16}
                className={`text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>

            {/* Dropdown Menu - Sadece açıkken gösterilir */}
            {isOpen && (
              <div
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden"
                role="menu"
                aria-orientation="vertical"
              >
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onChange(option.value); // Seçimi değiştir
                      setIsOpen(false); // Dropdown'ı kapat
                    }}
                    className={`w-full px-4 py-3 text-sm text-left transition-all duration-200 hover:bg-gray-50 ${
                      value === option.value
                        ? 'bg-blue-50 text-blue-600 font-medium' // Seçili öğe stili
                        : 'text-gray-700' // Normal öğe stili
                    }`}
                    role="menuitem"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ✅ Mobile Backdrop - Dropdown dışına tıklayarak kapatma */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}
