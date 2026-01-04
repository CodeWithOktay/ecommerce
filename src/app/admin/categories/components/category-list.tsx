"use client";

import {
  FolderTree,
  Tag,
  Search,
  Pencil,
  Trash2,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { Category, Brand, Attribute } from "@prisma/client";
import { useState, useMemo, Fragment } from "react";

type CategoryWithDetails = Category & {
  parent: Category | null;
  attributes: Attribute[];
  brands: Brand[];
};

interface CategoryListProps {
  categories: CategoryWithDetails[];
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  onEdit: (cat: CategoryWithDetails) => void;
  onDelete: (id: string) => void;
}

export function CategoryList({
  categories,
  searchTerm,
  setSearchTerm,
  onEdit,
  onDelete,
}: CategoryListProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Toggle expansion for a category
  const toggleExpand = (id: string) => {
    const newSet = new Set(expandedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedIds(newSet);
  };

  // 1. Filter based on search
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;
    return categories.filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  // 2. Group by Parent (only if NO search term is active)
  const { mainCategories, subCategoriesMap } = useMemo(() => {
    if (searchTerm) {
      // If searching, we don't group, we just want to show matches
      return { mainCategories: [], subCategoriesMap: {} };
    }

    const main: CategoryWithDetails[] = [];
    const subs: Record<string, CategoryWithDetails[]> = {};

    categories.forEach((cat) => {
      if (!cat.parentId) {
        main.push(cat);
      } else {
        if (!subs[cat.parentId]) {
          subs[cat.parentId] = [];
        }
        subs[cat.parentId].push(cat);
      }
    });

    return { mainCategories: main, subCategoriesMap: subs };
  }, [categories, searchTerm]);

  // Render a single row
  const renderRow = (cat: CategoryWithDetails, isSub = false) => {
    const hasChildren = !searchTerm && subCategoriesMap[cat.id]?.length > 0;
    const isExpanded = expandedIds.has(cat.id);

    return (
      <tr
        key={cat.id}
        className={`group transition-colors duration-200 border-b border-gray-50 last:border-0 ${
            isSub ? "bg-gray-50/50 hover:bg-indigo-50/20" : "hover:bg-indigo-50/30"
        }`}
      >
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
             {/* Indentation for subcategories */}
             {isSub && <div className="w-8 border-l-2 border-gray-200 h-6 ml-2 rounded-bl-lg" />}

            {/* Expand/Collapse Toggle */}
            {hasChildren ? (
                <button 
                    onClick={() => toggleExpand(cat.id)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-500"
                >
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
            ) : (
                // Placeholder to align if it's a main category without children
                !isSub && <div className="w-6" />
            )}

            <div
              className={`p-2.5 rounded-xl shadow-sm transition-transform group-hover:scale-105 ${
                cat.parentId
                  ? "bg-purple-100 text-purple-600 scale-90"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              {cat.parentId ? <Tag size={18} /> : <FolderTree size={20} />}
            </div>
            <div>
              <div className={`font-bold text-gray-900 ${isSub ? "text-sm" : "text-base"}`}>
                {cat.name}
              </div>
              {/* If searching, show parent name context since hierarchy is lost */}
              {searchTerm && cat.parent && (
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                  <ChevronRight size={12} />
                  <span>{cat.parent.name}</span>
                </div>
              )}
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          {cat.parentId ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100">
              Alt Kategori
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
              Ana Kategori
            </span>
          )}
        </td>
        <td className="px-6 py-4">
          <div className="flex flex-wrap gap-1.5 max-w-[220px]">
            {cat.attributes.slice(0, 3).map((a) => (
              <span
                key={a.id}
                className="text-[11px] font-medium bg-white text-gray-600 px-2 py-1 rounded-md border border-gray-200 shadow-sm"
              >
                {a.name}
              </span>
            ))}
            {cat.attributes.length > 3 && (
              <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-1 rounded-md">
                +{cat.attributes.length - 3}
              </span>
            )}
            {cat.attributes.length === 0 && (
              <span className="text-gray-300 text-xs italic">Yok</span>
            )}
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[...Array(Math.min(3, cat.brands.length))].map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[10px] text-indigo-700 font-bold"
                >
                  {cat.brands[i].name.charAt(0)}
                </div>
              ))}
            </div>
            {cat.brands.length > 0 ? (
              <span className="text-xs font-medium text-gray-600">
                {cat.brands.length} Marka
              </span>
            ) : (
              <span className="text-gray-300 text-xs italic">Yok</span>
            )}
          </div>
        </td>
        <td className="px-6 py-4 text-right">
          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
            <button
              onClick={() => onEdit(cat)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-200 transition-all hover:shadow-indigo-300"
            >
              <Pencil size={14} />
              Düzenle
            </button>
            <button
              onClick={() => onDelete(cat.id)}
              className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-all"
              title="Sil"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Kategori ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-base"
        />
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <span className="text-xs text-gray-400 border border-gray-100 rounded px-1.5 py-0.5">
            {searchTerm ? filteredCategories.length : categories.length} sonuç
          </span>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {(!searchTerm && mainCategories.length > 0) || (searchTerm && filteredCategories.length > 0) ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-5 font-semibold">KATEGORİ İSMİ</th>
                  <th className="px-6 py-5 font-semibold">DURUM</th>
                  <th className="px-6 py-5 font-semibold">ÖZELLİKLER</th>
                  <th className="px-6 py-5 font-semibold">MARKALAR</th>
                  <th className="px-6 py-5 font-semibold text-right">
                    İŞLEMLER
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {searchTerm
                  ? // Search Mode: Flat List
                    filteredCategories.map((cat) => renderRow(cat))
                  : // Hierarchy Mode: Grouped List
                    mainCategories.map((mainCat) => (
                      <Fragment key={mainCat.id}>
                        {renderRow(mainCat)}
                        {expandedIds.has(mainCat.id) &&
                          subCategoriesMap[mainCat.id]?.map((subCat) =>
                            renderRow(subCat, true)
                          )}
                      </Fragment>
                    ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center text-gray-400">
             {/* ... Match logic ... */}
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                 <Search size={32} className="opacity-50" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Buralar çok sessiz...</h3>
            <p className="max-w-xs mx-auto mt-1">
               {searchTerm ? `"${searchTerm}" ile eşleşen kategori bulunamadı.` : "Henüz hiç kategori eklenmemiş."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
