'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const sortOptions = [
  { value: 'recommended', label: 'Önerilen Sıralama' },
  { value: 'newest', label: 'En Yeniler' },
  { value: 'price-asc', label: 'Fiyata Göre (Artan)' },
  { value: 'price-desc', label: 'Fiyata Göre (Azalan)' },
];

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = sortOptions.find(option => option.value === value) || sortOptions[0];

  return (
    <div className="relative">
      {/* Desktop Dropdown */}
      <div className="hidden sm:block">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Sırala:
          </span>
          <div className="relative">
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-xl pl-4 pr-10 py-3 text-sm font-medium text-gray-900 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 cursor-pointer min-w-[200px]"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown 
              size={16} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" 
            />
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Sırala:
          </span>
          <div className="relative flex-1">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 flex items-center justify-between"
            >
              <span>{selectedOption.label}</span>
              <ChevronDown 
                size={16} 
                className={`text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
              />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-sm text-left transition-all duration-200 hover:bg-gray-50 ${
                      value === option.value
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Backdrop */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    </div>
  );
}