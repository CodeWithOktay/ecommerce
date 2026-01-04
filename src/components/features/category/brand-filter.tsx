"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Check } from "lucide-react";

interface BrandFilterProps {
  brands: {
    id: string;
    name: string;
    count: number;
  }[];
}

/**
 * Marka Filtresi Bileşeni
 * 
 * Ürün listeleme sayfalarında markalara göre filtreleme yapar.
 * Seçimleri URL query parametresi olarak saklar (?brands=1,2,3).
 * Sayfa yenilenmeden filtreleme yapılmasını destekler.
 */
export default function BrandFilter({ brands }: BrandFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  // URL'den seçili markaları oku
  useEffect(() => {
    const brandsParam = searchParams.get("brands");
    if (brandsParam) {
      setSelectedBrands(brandsParam.split(","));
    } else {
      setSelectedBrands([]);
    }
  }, [searchParams]);

  const handleToggle = (brandId: string) => {
    let newSelected = [...selectedBrands];
    if (newSelected.includes(brandId)) {
      newSelected = newSelected.filter((id) => id !== brandId);
    } else {
      newSelected.push(brandId);
    }

    // URL oluştur
    const params = new URLSearchParams(searchParams.toString());
    if (newSelected.length > 0) {
      params.set("brands", newSelected.join(","));
    } else {
      params.delete("brands");
    }

    // Sayfayı yenilemeden URL'i güncelle (scroll: false ile zıplamayı önle)
    router.push(`?${params.toString()}`, { scroll: false });
  };

  if (brands.length === 0) return null;

  return (
    <div>
      <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">
        Markalar
      </h3>
      <ul className="space-y-3">
        {brands.map((brand) => {
          const isSelected = selectedBrands.includes(brand.id);
          return (
            <li key={brand.id}>
              <label className="flex items-center gap-3 cursor-pointer group select-none">
                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-[#667EEA] border-[#667EEA]"
                      : "border-gray-300 bg-white group-hover:border-[#667EEA]"
                  }`}
                >
                  {isSelected && <Check size={14} className="text-white" />}
                  {/* Gizli input, erişilebilirlik ve change event'i için */}
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={isSelected}
                    onChange={() => handleToggle(brand.id)}
                  />
                </div>
                <span
                  className={`text-sm transition-colors ${
                    isSelected ? "text-gray-900 font-medium" : "text-gray-600 group-hover:text-[#667EEA]"
                  }`}
                >
                  {brand.name}
                  <span className="text-gray-400 text-xs ml-1">
                    ({brand.count})
                  </span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}