"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface Props {
  count: number;
}

export default function ProductToolbar({ count }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentStatus = searchParams.get("status") || "list";
  const currentSort = searchParams.get("sort") || "createdAt_desc";
  const currentIsActive = searchParams.get("isActive");
  const currentQuery = searchParams.get("q") || "";

  const updateUrl = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.push(`/admin/products?${params.toString()}`);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-white p-6 rounded-2xl border border-gray-200/60">
      {/* Sol Taraf: Sekmeler ve Arama */}
      <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full lg:w-auto">
        {/* Sekmeler */}
        <div className="flex gap-2">
          <button
            onClick={() => updateUrl({ status: "list" })}
            className={`px-4 py-2 rounded-lg font-medium transition-colors relative ${
              currentStatus === "list"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Aktif Ürünler
            {currentStatus === "list" && (
              <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
                {count}
              </span>
            )}
          </button>

          <button
            onClick={() => updateUrl({ status: "archived" })}
            className={`px-4 py-2 rounded-lg font-medium transition-colors relative ${
              currentStatus === "archived"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Arşiv
            {currentStatus === "archived" && (
              <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
                {count}
              </span>
            )}
          </button>
        </div>

        {/* Arama Kutusu */}
        <div className="relative max-w-sm">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Ürün ara..."
            value={currentQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateUrl({ q: e.target.value || null })
            }
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>
      </div>

      {/* Sağ Taraf: Filtreler */}
      <div className="flex gap-3 items-center">
        {/* Sıralama */}
        <select
          value={currentSort}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            updateUrl({ sort: e.target.value })
          }
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
        >
          <option value="createdAt_desc">Yeni Eski</option>
          <option value="createdAt_asc">Eski Yeni</option>
          <option value="name_asc">İsim A-Z</option>
          <option value="name_desc">İsim Z-A</option>
          <option value="price_asc">Fiyat Artan</option>
          <option value="price_desc">Fiyat Azalan</option>
          <option value="stock_asc">Stok Artan</option>
          <option value="stock_desc">Stok Azalan</option>
        </select>

        {/* Satış Durumu (Sadece aktif ürünler sekmesinde göster) */}
        {currentStatus === "list" && (
          <select
            value={currentIsActive || ""}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              updateUrl({ isActive: e.target.value || null })
            }
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
          >
            <option value="">Hepsi</option>
            <option value="true">Satışta</option>
            <option value="false">Satışta Değil</option>
          </select>
        )}
      </div>
    </div>
  );
}
