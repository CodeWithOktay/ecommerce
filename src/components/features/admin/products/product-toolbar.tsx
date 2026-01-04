"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Search, LayoutList, Archive, Filter, Sparkles, AlertCircle, ChevronDown, AlignLeft, Layers } from "lucide-react";

interface Props {
  count: number;
  categories: { id: string; name: string; parentId: string | null }[];
}

/**
 * Ürün Araç Çubuğu
 * 
 * Ürün listesi üzerindeki filtreleme ve arama araçlarını içerir.
 * - Sekmeler: Tümü, Tükenenler, Arşiv
 * - Arama: İsim, kategori veya marka ile arama
 * - Filtreler: Ana Kategori -> Alt Kategori (Kademeli), Stok Az, Yeni Eklenenler
 */
export default function ProductToolbar({ count, categories }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentStatus = searchParams.get("status") || "list";
  const currentQuery = searchParams.get("q") || "";
  const currentCategoryId = searchParams.get("categoryId") || "";
  const isLowStock = searchParams.get("lowStock") === "true";
  const isNewArrivals = searchParams.get("sort") === "createdAt_desc" && !isLowStock;

  // Kategori Mantığı
  const mainCategories = categories.filter(c => !c.parentId);
  
  // Seçili kategori ID'sine göre durum analizi
  let selectedMainCategory = "";
  let selectedSubCategory = "";

  const currentCategoryObj = categories.find(c => c.id === currentCategoryId);
  
  if (currentCategoryObj) {
    if (currentCategoryObj.parentId) {
      // Eğer seçili olan bir alt kategoriyse
      selectedSubCategory = currentCategoryObj.id;
      selectedMainCategory = currentCategoryObj.parentId;
    } else {
      // Eğer seçili olan bir ana kategoriyse
      selectedMainCategory = currentCategoryObj.id;
    }
  }

  // Seçili ana kategoriye göre alt kategorileri filtrele
  const subCategories = selectedMainCategory 
    ? categories.filter(c => c.parentId === selectedMainCategory)
    : [];

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

  const handleMainCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const mainId = e.target.value;
    // Ana kategori değişince categoryId'yi güncelle, alt kategori seçimini sıfırla (zaten null categoryId ile çözülür ama mainId'yi set ediyoruz)
    updateUrl({ categoryId: mainId || null });
  };

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subId = e.target.value;
    // Alt kategori seçilince veya iptal edilince (boş string gelirse ana kategoriye dön)
    updateUrl({ categoryId: subId || selectedMainCategory });
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between bg-white p-2 rounded-2xl border border-gray-200/60 shadow-sm mb-6">
      {/* Sol Taraf: Sekmeler */}
      <div className="p-1.5 flex bg-gray-100/50 rounded-xl self-stretch xl:self-auto overflow-x-auto">
        <button
          onClick={() => updateUrl({ status: "list" })}
          className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
            currentStatus === "list"
              ? "bg-white text-gray-900 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1)]"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
          }`}
        >
          <LayoutList size={16} />
          Aktif Ürünler
        </button>

        <button
          onClick={() => updateUrl({ status: "out_of_stock" })}
          className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
            currentStatus === "out_of_stock"
              ? "bg-white text-rose-600 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1)]"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${currentStatus === "out_of_stock" ? "bg-rose-500" : "bg-gray-400"}`} />
          Tükendi
        </button>

        <button
          onClick={() => updateUrl({ status: "archived" })}
          className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
            currentStatus === "archived"
              ? "bg-white text-gray-900 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1)]"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
          }`}
        >
          <Archive size={16} />
          Arşiv
        </button>
      </div>

      {/* Sağ Taraf: Arama ve Filtreler */}
      <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto p-1.5 xl:p-0 flex-wrap">
        {/* Arama Kutusu */}
        <div className="relative group flex-1 md:w-56 min-w-[200px]">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Ara..."
            value={currentQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateUrl({ q: e.target.value || null })
            }
            className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent text-gray-900 placeholder-gray-500 text-sm rounded-xl focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
          />
        </div>

        {/* --- YENİ KADEMELİ KATEGORİ FİLTRELERİ --- */}
        <div className="flex gap-2 items-center flex-wrap">
          
          {/* 1. ANA KATEGORİ FİLTRESİ */}
          <div className="relative group">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <AlignLeft size={14} className="text-gray-500 group-hover:text-indigo-600 transition-colors" />
             </div>
             <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown size={14} className="text-gray-400" />
             </div>
             <select
               value={selectedMainCategory}
               onChange={handleMainCategoryChange}
               className="pl-9 pr-9 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer appearance-none hover:border-gray-300 shadow-sm min-w-[140px]"
             >
               <option value="">Kategori</option>
               {mainCategories.map((cat) => (
                 <option key={cat.id} value={cat.id}>{cat.name}</option>
               ))}
             </select>
          </div>

          {/* 2. ALT KATEGORİ FİLTRESİ (Sadece Ana Kategori Seçiliyse görünür) */}
          {selectedMainCategory && subCategories.length > 0 && (
             <div className="relative animate-in fade-in slide-in-from-left-2 duration-300 group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <Layers size={14} className="text-gray-500 group-hover:text-indigo-600 transition-colors" />
                </div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                   <ChevronDown size={14} className="text-gray-400" />
                </div>
                <select
                  value={selectedSubCategory}
                  onChange={handleSubCategoryChange}
                  className="pl-9 pr-9 py-2.5 bg-indigo-50/50 border border-indigo-100 text-indigo-900 text-sm rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer appearance-none hover:border-indigo-300 shadow-sm min-w-[140px]"
                >
                  <option value="">Tümü</option>
                  {subCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
             </div>
          )}

          {/* 3. STOK AZ (Toggle) */}
          <button
            onClick={() => updateUrl({ 
                lowStock: isLowStock ? null : "true",
                sort: isLowStock ? null : "stock_asc"
            })}
            title="Az Stok"
            className={`flex items-center justify-center w-10 h-10 rounded-xl text-sm font-medium border transition-all shadow-sm ${
                isLowStock 
                 ? "bg-amber-50 border-amber-200 text-amber-600 shadow-amber-100 ring-2 ring-amber-100" 
                 : "bg-white border-gray-200 text-gray-400 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-600"
            }`}
          >
            <AlertCircle size={18} />
          </button>

          {/* 4. YENİ EKLENENLER (Toggle) */}
          <button
             onClick={() => updateUrl({ 
                 sort: isNewArrivals ? null : "createdAt_desc",
                 lowStock: null
             })}
            title="Yeni Eklenenler"
             className={`flex items-center justify-center w-10 h-10 rounded-xl text-sm font-medium border transition-all shadow-sm ${
                 isNewArrivals
                  ? "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-indigo-100 ring-2 ring-indigo-100"
                  : "bg-white border-gray-200 text-gray-400 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-600"
             }`}
          >
             <Sparkles size={18} />
          </button>

        </div>
      </div>
    </div>
  );
}
